(function() {
  
  angular
    .module('app')
    .controller('SearchCtrl', SearchCtrl);
    
  SearchCtrl.$inject = ['$mdToast', '$http', 'AuthenticationService', 'DataService'];
  
  function SearchCtrl($mdToast, $http, AuthenticationService, DataService) {
    var vm = this;
    vm.results;
    vm.collection = [];
    vm.search = search;
    vm.addBook = addBook;
    vm.showToast = showToast;
    vm.inCollection = inCollection;
    vm.currentUser = AuthenticationService.currentUser();

    (function() {
      DataService.getCollection()
      .then(function(data) {
        data.data.forEach(function(book) {
          vm.collection.push(book.id);
        });
      });
    })();
    
    function search(term) {
      var url = '/api/search/' + encodeURIComponent(term);
      $http.get(url)
        .then(function(data){
          vm.results = data.data;
        })
        .catch(function(error) {
          console.log(error);
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
    
    function addBook(book) {
      DataService.addToCollection(book)
        .then(function(bookid) {
          showToast('Added ' + book.title + ' to your collection.');
          vm.collection.push(bookid);
        });
    }
    
    function inCollection(book) {
      if (vm.collection.indexOf(book.id) === -1) {
        return false;
      } else {
        return true;
      }
    }
  }
  
})();