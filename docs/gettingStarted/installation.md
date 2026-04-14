Before you try installing everything, please check the [requirements](./requirements.md).

This guide assumes that you have a [Foundry VTT](https://foundryvtt.com/) server running.

You will need to:

* [Link your Patreon account to your Foundry account](#linking-a-patreon-account)
* Install and enable the [Material Deck module](#module)
* (Optionally) install a [gaming system module](#gaming-system-modules)
* Install the [Stream Deck application](#stream-deck-application)
* Install the [Stream Deck plugin](#stream-deck-plugin)
* Make sure the browser is allowed to [access the plugin](#allowing-browser-access-to-the-plugin)
* [Test if everything works](#testing-if-everything-works)
* (Optionally) install a [Stream Deck profile](#stream-deck-profiles)

!!! warning "Chrome, Brave, Adblockers and Script Blockers"
    Chrome, Brave and other browsers have settings that may prevent a communication between Foundry and the Stream Deck plugin.<br>
    Similarly, browser plugins/extensions can block the connection.<br>
    See [here](#allowing-browser-access-to-the-plugin) for more info.

<BR CLEAR="left">

## Linking a Patreon Account
Material Deck is a premium module that requires a subscription to the [Material Foundry Patreon](https://www.patreon.com/materialfoundry) at the 'Material Apprentice' tier or higher.<br>
As a patron you can gain access to the module by linking your Patreon account to your Foundry account:

1. Log in on the [Foundry VTT website](https://foundryvtt.com/)
2. Edit your profile [here](https://foundryvtt.com/me/edit)
3. Link your Patreon account at the bottom of the page if you haven't already
4. Verify that Material Deck shows up under your [subscriptions](https://foundryvtt.com/me/subscriptions). If it doesn't appear as expected under the "Subscribed Content" page of your user profile, you may need to Refresh your Patreon link

## Module
<div class="imgContainer"><img src="../../img/misc/enablePopup.png"></div>

You will need to install and enable the [Material Deck module](https://foundryvtt.com/packages/materialdeck-premium) by following [this](https://foundryvtt.com/article/modules/) guide.

When you or any players accesses a Foundry server with Material Deck enabled, while it has not been enabled for the client in the [module settings](../moduleSettings/moduleSettings.md), a popup will appear asking if you want to enable Material Deck for the client.

Any user that wants to use Material Deck should click 'Enable', other users should click 'Don't Enable'.

Tick the 'Do not show again' checkbox to prevent the popup from appearing.

## Gaming System Modules
<div class="imgContainer"><img src="../../img/misc/noSystemPopup.png"></div>
While the core Material Deck module is system agnostic, some features will require the installation of a [gaming system module](./gamingSystems.md).

If no gaming system module is installed and enabled, a popup will appear notifying you of this every time you access the Foundry server (as a GM).

You can press the 'Download Utility' button to open the [Download Utility](../moduleSettings/downloadUtility.md) or the 'Close' button to close the popup.

Tick the 'Do not show again' checkbox to prevent the popup from appearing.

## Stream Deck Application
For you computer to communicate with your Stream Deck, you will need to install either the [official Stream Deck application](https://www.elgato.com/ww/en/s/downloads) or [OpenDeck](#opendeck).

The official Stream Deck application only works on Windows and MacOS, and only with Elgato's devices. Linux users, or users of non-Elgato [compatible devices](./requirements.md#compatible-devices) will need to use OpenDeck.

### OpenDeck
OpenDeck is an open-source alternative to the official Stream Deck application that runs on Windows, MacOS and Linux. While Material Deck is currently fully functional in OpenDeck, you should consider it unofficially supported. This means that there is no guarantee that Material Deck will keep functioning on OpenDeck, and OpenDeck-specific issues might not be solved.

Please note that the default [profiles](../profiles/profiles.md) cannot be imported into OpenDeck. This means that you will have to create your own from scratch.

This documentation will assume the use of the official Stream Deck application, it is up to you to figure out how this translates to OpenDeck.<br>

You can get OpenDeck [here](https://github.com/nekename/OpenDeck).<br>
For the Ajazz AKP153 (and similar devices), you will need [this](https://github.com/4ndv/opendeck-akp153) plugin.

## Stream Deck Plugin
The Stream Deck plugin is what allows the Stream Deck to communicate with Foundry.

1. Download the latest plugin file (com.cdeenen.materialdeck.streamDeckPlugin) from [here](https://github.com/MaterialFoundry/MaterialDeck_SD/releases) or get it from the [Download Utility](../moduleSettings/downloadUtility.md)
2. Double-click the file, this should open the Stream Deck software if it's not open yet
3. Press 'Install' in the pop-up

If that doesn't work, you can try the following:

1. Download the source code from [here](https://github.com/MaterialFoundry/MaterialDeck_SD/archive/refs/tags/v1.7.2.zip)
2. Extract the file (using, for example, [WinRAR](https://www.win-rar.com/start.html?&L=0))
2. Copy the `com.cdeenen.materialdeck.sdPlugin` folder (in the 'Plugin' folder) to:
    * Windows: `%appdata%\Elgato\StreamDeck\Plugins\`
    * MacOS: `~/Library/Application Support/com.elgato.StreamDeck/Plugins/`
3. Restart the Stream Deck application.

## Allowing Browser Access to the Plugin
<b>Only for secured Foundry servers (servers that use `https` instead of `http`).</b>
<div class="imgContainer"><img src="../../img/misc/ChromeFix1.png"></div>
By default, some browsers may prevent connections between a secured website and local apps and services (which the Stream Deck plugin is).

You might see a pop-up appear when you first access your Foundry server, which asks you to allow this access. If you see this popup, select `Allow`.

<BR CLEAR="right">

<div class="imgContainer"><img src="../../img/misc/ChromeFix2.png"></div>
If you do not see that pop-up, click the icon to the left of the address bar and make sure `Apps on device` is enabled.

On older versions of Brave you have to disable the shields for your Foundry server:
1. Press the lion icon to the right of the address bar
2. Set shields to 'down'

<BR CLEAR="right">

### Browser Plugins/Extensions
Some browser plugins/extensions such as ad-blockers and script blockers may prevent the connection between Foundry and the Stream Deck.
If you run into connection issues, try disabling the extension or whitelist your Foundry server.

## Testing If Everything Works
You can now test if a connection can be established between the Stream Deck and Foundry:

1. Make sure the Stream Deck is connected to your computer and you are running the Stream Deck app
2. Start a world in Foundry and access it (or refresh it)
3. A notification should appear stating `Material Deck: Connected to Stream Deck`, which means the connection is established
4. In the Stream Deck app, drag a 'Token' action to one of the buttons (see [here](../actions/actions.md) if you don't know how to do that)
5. Select a token in Foundry, its icon and name should appear on the Stream Deck

## Stream Deck Profiles
Stream Deck profiles are essentially collections of button actions that you can easily switch between.

You can create your own or download one of the pre-made profiles.

See [here](../profiles/profiles.md) for more info on profiles.