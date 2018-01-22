(function() {

  angular
    .module('app')
    .controller('ProfileCtrl', ProfileCtrl);

  ProfileCtrl.$inject = ['$location', 'DataService', '$scope', '$mdToast'];

  function ProfileCtrl($location, DataService, $scope, $mdToast) {
    var vm = this;
    vm.user = {};
    vm.collection = [];
    $scope.wishlist = [];
    $scope.pending = [];
    $scope.inProgressDonor = [];
    $scope.inProgressRecipient = [];
    vm.removeFromCollection = removeFromCollection;
    vm.removeFromWishlist = removeFromWishlist;
    vm.showToast = showToast;
    $scope.approveTrade = approveTrade
    $scope.cancelTrade = cancelTrade;
    $scope.completeTrade = completeTrade;
    vm.tradesgiven = 0;
    vm.tradesreceived = 0;

    (function init() {
      vm.user = {};
      vm.collection = [];
      $scope.wishlist = [];
      $scope.pending = [];
      $scope.inProgressDonor = [];
      $scope.inProgressRecipient = [];
      vm.tradesgiven = 0;
      vm.tradesreceived = 0;

      DataService.getProfile()
        .success(function(data) {
          vm.user = data;
        })
        .error(function (e) {
          console.log(e);
        });

      DataService.getCollection()
        .success(function(data) {
          vm.collection = data;
        })
        .error(function (e) {
          console.log(e);
        });

      DataService.getWishlist()
        .success(function(data) {
          $scope.wishlist = data;
        })
        .error(function(e) {
          console.log(e);
        });

      DataService.getPending()
        .success(function(data) {
          $scope.pending = data;
        })
        .error(function(e) {
          console.log(e);
        });

      DataService.getInProgress()
        .success(function(data) {
          $scope.inProgressDonor = data[0];
          $scope.inProgressRecipient = data[1];
        })
        .error(function(e) {
          console.log(e);
        });

      DataService.getCompleteDonor()
        .success(function(data) {
          vm.tradesgiven = data;
        })
        .error(function(e) {
          console.log(e);
        });

      DataService.getCompleteRecipient()
        .success(function(data) {
          vm.tradesgiven = data;
        })
        .error(function(e) {
          console.log(e);
        });

    })();

    $scope.remove = function(array, index) {
      array.splice(index, 1)
    };

    $scope.add = function(array, datum) {
      array.push(datum);
    };

    $scope.inCollection = function(id) {
      if (userCollection.indexOf(id) > -1) {
        return true;
      } else {
        return false;
      }
    }

    function removeFromCollection(book) {
      DataService.removeFromCollection(book)
        .then(function(data) {
          $scope.remove(vm.collection, vm.collection.indexOf(book));
        });
    }

    function removeFromWishlist(book) {
      DataService.removeFromWishlist(book)
        .then(function(data) {
          $scope.remove(vm.wishlist, vm.wishlist.indexOf(book));
          /* angular.element.find(book.id).remove(); */
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

    function approveTrade(wishlist) {
      console.log("Initiate clicked on " + wishlist._id);
      DataService.approveTrade(wishlist).then(function(data) {

        DataService.getPending()
          .success(function(data) {
            console.log('Ctrl.approve.pending: ' + JSON.stringify(data));
            $scope.pending = data;
          })
          .error(function(e) {
            console.log(e);
          });
        DataService.getInProgress()
          .success(function(data) {
            console.log('Ctrl.approve.inprogress: ' + JSON.stringify(data[0]));
            $scope.inProgressDonor = data[0];
          })
          .error(function(e) {
            console.log(e);
          });
        });
    }

    function cancelTrade(trade) {
      DataService.cancelTrade(trade).then(function(data) {
        console.log("Cancel Trade: " + data);
        DataService.getPending()
          .success(function(data) {
            $scope.pending = data;
          })
          .error(function(e) {
            console.log(e);
          })
        DataService.getInProgress()
          .success(function(data) {
            $scope.inProgressDonor = data[0];
            showToast("Your trade was cancelled.")
          })
          .error(function(e) {
            console.log(e);
          });
      })
    }

    function completeTrade(trade) {
      DataService.completeTrade(trade).then(function(data) {
        console.log('Complete trade: ' + data);
        DataService.getInProgress()
          .success(function(data) {
            console.log("Get in progress: " + data[1]);
            $scope.inProgressRecipient = data[1];
            showToast("Your trade was completed.");
          });
      });
    }
  }

})();
