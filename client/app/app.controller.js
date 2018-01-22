(function() {

  angular
    .module('app')
    .controller('AppCtrl', AppCtrl);

  AppCtrl.$inject = ['$mdSidenav', 'AuthenticationService', '$scope'];

  function AppCtrl($mdSidenav, AuthenticationService, $scope) {
    var vm = this;
    vm.toggleSidenav = toggleSidenav;
    $scope.isLoggedIn = AuthenticationService.isLoggedIn();
    $scope.currentUser = AuthenticationService.currentUser();
    $scope.setMenu = setMenu;
    $scope.menu = $scope.menu;
    $scope.logout = logout;

    function toggleSidenav() {
      $scope.isLoggedin
      $scope.setMenu();
      $mdSidenav("left").toggle();
    }

    function setMenu() {
      if (AuthenticationService.isLoggedIn()) {
        $scope.menu = menuLoggedIn;
      }  else {
        $scope.menu = menuLoggedOut;
      }
    }

    function logout() {
      console.log("logging out")
      vm.toggleSidenav();
      AuthenticationService.logout();
      $scope.isLoggedin = AuthenticationService.isLoggedIn();
    }

    var menuLoggedOut = [{
      title: "Home",
      icon: "home",
      link: "/home",
    }, {
      title: "Sign In",
      icon: "",
      link: "/login",
    }, {
      title: "Register",
      icon: "",
      link: "/register",
    }];

    var menuLoggedIn = [{
      title: "Everyone's Books",
      icon: "book",
      link: "/books",
    },{
      title: "Your Dashboard",
      icon: "account_circle",
      link: "/dashboard",
    },{
      title: "Books You Have",
      icon: "library_books",
      link: "/have",
    },{
      title: "Add Books You Have",
      icon: "library_add",
      link: "/search",
    },{
      title: "Books You Want",
      icon: "favorite",
      link: "/want"
    },{
      title: "Books You Are Trading",
      icon: "share",
      link: "/trades"
    },{
      title: "Update Settings",
      icon: "settings",
      link: "/settings",
    }];
  }

})();
