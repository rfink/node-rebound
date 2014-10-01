rebound - a redis backed fixed length queue for node.js
===========================

This is a redis backed fixed length queue for node.js.  It allows you to set a max size,
pass in a redis configuration, and start adding items to the queue.

This is how you can use it:

In your package.json:

```js
  {
    "dependencies": {
      "node-rebound": "0.1.0"
    }
  }
```

## Usage

```js

  var Rebound = require("node-rebound");

  queue = new Rebound({
    port: 6379,
    host: 'localhost',
    namespace: 'rebound-test-queue',
    size: 5
  });
```

You can also just give an already bootstrapped-instance of node-redis:

```js

  var redis = require('redis');
  var Rebound = require("node-rebound");
  var client = redis.createClient();
 
  queue = new Rebound({
    size: 5,
    redis: client,
    namespace: 'rebound-test-queue'
  });

```

Then you can start adding items to the queue

```js

  // Add a single item to the queue
  queue.add(1, function(err) {
    if (err) return console.error(err);
    console.log(queue.length) // 1
  });

  ...

  // Add multiple items to the queue
  queue.add([ 1, 2, 3 ], function(err) {
    console.log(queue.length); // 3
    queue.add([ 4, 5, 6 ], function(err) {
      console.log(queue.length); // 5
      queue.all(function(err, items) {
        console.log(items); // [ '6', '5', '4', '3', '2' ];
        queue.destroy();
      });
    });
  });

```
