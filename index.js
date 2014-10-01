var debug = require('debug')('rebound');
var async = require('async');
var redis = require('redis');
var EventEmitter = require('events').EventEmitter;

module.exports = Rebound;

/**
 * Constructor for rebound function
 */
function Rebound(config) {
  if (!(this instanceof Rebound)) {
    return new Rebound(config);
  }
  EventEmitter.call(this);
  this.client = config.redis || redisConnect(config.port, config.host);
  this.client.on('error', this.emit.bind(this, 'error'));
  this.queueSize = config.size;
  this.queueName = config.namespace;
  this.length = 0;
}

Rebound.prototype.__proto__ = EventEmitter.prototype;

/**
 * Get all items in the queue
 */
Rebound.prototype.all = function(callback) {
  return this.client.lrange(this.queueName, 0, this.queueSize, callback);
};

/**
 * Add an item(s) onto the queue
 */
Rebound.prototype.add = function(item, callback) {
  // Handle an array of items
  if (Array.isArray(item)) {
    return async.map(item, this.add.bind(this), callback);
  }
  var self = this;
  return this.client
    .multi()
    .lpush(this.queueName, item)
    .ltrim(this.queueName, 0, this.queueSize - 1)
    .exec(function(err, results) {
        if (err) {
          return callback(err);
        }
        if (self.length < self.queueSize) {
          self.length++;
        }
        return callback();
      });
};

/**
 * Clear our queue of all entries
 */
Rebound.prototype.clear = function(callback) {
  var self = this;
  return this.client.del(this.queueName, function(err) {
    if (err) {
      return callback(err);
    }
    self.length = 0;
    return callback();
  });
};

/**
 * Destroy our list and close the redis connection
 */

Rebound.prototype.destroy = function() {
  var self = this;
  return this.clear(function(err) {
    if (err) {
      return callback(err);
    }
    return self.client.end();
  });
};

/**
 * Create and return our redis connection
 */
function redisConnect(port, host) {
  return redis.createClient(port, host);
}
