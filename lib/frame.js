// env
if (!process.env.MONGODB_CONNECTION) {
  console.log("MONGODB_CONNECTION environment variable required.");
  process.exit(1);
}

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_CONNECTION);

var Schema = mongoose.Schema;

var frameSchema = new Schema({
  videoId: String,
  videoUri: String,
  segmentIndex: Number,
  frameIndex: Number,
  uri: String,
  clarifai: [String]
});

frameSchema.index({ videoId: 1, segmentIndex: 1, frameIndex: 1 });

module.exports = mongoose.model('Frame', frameSchema);
