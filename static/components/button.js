import { CONST } from "../lib/utils.js";
class sButton extends HTMLElement {
    get disabled() {
        return this.hasAttribute(CONST.disabled);
    }
    set disabled(val) {
        if (val) {
            this.setAttribute('tabindex', '-1');
            this.classList.add('mpy_button__disabled');
            this.style.pointerEvents = CONST.none;
        }
        else {
            this.setAttribute('tabindex', '0');
            this.classList.remove('mpy_button__disabled');
            this.style.pointerEvents = CONST.auto;
        }
    }
    static get observedAttributes() {
        return ['disabled'];
    }
    constructor() {
        super();
        if (!this.getAttribute(CONST.class)) {
            this.classList.add('mpy_button');
        }
        if (this.hasAttribute('block')) {
            this.classList.add('mpy_button__block');
        }
        this.classList.add('unselectable');
        this.addEventListener('keydown', (e) => this.onKeydown(e));
    }
    // eslint-disable-next-line class-methods-use-this
    onKeydown(e) {
        if (e.key === 'Enter') {
            e.target.click();
        }
    }
}
export default sButton;
//# sourceMappingURL=button.js.map