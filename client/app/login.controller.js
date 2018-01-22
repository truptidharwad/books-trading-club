(function() {

  angular
    .module('app')
    .controller('LoginCtrl', LoginCtrl);
    
    LoginCtrl.$inject = ['$location', 'AuthenticationService'];
    
    function LoginCtrl($location, AuthenticationService) {
      var vm = this;
      vm.credentials = credentials;
      vm.onSubmit = onSubmit;
      
      var credentials = {
        email: "",
        password: ""
      };
      
      function onSubmit() {
        AuthenticationService
          .login(vm.credentials)
          .error(function(err) {
            alert(err.message)
          })
          .then(function() {
            $location.path('dashboard');
          });
      };
    }
    
})();
