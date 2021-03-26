---
layout: post
title:  "Turning Gifs Into Signal Stickers"
date:   2021-03-25 19:30
---

Signal recently added support for animated stickers. Naturally, that meant that
I had no choice but to add everyone's favorite Slack joke from years ago, the
[Party Parrots](https://cultofthepartyparrot.com/). 

But, there are a [few requirements from Signal](https://support.signal.org/hc/en-us/articles/360031836512-Stickers):

> - Non-animated stickers must be a separate PNG or WebP file
> - Animated stickers must be a separate APNG file. Please do not upload GIFs
> - Each sticker has a size limit of 300kb
> - Animated stickers maximum animation length of 3 seconds
> - Stickers resize to 512 x 512 px
> - Assign one emoji to each sticker
> - Maximum 200 stickers per pack

The zip of Party Parrot images is all in `.gif` format, and I need to bulk
crop them. Enter everyone's favorite obtuse swiss army knife: ffmpeg.

## HD Parrots
The HD ones are already square, which was easy enough:

```python
import os

for filename in os.listdir(os.getcwd()):
	filename = os.fsdecode(filename)
	if filename.endswith(".gif"):
		os.system(f"ffmpeg -i {filename} -plays 0 apng\{filename}.apng")
```


### `.gif` original:

<img src="assets/posts/2021-03-25-signal-stickers/parrot.gif">

### `.apng` output:

<img src="assets/posts/2021-03-25-signal-stickers/parrot.gif.apng">

## Small Parrots

The smaller non-hd parrots weren't square and were too small for Signal,
so we had to blow them up, center them, and have a transparent background.

```python
import os


for filename in os.listdir(os.getcwd()):
	filename = os.fsdecode(filename)
	if filename.endswith(".gif"):
		os.system(f"ffmpeg -i {filename} -vf \"scale='100:-1',pad=width=100:height=100:x=0:y=7:color=0xffffff00\" -plays 0 apng_square\{filename}.apng")
```

### `.gif` original:
<img src="assets/posts/2021-03-25-signal-stickers/bananaparrot.gif">

### `.apng` upscaled & "centered" output:
<img src="assets/posts/2021-03-25-signal-stickers/ananaparrot.gif.apng">

## End Result
I tried to do more but even though Signal claims you can have 200 I had issues
getting it past 100. So, there you go! Maybe someone will add the rest.

## [View images](https://signalstickers.com/pack/2e43b57cf03eb139bb44242007a90c54)

## [Add to Signal](https://signal.art/addstickers/#pack_id=2e43b57cf03eb139bb44242007a90c54&pack_key=d33e8cab3abce371249f983c334747df50c955728cc86afae4473181a3e7bf2d)