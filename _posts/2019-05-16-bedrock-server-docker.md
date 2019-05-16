---
layout: post
title:  "How to use Docker to run the Bedrock Minecraft server on Ubuntu 16.04"
date:   2019-05-16 17:18
categories: minecraft
---

## The Problem
You have an Ubuntu 16.04 server or some other distro on your server
 and you really don't want to change it, but want to 
run the [Minecraft bedrock server](https://www.minecraft.net/en-us/download/server/bedrock/)
. When you try and start it you get the following error:

```
./bedrock_server: error while loading shared libraries: libssl.so.1.1: cannot open shared object file: No such file or directory
```
or 
```
./bedrock_server: error while loading shared libraries: libcurl.so.4: cannot open shared object file: No such file or directory
```

## The Cause
Apparently, Mojang is not compiling the server with support for Ubuntu 16.04,
and since it depends on a higher glibc version, it's never going to run. It also
won't run on other distros, like Alpine Linux or CentOS.

## The Solution
Run the server with [the following `Dockerfile`](https://gist.github.com/jaydenmilne/cb3cb0502c4797d620cb598c9a8e702a):

<script src="https://gist.github.com/jaydenmilne/cb3cb0502c4797d620cb598c9a8e702a.js"></script>

And start it with [this script](https://gist.github.com/jaydenmilne/ca720cfb6620d962a4cd177bfeff01e2):

<script src="https://gist.github.com/jaydenmilne/ca720cfb6620d962a4cd177bfeff01e2.js"></script>

### Quick Primer on Docker

If you aren't familiar with Docker and just want to get this working, here is a 
quick overview of what you'll have to do.

1. [Install `docker-ce`](https://docs.docker.com/v17.09/engine/installation/linux/docker-ce/ubuntu/)

   Even if you aren't running Ubuntu, you should be able to get this to work with
   any distro that supports Docker with the magic of containerization.
2. Make sure you can run `docker run hello-world` from a bash prompt
3. [Download the server zipfile](https://www.minecraft.net/en-us/download/server/bedrock/)
   and unzip it
4. Create a file called `Dockerfile` with the contents shown above in the
   same folder.
5. Create a file called `start-bedrock-docker.sh` with the contents shown above
   
   At this point, the folder you are doing this in should look like this:
   ```
   +--my-folder-name
      +--Dockerfile
      +--start-bedrock-docker.sh
      +--bedrock-server-1.11.2.1
         +--bedrock_server
         +--permissions.json
         +--etc...
    ```
6. Customize your `server.properties` file

   It will be copied into the docker image. You can edit it later, it's just 
   easier to do it right now.
7. From `my-folder-name`, run `docker build -t mojang/bedrock`. You should see
   something like this at the end of a bunch of apt output:

   ```
   Successfully built 2b0e01bb18ac
   Successfully tagged mojang/bedrock:latest
   ```
8. Run `docker run mojang/bedrock` and ensure the server starts

   ```
   $ docker run mojang/bedrock
   NO LOG FILE! - setting up server logging...
   [2019-05-16 23:19:38 INFO] Starting Server
   [2019-05-16 23:19:38 INFO] Version 1.11.2.1
   [2019-05-16 23:19:38 INFO] Level Name: Bedrock level
   [2019-05-16 23:19:38 INFO] Game mode: 0 Survival
   [2019-05-16 23:19:38 INFO] Difficulty: 1 EASY
   [2019-05-16 23:19:42 INFO] IPv4 supported, port: 19132
   [2019-05-16 23:19:42 INFO] IPv6 not supported
   [2019-05-16 23:19:45 INFO] Server started.
   ```

   Kill it by running `docker ps` and noting the value under `NAMES` (should be
   a name like `thirsty_kapista`, see step 11 for example output), then running
   `docker stop {name}`. It will take a few seconds to stop.
9. Run `docker volume create bedrock-world`

   A docker volume is where your world will be persisted between `docker run`'s
10. Run the `start-bedrock-docker.sh` script, you should just see a SHA printed out

   ```
   $ ./start-bedrock-docker.sh
   68c52b82f015e2bd06e35a37a9792029407adbec4a8162bbf58d5582515d5f23
   $
   ```
11. Run `docker ps` to verify that the continer is running

    ```
    $ docker ps
    CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                      NAMES
    69e438cb1164        ef5e27d6f011        "/bin/sh -c 'cd /opt…"   19 hours ago        Up 19 hours         0.0.0.0:19132->19132/udp   thirsty_kapitsa
    ```
12. Connect to your server with a Bedrock client! Forward UDP port `19132`

### Useful Docker commands
- `docker ps` lists running containers. Careful, you can run more than one at a
   time
- `docker stop {container_name}` where `{container_name}` is `thirsty_kapitsa` 
   from the above `docker ps` output
- `docker run -it {container_name} /bin/bash` to attach a shell to a running 
  container

  This is useful for when you want to modify your server's configuration after 
  running `docker build`. Just run that command and cd to `/opt/bedrock` and 
  modify your server.properties from the command line with `nano`.
