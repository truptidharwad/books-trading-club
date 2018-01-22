(function(){

  angular
    .module('app')
    .controller('AllBooksCtrl', AllBooksCtrl);

  AllBooksCtrl.$inject = ['DataService', '$scope', '$mdToast'];

  function AllBooksCtrl(DataService, $scope, $mdToast) {
    var vm = this;
    vm.addToWishlist = addToWishlist;
    vm.removeFromWishlist = removeFromWishlist;
    vm.showToast = showToast;
    vm.wishListEligible = wishListEligible;
    $scope.userCollection = [];
    $scope.books;
    $scope.wishlist = [];


    (function() {
      getLibrary();
      getCollection();
      getWishlist();
    })();

    function getLibrary() {
      DataService.getAllBooks()
        .success(function(result) {
          $scope.books = result;
        });
    }

    function getCollection() {
      DataService.getCollection()
        .success(function(result) {
          result.forEach(function(book) {
            $scope.userCollection.push(book.id);
          });
        });
    }


    function getWishlist() {
      DataService.getWishlist()
        .success(function(result) {
          result.forEach(function(book) {
            $scope.wishlist.push(book.id);
          });
        });
    }

    function addToWishlist(book) {
      $scope.wishlist.push(book.id);
      DataService.addToWishlist(book)
        .then(function(result){
          vm.showToast(book.title + ' added to Books You Want');
        });
    }

    function removeFromWishlist(book) {
      $scope.wishlist.splice($scope.wishlist.indexOf(book.id),1);
      DataService.removeFromWishlist(book)
        .success(function(result){
          vm.showToast(book.title + ' removed from Books You Want');
        });
    }

    function showToast(msg) {
      $mdToast.show(
        $mdToast.simple()
          .content(msg)
          .position('top right')
          .hideDelay(3000)
      );
    }

    function wishListEligible(book) {
      if ($scope.userCollection.indexOf(book.id) > -1) {
        return false;
      } else if ($scope.wishlist.indexOf(book.id) > -1 ) {
        return false;
      } else {
        return true;
      }
    }

  }

})();
