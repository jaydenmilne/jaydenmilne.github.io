---
layout: post
title:  "How to use Git LFS with jenkins/blueocean"
date:   2019-03-19 09:35
categories: jenkins
---
## The Problem
You want to use Git LFS with Jenkins Blue Ocean in a docker image and a Jenkins Declarative Pipeline.

You created the project entirely using the Blue Ocean UI and are using the `jenkins/blueocean` Docker image.

## The Solution
After trying many different permutations of the `checkout scm` step, this turned out to be super easy. Turns out you don't need to add anything to your `Jenkinsfile` at all - you just need to change the configuration a bit.

### Enable Git LFS pull after checkout
Navigate to your project and select "Configure". Under "Branch Sources" -> "GitHub" select "Add" -> "Git LFS pull after checkout"

<img src="/assets/posts/2019-03-19-jenkins-pipeline-git-lfs/jenkins_scrot.png" alt="Screenshot of selecting the Git LFS Pull option in the Jenkins UI. If you're blind, sorry">

Click save, you're done.

### Add Git LFS to the `jenkins/blueocean` image
Now, if you test it your build will fail since [Git LFS is not included in the base Jenkins image](https://github.com/jenkinsci/docker/pull/552). You will need to extend the `jenkins/blueocean` image for Git LFS to work.

This dockerfile worked well for me:

```dockerfile
FROM jenkinsci/blueocean
USER root
RUN apk add git-lfs
```

Create that docker image, run it, and you should be able to use Git LFS!

Next up, I need to figure out how to specify credentials for the Git LFS pull (we don't want to use Github to save bandwidth costs). Hopefully this is possible