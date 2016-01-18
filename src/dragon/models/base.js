'use strict';

import eventsMixin       from '../events'
import mixin             from '../mixin'
import utils             from '../utils'
var {ObjectObserver}=require('observe-js')

class DragonBaseModel {

  constructor(attr = {}, options = {}) {
    this.uid = utils.uniqueId(this)
    this.mixin(eventsMixin)
    this.attr = {};
    Object.assign(this.attr, this.defaults, attr)
    this.options = options
    this.observer = new ObjectObserver(this.attr);
    this.observeAttributes();
  }

  initialize() {

  }

  /*
  TODO: not the full appr
  */
  clear() {

    this.attr = {}

  }

  /*
  TODO: add an an unobserve option
  */
  observeAttributes() {
    var _this = this
    // Trigger changes on model
    this.observer.open((added, removed, changed, getOldValueFn)=> {
      var valueChanged = added || removed || changed;
      console.log("change has been executed by dragon with the value",valueChanged)
      _this.emit('change', valueChanged)
      // respond to changes to the obj.
      Object.keys(added).forEach(function(property) {
        var value = added[property]
        _this.emit('add', {property,value})
        console.log("property added",property)// a property which has been been added to obj
        console.log("property value",value) // its value
      });
      Object.keys(removed).forEach(function(property) {
        var oldValue = getOldValueFn(property)
        _this.emit('delete', {property,oldProperty})
        console.log("property remove",property)// a property which has been been added to obj
        console.log("is old value",oldValue); // its old value
      });
      Object.keys(changed).forEach(function(property) {
        var oldValue = getOldValueFn(property),
            changedValue  = changed[property]
        _this.emit('updated', {property,changedValue})
        console.log("property updated",property); // a property on obj which has changed value.
        console.log("value of the property changed",changedValue); // its value
        console.log("this is the old value",getOldValueFn(property)); // its old value
      });
    });
  }

  /*
  TODO: Undecided on appraoch for sync/fetch/save/etc.
  */
  sync() {

  }

  toJSON() {

    return JSON.stringify(this.attr)

  }

  dispose(options = {}) {

    utils.dispose(this, options)

  }

  pairs(object = this.attr) {
    var index = -1,
    props = this.keys(object),
    length = props.length,
    result = Array(length);
    while (++index < length) {
      let key = props[index];
      result[index] = [key, object[key]];
    }
    return result;
  }

  // Internal pick helper function to determine if `obj` has key `key`.
 keyInObj (value, key, obj) {
    return key in obj;
  };

// Return a copy of the object only containing the whitelisted properties.
  pick(...keys) {
    var obj=this.attr,result = {}, iteratee = keys[0];
    if (obj == null) return result;
    if (typeof iteratee === 'function') {
      if (keys.length > 1) iteratee = iteratee; //TODO optimized callback for enable context
      keys = this.keys(obj); //not working in inherited properties keys
    } else {
      iteratee = this.keyInObj;
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  }

  // Return a copy of the object without the blacklisted properties.
  omit (...keys) {
    var obj=this.attr,iteratee = keys[0], context;
    if (typeof iteratee === 'function') {
      iteratee = iteratee;
      if (keys.length > 1) context = keys[1];
    } else {
      iteratee = function(value, key, obj) {
        return keys.indexOf(key) == -1;
      };
    }
    return this.pick(iteratee, context);
  }

  baseValues(object , props) {
    var index = -1,
    length = props.length,
    result = Array(length);

    while (++index < length) {
      result[index] = object[props[index]];
    }
    return result;
  }

  values(object = this.attr) {
    return this.baseValues(object, this.keys(object));
  }

  keys(object = this.attr){
    return Object.keys(object);
  }

  // Invert the keys and values of an object. The values must be serializable.
  invert = function(obj = this.attr) {
    var result = {},
    index = -1,
    props = this.keys(obj),
    length = props.length;

    while (++index < length) {
      result[obj[props[index]]] = props[index];
    }
    return result;
  };

  isArrayLike = function(collection) {
    var length = collection[length];
    return typeof length == 'number' && length >= 0 && length <= (Math.pow(2, 53) - 1);
  }; 

  isEmpty(value = this.attr) {
    if (value == null) return true;
    if (isArrayLike(value) && (_.isArray(value) || _.isString(value) || _.isArguments(value))) return value.length === 0;
    return this.keys(value).length === 0;
  }
}


DragonBaseModel.prototype.defaults = {}

DragonBaseModel.prototype.disposed = false

DragonBaseModel.prototype.indisposable = false

DragonBaseModel.prototype.url = ''

Object.assign(DragonBaseModel.prototype, {mixin})

export default DragonBaseModel
