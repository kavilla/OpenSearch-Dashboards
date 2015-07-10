'use strict';

let _ = require('lodash');

exports.all = [
  {
    id: 'red',
    icon: 'danger',
    severity: 1000,
    nicknames: [
      'Danger Will Robinson! Danger!'
    ]
  },
  {
    id: 'uninitialized',
    icon: 'spinner',
    severity: 900,
    nicknames: [
      'Initializing'
    ]
  },
  {
    id: 'yellow',
    icon: 'warning',
    severity: 800,
    nicknames: [
      'S.N.A.F.U',
      'I\'ll be back',
    ]
  },
  {
    id: 'green',
    icon: 'success',
    severity: 0,
    nicknames: [
      'Looking good'
    ]
  },
  {
    id: 'disabled',
    severity: -1,
    icon: 'toggle-off',
    nicknames: [
      'I\'m I even a thing?'
    ]
  }
];

exports.allById = _.indexBy(exports.all, 'id');

exports.defaults = {
  icon: 'question',
  severity: Infinity
};

exports.get = function (id) {
  return exports.allById[id] || _.defaults({ id: id }, exports.defaults);
};
