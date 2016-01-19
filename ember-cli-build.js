/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var isProduction = EmberApp.env() === 'production';

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    mythOptions: {
      source: './app/styles/app.css',
      inputFile: 'app.css',
      browsers: 'last 2 versions',
      sourcemap: false,
      compress: isProduction,
      outputFile: isProduction ? 'fancy-calculator.min.css' : 'fancy-calculator.css'
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
