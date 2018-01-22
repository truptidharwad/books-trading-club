/* global next */
var mongoose = require('mongoose');
var Collection = mongoose.model('Collection');
var User = mongoose.model('User');
var Book = mongoose.model('Book');
var Wishlist = mongoose.model('Wishlist');
var Trade = mongoose.model('Trade');

var collection = [];
var wishlist = [];
var pending = [];
var trades = [];

var findUserByEmail = function(email) {
  return new Promise(function(resolve, reject) {
    User.findOne({ email: email })
    .exec(function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result._id);
      }
    });
  });
};

var findUserByUsername = function(username) {
  return new Promise(function(resolve, reject) {
    console.log("trying to find: " + username);
    User.findOne({ username: username })
    .exec(function(err, result) {
      console.log("found: " + JSON.stringify(result));
      if (err) {
        reject(err);
      } else {
        resolve(result._id);
      }
    });
  });
};


var findBook = function(reqBook) {
  return new Promise(function(resolve, reject) {
    Book.findOne({ id: reqBook.id })
      .exec(function(err, result) {
        if (err) {
          reject(err);
        }
        if (result) {
          resolve(result._id);
        } else {
          var abook = { id: reqBook.id, title: reqBook.title, thumbnail: reqBook.thumbnail }
          Book.create(abook, function(err, book) {
            if (err) { reject(err) }
            resolve(book._id);
          });
        }
      });
  });
};

module.exports.allBooks = function(req, res, next) {
  Collection.find({ inTransit: { $ne: true }}).distinct("book").exec(function(err, result) {
    if (err) { return next(err);  }
    Book.find({_id: {$in: result}}).sort({title: 1}).exec(function(err, books) {
      if (err) { return next(err); }
      res.status(200).json(books);
    });
  });
};

module.exports.addToCollection = function(req, res, next) {
  var bookPromise = findBook(req.body.book);
  var userPromise = findUserByEmail(req.body.user.email);

  Promise.all([userPromise, bookPromise]).then(function(dataArr) {
    Collection.create({ owner: dataArr[0], book: dataArr[1] }, function(err, result) {
      if (err) { return next(err); }
      res.json(result);
    });
  });
};

module.exports.getUserBooks = function(req, res, next) {
  collection = [];
  console.log("Getting user books: " + req.params.email);
  findUserByEmail(decodeURIComponent(req.params.email)).then(function(thisUser) {
    Collection.find({ owner: thisUser, inTransit: { $ne: true }}).populate('book').exec(function(err, resultingCollection) {
      if (err) { return next(err); }
      resultingCollection.forEach(function(datum) {
        var entry = {
          id: datum.book.id,
          title: datum.book.title,
          thumbnail: datum.book.thumbnail
        };
        collection.push(entry);
      });
      res.json(collection);
    });
  });
};

module.exports.deleteUserBook = function(req, res, next) {
  var bookid = req.params.bookid;
  var itemIndex;
  findUserByEmail(decodeURIComponent(req.params.email)).then(function(thisUser) {
    Collection.find({ owner: thisUser }).populate('book').exec(function(err, resultingCollection) {
      if (err) { return next(err); }
      resultingCollection.forEach(function(item) {
        if (item.book.id === req.params.bookid) {
          itemIndex = resultingCollection.indexOf(item);
        }
      });
      Collection.remove({ _id: resultingCollection[itemIndex]._id}, function(err, result) {
      if (err) { return next(err); }
        res.json({ id: bookid });
      });
    });
  });
};

module.exports.addToWishlist = function(req, res, next) {
  var bookPromise = findBook(req.body.book);
  var userPromise = findUserByEmail(req.body.user.email);

  Promise.all([userPromise, bookPromise]).then(function(dataArr) {
    Wishlist.create({ user: dataArr[0], book: dataArr[1], status: "pending" }, function(err, result) {
      if (err) { return next(err); }
      res.json(result);
    });
  });
};

module.exports.getUserWishlist = function(req, res, next) {
  wishlist = [];
  findUserByEmail(decodeURIComponent(req.params.email)).then(function(thisUser) {
    Wishlist.find({ user: thisUser, status: { $ne: "complete" }}).populate('book').exec(function(err, resultingList) {
      if (err) { return next(err); }
      resultingList.forEach(function(datum) {
        var entry = {
          id: datum.book.id,
          title: datum.book.title,
          thumbnail: datum.book.thumbnail
        };
        wishlist.push(entry);
      });
      res.json(wishlist);
    });
  });
};

module.exports.removeFromWishlist = function(req, res, next) {
  var bookid = req.params.bookid;
  var itemIndex;
  findUserByEmail(decodeURIComponent(req.params.email)).then(function(thisUser) {
    Wishlist.find({ user: thisUser }).populate('book').exec(function(err, resultingList) {
      if (err) { return next(err); }
      resultingList.forEach(function(item) {
        if (item.book.id === req.params.bookid) {
          itemIndex = resultingList.indexOf(item);
        }
      });
      Wishlist.remove({ _id: resultingList[itemIndex]._id}, function(err, result) {
        if (err) { return next(err); }
        res.json({ id: bookid });
      });
    });
  });
};

module.exports.getUserPending = function(req, res, next) {
  pending = [];
  console.log("Getting user pending trades: " + req.params.username);
  findUserByUsername(req.params.username).then(function(thisUser) {
    Wishlist.find({ status: { $nin: ['approved', 'completed']}}).exec(function(err, wishlistedBooks) {
      if (err) { return next(err); }
      var bookArr = wishlistedBooks.map(function(item) { return item.book });
      Collection.find({'book': {$in: bookArr}, 'owner': thisUser, inTransit: { $ne: true }}).exec(function(err, titlesPending) {
        var pendingIds = [];
        if (err) { return next(err); }
        titlesPending.forEach(function(datum) {
          pendingIds.push(datum.book);
        });
        Wishlist.find({'book': { $in: pendingIds }, status: { $nin: ['approved', 'complete'] }}).populate('book user', '-hash -salt').exec(function(err, pendingTrades){
          if (err) { return next(err); }
          res.json(pendingTrades);
        })
      });
    });
  });
};

function inProgressAsDonor(user) {
  return new Promise(function(resolve, reject) {
    Trade.find({ donor: user, status: 'initiated' }).populate('book recipient donor', '-hash -salt').exec(function(err, donorTrades) {
      if (err) {
        reject(err);
      } else {
        resolve(donorTrades);
      }
    });
  });
}

function inProgressAsRecipient(user) {
  return new Promise(function(resolve, reject) {
    Trade.find({ recipient: user, status: 'initiated' }).populate('book recipient donor', '-hash -salt').exec(function(err, recipientTrades) {
      if (err) {
        reject(err);
      } else {
        resolve(recipientTrades);
      }
    });
  });
}

module.exports.getInProgress = function(req, res, next) {
  inProgress = [];
  findUserByUsername(decodeURIComponent(req.params.username)).then(function(thisUser) {
    Promise.all([inProgressAsDonor(thisUser), inProgressAsRecipient(thisUser)]).then(function(result){
      res.status(200).json(result);
    });
  });
};

function changeWishlistStatus(user, book, newValue) {
  new Promise(function(resolve, reject) {
    Wishlist.findOneAndUpdate({ user: user, book: book }, { $set: { status: newValue }}, {new: true}).exec(function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result)
      }
    });
  });
}

function moveCollection(user, book, status) {
  new Promise(function(resolve, reject) {
    Collection.findOneAndUpdate({ owner: user, book: book}, { $set: { inTransit: status }}, { new: status }).exec(function(err, collection) {
      if (err) {
        reject(err);
      } else {
        console.log("Did I switch inTransit status? " + JSON.stringify(collection));
        resolve(collection);
      }
    });
  });
}

function createTrade(donor, recipient, book) {
  new Promise(function(resolve, reject) {
    var doc = {
      donor: donor,
      recipient: recipient,
      book: book,
      status: 'initiated'
    };
    Trade.create(doc, function(err, newDoc) {
      if (err) { reject(err) }
      resolve(newDoc);
    });
  })
}

module.exports.approveTrade = function(req, res, next) {
  console.log("received request to approve trade " + req.body.wishlist._id);
  var wishlist = req.body.wishlist;
  var donor = req.body.user._id;
  var book = wishlist.book._id;
  var recipient = wishlist.user._id;

  Promise.all([changeWishlistStatus(wishlist._id, "approved"), moveCollection(donor, book, true), createTrade(donor, recipient, book)]).then(function(resultData) {
    res.status(200).json(resultData[2]);
  });
};

module.exports.cancelTrade = function(req, res, next) {
  Trade.findOneAndUpdate({ _id: req.params.id }, {$set: { status: "cancelled"}}, {new: true}).exec(function(err, result) {
    moveCollection(result.donor, result.book, false);
    changeWishlistStatus(result.recipient, result.book, 'pending');
    res.status(200).json(result);
  });
};

module.exports.completeTrade = function(req, res, next) {
  Trade.findOneAndUpdate({ _id: req.params.id }, { $set: { status: "complete" }}, { new: true }).exec(function(err, result){
    Collection.findOneAndUpdate({ book: result.book, owner: result.donor }, { $set: { owner: result.recipient, inTransit: false }, $push: { pastOwners: result.donor }}, { new: true }).exec(function(err, result) {
      if (err) { return next(err); }
    });
    changeWishlistStatus(result.recipient, result.book, 'complete');
    res.status(200).json(result);
  });
};

module.exports.completedAsDonor = function(req, res, next) {
  findUserByUsername(req.params.username).then(function(thisUser) {
    Trade.find({status: 'complete', donor: thisUser}).populate('donor recipient book').exec(function(err, result) {
      console.log("As donor: " + result);
      if (err) {
        return next(err);
      } else {
        res.status(200).json({result})
      }
    });
  });
}

module.exports.completedAsRecipient = function(req, res, next) {
  findUserByUsername(req.params.username).then(function(thisUser) {
    Trade.find({status: 'complete', recipient: thisUser}).populate('donor recipient book').exec(function(err, result) {
      console.log("As recipient: " + result);
      if (err) {
        return next(err);
      } else {
        res.status(200).json({result})
      }
    });
  });
}
