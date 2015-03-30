var createElement       = require('virtual-dom/create-element')
var diff                = require('virtual-dom/diff')
var extractFromTemplate = require('./helpers/extractFromTemplate')
var patch               = require('virtual-dom/patch')
var VNode               = require('virtual-dom/vnode/vnode')
var VText               = require('virtual-dom/vnode/vtext')

var convertHTML = require('html-to-vdom')({
  VNode: VNode,
  VText: VText
})

/*
@class DragonBaseView
*/
class DragonBaseView {

  constructor(options = {}) {

    /*
    A template must be assigned to the view, whether it be on the View Class or the instance
    */
    if(!options.template && !this.template) {
      throw new Error('A view must have a template.')
      return
    }

    var _this = this

    this.initialize(options)

    //If the view is set to render on initialization
    if(this.renderOnInit) {

      //If the view is set to attach on initialization
      if(!this.attached && this.attachOnInit) {

        //this.on('rendered', this.attach)

      }

      this.render()

    }

  }

  initialize(options) {

    this.setProperties(options)
    this.setMixins(options)

  }

  /*
  @method attach
  @type Function
  @return this
  @desc Attaches the view to the DOM
  */

  attach() {

    var _this = this

    try {

      /*
      Can't use .forEach() on NodeLists
      Tempting to use NodeList.prototype.forEach = Array.prototype.forEach but that's a no no
      See for basic info: https://developer.mozilla.org/en-US/docs/Web/API/NodeList
      See this guy (which I ignore) for a super long list of reasons: http://toddmotto.com/ditch-the-array-foreach-call-nodelist-hack/
      */
      Array.prototype.forEach.call(_this.$container, function($container) {

        $container[_this.containerMethod](_this._vel)

      })
    }

    catch(e) {

      throw new Error(e)
      return

    }

    return this

  }

  /*
  TODO: Figure out how to get this to work
  */
  defineAttributes() {

    /*
    @property attributes
    @type Object
    @desc A store of attributes from the outer tag of the template
    @overridable true
    */
    this.attributes = this.attributes || {}

    /*
    @property attributes
    @type Object
    @desc A store of attributes from the outer tag of the template
    @overridable true
    */
    /*this.attributesProxy = this.attributesProxy || new Proxy(this.attributes, {

      get: (target, name) => {

        return name in target ? target[name] : null

      },

      set: (obj, prop, val) => {

        obj[prop] = val

      }

    })*/

  }

  defineProperties(options) {

    this.defineAttributes()

    /*
    @property attached
    @type Boolean
    @default false
    @desc Whether to the view has been attached to the DOM
    */
    this.attached = false

    /*
    @property disposed
    @type Boolean
    @default false
    @desc Whether the view has been disposed
    */
    this.disposed = false

  }

  /*
  @method detach
  @type Function
  @returns Promise
  @desc Detachs the view from the DOM
  */
  detach() {

  }

  getTagName(template) {

    var tagNameFrag = document.createDocumentFragment()
    tagNameFrag.textContent = template

    // TODO: this is a janky way of getting the tagName
    var tagName;
    var tagFrag    = tagNameFrag.textContent.split('<')[1]
    var indexGator = tagNameFrag.textContent.indexOf('>')
    var indexSpace = tagNameFrag.textContent.indexOf(' ')

    if(indexSpace == -1 || indexGator < indexSpace) {

      tagName = tagFrag.split('>')[0]

    }

    else {

      tagName = tagFrag.split(' ')[0]

    }

    return tagName

  }

  /*
  @method getTemplate
  @type Function
  @returns String
  @desc Gets the template for the view

  @notes This function can do whatever the developer desires. Mixins, such as Handlebars Mixin, will take overwrite this. The developer should feel comfortable overwriting this.
  */
  getTemplate() {

    return this.template

  }

  getTemplateData() {

  }

  /*
  @method render
  @type Function
  @return this
  @desc Renders the view
  */

  render() {

    var template = this.getTemplate()

    // Get the tagName if it hasn't previously been grabbed
    // This really isn't needed; the tagName will be stored on the model *if* needed

    if(!this.tagName) {

      this.tagName = this.getTagName(template)

    }

    if(!this.vel) {

      this.vel  = convertHTML(template)
      this.vel.tagName = this.tagName
      this._vel = createElement(this.vel)

    }

    var vel     = convertHTML(template)
    var patches = diff(this.vel, vel)

    this._vel   = patch(this._vel, patches)
    this.vel    = vel

    var extraction = extractFromTemplate(template)

    this.setAttributes(extraction.attributes)

    /*
    If
    the view is to attach on initialize,
    the view has not already been attached,
    the view's container is present in the DOM,
    then attach
    */
    if(this.attachOnInit && !this.attached && this.$container.length > 0) {

      this.attach()

    }

    return this

  }

  /*
  @method setAttributes
  @type Function
  @returns Void
  @desc Assigns attributes to view

  @param attributes {Object}
  */

  setAttributes(attributes) {
    var _this = this

    // Assigned once
    if(!this.id && attributes.id) {
      this.id = attributes.id
      delete attributes.id
    }

    // Assigned once
    if(!this.className && attributes.className) {
      this.className = attributes['className']
      delete attributes['className']
    }

    // Other attributes can be re-assigned
    Object.keys(attributes).forEach( (key) => {

      _this.attributes[key] = attributes[key]

    })

  }

  /*
  @function setMixins
  @type Function
  @desc Sets Mixin(s) on instance

  @arg options {Object}
  */
  setMixins(options = {}) {

    /*
    @property mixins
    @type Array
    @desc List of mixins
    @note This adds a mixin to the instance, not the class
    */

    // TODO: need to combine the options with the this to have a full array
    this.mixins = options.mixins || []

    this.mixins.forEach( (Mixin) => {

      Object.assign(this, Mixin)

    }, this)

  }

  setProperties(options = {}) {
    var _this = this

    this.defineProperties(options)

    Object.keys(options).forEach( (key) => {

      var ignore = [
        //'container',
        //'el'
      ]

      // If the property is not on the ignore list
      if(ignore.indexOf(key) == -1) {
        _this[key] = options[key]
      }

    })

    this.$container = document.querySelectorAll(this.container)

    // TODO: get this to work
    /*
    if(this.$container.length > 0) {
      this.$el = document.querySelectorAll(this.$container[0])
    }
    */

  }

}

/* Developer Notes
The following properties & methods are assigned on the prototype to allow for easier overriding.
*/

/*
@property attachOnInit
@type Boolean
@default true
@desc Whether to attach the view on initialization
*/
DragonBaseView.prototype.attachOnInit = true

/*
@property renderOnInit
@type Boolean
@default true
@desc Whether to render the view on initialization
*/
DragonBaseView.prototype.renderOnInit = true

/*
@property containerMethod
@type String
@default 'append'
@options 'append', 'prepend'
@desc Determines how the view is attached to the DOM
*/
DragonBaseView.prototype.containerMethod = 'appendChild'

/*
@property tagName
@type String
@default null
@desc The tag of the view
@note This value is ignored after a view's initial render
*/
//DragonBaseView.prototype.tagName = null

/*
@property template
@type ????
@default null
@desc Template for the view
*/
DragonBaseView.prototype.template = null

module.exports = DragonBaseView