


//==============================================================================

//-- Dependencies --------------------------------
import {COMMAND} from './constants.js'
import preferences from './preferences.js'

//-- Project constants ---------------------------

//------------------------------------------------
export default {
	setup(configuration, commandProxy){
        // Listen for center on numberpad (CLEAR), not handled by mousetrap.js
        document.body.addEventListener('keydown', (eventKeydown) => {
            if(eventKeydown.keyCode == 12) {
                commandProxy.command(COMMAND.WAIT, {'key': null});
            }
        });
        // Function creator, for generating mousetrap.js key press handlers
        const trapCreator = (key, command) => {
            return (keyEvent) => {
                commandProxy.command(command, {'key': key});
                keyEvent.preventDefault();
            };
        };
        // Configure mousetrap to handle key presses
        this.mousetrap = Mousetrap(document.body);
        for(let key in preferences){
            // Handle key press
            const command = preferences[key];
            this.mousetrap.bind(key, trapCreator(key, command));
            // Also handle uppercase key press
            const upperKey = key.toUpperCase();
            if(upperKey !== key){
                this.mousetrap.bind(upperKey, trapCreator(upperKey, command));
            }
        }
    }
};
