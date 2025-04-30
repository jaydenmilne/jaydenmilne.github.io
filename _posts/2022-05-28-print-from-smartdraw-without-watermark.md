---
layout: post
title:  "Print From Smartdraw Trial Without a Watermark"
date:   2022-05-28 12:45
---

Did you spend hours fighting the clunky [smartdraw](smartdraw.com) editor because
you needed some one off plans, just to find out that it defaces your plans with
watermarks when you export it? No fear, you export your drawing as an SVG fairly
easily.

## Steps

1. Open your document in FireFox
2. Turn off rulers and grids by going to the `Page` tab
3. Shift+Right Click on your drawing, press "Inspect"
4. Right click the SVG node -> Copy -> Outer HTML
5. Paste it into Notepad
6. Do a find-and-replace for `&nbsp;` to ` ` (a single space character)
7. Save the file in Notepad as an SVG
8. Open it in Edge or some other SVG viewer
9. Print it without the watermark

## Fin

It's super frustrating that they let you invest hours into drawing something 
without warning you that they're going to watermark it. Someone recommended this
software to me since it worked well for them also using the trial, but they must 
have added this watermarking in the past couple months. 

Overall, I didn't find this product too compelling. The only advantage it had
over similar things from LucidChart was that you can type in the dimensions
instead of having to click and drag. 

The UI was slow, clunky, and you can't hide
labels you don't want, so instead you have to hide them all. 

When you press the "Show Labels" button the whole app freezes for a second and
is noticeably less performant. 