class Validate {
    constructor() {
        this.rules = {
            pass: { regexp: new RegExp(/.*/), message: '' },
            min_6: { regexp: new RegExp(/^.{6,}$/), message: 'minimum 6 characters' },
            min_8: { regexp: new RegExp(/^.{8,}$/), message: 'minimum 8 characters' },
            no_spaces: { regexp: new RegExp(/^\S+$/), message: 'no spaces allowed' },
            letters_only: { regexp: new RegExp(/^[a-zа-яё]+$/i), message: 'only letters allowed' },
            email: { regexp: new RegExp(/^\w+[\w-.]*@\w+([-.]\w+)*\.[a-z]{2,}$/i), message: 'need a valid e-mail address' },
            phone: { regexp: new RegExp(/^\+?\d\(?\d{3}\)?\d([-\d]{8})|([\d]{5})\d$/), message: 'need a valid phone number' },
        };
        if (Validate.instance) {
            return Validate.instance;
        }
        Validate.instance = this;
    }
    validate(input, ruleset) {
        const result = { valid: true, message: 'Ok' };
        ruleset.split(' ').every((r) => {
            if (!this.rules[r]) {
                throw new Error(`Cant validate: rule '${r}' dont exist`);
            }
            if (!input.match(this.rules[r].regexp)) {
                result.valid = false;
                result.message = this.rules[r].message;
                return false; // last every()
            }
            return true; // next every()
        });
        return result;
    }
}
export default Validate;
//# sourceMappingURL=validate.js.map