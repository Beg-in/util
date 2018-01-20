'use strict';

module.exports = {
  base64UrlEncode(b64) {
    return b64.replace(/\//g, '_').replace(/\+/g, '-');
  },

  base64UrlDecode(url) {
    return url.replace(/_/g, '/').replace(/-/g, '+');
  },
};
