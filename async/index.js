'use strict';

module.exports = {
  delay(duration = 100) {
    return new Promise(resolve => setTimeout(resolve, duration));
  },
};
