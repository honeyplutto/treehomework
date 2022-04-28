const isEmpty = object => {
    for (let prop in object) {
        if (object.hasOwnProperty(prop)) {
            return false;
        }
    }
    return true;
} 

class DomElement {
    constructor(type, props, children) {
        this.type = type;
        this.props = props || {};
        this.children = children || [];

        this._primalType = 'DOMELEMENT';
        this._possibleAttributes = [
            'id', 'class', 'style', 'hidden', 'title' 
        ]
    }

    _checkType() {
        if (this.type.toUpperCase() !== this._primalType) {
            throw new Error('The element type does not match the class type!');
        }
    }

    _checkPossibleAttributes() {
        for (let attribute of Object.keys(this.props)) {
            if (!this._possibleAttributes.includes(attribute.toLowerCase())) {
                throw new Error(`Can't add attribute "${attribute}" to ${this._primalType}`);
            }
        }
    }

    _addAttributes(...attribute) {
        this._possibleAttributes = [...this._possibleAttributes, ...attribute];
    }

    draw() {
        const elem = document.createElement(this.type);
        
        if (!isEmpty(this.props)) {
            for (let [attribute, value] of Object.entries(this.props)) {
                elem.setAttribute(attribute, value);
            }
        }
        
        if (!Array.isArray(this.children)) {
            this.children = [this.children];
        }
        
        this.children.forEach(child => {
            if (child.type === 'TEXT') {
                elem.textContent = child.children;
            } else {
                elem.appendChild(child.draw());
            }
        });
       
        return elem;
    }
}

//Classes 

class DivElement extends DomElement {
    constructor(type, props, children) {
        super(type, props, children);
        this._primalType = 'DIV';
        this._checkType();
        this._checkPossibleAttributes();
    }
}

class UlElement extends DomElement {
    constructor(type, props, children) {
        super(type, props, children);
        this._primalType = 'UL';
        this._checkType();
        this._addAttributes('type');
        this._checkPossibleAttributes();
    }
}

class LiElement extends DomElement {
    constructor(type, props, children) {
        super(type, props, children);
        this._primalType = 'LI';
        this._checkType();
        this._addAttributes('type', 'value');
        this._checkPossibleAttributes();
    }
}

class SpanElement extends DomElement {
    constructor(type, props, children) {
        super(type, props, children);
        this._primalType = 'SPAN';
        this._checkType();
        this._checkPossibleAttributes();
    }
}


class FormElement extends DomElement {
    constructor(type, props, children) {
        super(type, props, children);
        this._primalType = 'FORM';
        this._checkType();
        this._addAttributes(
            'action', 'autocomplete', 'method', 'name', 'enctype'
        );
        this._checkPossibleAttributes();
    }
}

class LabelElement extends DomElement {
    constructor(type, props, children) {
        super(type, props, children);
        this._primalType = 'LABEL';
        this._checkType();
        this._addAttributes('for');
        this._checkPossibleAttributes();
    }
}

class BrElement extends DomElement {
    constructor(type, props, children) {
        super(type, props, children);
        this._primalType = 'BR';
        this._checkType();
        this._addAttributes('clear');
        this._checkPossibleAttributes();
    }
}

class InputElement extends DomElement {
    constructor(type, props, children) {
        super(type, props, children);
        this._primalType = 'INPUT';
        this._checkType();
        this._addAttributes(
            'type', 'value', 'form', 'formaction',
            'disabled', 'name', 'placeholder', 'required'
        );
        this._checkPossibleAttributes();
    }
}

class PElement extends DomElement {
    constructor(type, props, children) {
        super(type, props, children);
        this._primalType = 'P';
        this._checkType();
        this._addAttributes('align');
        this._checkPossibleAttributes();
    }
}

class TextElement extends DomElement {
    constructor(type, value) {
        super(type, {}, value);
        this._primalType = 'TEXT';
        this._checkType();
    }
}

const CLASSES = {
    DIV: DivElement,
    UL: UlElement,
    LI: LiElement,
    SPAN: SpanElement,
    FORM: FormElement,
    LABEL: LabelElement,
    BR: BrElement,
    INPUT: InputElement,
    P: PElement,
    TEXT: TextElement
};


function el(type, attribute, children) {

    type = type.toUpperCase();

    if (typeof children === 'string' || typeof children === 'number') {
        
        children = new CLASSES['TEXT']('TEXT', children);
    }

    return new CLASSES[type](type, attribute, children);
}


//Test Cases 

const tree =
    el("div", {"class": "some_classname", "id": "some_id"},
    el("span", {}, 'hello')
);

// document.getElementById('root').appendChild(tree.draw());

const tree2 =
      el("div", {},
        el("ul", {}, [
          el("li", {}, "Item 1"),
          el("li", {}, "Item 2"),
          el("li", {}, "Item 3")
        ])
      );
      
// document.getElementById("root").appendChild(tree2.draw());

const tree3 =
      el("form", {action: '/some_action'}, [
        el("label", {for: 'name'}, "First name:"),
        el("br", {}, null),
        el("input", {type: 'text', id: 'name', name: 'name', value: "My name"}, null),
        el("br", {}, null),
        el("label", {for: 'last_name'}, "Last name:"),
        el("br", {}, null),
        el("input", {type: 'text', id: 'last_name', name: 'last_name', value: "My second name"}, null),
        el("br", {}, null),
        el("input", {type: 'submit', value: 'Submit'}, null),
      ]);

// document.getElementById("root").appendChild(tree3.draw());