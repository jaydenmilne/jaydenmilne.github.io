---
layout: post
title:  "UI Hall of Shame: UPS"
date:   2020-06-02 22:55
categories: bad-ui
---

Even UPS isn't immune from bad UI.

Open a link to track a package, of the format `https://www.ups.com/track?loc=en_US&tracknum=DEADBEEFCAFEBABE00`

The page is automatically redirected to `https://www.ups.com/track?loc=en_US&tracknum=DEADBEEFCAFEBABE00/trackdetails`.
Notice the `/trackdetails` helpfully added to the end.

<img src="/assets/posts/2020-06-02-ui-hall-of-shame-ups/redirected1.jpg">

Press refresh, or try and share the link with someone:

<img src="/assets/posts/2020-06-02-ui-hall-of-shame-ups/404.png">

Nice. 

Someone doesn't understand how URLs and parameters are supposed to work. Should
be something like

`https://www.ups.com/track/DEADBEEFCAFEBABE00/trackdetails?loc=en_US`

or 

`https://www.ups.com/track/trackdetails?loc=en_US&tracknum=DEADBEEFCAFEBABE00`