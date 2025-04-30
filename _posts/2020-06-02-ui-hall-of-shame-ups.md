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

Nice. To make things even better, they break your history so you can't just hit
back, they really unintentionally to gaslight you into thinking the package you were 
tracking suddenly doesn't exist.

Someone doesn't understand how URLs and parameters are supposed to work. Should
be something like

`https://www.ups.com/track/DEADBEEFCAFEBABE00/trackdetails?loc=en_US`

or 

`https://www.ups.com/track/trackdetails?loc=en_US&tracknum=DEADBEEFCAFEBABE00`

I don't know why, but I looked at their code, and as I suspected they're it's a
SPA (Angular?) they're using incorrectly. I can't be bothered to figure it out, but
I think the bug is here somewhere.

```javascript
    1 == o.length ? (sessionStorage.setItem("UPS_SimplifiedTrackingNumber", o[0]),
    this._router.navigate([this._trackDetailsRoute])) : o.length > 1 && o.length < 26 ? (utag_data.page_id = "track/track-container.page",
    sessionStorage.setItem("UPS_SimplifiedTrackingNumbers", h),
    this._router.navigate([this._trackSummaryRoute])) : o.length > 25 && (this._errorService.setError(o, ">25"),
    this._router.navigate([this._trackRoute]))
} else
    window.location.href.endsWith(this._trackDetailsRoute) || window.location.href.endsWith(this._trackDetailsRoute + "/") ? this._router.navigate([this._trackDetailsRoute]) : window.location.href.endsWith(this._trackSummaryRoute) || window.location.href.endsWith(this._trackSummaryRoute + "/") ? (utag_data.page_id = "track/track-container.page",
    this._router.navigate([this._trackSummaryRoute])) : window.location.href.endsWith(this._print) || window.location.href.endsWith(this._print + "/") ? this._router.navigate([this._print]) : this._router.navigate([this._trackRoute]);
var m = this.getParameterByName("requester");
sessionStorage.setItem("UPS_SimplifiedClientID", m)
}
```

High quality stuff. If they had a way to report a bug I would do it.

Oh look, [it's been around for four months](https://www.drupal.org/project/simple_package_tracking/issues/3113863).
