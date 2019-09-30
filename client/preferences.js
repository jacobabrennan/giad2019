

//==============================================================================

//-- Dependencies --------------------------------
import {DIR, COMMAND} from '../shared/constants.js';

//------------------------------------------------
export default {
    /* Special Key Names: backspace, tab, enter, return, capslock, esc, escape,
       space, pageup, pagedown, end, home, left, up, right, down, ins, del,
       plus.*/
    // COMMAND.NONE needed to register alphabet keypresses with Mousetrap.
    // Uppercase aliases generated automatically by the client.
    "up": DIR.NORTH,
	"down": DIR.SOUTH,
	"left": DIR.WEST,
	"right": DIR.EAST,
    "home": DIR.NORTHWEST,
    "end": DIR.SOUTHWEST,
    "pageup": DIR.NORTHEAST,
    "pagedown": DIR.SOUTHEAST,
    //"Unidentified": DIR.WAIT, // See setup for special case.
    
    "escape": COMMAND.CANCEL,
    "a": COMMAND.ATTACK,
    "b": COMMAND.NONE,
    "c": COMMAND.CLOSE,
    "d": COMMAND.DROP,
    "e": COMMAND.EQUIP,
    "f": COMMAND.FIRE,
    "g": COMMAND.GET,
    "r": COMMAND.CAMP,
    "s": COMMAND.STAIRS,
    "t": COMMAND.THROW,
    "v": COMMAND.USE,
    "w": COMMAND.UNEQUIP,
    "x": COMMAND.LOOK, // eXamine
    "z": COMMAND.NONE,
    
    "h": COMMAND.NONE,
    "i": COMMAND.USE,
    "j": COMMAND.NONE,
    "k": COMMAND.NONE,
    "l": COMMAND.LOOK,
    "m": COMMAND.NONE,
    "n": COMMAND.NONE,
    "o": COMMAND.NONE,
    "p": COMMAND.NONE,
    "u": COMMAND.USE,
    "y": COMMAND.NONE,
    
    "?": COMMAND.HELP,
    "/": COMMAND.HELP,
    "<": COMMAND.STAIRS,
    ">": COMMAND.STAIRS,
    ",": COMMAND.STAIRS,
    ".": COMMAND.STAIRS,
    "[": COMMAND.PAGEDOWN,
    "]": COMMAND.PAGEUP,
    "space": COMMAND.CANCEL,
    "enter": COMMAND.ENTER,
    //"return": COMMAND.ENTER
        // Don't use. Mousetrap will fire events for both enter AND return.
    "backspace": COMMAND.NONE,
    "del": COMMAND.NONE
};
