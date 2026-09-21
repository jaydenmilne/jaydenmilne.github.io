---
layout: post
title:  "Abusing CD-Rs, DVD-Rs, and BD-Rs for Science"
date:   2026-09-05 11:41
---

I've been on an optical media kick lately, having a grand old time burning
disks and whatnot. One bit of advice that consistently comes up: don't let your
burned disks get exposed to sunlight; the dye layer is UV after all, and since
the [sun is a deadly lazer](https://youtu.be/xuCn8ux2gbs?t=182) it can damage
your precious bits.

Naturally, this advice needs to be tested to determine what _actually_ happens 
if you disregard it.

I had a friendly LLM [shart out some scripts](https://github.com/jaydens-tasty-slop/optical-stress-tests/tree/master) 
to generate max-size iso images and sha256sum them from the disk, and burned 
using k3b:

- [Verbatim CD-R](https://www.amazon.com/dp/B00029U1DK) (at max speed, 40x)
- [Verbatim CD-RW](https://www.amazon.com/dp/B00029U1DK) (at max speed, 40x)
- [Verbatim DVD-R](https://www.amazon.com/dp/B000FFQ1WG?th=1) (at max speed, 16x)
  - I also have a second DVD-R that long story short had 615 buffer underruns
    while burning. It passed verification, but it seemed like a poor test subject.
    I exposed it though because it would be interesting if using Burnfree made
    it degrade faster 
- [Verbatim BD-R](https://www.amazon.com/dp/B00GSQ4DBM?th=1) (at max speed, 12x)

The CD and DVD were burned with a brand new (old stock) Hitachi-LG data storage
[GHD0N](https://hitachi-lg.com/en/products/data.view/?v=19), the Blu-ray with
a brand new LG [WH16NS60](https://www.lg.com/us/burners-drives/lg-wh16ns60-internal-blu-ray-dvd-drive). The blanks were also just purchased
from Amazon, so hopefully they are fresh.

I verified each burn with k3b as well as my slop-script, and placed them in 
a ziplock baggie (so they don't get physically dirty and ruin by readers) with
the media side facing west in a window. They'll get blasted by the sun for hours
each day, and are physically warm to the touch.

I'll update this post as I go along.

# Updates

## 2026-09-06

Hung the discs in the window. 

## 2026-09-21

Finally had time to check on these. Looks like I waited too long.

* **CD-R:** Read fine
* **CD-RW:** Read fine
* **DVD-R:** I could tell these were toast before I even put them in the drive.
  Visibly discolored ring around the middle, and an odd intrusion on the side
  of one as well. No longer have a blue tint.
* **BD-R:** Didn't seem visibly damaged and my drive still recognizes it. The 
  sector analysis software was able to get at least one good sector off of it
  after retying a few times, but it seems like this disc is toast too.
  
<img alt="failed DVD-R" src="/assets/posts/2026-09-06-burned-media-torture-test/dvd-r.jpg">

I'll hang them back up and check in again later.