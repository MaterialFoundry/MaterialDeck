When your system module is ready, you can publish it.<br>
Ideally you'd both submit it using Foundry's package submission so it's downloadable within Foundry, and to the Material Deck repository, so people can find it from the Material Deck documentation and Download Utility.

## Foundry Module Management

### Package Submission
For your module to show up in the Foundry module browser, you need to fill in the [New Package Submission](https://foundryvtt.com/creators/submit/) form. The Foundry team will review your submission and (hopefully) approve it.

### Updating a Package
You can update your package and push a new version [here](https://foundryvtt.com/me/packages).<br>
Select the module you would like to edit. At the bottom there is a list of releases where you can create a new release by pressing the `Add` button. Fill in the fields and press `Save Package`.<br>
The new version should now be available to all users.

## Material Deck Supported Systems
You can add your system module to the Material Deck supported modules. To have your module accepted you will need to do 2 things:

1. Add your system to the supported systems in the Material Deck documentation
2. Add your system to the `versions.json` file that allows the system module to show up in the Download Utility

Both are done on the main [Material Deck](https://github.com/materialfoundry/materialdeck) repository. To do this, you must:

1. Fork the Material Deck repository
2. Make the required changes
3. Perform a pull request

After the pull request, your submission will be reviewed.

You can follow [this](https://youtu.be/a_FLqX3vGR4?si=xGZ8ITSNMgXmACgA) guide on how to fork a repository and perform a pull request.

The rest of this page assumes that you've forked the Material Deck repository and are making changes to your fork.

### Adding Your System to the Material Deck Documentation
You will need to edit the `gamingSystems.md` file that can be found at `/docs/gettingStarted/gamingSystems.md`.

Under the `Supported Systems` header you will find a table with all the supported systems. This table is formatted using [Markdown](https://www.markdownguide.org/extended-syntax/#tables). This means that each table row is separated by a new line, while each column is separated by a `|`.

You will need to fill in all 5 fields:

| Field                 | Description |
|-----------------------|-------------|
|System                 | The full name of the gaming system, with hyperlink to the Foundry page of that system |
| Material Deck Module  | The full name of your module, with hyperlink to the module's Foundry page |
| Documentation         | Hyperlink to the documentation, this can be a readme file or something like an MkDocs page like the [DnD5e](https://materialfoundry.github.io/MaterialDeck_DnD5e) documentation |
| Project Source        | Hyperlink to the project source of your module, such as a GitHub repository |
| Author                | Your (user)name |

Insert your system so the table is ordered alphabetically based on the gaming system name.

### Adding Your System to versions.json
The [`versions.json`](https://github.com/MaterialFoundry/MaterialDeck/blob/Master/versions.json) file is used by Material Deck to populate the Download Utility. The file can be found in the root directory of the Material Deck repository.

The file contains a `systems` array. You will need to add your system to that array with the following fields:

| Field     | Description |
|-----------|-------------|
| title     | Title of the gaming system |
| id        | Id of your module (should be the same as in your module's module.json) |
| system    | Id of the gaming system |
| author    | Your (user)name   |
| url       | Url to Foundry page of your module |
| manifest  | Url to your module's manifest file (module.json) |
| repository    | Url to your module's repository |
| documentation | Url to your module's documentation |
| compatibility | Material Deck version your module is compatible with. Should contain at least a `minimum` field |
| version       | version number of your module |

### Updating Your Module
When you update your module, please update the version number in `versions.json`.

## Announcing Your Releases
You can be given permission to announce releases on the Material Deck Discord server in the `#md-system-updates` channel. To do this, you will need to be given the `System Dev` role. To get this role, message Cris (@materialfoundry) on Discord.