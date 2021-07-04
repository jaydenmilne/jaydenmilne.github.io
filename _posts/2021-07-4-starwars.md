---
layout: post
title:  "Another Star Wars Site: starwars.jayd.ml"
date:   2021-07-04 10:46
---

I made another silly website: [starwars.jayd.ml](https://starwars.jayd.ml).

A roommate was watching Star Wars and I realized I could tell which one it was
by just listening to a few seconds of the movie. I wondered how far I could take
this - so here we are! 


## Implementation Details
I broke the 6 Star Wars movies into 10, 5, 2, and 1 second increments, using my
favorite swiss army knife, ffmpeg. 

In case you're wondering, the command line was

```ps
ffmpeg -i .\input.ogg -c copy -map 0 -segment_time 10 -f segment medium\input_medium%09d.ogg
```

I was going to use the Opus codec because I thought it was supported for iOS, 
but it turns out you have to use this wonky container format that doesn't work 
on any other operating system, so I had to re-encode as MP3. Luckily Powershell
makes it pretty easy to do that in parallel:

```ps
ls | Where { $_.Extension -eq ".opus" } | ForEach-Object -parallel  { ffmpeg -i $_.FullName $_.Name.Replace(".opus", ".mp3") > $null } -ThrottleLimit 6
```

I then renamed each file with a UUID, to prevent cheating with the web inspector,
and encrypted them with AES (incorrectly, with the same IV for each file) as 
well so you can't just download the `.mp3` file, you have to know how to use 
openssl.

There is a 'manifest' file that maps the difficulty and episode to the list of 
uuids, and that's encrypted as well to make it more difficult to cheat. 

Determined cheaters can still figure it out, but I at least tried to make it 
harder.