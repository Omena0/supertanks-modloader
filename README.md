# Supertanks modloader

Mod loader for [supertanks](https://supertanks.io/).

## Superhax

Advanced cheats for supertanks.

Is basically capable of playing the game on its own. And its good at it.

### Features

| Feature      | Description                                               |
| ------------ | --------------------------------------------------------- |
| Smart Aim    | Click almost anywhere and the shot ball will hit there.   |
| Ctrl move    | Only moves when ctrl is held.                             |
| Trajectories | Show the exact path all balls will take.                  |
| Minimap      | Show the maze layout and the position of all players.     |
| Auto Dodge   | Automatically dodge all balls.                            |
| Auto Kill    | Automatically shoot balls strategically to kill players.  |
| Pathfind     | Middle click anywhere to move there via the optimum path. |
| Auto respawn | Instantly respawn when you die.                           |

### Vanilla

Vanilla game, no changes. Use the files for reference here.

## How to install

Unfortunately since the extensions isn't on the marketplace, it can only be loaded temporarily.
Meaning you will have to do this every time you restart the browser.

### Firefox

1. Go to Menu > Extensions and themes
2. Click the Cog > Debug Add-ons
3. Click Load temporary Add-on... This will open a file picker dialog.
4. Open the cloned repo path, go to the extension/ folder and select manifest.json

### Chrome

Chrome is not currently supported. Just download firefox.
Manifest V3 is a pain to deal with.

## How to use

To open the mod picker, click on the extension icon in the extensions menu.
(the right of the address bar inside the puzzle piece menu, or left of the puzzle piece menu)

Then simply pick the mod you want to use from the list.
Config values will show up for the mod you have selected.

## How to create mods

1. Clone this repo
2. Create a new folder under mods/ in the repo root
3. Create a manifest.json:

```json
{
    "id": "example",                // Name of the folder which this file is in
    "name": "Example mod",          // Shown in the mod selection list
    "description": "Example mod.",  // Description to show when selected
    "version": "1.2.3",             // Version number
    "config": {                     // Config values, optional, these are passed on to the mod via globalThis.mod_config
        "integer_example": {
            "name": "Example number input",
            "type": "integer",
            "default": 1
        },
        "slider_example": {
            "name": "Example slider input",
            "type": "integer",
            "inputType": "slider",
            "range": [0, 100],
            "default": 50
        },
        "string_example": {
            "name": "Example string input",
            "type": "string",
            "default": "Default value"
        }
    }
}
```

4. Copy the files you want to modify from mods/vanilla/ into your mod's folder.
5. Edit the files however you want. To access the config, see globalThis.mod_config.
See the superhax mod for a good example on how to mod.
And see doc/ for documentation over the supertanks client internals.
6. Run `node build.js` to build your mod, it is then accessible in extension/mods.
And will automatically be loaded if you loaded the extension in the way described [above](#how-to-install)
