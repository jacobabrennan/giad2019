

//== Driver ====================================================================

//------------------------------------------------
export default class Driver {
    focus(newFocus) {
        if(this.currentFocus == newFocus) {
            return;
        }
        if(this.currentFocus) {
            this.blur();
        }
        this.currentFocus = newFocus;
        if(this.currentFocus && this.currentFocus.focused) {
            this.currentFocus.focused();
        }
    }
    blur() {
        if(this.currentFocus && this.currentFocus.blurred) {
            this.currentFocus.blurred();
        }
        this.currentFocus = undefined;
    }
    focused() {}
    blurred() {}
    command(which, options) {
        if(!(this.currentFocus && this.currentFocus.command)) { return false;}
        return this.currentFocus.command(which, options);
    }
    display(){
        if(!(this.currentFocus && this.currentFocus.display)) { return false;}
        return this.currentFocus.display.apply(this.currentFocus, arguments);
    }
}
