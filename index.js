// env
if (!process.env.CLARIFAI_CLIENT_ID) {
  console.log("CLARIFAI_CLIENT_ID environment variable required.");
  process.exit(1);
}

if (!process.env.CLARIFAI_CLIENT_SECRET) {
  console.log("CLARIFAI_CLIENT_SECRET environment variable required.");
  process.exit(1);
}

var debug = require('debug')('clickberry:video-frame-clarifai:worker');

var Recognizer = require('./lib/recognizer');
var recognizer = new Recognizer(process.env.CLARIFAI_CLIENT_ID, process.env.CLARIFAI_CLIENT_SECRET);

var Bus = require('./lib/bus');
var bus = new Bus();

var Frame = require('./lib/frame');

function handleError(err) {
  console.error(err);
}

bus.on('frame', function (msg) {
  var frame = JSON.parse(msg.body);

  // we will recognize objects in 1 frame per second
  debug('Video frame ready for recognition: ' + JSON.stringify(frame));

  var options = {
    language: process.env.CLARIFAI_LANGUAGE
  };

  function finishProcessing(results) {
    debug('Video frame clarifai results (' + frame.uri + '): ' + results.join(', '));
    msg.finish();
  }

  recognizer.detect(frame.uri, options, function (err, results) {
    if (err) return handleError(err);

    // checking if the frame has been alreade processed by another analyzer
    var query  = Frame.where({
      videoId: frame.videoId, 
      segmentIndex: frame.segmentIdx, 
      frameIndex: frame.frameIdx
    });

    query.findOne(function (err, f) {
      if (err) return handleError(err);

      // save recognition results
      if (f) {
        debug('Appending clarifai results to the existing frame record.');

        // update frame
        f.update({ clarifai: results }, function (err) {
          if (err) return handleError(err);

          finishProcessing(results);
        });
      } else {
        // create frame
        Frame.create({
          videoId: frame.videoId,
          videoUri: frame.videoUri,
          segmentIndex: frame.segmentIdx,
          frameIndex: frame.frameIdx,
          uri: frame.uri,
          clarifai: results,
        }, function (err) {
          if (err) return handleError(err);

          finishProcessing(results);
        });
      }
    });
  });
});

debug('Listening for messages...');
