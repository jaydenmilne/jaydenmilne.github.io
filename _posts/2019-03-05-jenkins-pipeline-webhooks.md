---
layout: post
title:  "How to get Jenkins Blue Ocean Github Webhooks to Work"
date:   2019-03-05 09:35
categories: jenkins
---

## The Problem
I've been setting up a CI system for [holodeck-engine](https://github.com/BYU-PCCL/holodeck-engine) using Jenkins declarative multibranch pipelines and the new Blue Ocean UI. I wanted to be able to have it automatically build branches and pull requests and report the results back to Github - and this seemed the easiest way.

Unfortunately, after using Blue Ocean's nice "New Pipeline" UI, there were no Webhooks enabled in the GitHub repository (To see this in Github: Repo Settings Tab -> Webhooks), so I had to manually poll (in Jenkins: Job -> Scan Repository) to get it to build new branches and commits.

This appears to be a known bug that hasn't seen much traction: [JENKINS-50883](https://issues.jenkins-ci.org/browse/JENKINS-50883)

The suggestion in the above ticket: Manage Jenkins -> Configure System -> GitHub -> Advanced -> "Re-register hooks for all jobs" didn't help either.

Since Blue Ocean manages credentials and the Jenkins job, a lot of the tutorials on setting up these webhooks didn't apply. 

## The Solution
This is assuming you already have your Jenkins instance available on the public internet (otherwise webhooks aren't going to work).

**TLDR:** Add your personal access token before adding your pipeline.

1. Before doing anything in Blue Ocean, add your GitHub personal access token in Manage Jenkins -> Configure System -> Credentials
2. Press "Test Connection" and verify it can communicate.
3. Check the "Manage Hooks" box
4. Then, in the Blue Ocean UI, use the "New Pipeline" flow. It shouldn't prompt you for your Personal Access Token and give you your list of repos directly. Add your repository
5. After adding your repo, go back to Manage Jenkins -> Configure System -> GitHub -> Advanced -> "Re-register hooks for all jobs" 

   You should get a message saying it re-registered the hooks for x jobs, if you get a "Only works when ... !" message then something went wrong.
6. Verify in GitHub that the hook was registered: Repo Settings Tab -> Webhooks should have a `{jenkins url}/github_webhook/` entry
7. Open a PR and make sure Jenkins builds it!

### Notes
This is my Jenkins version info:
- Jenkins 2.150.3
- Blue Ocean 1.11.1
- GitHub API plugin 1.95
- GitHub Branch Source Plugin 2.4.2
- GitHub Pipeline for Blue Ocean 1.11.1
- GitHub plugin 1.29.4