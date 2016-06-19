(() => {
  'use strict';

  class Stopper {
    constructor(name, start, stop) {
      this.name = name;
      this.dates = {start: start, stop: stop, laps: []};
      this.hooks = {start: [], stop: [], split: []};
    }

    start() {
      if (this.dates.start) {
        throw new Error('Stopper already started!');
      }

      this.dates.start = new Date();

      this.emit('start', this.dates.start);
    }

    stop() {
      if (!this.dates.start) {
        throw new Error('Stopper not started!');
      }

      if (this.dates.stop) {
        throw new Error('Stopper already stopped!');
      }

      this.dates.stop = new Date();

      this.emit('stop', this.dates.stop);
    }

    split(name) {
      if (!this.dates.start) {
        throw new Error('Stopper not started!');
      }

      if (this.dates.stop) {
        throw new Error('Stopper already stopped!');
      }

      this.dates.laps.push(new Stopper(name, this.dates.start, new Date()));

      this.emit('split', this.dates.laps[this.dates.laps.length - 1]);
    }

    measure() {
      return this.dates.stop - this.dates.start;
    }

    emit(event, data) {
      this.hooks[event].forEach((el) => {
        el(data);
      });
    }

    on(event, action) {
      if (Object.keys(this.hooks).indexOf(event) === -1) {
        throw new Error('Unknown event ' + event);
      }

      this.hooks[event].push(action);
    }
  }

  module.exports = Stopper;
})();
