import test from 'tape';
import { reducerTest } from 'tape-redux';

import { requesting } from './reducer';
import * as actions from './actions.js';


test('request report reducer', reducerTest(
  requesting,
  false,
  actions.requestSpot,
  true,
  'Requesting a spot should change the requesting property to true'
));
