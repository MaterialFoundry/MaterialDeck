Using 'Custom On-Click' you can modify a value in the token or actor object, as specified in the `Formula` field.

<b>Please note that this function is quite powerful, but can seriously mess up tokens and actors if you're not careful. Please make sure you fill in the correct formula and create a test character to test it out on first!</b>

In 'Formula' you can fill in the desired formula. You can use the following:

* Numbers: Any number you want
* Token and actor data: see below
* Macros: see below
* `[@this]`: gets the value of the 'target', see below
* `;`: separates multiple formulas/macros
* `=`: sets the target on the left of '=' to the value on the right
* `++`: add 1
* `--`: subtract 1
* `+`: addition
* `-`: subtraction
* `*`: multiplication
* `/`: division
* `**`: exponentiation
* `%`: modulus
* `<`, `<=`, `>`, `>=`: limit the value
* Strings: see below

Forget about the proper order of operations, any operation is performed from left to right. Each operation must be separated by an empty space. A properly formatted formula has a 'target' in the form of token or actor data, followed by a `=`, followed by either a value or a function.

Token and actor data is the path the the desired data (from the token object).<br>
For example, to get the hit points in dnd5e, you'd use the path `actor.system.attributes.hp.value`.<br>
Any path you want needs to be prefixed by `@`, and surrounded by square brackets `[` and `]`.
So in for the hp you'd fill in `[@actor.system.attributes.hp.value]`

`[@this]` is a shorthand for whatever data path you have to the left of the `=` sign.

## Basic Examples
Set the walking speed to 25 feet:<br>
`[@actor.system.attributes.movement.walk] = 25`

Increment the HP by 1:<br>
`[@actor.system.attributes.hp.value] = [@this] ++`

Increment the HP by 1 but limit to the max hp:<br>
`[@actor.system.attributes.hp.value] = [@this] ++ <= [@actor.system.attributes.hp.max]`

Set the AC to 10 plus the DEX modifier:<br>
`[@actor.system.attributes.ac.value] = 10 + [@actor.system.abilities.dex.mod]`

## Shorthand Notation
You cannot use shorthand notation such as `[@actor.system.attributes.hp.value] ++` or `[@actor.system.attributes.hp.value] += 1`.<br>
Instead you will need to use one of the following methods:<br>
`[@actor.system.attributes.hp.value] = [@actor.system.attributes.hp.value] ++`<br>
`[@actor.system.attributes.hp.value] = [@actor.system.attributes.hp.value] + 1`<br>
`[@actor.system.attributes.hp.value] = [@this] ++`<br>

## Strings
If you want to modify string data, such as a token name, any part to the right of `=` should not contain any maths, or you might get unexpected results. If the string contains any empty spaces, you must surround the string with square brackets `[` and `]`.

For example, to set the token name: `[@actor.name] = John` or `[@actor.name] = [John Doe]`.<br>
Using `[@actor.name] = John Doe` will not work.

## Triggering Macros
You can trigger macros using `@macro macroName`.

If the name of you macro or any of the arguments has spaces in it, you have to surround the name with apostrophe `'`.<br>
For example, if you macro is named `Test Macro`, you use `@macro  'Test Macro'`.

You can use arguments by adding them after the macro name:<br>
`@macro 'Test Macro' '{"argument1": 1, "argument2": 2}'`<br>
The argument is in the form of an object, where each key needs to be surrounded with quotation marks `"`, and the entire argument object must be surrounded with apostrophe `'`.

You can use these macros to change the button's icon or text, as explained [here](../macro.md#changing-button-icon-and-text).

## Combining Multiple Formulas
You can combine multiple formulas (or macro triggers) into one by separating them with `;`.

For example, you can increment the HP by 1 and set the walking speed to 25 feet with:<br>
`[@actor.system.attributes.movement.walk] = 25 ; [@actor.system.attributes.hp.value] = [@this] ++`

Or increment the HP by 1 and call the macro `Test Macro`:<br>
`[@actor.system.attributes.hp.value] = [@this] ++ ; @macro [Test Macro]`