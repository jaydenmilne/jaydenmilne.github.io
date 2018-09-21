---
layout: post
title:  "How To Install Windows 10 on a Locked T-Mobile Lumia 435"
date:   2018-06-29 17:43
categories: windowsphone
---

## Background
So, I was on eBay one day when I [found this guy selling Lumia 435s for $18(!!)](https://www.ebay.com/itm/Microsoft-Lumia-435-Nokia-8GB-White-T-Mobile-Clean-IMEI-Excellent-Cond-0017/). 
So, after checking to make sure that the Lumia 435 is on the 
[official Windows 10 upgrade list](https://www.microsoft.com/en-us/windows/windows-10-mobile-upgrade), 
I bought one and tried to update it to Windows 10.

### Just Checking For Updates
So, I fire up my new 435 and check for updates:

<img src="/assets/posts/2018-06-29-windows-10-lumia-435-tmobile/update-1.jpg" height="30%" width="30%" alt="No updates are available???">

Nothing, even though it should upgrade to Windows 10. Odd

### Upgrade "Assistant"
After some googling I found out you need to install an app to enable the update. 
OK then. I saw it had a two star rating from people who were mad they couldn't upgrade.
I though I was OK though, since my phone is _officially supported_ by Microsoft!

<img src="/assets/posts/2018-06-29-windows-10-lumia-435-tmobile/upgrade-advisor-1.jpg" height="30%" width="30%" alt="Come on baby daddy wants Windows 10...">
<img src="/assets/posts/2018-06-29-windows-10-lumia-435-tmobile/upgrade-advisor-2.jpg" height="30%" width="30%" alt="And the Upgrade Advisor earns it's two star rating">

Burned by M$FT

### Windows Insider Program
I tried the Windows Insider program to get Windows 10 too.

<img src="/assets/posts/2018-06-29-windows-10-lumia-435-tmobile/insider-1.jpg" height="30%" width="30%" alt="Come on baby daddy wants Windows 10...">
<img src="/assets/posts/2018-06-29-windows-10-lumia-435-tmobile/insider-2.jpg" height="30%" width="30%" alt="And the Upgrade Advisor earns it's two star rating">

Unfortunantly the insider app would pop up this error message:
 
> Server Error
> 
> A connection error prevented us from
> downloading programs for you. Please
> check the date/time of your device and its
> network connection and try again.
>
> [OK]

Seems like there is some SSL cert issue going on with that app. If I set it the phone's date to 2015, the halcyon years of Windows Phone, it would connect, but report no builds available.

Would I be stuck in the forgotten Windows Phone 8.1 wasteland? Would I be out $18?

## The not-so-official way: hikari_calyx

I searched for too long for a way to force
a T-Mobile Lumia 435 to upgrade to Windows 10 and found nothing, since it seems
most tech-savvy people bought the unlocked version. Eventually, by accident, [I was
linked to a post by one hikari_calyx](https://forum.xda-developers.com/windows-10-mobile/guide-win10-mobile-offline-update-t3527340) 
on XDA developers that purports to support the 435. Go there and to read their
instructions, but for archival purposes I'll reproduce the relevant portions here.

Note that hikari_calyx reccomend against using this on the 435 since the "Upgrade
Assistant" supports it, but since T-Mobile blocks the update this will work just
fine.

```c
#include <std_disclaimer.h>

/*
 * Your warranty is now void.
 *
 * We are not responsible for bricked devices, dead SD cards,
 * thermonuclear war, or you getting fired because the alarm app failed. Please
 * do some research if you have any concerns about features included in this ROM
 * before flashing it! YOU are choosing to make these modifications, and if
 * you point the finger at us for messing up your device, we will laugh at you.
 *
 */
 ```
__ALL CREDIT GOES TO [hikari_calyx](https://forum.xda-developers.com/windows-10-mobile/guide-win10-mobile-offline-update-t3527340)__

1. This procedure might wipe your phone, so copy your crap off. For best results factory
   reset it before starting. At least remove your PIN though.
2. Install the [Windows Device Recovery Tool](https://support.microsoft.com/en-us/help/12379/windows-10-mobile-device-recovery-tool-faq)
    
   This will help you get back to stock should anything go awry. Might have good drivers too
3. Open the `W10M_Offline_Update_V4.1.txt` file linked to the post above, and open the MEGA url and
   start the the massive 1.6 gb download of `win10_mobile_offline_updater_v41.wim.`
   since it takes about two hours

   Here is a link to the text file for archival purposes: [W10M_Offline_Update_V4.1.txt](\assets\posts\2018-06-29-windows-10-lumia-435-tmobile\W10M_Offline_Update_V4.1.txt). 
   I won't re-host the .wim here, but if the MEGA link dies @ me on Twitter and
   I'll send you a new link. I hate dead links.
4. Since you have an up-to-date T-Mobile Lumia 435, your device is running version 
   `8.10.15148.160`, which is above the minimum of `8.10.14219.341` specified by hikari_calyx.

   They give the following matrix for what folder to extract:

   > Lumia 52X, 62X, 720/T, 810, 820, 822, HUAWEI W2: 2nd Generation\480x800  
   > Lumia 1320: 2nd Generation\720x1280  
   > Lumia 920/T, 925/T, 928, 1020: 2nd Generation\768x1280  
   > Lumia 1520: 2nd Generation\1520  
   > __Lumia 43X/532: 3rd Generation\43X-532__  
   > Lumia 535: 3rd Generation\535  
   > Lumia 63X: 3rd Generation\63X  
   > Lumia 73X: 3rd Generation\73X  
   > Lumia 830: 3rd Generation\830  

   So extract `3rd Generation\43X-532` somewhere convenient on your hard drive.
5. Download and extract `iutool.7z` from the post linked above.  
   [XDA link](https://forum.xda-developers.com/attachment.php?attachmentid=3982010&d=1482901928)  
   [Mirror](\assets\posts\2018-06-29-windows-10-lumia-435-tmobile\iutool.7z)
6. Connect your phone
7. Open Devices and Printers on your computer (Control Panel) and uninstall your Windows Phone
8. Open an administrator command window in the folder where you extracted `iutool`
9. Run `iutool -l` and verify your phone is listed
10. Now comes the fun part - run `iutool -V -p path-to-43X-532-folder-you-extracted`
<img src="/assets/posts/2018-06-29-windows-10-lumia-435-tmobile/iutool-1.png" height="85%" width="85%" alt="IM IN THE MAINFRAME">
11. Eventually it will finish with the following message
<img src="/assets/posts/2018-06-29-windows-10-lumia-435-tmobile/iutool-2.png" height="85%" width="85%" alt="I BEAT THE SYSTEM">
```
[1] Transferred file 134/137
[1] Transferred file 135/137
[1] Transferred file 136/137
[1] Transferred file 137/137
[1] Transferring files complete: 137 files
[1] Update started
[1] Unlock the device
[1] Device unlocked
```
I did this once and it gave me an error at the end, but it still worked.
If you check the update screen in the settings app you'll see it's started an update

<img src="/assets/posts/2018-06-29-windows-10-lumia-435-tmobile/update-2.jpg" height="30%" width="30%" alt="You can't control me, T-Mobile.">

12. Wait like an hour for it to update. You'll see the gears screen 

<img src="/assets/posts/2018-06-29-windows-10-lumia-435-tmobile/gears.jpg" height="30%" width="30%" alt="This takes forever">
 
Then some more loading screens, until you are finally running Windows 10 Mobile version `1511`!
The nice thing is that since the Lumia 435 (but not the T-Mobile) is officially 
supported, you don't have to use any of the steps to manually copy update cab 
files that are detailed in the XDA post, just let it update normally and you'll
 be good to go. It'll reboot like three or so times, but eventually you'll
make it to version `1607`. 


It runs quite well, I'm impressed what this little thing can do.
 
