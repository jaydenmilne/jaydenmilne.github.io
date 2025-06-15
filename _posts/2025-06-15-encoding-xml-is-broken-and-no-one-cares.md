---
layout: post
title:  "Golang's encoding/XML is broken and no one seems to care"
date:   2025-06-15 15:19
---

For the first time I've felt betrayed somewhat by Go's standard library. `encoding/xml`
is just broken in a lot of ways, has been for over a decade, and no one seems
to want to fix it. I couldn't find a good independent, working xml library to use
either, so this just doesn't work.

In short: I do not recommend you try and parse or generate XML in golang, at 
least until Google fixes `encoding/xml` or someone writes an XML parser that 
works. With enough hacks and workarounds you just might be able to get something
to work. It won't be pretty though.

I mean seriously, you can't really parse or generate RSS or podcast feeds with
`encoding/xml`. I feel like that should be one of the better supported cases.

Takeaways:

* A lot of the time the advice will boil down to having to have separate structs
  with different tags for marshalling and unmarshalling XML. 
  
  As much as I hate it, that really does seem to be the only solution for some of these problems for now.
* XML namespaces are barely supported and buggy. You will not be able to choose
  the prefix for your namespace in your generated output, so you won't be able
  to generate exactly the XML you want.

  You will then discover that many XML parsers in the wild (cough podcasts) 
  expect to have certain namespace prefixes, and will choke on go's technically 
  valid output.

# Quick Recap

[Here's an example of using encoding/xml](https://go.dev/play/p/5Io9WK9vkTC)

```go
package main

import (
	"encoding/xml"
	"fmt"
)

type XMLDoc struct {
	XMLName xml.Name `xml:"document"`
	Field   string   `xml:"field"`
}

func main() {
	input := `<document><field>field_value</field></document>`
	var parsed XMLDoc
	xml.Unmarshal([]byte(input), &parsed)
	fmt.Printf("%#v", parsed)
}

```
```
main.XMLDoc{XMLName:xml.Name{Space:"", Local:"document"}, Field:"field_value"}
```

Simple enough. [Here's how you would modify this to use namespaces](https://go.dev/play/p/2bDIeDlMw7h), demonstrating two equivalent ways to specify the namespace.

```go
package main

import (
	"encoding/xml"
	"fmt"
)

type XMLDoc struct {
	XMLName xml.Name `xml:"document"`
	Field   string   `xml:"https://example.com/xmlschema field"`
}

func parse(input string) {
	var parsed XMLDoc
	xml.Unmarshal([]byte(input), &parsed)
	fmt.Printf("%#v\n", parsed)
}

func main() {
	parse(`
		<document xmlns:examplenamespace="https://example.com/xmlschema">
			<examplenamespace:field>field_value</examplenamespace:field>
		</document>
	`)

	parse(`
		<document>
			<field xmlns="https://example.com/xmlschema">field_value</field>
		</document>
	`)
}
```
```
main.XMLDoc{XMLName:xml.Name{Space:"", Local:"document"}, Field:"field_value"}
main.XMLDoc{XMLName:xml.Name{Space:"", Local:"document"}, Field:"field_value"}
```

# The Problem

The issue is when you need to mix namespaced and non-namespaced tags.

Watch this magic trick, [this works as expected](https://go.dev/play/p/GGJZyDtaXpe):

```go
package main

import (
	"encoding/xml"
	"fmt"
)

type XMLDoc struct {
	XMLName         xml.Name `xml:"document"`
	NamespacedField string   `xml:"https://example.com/xmlschema field"`
	Field           string   `xml:"field"`
}

func parse(input string) XMLDoc {
	var parsed XMLDoc
	xml.Unmarshal([]byte(input), &parsed)
	fmt.Printf("\n%#v\n", parsed)
	return parsed
}

func main() {
	parse(`
		<document xmlns:examplenamespace="https://example.com/xmlschema">
			<examplenamespace:field>namespaced_field_value</examplenamespace:field>
			<field>field_value</field>
		</document>
	`)

	parse(`
		<document>
			<field xmlns="https://example.com/xmlschema">namespaced_field_value</field>
			<field>field_value</field>
		</document>
	`)

}
```
```
main.XMLDoc{XMLName:xml.Name{Space:"", Local:"document"}, NamespacedField:"namespaced_field_value", Field:"field_value"}

main.XMLDoc{XMLName:xml.Name{Space:"", Local:"document"}, NamespacedField:"namespaced_field_value", Field:"field_value"}
```
All good, but watch what happens when [I flip the order of `Field` and `NamespacedField` in 
the struct](https://go.dev/play/p/J67qm1XSWBG):

```go
type XMLDoc struct {
	XMLName         xml.Name `xml:"document"`
	Field           string   `xml:"field"`
	NamespacedField string   `xml:"https://example.com/xmlschema field"`
}
```

Our test program output is now:

```
main.XMLDoc{XMLName:xml.Name{Space:"", Local:"document"}, Field:"field_value", NamespacedField:""}

main.XMLDoc{XMLName:xml.Name{Space:"", Local:"document"}, Field:"field_value", NamespacedField:""}
```

**Yikes!** Now `NamespacedField` isn't correctly deserialized!

We've found an [11 year old bug](https://github.com/golang/go/issues/8535) in 
`encoding/xml` that Google is unable or unwilling to fix. It was really not fun
to discover this independently and find these ancient issues open.

# Workaround 1: Fake Namespaces

[One workaround is to a fake namespace and set it as the default namespace, eg](https://go.dev/play/p/13J3BUTh3kR)

```go

package main

import (
	"bytes"
	"encoding/xml"
	"fmt"
)

type XMLDoc struct {
	XMLName         xml.Name `xml:"document"`
	Field           string   `xml:"_ field"`
	NamespacedField string   `xml:"https://example.com/xmlschema field"`
}

func parse(input string) XMLDoc {
	var parsed XMLDoc
	decoder := xml.NewDecoder(bytes.NewReader([]byte(input)))
	decoder.DefaultSpace = "_"
	decoder.Decode(&parsed)

	fmt.Printf("\n%#v\n", parsed)
	return parsed
}

func write(doc XMLDoc) {
	marshalled, _ := xml.Marshal(&doc)
	fmt.Print(string(marshalled))
}

func main() {
	write(parse(`
		<document xmlns:examplenamespace="https://example.com/xmlschema">
			<examplenamespace:field>namespaced_field_value</examplenamespace:field>
			<field>field_value</field>
		</document>
	`))
}

```

```
main.XMLDoc{XMLName:xml.Name{Space:"_", Local:"document"}, Field:"field_value", NamespacedField:"namespaced_field_value"}
<document><field xmlns="_">field_value</field><field xmlns="https://example.com/xmlschema">namespaced_field_value</field></document>
```

This is gross and I hate it, but works for decoding. You can see the problem in
the output though: our fake namespace now leaks into the serialized XML.

Absent some gross (and insecure) string find/replacing action, the only way
around this seems to be to have a separate model without the fake namespace for
marshalling. Yikes.

# Workaround 2: Custom types (!!)

This is from [this comment on github](https://github.com/golang/go/issues/9519#issuecomment-2957545044).