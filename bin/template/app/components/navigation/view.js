var BaseView = require('../base/view'),
    Dragon   = require('dragon'),
    template = require('./template')

class NavigationView extends BaseView {

  constructor() {

    super()

  }

}

NavigationView.prototype.container = '#app-container'
NavigationView.prototype.template  = template

module.exports = NavigationView
