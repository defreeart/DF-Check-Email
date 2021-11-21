// DF Check Email v1
// © defreeart
// https://github.com/defreeart

function DFCheckEmail(props) {
    const defaults = {
        scriptName: 'DFCheckEmail',
        formClass: 'df-check-email-form',
        wrapperClass: 'df-check-email-wrapper',
        emailClass: 'df-check-email-input',
        validClass: 'valid',
        invalidClass: 'invalid'
    }

    window.addEventListener('load', () => {
        if (!isType('Object', props)) props = {};
        merge(props, defaults);
        runDFCheckEmail(props);
    });

    function isType(name, object) {
        let type = Object.prototype.toString.call(object);
        return type === `[object ${name}]`;
    }

    function merge(props, options) {
        for (let key in options) {
            let none = props[key] === undefined;
            if (none) props[key] = options[key];
        }
    }
}

function runDFCheckEmail(props) {
    let name = {
        selectors: {
            form: `.${props.formClass}`,
            wrapper: `.${props.wrapperClass}`,
            email: `.${props.emailClass}`
        },
        classes: {
            valid: props.validClass,
            invalid: props.invalidClass
        }
    }

    let data = {
        regexp: /^[a-z0-9][-+.\w]{0,63}@(([a-z0-9][\w-]{0,61}){0,1}[a-z0-9]\.)+[a-z]{2,6}$/
    }

    class Init {
        main() {
            if (!this.writeSelectors()) return;
            new Controller().main();
        }

        writeSelectors() {
            let {selectors, collections} = name;
            if (!this.writeGroup(selectors, 1)) return;
            if (!this.writeGroup(collections)) return;
            return true;
        }

        writeGroup(object, n) {
            for (let key in object) {
                let selector = object[key];
                let node = this.getNodes(selector, n);
                let none = !node || node.length === 0;
                if (none) return this.isNotFound(key);
                data[key] = node;
            }
            return true;
        }

        getNodes(e, i, c) {
            let container = c || document;
            let a = container.querySelector(e);
            let b = container.querySelectorAll(e);
            return (i == 1) ? a : b;
        }

        isNotFound(item) {
            let s = `${props.scriptName}: `;
            s += `No ${item}. `;
            s += `Check the code and the class names`;
            console.warn(s);
        }
    }

    class Controller {
        main() {
            this.writeLogic();
            this.runLogic();
        }

        writeLogic() {
            data.control = {
                listeners: new Listeners()
            }
        }

        runLogic() {
            data.control.listeners.main();
        }
    }

    class Listeners {
        main() {
            this.setInputListener(data);
            this.setFormListener(data);
        }

        setInputListener({email, wrapper}) {
            email.addEventListener('input', () => {
                this.updateClass(email, wrapper);
            });
        }

        setFormListener({form, wrapper}) {
            form.addEventListener('submit', e => {
                this.validate(e, wrapper);
            });
        }

        updateClass(email, wrapper) {
            let {valid, invalid} = name.classes;
            if (email.value.match(data.regexp)) {
                wrapper.classList.remove(invalid);
                wrapper.classList.add(valid);
            } else {
                wrapper.classList.remove(valid);
            }
        }

        validate(e, wrapper) {
            let {valid, invalid} = name.classes;
            if (wrapper.classList.contains(valid)) return;
            e.preventDefault();
            wrapper.classList.add(invalid);
        }
    }

    new Init().main();
}