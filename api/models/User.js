/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true
    },

    title: {
      type: 'string'
    },

    email: {
      type: 'string',
      email: true,
      required: true,
      unique: true
    },

    searchHistory: {
      type: 'array'
    },

    password: {
      type: 'string',
      required: true
    },

    lastLoggedIn: {
      type: 'date',
      required: 'true',
      defaultsTo: new Date(0)
    }
  }
};
