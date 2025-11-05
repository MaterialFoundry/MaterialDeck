<div class="imgContainer"><img src="../../img/moduleSettings/moduleSettings.png"></div>
The module settings can be accessed in Foundry by pressing the 'Game Settings' (cogs icon) in the sidebar on the right, and then pressing 'Configure Settings'. This will open the 'Configure Game Settings' menu, where you have to select 'Material Deck' in the left column.

At the top you will find 6 buttons:

* <b>Documentation</b>: Pressing this button will lead you to this documentation.
* <b>Download Utility</b>: Opens the [Download Utility](./downloadUtility.md).
* <b>Device Manager</b>: Opens the [Device Manager](./deviceManager.md).
* <b>Permission Config</b>: Opens the [Permission Config](./permissionConfig.md).
* <b>Soundboard</b>: Opens the [Soundboard](../actions/audio/soundboard.md).
* <b>Custom Action Config</b>: Opens the [Custom Action Config](../actions/custom/config.md).

Below that, you will find the following settings:

* [Enable Module for this Client](#enable-module-for-this-client)
* [Hold Time](#hold-time)
* [Stream Deck Port](#stream-deck-port)
* [Maximum Connection Attempts](#maximum-connection-attempts)
* [Connection Notifications](#connection-notifications)
* [Image Cache Size](#image-cache-size)

## Enable Module for this Client
Each user can decide for themselves if they want to enable Material Deck (assuming the GM has allowed this in the [Permission Config](./permissionConfig.md)).<br>
Unticking this setting will prevent the module from trying to connect to a Stream Deck.<br>
Any sounds played through the [Audio Action](../actions/audio/audio.md) will still be played for users that have this setting disabled.

## Hold Time
Some actions will provide 'hold' functionality. This setting sets the default hold time (the time in milleseconds that you have to hold a button for it to register as a 'hold').

Please note that [system modules](../gettingStarted/gamingSystems.md) and [Custom Actions](../actions/custom/custom.md) can define their own hold time.

## Stream Deck Port
Material Deck needs to know on what port to connect to the Stream Deck. By default this is set to `3005`, but this can be changed if desired (for example, if another application uses that port). Most people will not need to change this.

If you change the port here, you will also need to change the port in the Stream Deck application.<br>
This can be done by selecting any Material Deck action, pressing the 'Global Plugin Settings' at the bottom, and changing the port there to the same value.

## Maximum Connection Attempts
Material Deck will attempt to connect to the Stream Deck whenever Foundry is refreshed or the connection to the Stream Deck is lost.<br>
It will attempt to create a connection as many times as configured here. So if set to 5, Material Deck will attempt to connect 5 times, after which it stops. You will then have to refresh Foundry to retry the connection.

Setting this to 0 will cause Material Deck to keep trying to connect indefinitely.

## Connection Notifications
By default, Material Deck will display notifications whenever a connection event occurs (e.g. a Stream Deck is connected).

With this setting you can configure which of these notifications should be displayed:

| Option    | Description   |
|-----------|---------------|
| Always    | Display all connection notifications |
| Failed Attempts   | Display notifications when a connection between Material Deck and the Stream Deck could not be established.   |
| Never     | Never show connection notifications.  |

## Image Cache Size
Material Deck often has to generate and send a lot of images to the Stream Deck, which can be time consuming. To improve performance, an image cache is implemented which stores images in the Stream Deck app. This means that if an image has to be sent that has already been sent previously (maybe because you switched between two folders), Material Deck no longer has to generate and then send that image, instead it tells the Stream Deck app to display an image from the cache.

The image cache size is the amount of images to store. A higher value will improve performance (for a longer time), but it increases memory (RAM) usage.