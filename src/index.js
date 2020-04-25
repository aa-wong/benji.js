'use stirct';

import 'babel-register';
import 'idempotent-babel-polyfill';

import Benji from './benji';

((_export) => {
  try {
    window.benji = _export;
  } catch (e) {
    module.exports = _export;
  }
})(Benji);

export default Benji;
