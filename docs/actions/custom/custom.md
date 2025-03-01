# Custom Actions
Custom actions can be used to create a fully customized button.

You can configure settings that show up in the Stream Deck's property inspector, and define functions that are called when, for example, the button is pressed.

To use custom actions, you need to register an action. This is done through the [Custom Action Config](./config.md/#custom-action-config).<br>

Each custom action can register on 4 events:

* <b>On Update</b>: the button appears or a specified hook is called
* <b>On Press</b>: the button is pressed down
* <b>On Release</b>: The button is released
* <b>On Hold</b>: The button is held down

On these events specified code can be executed. This code has access to the complete Foundry API, so it could change anything in the game, similar to script macros.<br>
Besides that, the code can be used to configure the button by setting its text and icon.

## Button Press Event Order
Whenever a button is pressed, the following events will be called in the following order (if the event is configured):

1. The button is pressed down:
    * On Press: Will always be called
    * On Hold: Will be called if `delay` is set to 0 or not configured
2. The button is held down:
    * On Hold: Will be called once if the button has been held down for `delay` milliseconds
    * On Hold: Will be called repeatedly (every `period` ms) if `period` is configured
3. The button is released:
    * On Release: Will be called unless `stop on hold` is enabled, in which case it will not be called if the `on hold` event was called

#### Use Cases
Below are some common cases where you might want to execute one or more code blocks in certain situations.<br>
This (incomplete) list can be used as a starting guide.

| Execute           | Configuration |
|-------------------|---------------|
| Code `A` if pressed | 'On Press': code `A`. |
| Code `A` if pressed,<br>Code `B` if released | 'On Press': code `A`,<br>'On Release': code `B` |
| Code `A` every second | 'On Hold': code `A`,<br>'On Hold': period `1000` |
| Code `A` every 500ms but after a 1 second delay | 'On Hold': code `A`,<br>'On Hold': delay: `1000`,<br>'On Hold': period `500` |
| Code `A` if pressed,<br>Code `B` every 500ms but after a 1 second delay | 'On Press': code `A`,<br>'On Hold': code `B`,<br>'On Hold' delay `1000`,<br>'On Hold': period `500` |
| Code `A` if released unless long pressed,<br>Code `B` after a 1 second long press<br>(creates a dual-action button based on how long the button is pressed) | 'On Release': code `A`,<br>'On Release': stop on hold `true`,<br>'On Hold': code `B`,<br>'On Hold': delay `1000` |



