(function() {
  
  angular
    .module('app')
    .controller('RegisterCtrl', RegisterCtrl);
    
  RegisterCtrl.$inject = ['$location', 'AuthenticationService'];
  
  function RegisterCtrl($location, AuthenticationService) {
    var vm = this;
    vm.credentials = credentials;
    vm.onSubmit = onSubmit;
    
    var credentials = {
      name: "",
      email: "",
      password: ""
    };
    
    function onSubmit() {
      console.log(vm.credentials);
      AuthenticationService 
        .register(vm.credentials)
        .error(function(err) {
          alert(err.message);
        })
        .then(function() {
          $location.path('dashboard');
        });
    };
    
  };
  
})();