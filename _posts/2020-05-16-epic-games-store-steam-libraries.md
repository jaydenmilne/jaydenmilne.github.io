---
layout: post
title:  "Library Information for Epic Games Store and Steam"
date:   2020-05-16 09:12
categories: games
---

## The Question
Where does the Epic Games Launcher store metadata about what games are installed
and where?

## The Answer
On my machine, `C:\\ProgramData\\Epic\\EpicGamesLauncher\\Data\\Manifests`.

(found using ProcMon)

Inside that folder there is a bunch of `*.item` json files (example below) that 
contain most of the interesting metadata. 

### Interesting Fields

- **`AppName`**: This seems to be an internal identifier the EGS uses to refer 
  to it and create directories. I would assume that this is unique for the whole
  store. 

  It seems earlier `AppNames` are human readable, like `Fortnite` or `Sage` 
  refers to "Overcooked", but later ones are a some kind of UUID, like GTAV is
  `9d2d0eb64d5c44529cece33fe2a46482`.

  Someone should make a database of these... (like SteamIDs)

- **`InstallLocation`**: Path to where the game is installed
- **`LaunchExecutable`**: Relative path inside of `InstallLocation` to the
  executable. `InstallLocation` + `LaunchExecutable` always seems to be valid
- **`bIsApplication`**: UE4 dev tools doesn't have this flag set


### Example .item file
This is "`0B5BCCB6454D17D42D663B9E3C28B935.item`", the item file for the free
"Nuclear Throne" which I have never played.

```json
{
	"FormatVersion": 0,
	"bIsIncompleteInstall": false,
	"AppVersionString": "1",
	"LaunchCommand": "",
	"LaunchExecutable": "nuclearthrone.exe",
	"ManifestLocation": "D:\\Epic Games\\NuclearThrone/.egstore",
	"bIsApplication": true,
	"bIsExecutable": true,
	"bIsManaged": false,
	"bNeedsValidation": false,
	"bRequiresAuth": true,
	"bCanRunOffline": true,
	"AppName": "Turaco",
	"BaseURLs": [
		"http://epicgames-download1.akamaized.net/Builds/Org/o-6xk2nej4lbrlkq5q4vxdf9w5kens7c/af422c0d66204723b7b657f3e9686222/default",
		"http://download.epicgames.com/Builds/Org/o-6xk2nej4lbrlkq5q4vxdf9w5kens7c/af422c0d66204723b7b657f3e9686222/default",
		"http://download2.epicgames.com/Builds/Org/o-6xk2nej4lbrlkq5q4vxdf9w5kens7c/af422c0d66204723b7b657f3e9686222/default",
		"http://download3.epicgames.com/Builds/Org/o-6xk2nej4lbrlkq5q4vxdf9w5kens7c/af422c0d66204723b7b657f3e9686222/default",
		"http://download4.epicgames.com/Builds/Org/o-6xk2nej4lbrlkq5q4vxdf9w5kens7c/af422c0d66204723b7b657f3e9686222/default"
	],
	"BuildLabel": "Live",
	"CatalogItemId": "3524134c7a4e4cf2832d8d2a634baef8",
	"CatalogNamespace": "742f165671424189aecdfdadf5ea9755",
	"AppCategories": [
		"public",
		"games",
		"applications"
	],
	"ChunkDbs": [],
	"CompatibleApps": [],
	"DisplayName": "Nuclear Throne",
	"FullAppName": "Turaco: Live",
	"InstallationGuid": "0B5BCCB6454D17D42D663B9E3C28B935",
	"InstallLocation": "D:\\Epic Games\\NuclearThrone",
	"InstallSessionId": "FC9CEB0B4738CBD8667075B018992077",
	"InstallTags": [],
	"InstallComponents": [],
	"HostInstallationGuid": "00000000000000000000000000000000",
	"PrereqIds": [],
	"StagingLocation": "D:\\Epic Games\\NuclearThrone/.egstore/bps",
	"TechnicalType": "public,games,applications",
	"VaultThumbnailUrl": "",
	"VaultTitleText": "",
	"InstallSize": 164670619,
	"MainWindowProcessName": "",
	"ProcessNames": [],
	"MainGameAppName": "Turaco",
	"MandatoryAppFolderName": "NuclearThrone",
	"OwnershipToken": "false"
}
```
