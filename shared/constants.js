

//==============================================================================

//-- Dependencies --------------------------------

//------------------------------------------------

//-- Misc. Configuration: ------------------------
const debug = false;
const VERSION = '1.2.0';
const STORAGE_VERSION = '1.2';
const displaySize = 21;
const DEFAULT_MAP_SIZE = 48;
const HIGHLIGHT = 'highlight';
const COLOR_INSTRUCTION = '#00f';
let TILE_SIZE = 8;
let FONT_SIZE = 8;
if('WebkitAppearance' in document.documentElement.style){
    // Work around Chrome's font blurring.
    TILE_SIZE = 24;
    FONT_SIZE = 24;
}
const FINAL_DEPTH = 7;
const INTRO_TITLE = 'You descend into darkness';
const INTRO_BODY = 'While running from humans in the forest, you stumble on a secret passage into an abandoned dwarven city. The once magnificent halls and chambers are now littered with trash and debris. It smells of decay. You think you hear the sound of another goblin up ahead, but you think you also saw something hideous crawling in the darkness.';
const GOBLIN_SCORE = 100;
const URL_SCORE_REPORT = 'http://jacobabrennan.com:7231/scores';
const SAVE_STORAGE = 'gameSave';

//-- Directions: ---------------------------------
export const DIR = {
    WAIT      : 0,
    NORTH     : 1,
    SOUTH     : 2,
    EAST      : 4,
    WEST      : 8,
    NORTHEAST : 5,
    NORTHWEST : 9,
    SOUTHEAST : 6,
    SOUTHWEST : 10,
    UP        : 16,
    DOWN      : 32,
};

//-- Action Commands: ----------------------------
export const COMMAND = {
    CANCEL   : 64 ,
    USE      : 65 ,
    NEWGAME  : 66 ,
    SAVEGAME : 67 ,
    LOADGAME : 68 ,
    GET      : 69 ,
    DROP     : 70 ,
    LOOK     : 71 ,
    EQUIP    : 72 ,
    UNEQUIP  : 73 ,
    STAIRS   : 74 ,
    FIRE     : 75 ,
    THROW    : 76 ,
    MOVE     : 77 ,
    WAIT     : 78 ,
    HELP     : 79 ,
    CLOSE    : 80 ,
    PAGEDOWN : 81 ,
    PAGEUP   : 82 ,
    ENTER    : 83 ,
    NONE     : 84 ,
    CAMP     : 85 ,
    ATTACK   : 86 ,
    // Commands from server
    SENSE    : 100,
    TURN     : 101,
    GAMEOVER : 102,
    WIN      : 103,
};

//-- Targeting system: ---------------------------
export const TARGET = {
    SELF       :  1, // Allow the self to be targetted. Will skip selection if this is the only flag set.
    FRIEND     :  2, // Allow targeting of friendly actors.
    ENEMY      :  4, // Allow enemies to be targetted.
    // OTHER      : TARGET_ENEMY|TARGET_FRIEND, // Allow any other actor to be targeted.
    // ANYONE     : TARGET_OTHER|TARGET_SELF, // Allow any actor to be targeted.
    ALL        :  8, // All viable targets will be effected, not just one (no selection).
    FURNITURE  : 16, // Allow to target furniture.
    RANGE      : 32, // Allow targets in range, not just those in view.
    DIRECTION  : 64, // The player will be prompted to select a direction.
    RANGE_VIEW : -1, // Targeting will use the actors view range.
};
TARGET.OTHER  = TARGET.ENEMY | TARGET.FRIEND;
TARGET.ANYONE = TARGET.OTHER | TARGET.SELF;

//-- Project Constants ---------------------------
export const PERCEIVE = {
    /* What can an actor perceive?
        Movable: 1b
        Opaque: 1b
        color?: 6b, rgb(2b, 2b, 2b);
        'shape'/'form'?: 8b (ascii)
        'smell'?: 2b*4: Rot, Food, ?, ?,
        'size'?
        0b 0 0 (00,00,00) 00000000 (00,00,00,00) 00000000
        0b 0000 0000 0000 0000 0000 0000 0000 0000
    */
    NONE   : 0b00000000000000000000000000000000,
    AIR    : ' '.charCodeAt(0) << 16,
    OPAQUE : 0b10000000000000000000000000000000,
    MOVABLE: 0b01000000000000000000000000000000,
    COLOR  : 0b00111111000000000000000000000000,
    COLOR_SHIFT: 24,
    SHAPE  : 0b00000000111111110000000000000000,
    SHAPE_SHIFT: 16,
    SMELL  : 0b00000000000000001111111100000000,
    ID     : 0b00000000000000000000000011111111,
};

//-- Actor Factions (bit flags): -----------------
export const FACTION = {
    FACTION_PLAYER : 1,
    FACTION_ENEMY : 2,
};

//-- Genders: ------------------------------------
const GENDER_MALE = 'm';
const GENDER_FEMALE = 'f';
const GENDER_NONBINARY = 'nb';

//-- Equipment placements: -----------------------
export const EQUIP = {
    EQUIP_MAINHAND : 'main',
    EQUIP_OFFHAND : 'off',
    EQUIP_BODY : 'body',
    EQUIP_HEAD : 'head',
    EQUIP_NECK : 'neck',
    EQUIP_FINGER : 'finger',
};

//-- Damage Types (bit flags) --------------------
const DAMAGE_PHYSICAL = 1;
const DAMAGE_FIRE  =  2;
const DAMAGE_ACID  =  4;
const DAMAGE_MAGIC =  8;
const DAMAGE_ICE   = 16;
const DAMAGE_0000000000100000 = 32;
const DAMAGE_0000000000000000 =  0;

//-- Creature Types --------------------------------
const CREATURE_NONE   = 0;
const CREATURE_UNDEAD = 1;
