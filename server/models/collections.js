var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var collectionSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: 'Book' },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  pastOwners: [{ type: Schema.Types.ObjectId, ref: 'User'}],
  inTransit: Boolean
});

mongoose.model('Collection', collectionSchema);