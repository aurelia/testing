var Promise = require('bluebird');
Promise.config({warnings: false});

import './integrated/matchers';

import {initialize} from 'aurelia-pal-browser';
initialize();
