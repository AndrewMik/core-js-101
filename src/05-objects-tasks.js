/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return width * height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const ORDER = {
  element: 0,
  id: 1,
  class: 2,
  attr: 3,
  pseudoClass: 4,
  pseudoElement: 5,
};

function checkOrder(orders, newOrder) {
  if (orders[orders.length - 1] > newOrder) {
    throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
  }
  return newOrder;
}

class CSSBuilder {
  constructor() {
    this.order = [];
  }

  element(value) {
    this.order.push(checkOrder(this.order, ORDER.element));
    if (this.el) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.el = value;
    return this;
  }

  id(value) {
    this.order.push(checkOrder(this.order, ORDER.id));
    if (this.ID) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.ID = value;
    return this;
  }

  class(value) {
    this.order.push(checkOrder(this.order, ORDER.class));
    this.classes = this.classes ? this.classes += `.${value}` : value;
    return this;
  }

  attr(value) {
    this.order.push(checkOrder(this.order, ORDER.attr));
    this.attribute = value;
    return this;
  }

  pseudoClass(value) {
    this.order.push(checkOrder(this.order, ORDER.pseudoClass));
    this.pseudoClasses = this.pseudoClasses ? this.pseudoClasses += `:${value}` : value;
    return this;
  }

  pseudoElement(value) {
    this.order.push(checkOrder(this.order, ORDER.pseudoElement));
    if (this.pseudoElements) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.pseudoElements = value;
    return this;
  }

  stringify() {
    return `${this.el ? this.el : ''}`
    + `${this.ID ? `#${this.ID}` : ''}`
    + `${this.classes ? `.${this.classes}` : ''}`
    + `${this.attribute ? `[${this.attribute}]` : ''}`
    + `${this.pseudoClasses ? `:${this.pseudoClasses}` : ''}`
    + `${this.pseudoElements ? `::${this.pseudoElements}` : ''}`;
  }

  combine(selector1, combinator, selector2) {
    this.stringify = () => `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new CSSBuilder().element(value);
  },

  id(value) {
    return new CSSBuilder().id(value);
  },

  class(value) {
    return new CSSBuilder().class(value);
  },

  attr(value) {
    return new CSSBuilder().attr(value);
  },

  pseudoClass(value) {
    return new CSSBuilder().pseudoClass(value);
  },

  pseudoElement(value) {
    return new CSSBuilder().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new CSSBuilder().combine(selector1, combinator, selector2);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
