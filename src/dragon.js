'use strict';

// Polyfills
// TODO: which of these are still needed?
import '../lib/polyfills/element.remove'
import '../lib/polyfills/node.prependchild'
import '../lib/polyfills/nodelist.queryselectorall'
import '../lib/polyfills/nodelist.remove'
import '../lib/polyfills/Object.assign'
import '../lib/polyfills/Array.from'

import Collection from './dragon/collections/base'
import Model      from './dragon/models/base'
import View       from './dragon/views/base'

var Dragon = {
  //CollectionView : require('./dragon/views/collectionView'),
  //Composer       : require('./dragon/composition/composer'),
  //Composition    : require('./dragon/composition/composition'),
  //Dispatcher     : require('./dragon/router/dispatcher'),
  //EventBroker    : require('./dragon/lib/eventBroker'),
  //mediator       : require('./dragon/mediator/mediator'),
  //Layout         : require('./dragon/views/layout'),
  //SyncMachine    : require('./dragon/models/syncMachine'),
  //Application    : require('./dragon/application/base'),
  //Component      : require('./dragon/components/base'),
  //ComponentAPI   : require('./dragon/components/api'),
  //Controller     : require('./dragon/controllers/base'),
  //Events         : require('./dragon/events'),
  //Router         : require('./dragon/router/base'),
  //Utils          : require('./dragon/utils'),
  Collection,
  Model,
  View
}

export {Collection}
export {Model}
export {View}
export default Dragon
