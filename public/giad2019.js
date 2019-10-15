

//== Goblin-Like Main ==========================================================

//-- Dependencies --------------------------------
import Client from './client/client.js';

//-- Setup Game ----------------------------------
let configurationClient = {
    container: document.getElementById('game_area'),
};
new Client(configurationClient);
