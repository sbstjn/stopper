(() => {
  'use strict';

  const assert = require('chai').assert;
  const Stopper = require('../');

  suite('Structure', function() {
    setup(function() {
      this.stp = new Stopper();
    });

    suite('Object', function() {
      test('constructor returns Stopper', function() {
        assert.equal(this.stp.constructor.name, 'Stopper');
      });

      test('list of available Stopper methods', function() {
        assert.deepEqual(Object.getOwnPropertyNames(Stopper.prototype), ['constructor', 'emit', 'last', 'lap', 'laps', 'measure', 'on', 'split', 'start', 'stop']);
      });
    });

    suite('Data', function() {
      test('list of available Stopper properties', function() {
        assert.deepEqual(Object.keys(this.stp), ['name', 'dates', 'hooks']);
      });

      test('has array of Stopper laps', function() {
        assert.typeOf(this.stp.dates.laps, 'Array');
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

        assert.notEqual(this.stp.dates.start, undefined)
        assert.equal(this.stp.dates.start.constructor.name, 'Date');
      });

      test('init with start date', function() {
        let tmp = new Stopper('name', new Date());

        assert.typeOf(tmp.dates.start, 'Date');
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

        assert.typeOf(this.stp.dates.stop, 'Date');
      });

      test('init with stop date', function() {
        let tmp = new Stopper('name', new Date(), new Date());

        assert.typeOf(tmp.dates.stop, 'Date');
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
        assert.equal(this.stp.dates.laps[0].constructor.name, 'Stopper');
        assert.typeOf(this.stp.dates.laps[0].dates.start, 'Date');
        assert.typeOf(this.stp.dates.laps[0].dates.stop, 'Date');

        this.stp.split();
        assert.equal(this.stp.dates.laps.length, 2);
        assert.equal(this.stp.dates.laps[1].constructor.name, 'Stopper');
        assert.typeOf(this.stp.dates.laps[1].dates.start, 'Date');
        assert.typeOf(this.stp.dates.laps[1].dates.stop, 'Date');
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

      test('split does have a corrent start and stop', function(done) {
        let stp = new Stopper('example');
        stp.start();

        setTimeout(() => {
          stp.split('first');
        }, 20);

        setTimeout(() => {
          stp.split('second');
        }, 40);

        setTimeout(() => {
          stp.split('third');
        }, 80);

        setTimeout(() => {
          stp.split('fourth');
        }, 100);

        setTimeout(() => {
          stp.stop();

          assert.approximately(stp.lap('first').measure(),  20, 5, 'first split');
          assert.approximately(stp.lap('second').measure(), 20, 5, 'second split');
          assert.approximately(stp.lap('third').measure(),  40, 5, 'third split');
          assert.approximately(stp.lap('fourth').measure(), 20, 5, 'fourth split');

          assert.approximately(stp.measure(), 110, 5, 'total');
          assert.equal(stp.laps().length, 4);

          done();
        }, 110);
      });

      test('split is between start and stop', function(done) {
        this.stp.start();

        setTimeout(() => {
          this.stp.split();

          setTimeout(() => {
            this.stp.stop();

            assert.isAbove(this.stp.dates.stop, this.stp.dates.start);
            assert.deepEqual(this.stp.dates.laps[0].dates.start, this.stp.dates.start);
            assert.isAbove(this.stp.dates.laps[0].dates.stop, this.stp.dates.start);
            assert.isAbove(this.stp.dates.stop, this.stp.dates.laps[0].dates.stop);

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

    suite('Naming', function() {
      test('set name for Stopper', function() {
        let tmp = new Stopper('custom name');

        assert.equal(tmp.name, 'custom name');
      });

      test('set name for Stopper splits', function() {
        this.stp.start();

        this.stp.split('first');
        assert.equal(this.stp.dates.laps.length, 1);
        assert.equal(this.stp.dates.laps[0].constructor.name, 'Stopper');
        assert.equal(this.stp.dates.laps[0].name, 'first');

        this.stp.split('second');
        assert.equal(this.stp.dates.laps.length, 2);
        assert.equal(this.stp.dates.laps[1].name, 'second');
      });

      test('get lap for name', function() {
        this.stp.start();
        this.stp.split('test1');
        this.stp.split('test2');
        this.stp.split('test3');
        this.stp.stop();

        assert.equal(this.stp.lap('test1').constructor.name, 'Stopper');
        assert.equal(this.stp.lap('test1').name, 'test1');

        assert.equal(this.stp.lap('test3').constructor.name, 'Stopper');
        assert.equal(this.stp.lap('test3').name, 'test3');

        assert.typeOf(this.stp.laps(), 'Array');
        assert.equal(this.stp.laps().length, 3);
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
