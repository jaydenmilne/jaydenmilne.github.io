---
layout: post
title:  "iptsd prevents hibernation"
date:   2025-03-07 08:44
---

Put Arch on my Surface Book 1, and it wouldn't hibernate, mostly after using
systemd's `HibernateDelaySec=`. Poking through the logs, I saw this:

<details>
<summary>logs </summary>

```
(system is resuming after sleeping to hibernate)
Mar 10 09:11:35 hostname kernel: Restarting tasks ...
Mar 10 09:11:35 hostname kernel: ipts 0000:00:16.4-3e8d0870-271a-4208-8eb5-9acb9402ae04: IPTS EDS Version: 1
Mar 10 09:11:35 hostname kernel: done.
Mar 10 09:11:35 hostname kernel: random: crng reseeded on system resumption
Mar 10 09:11:35 hostname kernel: ipts 0000:00:16.4-3e8d0870-271a-4208-8eb5-9acb9402ae04: IPTS running in event mode
Mar 10 09:11:35 hostname kernel: input: IPTS 1B96:005E Touchscreen as /devices/pci0000:00/0000:00:16.4/0000:00:16.4-3e8d0870-271a-4208-8eb5-9acb9402ae04/0000:1B96:005E.0012/input/input85
Mar 10 09:11:35 hostname kernel: input: IPTS 1B96:005E as /devices/pci0000:00/0000:00:16.4/0000:00:16.4-3e8d0870-271a-4208-8eb5-9acb9402ae04/0000:1B96:005E.0012/input/input86
Mar 10 09:11:35 hostname iptsd[7043]: [09:11:35.618] [warning] core: linux: Reading from file failed: Input/output error
Mar 10 09:11:35 hostname systemd[1]: Stopping Intel Precise Touch & Stylus Daemon...
Mar 10 09:11:35 hostname kernel: hid-generic 0000:1B96:005E.0012: input,hidraw1: <UNKNOWN> HID v0.00 Device [IPTS 1B96:005E] on
Mar 10 09:11:35 hostname iptsd[7043]: [09:11:35.718] [error] core: linux: IOCTL 3221374982 failed: No such device
Mar 10 09:11:35 hostname systemd[1]: Condition check resulted in iTouch Controller being skipped.
Mar 10 09:11:35 hostname systemd[1]: Started Intel Precise Touch & Stylus Daemon.
Mar 10 09:11:35 hostname iptsd[32669]: [09:11:35.753] [info] Loading config /usr/share/iptsd/surface-book-1.conf.
Mar 10 09:11:35 hostname iptsd[32669]: [09:11:35.754] [info] Loading config /etc/iptsd.conf.
Mar 10 09:11:35 hostname kernel: input: IPTSD Virtual Touchscreen 1B96:005E as /devices/virtual/input/input87
Mar 10 09:11:35 hostname iptsd[32669]: [09:11:35.764] [info] Connected to device 1B96:005E
Mar 10 09:11:35 hostname iptsd[32669]: [09:11:35.764] [info] Running in Touchscreen mode
Mar 10 09:11:35 hostname kernel: input: IPTSD Virtual Stylus 1B96:005E as /devices/virtual/input/input88
Mar 10 09:11:35 hostname kernel: ipts 0000:00:16.4-3e8d0870-271a-4208-8eb5-9acb9402ae04: Stopping IPTS
Mar 10 09:11:35 hostname systemd-sleep[32596]: System returned from sleep operation 'suspend-then-hibernate'.
Mar 10 09:11:35 hostname kernel: PM: suspend exit
Mar 10 09:11:35 hostname systemd-sleep[32596]: Performing sleep operation 'hibernate'...
Mar 10 09:11:35 hostname kernel: PM: Image not found (code -16)
Mar 10 09:11:35 hostname kernel: PM: hibernation: hibernation entry
Mar 10 09:11:55 hostname kernel: Filesystems sync: 0.027 seconds
Mar 10 09:11:55 hostname kernel: Freezing user space processes
Mar 10 09:11:55 hostname kernel: ipts 0000:00:16.4-3e8d0870-271a-4208-8eb5-9acb9402ae04: Starting IPTS
Mar 10 09:11:55 hostname kernel: Freezing user space processes failed after 20.003 seconds (2 tasks refusing to freeze, wq_busy=0):
Mar 10 09:11:55 hostname kernel: task:iptsd           state:D stack:0     pid:7043  tgid:7043  ppid:1      flags:0x00000006
Mar 10 09:11:55 hostname kernel: Call Trace:
Mar 10 09:11:55 hostname kernel:  <TASK>
Mar 10 09:11:55 hostname kernel:  __schedule+0x3b2/0x1450
Mar 10 09:11:55 hostname kernel:  ? uinput_destroy_device+0x4d/0xc0 [uinput 227f083935715b8ea3ac33456e746021dcc61bc4]
Mar 10 09:11:55 hostname kernel:  schedule+0x27/0xf0
Mar 10 09:11:55 hostname kernel:  schedule_preempt_disabled+0x15/0x30
Mar 10 09:11:55 hostname kernel:  rwsem_down_write_slowpath+0x1d3/0x660
Mar 10 09:11:55 hostname kernel:  down_write+0x5a/0x60
Mar 10 09:11:55 hostname kernel:  hidraw_release+0x26/0x120
Mar 10 09:11:55 hostname kernel:  __fput+0xde/0x2a0
Mar 10 09:11:55 hostname kernel:  __x64_sys_close+0x3c/0x80
Mar 10 09:11:55 hostname kernel:  do_syscall_64+0x82/0x190
Mar 10 09:11:55 hostname kernel:  ? uinput_destroy_device+0x45/0xc0 [uinput 227f083935715b8ea3ac33456e746021dcc61bc4]
Mar 10 09:11:55 hostname kernel:  ? kfree+0x2eb/0x360
Mar 10 09:11:55 hostname kernel:  ? uinput_destroy_device+0x4d/0xc0 [uinput 227f083935715b8ea3ac33456e746021dcc61bc4]
Mar 10 09:11:55 hostname kernel:  ? uinput_ioctl_handler.isra.0+0xe7/0x900 [uinput 227f083935715b8ea3ac33456e746021dcc61bc4]
Mar 10 09:11:55 hostname kernel:  ? do_fault+0x2dc/0x4c0
Mar 10 09:11:55 hostname kernel:  ? __rseq_handle_notify_resume+0xa2/0x4a0
Mar 10 09:11:55 hostname kernel:  ? switch_fpu_return+0x4e/0xd0
Mar 10 09:11:55 hostname kernel:  ? arch_exit_to_user_mode_prepare.isra.0+0x79/0x90
Mar 10 09:11:55 hostname kernel:  ? syscall_exit_to_user_mode+0x37/0x1c0
Mar 10 09:11:55 hostname kernel:  ? do_syscall_64+0x8e/0x190
Mar 10 09:11:55 hostname kernel:  ? __x64_sys_rt_sigaction+0x12a/0x140
Mar 10 09:11:55 hostname kernel:  ? syscall_exit_to_user_mode+0x37/0x1c0
Mar 10 09:11:55 hostname kernel:  ? do_syscall_64+0x8e/0x190
Mar 10 09:11:55 hostname kernel:  ? switch_fpu_return+0x4e/0xd0
Mar 10 09:11:55 hostname kernel:  ? arch_exit_to_user_mode_prepare.isra.0+0x79/0x90
Mar 10 09:11:55 hostname kernel:  entry_SYSCALL_64_after_hwframe+0x76/0x7e
Mar 10 09:11:55 hostname kernel: RIP: 0033:0x71b30509fe56
Mar 10 09:11:55 hostname kernel: RSP: 002b:00007ffd8e941fd0 EFLAGS: 00000202 ORIG_RAX: 0000000000000003
Mar 10 09:11:55 hostname kernel: RAX: ffffffffffffffda RBX: 000071b305501780 RCX: 000071b30509fe56
Mar 10 09:11:55 hostname kernel: RDX: 0000000000000000 RSI: 0000000000000000 RDI: 0000000000000003
Mar 10 09:11:55 hostname kernel: RBP: 00007ffd8e941fe0 R08: 0000000000000000 R09: 0000000000000000
Mar 10 09:11:55 hostname kernel: R10: 0000000000000000 R11: 0000000000000202 R12: 000056fd5996ecf0
Mar 10 09:11:55 hostname kernel: R13: 0000000000000002 R14: 00007ffd8e942980 R15: 000000000000001d
Mar 10 09:11:55 hostname kernel:  </TASK>
```
</details>

So it looks like [surface linux's iptsd](https://github.com/linux-surface/iptsd)
doesn't like being woken up and told to freeze itself right after.

This makes my laptop's battery die, which makes me sad. 

## Workaround

We can just kill iptsd before and after we resume. Luckily, systemd has a
convenient little hook ([`man systemd-sleep`](https://www.freedesktop.org/software/systemd/man/latest/systemd-sleep.conf.html))
just for shenanigans like this.

> Note that scripts or binaries dropped in /usr/lib/systemd/system-sleep/ are 
> intended for local use only and should be considered hacks.

Indeed.

Drop the following script in `/lib/systemd/system-sleep/iptsd-hack.sh`

```bash
#!/bin/sh

# This file (or a link to it) must be in /lib/systemd/system-sleep/iptsd.sh
logger -t "iptsd-hack" "\$0=$0, \$1=$1, \$2=$2"

if [ $1 == "pre" ]; then
  logger -t "iptsd-hack" "stopping iptsd"
  iptsd-systemd -- stop
else
  logger -t "iptsd-hack" "starting iptsd"
  iptsd-systemd -- start
fi
```

Do a `systemctl daemon-reload` for a good measure.