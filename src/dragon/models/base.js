var EventsMixin         = require('../events'),
    Utils               = require('../utils'),
    uniqueId            = Utils.uniqueId

class DragonBaseModel {

  constructor(attr = {}, options = {}) {
    this.uid = uniqueId('model')

    Object.assign(this, EventsMixin)
    Object.assign(attr, this.defaults)

    // Model attributes store
    this.attr = attr

    this.observeAttributes()

  }

  clear() {

    this.attr = {}

  }

  observeAttributes() {

    // Trigger changes on model
    Object.observe(this.attr, (changes) => {

      this.trigger('change', changes)

      /*
      TODO: consider making this a mixin and expanding to watch specific properties
      */

      var add    = [],
          del    = [],
          update = []

      changes.forEach( (change) => {

        switch(change.type) {

          case 'add'    : add.push(change); break;
          case 'delete' : del.push(change); break;
          case 'update' : update.push(change); break;

        }

      })

      if(add.length > 0)    this.trigger('add', add)
      if(del.length > 0)    this.trigger('delete', del)
      if(update.length > 0) this.trigger('update', update)

    })

  }

  /*
  TODO: Undecided on appraoch for sync/fetch/save/etc.
  */
  sync() {

  }

  toJSON() {

    return JSON.stringify(this.attr)

  }

}

DragonBaseModel.prototype.defaults = {}

DragonBaseModel.prototype.url = ''

module.exports = DragonBaseModel
