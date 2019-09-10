---
layout: post
title:  "Battery Drain on Windows 10 while sleeping"
date:   2019-09-10 08:46
categories: windows
---

## The Problem

After not using your laptop all summer, the battery drains completely every
night when shutting the lid. This used to work fine.

## How to Investigate

Run a sleep study. From an elevated command prompt:

```batch

C:\WINDOWS\system32>powercfg /SLEEPSTUDY
Sleep Study report saved to file path C:\WINDOWS\system32\sleepstudy-report.html.

```

Open the generated HTML file. Mine had a graph looking like this:

<img src="/assets/posts/2019-09-10-surface-book-battery-drain/chart.png" alt="Graph showing excessive battery drain">

Scroll down and try and find the section that has the worst drain:

<img src="/assets/posts/2019-09-10-surface-book-battery-drain/bad.png" alt="Section with 82% battery usage">

Click on that row of the table. Find the red box and drill down until you find a culprit

<img src="/assets/posts/2019-09-10-surface-book-battery-drain/drill-down.png" alt="Section with 82% battery usage">

## The problem, in my case

The Realtek card reader has a driver that doesn't play nice with Windows 10.
You'd think that, being a Surface Book, I wouldn't have problems like this, or
they'd expedite a fixed driver, or pull the bad one.

I rolled back to an older version of the driver, provided by Microsoft.

At least the sleep study tool is pretty good!