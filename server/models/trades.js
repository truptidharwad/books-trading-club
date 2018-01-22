var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tradeSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: 'Book' },
  recipient: { type: Schema.Types.ObjectId, ref: 'User' },
  donor: { type: Schema.Types.ObjectId, ref: 'User' },
  status: String
});

mongoose.model('Trade', tradeSchema);
