---
layout: post
title:  "letterboxd2jellyfin sync script"
date:   2026-02-14 14:38
---

I have an incredibly niche use case where I 

1. Have a physical media collection that I haven't ripped
2. Would like to browse that collection in Jellyfin like its my own personal 
   Netflix
3. Have a public list in Letterboxd of all the movies I own

So I wrote a [quick script](https://github.com/jaydenmilne/letterboxd-2-jellyfin) 
and [published it to pypi](https://pypi.org/project/letterboxd2jellyfin/).
Shout out to [letterboxdpy](https://github.com/nmcassa/letterboxdpy) that made
this incredibly simple.

This script reads the playlist from letterboxd and writes stub `.mp4` files in 
the appropriate Jellyfin file structure so you can browse it, eg

```sh
$ letterboxd2jellyfin  -o '/path/to/jellyfin/library/Movies' -url https://letterboxd.com/matchup/list/scream-ranked/
parsing URL
Loading playlist `scream-ranked` from username `matchup`...
done!
This playlist has 6 entries
creating stub file  deleteme/Scream (1996)/Scream (1996).mp4
creating stub file  deleteme/Scream 4 (2011)/Scream 4 (2011).mp4
creating stub file  deleteme/Scream 2 (1997)/Scream 2 (1997).mp4
creating stub file  deleteme/Scream VI (2023)/Scream VI (2023).mp4
creating stub file  deleteme/Scream (2022)/Scream (2022).mp4
creating stub file  deleteme/Scream 3 (2000)/Scream 3 (2000).mp4
all done!
```

Now obviously you can't play this, it just plays a [cheeky stub of a video](https://github.com/jaydenmilne/letterboxd-2-jellyfin/blob/main/src/letterboxd2jellyfin/bluray.mp4),
but it is good enough to trick Jellyfin into showing all of the metadata. This
lets me doomscroll my own collection without having to walk over a few feet and
actually look at it, but also lets me sort and filter easily by actors.

This was also my first project using `uv` - it is indeed quite fast! Took me a 
while to figure out how to get those `.mp4` files embedded though. Turns out you
still have to opt in to the `uv build` backend even though that was what I was
trying to configure. 