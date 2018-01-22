(function() {
 'use strict';

  angular.module('app', ['ngMaterial', 'ngRoute']);
  
  angular
   .module('app')
   .config(['$mdThemingProvider', '$routeProvider', '$locationProvider', config])
   .run(['$rootScope', '$location', 'AuthenticationService', run]);
 
 function config($mdThemingProvider, $routeProvider, $locationProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('indigo')
      .accentPalette('pink')
      .warnPalette('red');
      
    $routeProvider
      .when('/search', {
        controller: 'SearchCtrl',
        controllerAs: 'search',
        templateUrl: 'views/search.html'
      })
      .when('/register', {
        controller: 'RegisterCtrl',
        controllerAs: 'register',
        templateUrl: 'views/register.html'
      })
      .when('/login', {
        controller: 'LoginCtrl',
        controllerAs: 'login',
        templateUrl: 'views/login.html'
      })
      .when('/dashboard', {
        controller: 'ProfileCtrl',
        controllerAs: 'profile',
        templateUrl: 'views/dashboard.html'
      })
      .when('/have', {
        controller: 'ProfileCtrl',
        controllerAs: 'profile',
        templateUrl: 'views/have.html'
      })
      .when('/want', {
        controller: 'ProfileCtrl',
        controllerAs: 'profile',
        templateUrl: 'views/want.html'
      })
      .when('/trades', {
        controller: 'ProfileCtrl',
        controllerAs: 'tradeCtrl',
        templateUrl: 'views/trades.html'
      })
      .when('/books', {
        controller: 'AllBooksCtrl',
        controllerAs: 'allbooks',
        templateUrl: 'views/allbooks.html'
      })
      .when('/settings', {
        controller: 'SettingsCtrl',
        controllerAs: 'settings',
        templateUrl: 'views/settings.html'
      })
      .when('/', {
        templateUrl: 'views/home.html'
      })
      .otherwise({
      // default page
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
  };

  function run($rootScope, $location, AuthenticationService) {
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
      if ($location.path() === '/dashboard' && !AuthenticationService.isLoggedIn()) {
        $location.path('/');
      } else if ($location.path() === '/' && AuthenticationService.isLoggedIn()) {
        $location.path('/dashboard');
      }
    });
  }
  
})();