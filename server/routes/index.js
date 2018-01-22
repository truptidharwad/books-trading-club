  var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});

var ctrlSearch = require('../controllers/search');
var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
var ctrlBooks = require('../controllers/books');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);
router.post('/profile', ctrlProfile.profileSet);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

router.get('/search/:term', ctrlSearch);

router.post('/collection', ctrlBooks.addToCollection);
router.get('/collection/:email', ctrlBooks.getUserBooks);
router.get('/collection/:email/:bookid', ctrlBooks.deleteUserBook);

router.post('/wishlist', ctrlBooks.addToWishlist);
router.get('/wishlist/:email', ctrlBooks.getUserWishlist);
router.get('/wishlist/:email/:bookid', ctrlBooks.removeFromWishlist);

router.get('/:username/trades/pending', ctrlBooks.getUserPending);
router.get('/:username/trades/donor',ctrlBooks.completedAsDonor);
router.get('/:username/trades/recipient', ctrlBooks.completedAsRecipient);
router.post('/trade/approve', ctrlBooks.approveTrade);
router.get('/:username/trades/inprogress', ctrlBooks.getInProgress);
router.get('/trade/:id/complete', ctrlBooks.completeTrade);
router.get('/trade/:id/delete', ctrlBooks.cancelTrade);
router.get('/books', ctrlBooks.allBooks);

module.exports = router;
