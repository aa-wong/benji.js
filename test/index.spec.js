/* global describe, it, before */

import chai from 'chai';
import {Benji, benjiMethod} from '../lib/benji.js';

chai.expect();

const expect = chai.expect;

let lib;

describe('Given an instance of my Benji library', () => {
  before(() => {
    lib = new Benji();
  });
});
