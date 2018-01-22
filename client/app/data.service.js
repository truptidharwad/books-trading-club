(function() {

  angular
    .module('app')
    .factory('DataService', DataService);

  DataService.$inject = ['$http', 'AuthenticationService'];

  function DataService($http, AuthenticationService) {

    var service = {
      getProfile: getProfile,
      setProfile: setProfile,
      getCollection: getCollection,
      getWishlist: getWishlist,
      getPending: getPending,
      getInProgress: getInProgress,
      getCompleteDonor: getCompleteDonor,
      getCompleteRecipient: getCompleteRecipient,
      addToCollection: addToCollection,
      removeFromCollection: removeFromCollection,
      addToWishlist: addToWishlist,
      removeFromWishlist: removeFromWishlist,
      getAllBooks: getAllBooks,
      approveTrade: approveTrade,
      cancelTrade: cancelTrade,
      completeTrade: completeTrade,
    };

    return service;

    function getProfile() {
      return $http.get('/api/profile', {
        headers: {
          Authorization: 'Bearer ' + AuthenticationService.getToken()
        }
      });
    }

    function setProfile(user) {
      return $http.post('/api/profile', user);
    }

    function getCollection() {
      var url = '/api/collection/' + encodeURIComponent(AuthenticationService.currentUser().email);
      return $http.get(url);
    }

    function getWishlist() {
      var url = '/api/wishlist/' + encodeURIComponent(AuthenticationService.currentUser().email);
      return $http.get(url);
    }

    function getPending() {
      var url = '/api/' + AuthenticationService.currentUser().username + '/trades/pending';
      return $http.get(url);
    }

    function getInProgress() {
      var url = '/api/' + AuthenticationService.currentUser().username + '/trades/inprogress';
      return $http.get(url);
    }

    function getCompleteDonor() {
      var url = '/api/' + AuthenticationService.currentUser().username + '/trades/donor';
      return $http.get(url);
    }

    function getCompleteRecipient() {
      var url = '/api/' + AuthenticationService.currentUser().username + '/trades/donor';
      return $http.get(url);
    }

    function addToCollection(book) {
      return new Promise(function(resolve, reject) {
        var user = AuthenticationService.currentUser();
        $http.post('/api/collection', {
          user: user,
          book: book
        }).catch(function(err) {
          reject(err);
        }).then(function(result) {
          resolve(book.id);
        });
      });
    }

    function removeFromCollection(book) {
      return new Promise(function(resolve, reject) {
        var user = AuthenticationService.currentUser();
        $http.get('/api/collection/' + encodeURIComponent(user.email) + '/' + book.id )
          .then(function(result) {
            resolve(result.data);
          });
      });
    }

    function getAllBooks() {
      console.log("Calling all books api");
      return $http.get('/api/books');
    }

    function addToWishlist(book) {
      return new Promise(function(resolve, reject) {
        var user = AuthenticationService.currentUser();
        $http.post('/api/wishlist', {
          user: user,
          book: book
        }).catch(function(err) {
          reject(err);
        }).then(function(result) {
          resolve(book.id);
        });
      });
    }

    function removeFromWishlist(book) {
      return new Promise(function(resolve, reject) {
        var user = AuthenticationService.currentUser();
        $http.get('/api/wishlist/' + encodeURIComponent(user.email) + '/' + book.id )
          .then(function(result) {
            resolve(result.data);
          });
      });
    }

    function approveTrade(wishlist) {
      return new Promise(function(resolve, reject) {
        var user = AuthenticationService.currentUser();
        var data = { user: user, wishlist: wishlist };
        console.log("Sending approve request to server")
        $http.post('/api/trade/approve', data)
          .then(function(result) {
            console.log("dataService.approveTrade result: " + JSON.stringify(result));
            resolve(result.data);
          }, function(error) {
            reject(error);
          });
      });
    }

    function cancelTrade(trade) {
      return new Promise(function(resolve, reject) {
        $http.get('/api/trade/' + trade._id + '/delete')
          .then(function(result) {
            resolve(result.data);
          }, function(error) {
            reject(error);
          });
      });
    }

    function completeTrade(trade) {
      return new Promise(function(resolve, reject) {
        $http.get('/api/trade/' + trade._id + '/complete')
          .then(function(result) {
            resolve(result.data);
          }, function(error) {
            reject(error);
          });
      });
    }
  }
})();
