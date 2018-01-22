(function() {
  
  angular
    .module('app')
    .controller('SettingsCtrl', SettingsCtrl);
    
  SettingsCtrl.$inject = ['DataService', '$mdToast'];
  
  function SettingsCtrl(DataService, $mdToast){
    
    var vm = this;
    vm.user = {}
    vm.setProfile = setProfile;
    vm.showToast = showToast;
    vm.states = ('Other AB BC MB NB NL NS NT NU ON PE QC SK YK AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
            'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
            'WY').split(' ').map(function (state) { return { abbrev: state }; });
    
    (function(){
      DataService.getProfile()
        .then(function(result) {
          vm.user = result.data;
        });
    })();
    
    function setProfile(userMods) {
      console.log(JSON.stringify(userMods));
      DataService.setProfile(userMods)
        .then(function(result) {
          vm.user = result.data;
          vm.showToast('User profile updated')
        })
    }
    
    var states = ['Other', 'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YK', 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
    
    function showToast(msg) {
      $mdToast.show(
        $mdToast.simple()
          .content(msg)
          .position('top right')
          .hideDelay(3000)
      );
    };
  }
  
})();