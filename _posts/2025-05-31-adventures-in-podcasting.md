---
layout: post
title:  "Adventures in Podcasting"
date:   2025-05-31 10:29
---

Contenders:

- https://github.com/eduncan911/podcast

- https://github.com/jbub/podcasts

# Fun with `encoding/xml`

For the first time I've felt betrayed somewhat by Go's standard library. The
`encoding/xml` package's namespace support seems to be half baked, and I've
been unable to work around some issues.

## Quick Recap

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

### The Problem

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
package main

import (
	"encoding/xml"
	"fmt"
)

type XMLDoc struct {
	XMLName         xml.Name `xml:"document"`
	Field           string   `xml:"field"`
	NamespacedField string   `xml:"https://example.com/xmlschema field"`
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
main.XMLDoc{XMLName:xml.Name{Space:"", Local:"document"}, Field:"field_value", NamespacedField:""}

main.XMLDoc{XMLName:xml.Name{Space:"", Local:"document"}, Field:"field_value", NamespacedField:""}
```

**Yikes!** Now `NamespacedField` isn't correctly deserialized!

We've found an [11 year old bug](https://github.com/golang/go/issues/8535) in `encoding/xml` that Google seemingly has no
desire to fix.


# `CDATA`

If you use this, you apparently have to have `xmlns:content="http://purl.org/rss/1.0/modules/content/"` in your `<rss>` tag. I don't really understand this because the 
`CDATA` thing appears to be an XML thing, and if it is needed, why doesn't
`encoding/xml` include it?


# WTF is going on with date formats?

The RSS spec says the date format should be [RFC 822](http://asg.web.cmu.edu/rfc/rfc822.html#sec-5)
with the example `Mon, 10 Oct 2005 14:10:00 GMT`. Apple says it should be 
[RFC 2822](http://www.faqs.org/rfcs/rfc2822.html) and gives the example 
`Sat, 01 Apr 2023 19:00:00 GMT`

Go helpfully provides a `time.RFC822` format specifier, but when I use it
Apple Podcasts defaults to a date in 2000. Looking at the format specifier, it 
is `02 Jan 06 15:04 MST`, which doesn't appear to match. Browsing the stdlib
I see `RFC1123` which does appear to have the right format (`Mon, 02 Jan 2006 15:04:05 MST`),
so I used that and it worked in Apple Podcasts.

Except the `podcast.ai` feed validator complains that:

> The "lastBuildDate" value "Sat, 31 May 2025 10:41:05 MDT" does not conform to RFC 2822.

# Apple Podcasts App

To test I've been manually adding my feed URL to the Apple Podcast app and
removing it when I want to apply some changes.

Unfortunately, there is some kind of caching going on; so if I re-add the same
URL immediately sometimes it shows the old version and sometimes it just doesn't
do anything at all.

# Buggy Podcast Validator Tools

- https://podcastai.com/feed-validator
  - Appears to not understand XML namespaces, ie complains about `itunes:image`
    missing when ` <image xmlns="http://www.itunes.com/dtds/podcast-1.0.dtd">`
    it there and the Apple Podcast app understands it
  - Complains about dates that seem valid?
- https://www.castfeedvalidator.com/validate.php
  - Does not like it when your file doesn't end with `xml`
  - Appears to understand XML namespaces though
- https://podba.se/validate/?
  - Complains about missing `“Atom” namespace was not found` when it is 100%
    there
  - Appears to not understand XML namespaces
  - Got this confusing error:

    > The feed’s is missing an . To be featured by Apple Podcasts, feeds must 
    > have valid author information.
- https://validator.w3.org/
  - Appears to work
- https://validator.livewire.io
  - Really doesn't understand XML namespaces
    
    > Bad item <duration> attribute name: xmlns[itunes]
    
    Except it does parse some  later?

    > Found 5 podcast namespace tags: <podcast:episode>, <podcast:location>, <podcast:person>, <podcast:season>, <podcast:transcript>[podcastindex]
- https://www.feedvalidator.org
  - This is just, wrong? According to Apple's spec?

    > line 41, column 34: itunes:explicit must be "yes", "no", or "clean": false
  - Doesn't know about `https://podcastindex.org/namespace/1.0` namespace

# Conclusion

This is annoying.