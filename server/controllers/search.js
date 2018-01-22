var books = require('google-books-search');

var search = function(req, res) {
  books.search(req.params.term, function(error, results) {
    if ( ! error ) {
      res.json(results);
    } else {
      res.json(error);
    }
  });
}
module.exports = search;
