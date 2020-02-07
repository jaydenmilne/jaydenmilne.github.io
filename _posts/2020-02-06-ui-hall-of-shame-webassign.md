---
layout: post
title:  "UI Hall of Shame: WebAssign"
date:   2020-02-06 16:52
categories: bad-ui
---

I've used WebAssign for a few math classes. Previously, it was a fairly positive
experience. While dated, the site was fairly functional and responsive. It had
a compact layout, only used JS when it had to, and was mostly server-side 
rendered (of course that meant that there had to be more round trips and page
loads, but it wasn't terrible). The ebook worked fine, and was mostly just 
HTML.

But it seems that didn't give them as many opportunities to push their "value
add" services, and they gimped the old site and made it load in what is 
essentially an iframe, with modern chrome around it. But, this was half-done
in an inconsistent, confusing way.

I appreciate that they were trying to modernize their app, but they just didn't
have as good of a UI as the old one, and it feels slower to boot.


## The Good (?)
WebAssign does have a fairly good homework system. The equation editor is one of
the better ones I've used, and since that part is unchanged from the redesign it
makes it more impressive since the editor must've been fairly old.

## The Bad

### Mysterious buttons
I access the textbook through WebAssign. Quick, tell me what you think the two
buttons below do:

<img src="/assets/posts/2020-02-06-ui-hall-of-shame-webassign/toc.png">

If your answer was that `1` brings you to the chapter table of contents, and `2`
brings you to the table of contents for the entire book, you must work for
WebAssign, because that made no sense to me.

### Worthless sidebar
They've also added this nice sidebar on the left hand of the screen, whose
primary purpose seems to be to take up screen real-estate when I have two
windows side by side, like when, I don't know, I'm doing homework.

<img src="/assets/posts/2020-02-06-ui-hall-of-shame-webassign/sidebar-1.png">

This is an example of having icons for the sake of having icons, since I have
no idea what any of these do. Let's expand it to see what they are.

<img src="/assets/posts/2020-02-06-ui-hall-of-shame-webassign/sidebar-2.png">

Ah, mostly trying to sell me some "value added" stuff of questionable value.
Glad that sidebars there now.

### That horrible side window

Let's add a new ublock origin rule for that sidebar and move on to actually 
trying to read the textbook. 

<img src="/assets/posts/2020-02-06-ui-hall-of-shame-webassign/table-1.png">

Let's follow that link to Table 1. After all, one of the principal advantages of
ebooks is the ease of following links around without having to flip pages back
and forth.

Here's a video:

<iframe width="560" height="315" src="https://www.youtube.com/embed/QYKktWx_9Kg" frameborder="0" allow="encrypted-media;" allowfullscreen></iframe>

👏👏 what fantastic stuff.

To recap:

1. Click the link. It opens a sidebar for some reason. OK fine whatever.
2. Open to the page in the book, center on the "chart" (more on this)
3. After it finishes loading scroll away from the chart
4. The chart is incomplete, and not clickable except for a tiny ➕ in the 
   corner. Classy
5. Click on the plus, now it loads again
6. Be greeted by this wonderful horizontal scrollbar broken table (earlier it 
   would actually load images in the left column, but apparently I got some
   bonus bugs for the video)

Oh, and you can't make that sidebar wider for some reason. Wonderful!

<img src="/assets/posts/2020-02-06-ui-hall-of-shame-webassign/expand.gif">

When I click on it it just makes this weird dotted line thing appear next to it
that does nothing.
