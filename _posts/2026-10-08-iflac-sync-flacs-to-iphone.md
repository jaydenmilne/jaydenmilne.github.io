---
layout: post
title:  "iFlac: Sync your FLAC files to your iPhone from Linux"
date:   2026-10-08 18:33
---

> **COGNITOHAZARD WARNING:** This README is written by a real life meat computer
> but the rest of the project is 100% vibecoded

https://github.com/jaydens-tasty-slop/iFlac

I have a growing FLAC collection that I'd like on my phone, but I don't want to
have to boot Windows to use the Apple Music app or (shudders) iTunes. 

Had a friendly robot write this project to sync your FLAC files to your iPhone.

Based off of:

- [libimobiledevice](https://libimobiledevice.org/) and the approach
- [ByeTunes](https://github.com/EduAlexxis/ByeTunes)

It works by pairing your PC then injecting rows into Apple Music's sqlite database (!!).
Seems to work fine from my testing on an iPhone 12.

TIP: Don't use Bluetooth or this whole exercise was pointless - Bluetooth will compress your delicious lossless audio.