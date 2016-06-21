# stopper

[![Travis](https://img.shields.io/travis/sbstjn/stopper.svg?maxAge=600)](https://travis-ci.org/sbstjn/stopper) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](https://github.com/sbstjn/stopper/commits/master) [![npm](https://img.shields.io/npm/dt/stopper.svg?maxAge=600)](https://www.npmjs.com/package/stopper) [![npm](https://img.shields.io/npm/v/stopper.svg?maxAge=600)](https://www.npmjs.com/package/stopper)

A minimal JavaScript stopwatch object to count and measure time in your Node.js
or browser applications.

```js
(() => {
  'use strict';

  const Stopper = require('stopper')  
    , util = require('util');

  const stp = new Stopper('A nice but optional name');

  stp.start();

  setTimeout(() => {
    stp.stop();

    util.log(stp.measure());
  }, 600);
})();
```

```bash
$ > node test.js
20 Jun 09:36:58 - 603
```
