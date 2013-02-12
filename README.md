rebound - a redis backed fixed length queue for node.js
===========================

This is a redis backed fixed length queue for node.js.  It allows you to set a max size,
pass in a redis configuration, and start adding items to the queue.

This is how you can use it:

In your package.json:

```js
  {
    "dependencies": {
      "rebound": "git://github.com/rfink/node-rebound.git"
    }
  }
```

## Usage

```js

  var Rebound = require("rebound");

  queue = new Rebound({
    port: 6379,
    host: 'localhost',
    namespace: 'rebound-test-queue',
    size: 5
  });

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
