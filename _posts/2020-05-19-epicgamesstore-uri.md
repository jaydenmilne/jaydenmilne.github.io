---
layout: post
title:  "steamsync & Epic Games Store URIs"
date:   2020-05-19 18:44
categories: games
---

Building off my last post, I built a little script called [steamsync](https://github.com/jaydenmilne/steamsync)
that will import your Epic Games Store games as shortcuts into Steam. It is pip
installable (`pip install steamsync && steamsync.py`), so give it a try!

## Epic Games Store URIs

I noticed that some games failed to launch, eg GTAV would give an authentication
error. Using Procmon, I looked at the arguments that the Epic Games Store
uses to launch the game. Here is an example:
```
"D:/Epic Games/GTAV/PlayGTAV.exe"  -AUTH_LOGIN=unused -AUTH_PASSWORD=abcdefghijklmnopqrstuvwxyz123456 -AUTH_TYPE=exchangecode -epicapp=9d2d0eb64d5c44529cece33fe2a46482 -epicenv=Prod -EpicPortal  -epicusername="gaben" -epicuserid=abcdefghijklmnopqrstuvwxyz12345 -epiclocale=en
```

Yup, sure enough, just launching `PlayGTAV.exe` and signing in with your Rockstar
account that is linked to your EGS account isn't enough, you need to do it through
the launcher. Maybe I should ask for a refund :)

Anyway, this means that we can't launch GTAV from Steam with just a shortcut to
`PlayGTAV.exe`, although most other, simpler games work.

### Shortcuts

Fortunantly, the Epic Games Store has a feature that lets you make a desktop 
shortcut. Let's make one and see what the target is:

```
com.epicgames.launcher://apps/9d2d0eb64d5c44529cece33fe2a46482?action=launch&silent=true
```

Eureka! The `9d2d0e`... is the Epic `AppName` field that I noticed in the last
blog post. 

Sure enough, after some testing, putting that URI in as the shortcut in Steam
launches the game.

Unfortunately, since we aren't giving the path to the executable, Steam doesn't
automatically pull in the games icon. And the EGS has a habit of opening itself
after the game exits, which can be kind of annoying in Big Picture mode.

### `steamsync`

Versions of `steamsync` after `0.2.0` have this fix in place. If you want to use
the path to the executable method, use the `--use-paths` option. This works for
most games.