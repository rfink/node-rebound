
var should = require('should')
    , Rebound = require('../index');

describe('rebound', function() {

  var items = [ 1, 2, 3 ]
      , size = 5
      , rebound = new Rebound({
          port: 6379,
          host: 'localhost',
          namespace: 'rebound-test-queue',
          size: size
      });

  beforeEach(function(done) {
    rebound.add(items, done);
  });

  afterEach(function(done) {
    rebound.clear(function(err) {
      done();
    });
  });

  after(function(done) {
    rebound.destroy();
    done();
  });

  describe('length', function() {
    it('should have correct length', function(done) {
      rebound.length.should.equal(items.length);
      done();
    });
  });

  describe('drop items', function() {
    it('should be dropping items after the max size', function(done) {
      var newItems = [ 4, 5, 6 ];
      rebound.add(newItems, function(err) {
        rebound.length.should.equal(size);
        done();
      });
    });
  });

  describe('list contains', function() {
    it('should contain the items we expect it to', function(done) {
      var newItems = [ 4, 5, 6, 7, 8, 9, 10 ];
      rebound.add(newItems, function(err) {
        rebound.all(function(err, items) {
          items.should.eql([ '10', '9', '8', '7', '6' ]);
          done();
        });
      });
    });
  });

  describe('try clear', function() {
    it('should clear the list correctly', function(done) {
      rebound.clear(function(err) {
        rebound.length.should.equal(0);
        rebound.all(function(err, items) {
          items.should.eql([]);
          done();
        });
      });
    });
  });

});