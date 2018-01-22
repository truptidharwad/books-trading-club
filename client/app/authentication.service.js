(function() {
  
  angular
    .module('app')
    .service('AuthenticationService', AuthenticationService)
    
    AuthenticationService.$inject = ['$http', '$window'];
    
    function AuthenticationService($http, $window) {
      
      var saveToken = function(token) {
        $window.localStorage['book-token'] = token;
      };
      
      var getToken = function() {
        return $window.localStorage['book-token'];
      };
      
      var logout = function() {
        $window.localStorage.removeItem('book-token');
      };
      
      var isLoggedIn = function() {
        var token = getToken();
        var payload;
        
        if (token) {
          payload = token.split('.')[1];
          payload = $window.atob(payload);
          payload = JSON.parse(payload);
          
          return payload.exp > Date.now() / 1000;
        } else {
          return false;
        }
      };
      
      var currentUser = function() {
        if (isLoggedIn()) {
          var token = getToken();
          var payload = token.split('.')[1];
          payload = $window.atob(payload);
          payload = JSON.parse(payload);
          return {
            _id: payload._id,
            email: payload.email,
            username: payload.username
          };
        }
      };
      
      var register = function(user) {
        return $http.post('/api/register', user).success(function(data) {
          saveToken(data.token);
        });
      };
      
      var login = function(user) {
        return $http.post('/api/login', user).success(function(data) {
          saveToken(data.token);
        });
      };
       
      return {
        saveToken: saveToken,
        getToken: getToken,
        logout: logout,
        isLoggedIn: isLoggedIn,
        currentUser: currentUser,
        register: register,
        login: login
      };
    }
    
})();