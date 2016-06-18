(() => {
  'use strict';

  const assert = require('chai').assert;
  const Stopper = require('../');

  suite('Structure', function() {
    setup(function() {
      this.stp = new Stopper();
    });

    suite('Object', function() {
      test('constructor returns Stopper object', function() {
        assert.equal(this.stp.constructor.name, 'Stopper');
      });

      test('list of available Stopper methods', function() {
        assert.deepEqual(Object.getOwnPropertyNames(Stopper.prototype), ['constructor', 'start', 'stop', 'split', 'measure', 'emit', 'on']);
      });
    });

    suite('Data', function() {
      test('list of available Stopper properties', function() {
        assert.deepEqual(Object.keys(this.stp), ['dates', 'hooks']);
      });

      test('has array of Stopper laps', function() {
        assert.equal(this.stp.dates.laps.constructor.name, 'Array');
      });
    });

    suite('Events', function() {
      test('list of available events', function() {
        assert.deepEqual(Object.keys(this.stp.hooks), ['start', 'stop', 'split']);
      });
    });
  });

  suite('Usage', function() {
    setup(function() {
      this.stp = new Stopper();
    });

    suite('Dates', function() {
      beforeEach(function() {
        this.stp = new Stopper();
      });

      test('start sets date', function() {
        this.stp.start();

        assert.notEqual(this.stp.dates.start, null)
        assert.equal(this.stp.dates.start.constructor.name, 'Date');
      });

      test('mutliple starts fail', function(done) {
        try {
          this.stp.start();
          this.stp.start();

          done(new Error('Triggered start() twice!'));
        } catch (e) {
          assert.equal(e.message, 'Stopper already started!');

          done();
        }
      });

      test('stop without start throws error', function(done) {
        try {
          this.stp.stop();

          done(new Error('Triggered stop() without error'));
        } catch (e) {
          assert.equal(e.message, 'Stopper not started!');

          done();
        }
      });

      test('stop sets date', function() {
        this.stp.start();
        this.stp.stop();

        assert.notEqual(this.stp.dates.stop, null)
        assert.equal(this.stp.dates.stop.constructor.name, 'Date');
      });

      test('mutliple stops fail', function(done) {
        try {
          this.stp.start();
          this.stp.stop();
          this.stp.stop();

          done(new Error('Triggered stop() twice!'));
        } catch (e) {
          assert.equal(e.message, 'Stopper already stopped!');

          done();
        }
      });

      test('stop is above start', function(done) {
        this.stp.start();

        setTimeout(() => {
          this.stp.stop();

          assert.isAbove(this.stp.dates.stop, this.stp.dates.start);

          done();
        }, 12);
      });

      test('split adds date to laps', function() {
        this.stp.start();

        this.stp.split();
        assert.equal(this.stp.dates.laps.length, 1);
        assert.equal(this.stp.dates.laps[0].constructor.name, 'Date');

        this.stp.split();
        assert.equal(this.stp.dates.laps.length, 2);
        assert.equal(this.stp.dates.laps[1].constructor.name, 'Date');
      });

      test('split without start fails', function(done) {
        try {
          this.stp.split();

          done(new Error('Triggered split() without start!'));
        } catch (e) {
          assert.equal(e.message, 'Stopper not started!');

          done();
        }
      });

      test('split after stop fails', function(done) {
        try {
          this.stp.start();
          this.stp.stop();
          this.stp.split();

          done(new Error('Triggered stop() on already stopped Stopper!'));
        } catch (e) {
          assert.equal(e.message, 'Stopper already stopped!');

          done();
        }
      });

      test('split is between start and stop', function(done) {
        this.stp.start();

        setTimeout(() => {
          this.stp.split();

          setTimeout(() => {
            this.stp.stop();

            assert.isAbove(this.stp.dates.stop, this.stp.dates.start);
            assert.isAbove(this.stp.dates.laps[0], this.stp.dates.start);
            assert.isAbove(this.stp.dates.stop, this.stp.dates.laps[0]);

            done();
          }, 12);
        }, 12);
      });

      test('measure returns positive value', function(done) {
        this.stp.start();

        setTimeout(() => {
          this.stp.stop();

          assert.isAbove(this.stp.measure(), 0);

          done();
        }, 12);
      });
    });

    suite('Events', function() {
      suite('Binding', function() {
        test('fail to bind unavailable event', function(done) {
          try {
            this.stp.on('invalid');

            done(new Error('Bound invalid event!'));
          } catch (e) {
            assert.equal(e.message, 'Unknown event invalid');
            
            done();
          }
        });

        test('succeed to bind available events', function(done) {
          try {
            this.stp.on('start');
            this.stp.on('stop');
            this.stp.on('split');

            done();
          } catch (e) {
            done(new Error('Failed to bind start, stop, split events!'));
          }
        });
      });

      suite('Trigger', function() {
        test('start', function(done) {
          this.stp.on('start', () => { done(); });
          this.stp.start();
        });

        test('stop', function(done) {
          this.stp.start();

          this.stp.on('stop', () => { done(); });
          this.stp.stop();
        });

        test('split', function(done) {
          this.stp.start();

          this.stp.on('split', () => { done(); });
          this.stp.split();
        });
      });
    });
  });
})();
