// Simple, completely non-scalable persistence layer for quick-and-dirty
// testing.  Just serializes the entire memory db to a file on every 
// database update.  
// Advantage: give it JSON and you have a database.
// Disadvantage: really slow to seralize the whole thing every time.
//   * may extend this in the future to just use redis
//

var Promise = require('bluebird');
var _ = require('lodash');
var fs = Promise.promisifyAll(require('fs'));

var singleton = null;

module.exports = function(config) {
  if (singleton) return singleton;

  var log = config.drivers.log().child({ module: 'memory-db-persistence' });
  config.output_file = config.output_file || "current_db.js";

  var pending_writes = false;

  var _MemoryDBPersistence = {
    loadFullDb: function() {
      try {
        return require(config.output_file); // who needs JSON.parse?
      } catch(e) {
        return {}; // file doesn't exist, just start with empty db
      };
    },
    
    dbUpdated: function(info) {
      // probably not as long as you don't kill the system while 
      // existing writes are pending things will be fine....
      if (pending_writes) return; // can't write until other ones finish
      pending_writes = true;
      return fs.writeFileAsync(config.output_file, "module.exports = " + JSON.stringify(_.clone(info.db)))
      .then(function() { 
        // If there has been more activity, schedule function to run again right away,
        // but break the recursion chain with setTimeout so we don't overflow the stack
        if (pending_writes) {
          setTimeout(_MemoryDBPersistence.dbUpdated, 0, info);
        }
        pending_writes = false;
      });
    },
  };

  singleton = _MemoryDBPersistence;
  return singleton;
};

