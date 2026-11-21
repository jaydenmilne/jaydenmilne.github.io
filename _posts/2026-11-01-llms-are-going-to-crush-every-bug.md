---
layout: post
title:  "LLMs are going to crush every open source bug"
date:   2026-11-01 08:30
---

Lately I decided to see how good Claude is at bringing up modern Linux on a
9 year old Galaxy Tab S3. Here's a sample of how that is going.

> **Me:** Hey I noticed that screen rotation is janky and it is clearly compositing
> uninitialized memory

_One hour goes by_

> No problem boss, all good now! All I had to do was:
> 
> - Backport a WIP GPU patch from LKML that hasn't even been merged yet to your kernel
> - Fix a freedreno GPU driver bug that has existed since 2018
> - Find two separate bugs in Kwin
> - Find an Alpine packaging bug that has prevented any file capabilities from being
>   applied to binaries for the past month
> 
> I've forked each project and prepared MR descriptions for each. 

LLMs have been derided as mediocrity machines that just give stochastic averages.
Even if we accept that framing, despite all the cynicism in tech about software
quality, most code really does mostly work. 