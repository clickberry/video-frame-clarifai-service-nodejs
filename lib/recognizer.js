/**
 * @fileOverview Encapsulates image recognition logic.
 */

var debug = require('debug')('clickberry:video-frame-clarifai:recognizer');
var Clarifai = require('clarifai');

var defaults = {
  language: 'en'
};

 /**
  * A class for detecting objects on image.
  *
  * @class
  * @param      {string}  clientId      Clarifai client id.
  * @param      {string}  clientSecret  Clarifai client secret.
  */
var Recognizer = function (clientId, clientSecret) {
  Clarifai.initialize({
    'clientId': clientId,
    'clientSecret': clientSecret
  });
};

/**
 * Detects objects on images specified by uris.
 *
 * @method     detect
 * @param      {string}  image_uri  Image URI.
 * @param      {Object}        opts        Addition options.
 * @param      {Function}      fn          Callback.
 */
Recognizer.prototype.detect = function (imageUri, opts, fn) {
  var recognizer = this;
  // normalize parameters

  if (typeof opts === 'function') {
    fn = opts;
    opts = {};
  }

  opts = Object.assign({}, defaults, opts);

  debug('Detecting objects on image: ' + imageUri);

  function handleResponse(res) {
    debug('Detected objects on image ' + imageUri + ': ' + JSON.stringify(res));

    fn(null, res.results[0].result.tag.classes);
  }

  function handleError(err) {
    debug('Error detecting objects on image ' + image_uri + ': ' + err);
    fn(err);
  }

  // make api call
  Clarifai.getTagsByUrl(imageUri, {
    'language': opts.language
  }).then(
    handleResponse,
    handleError
  );
};

module.exports = Recognizer;
