var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  thumbnail: String
});

mongoose.model('Book', bookSchema);