(function () {
  angular
    .module('Hungry.app')
    .controller('AppController', AppController);

  function AppController(Auth) {
    var vm = this;

    vm.hasRole = Auth.hasRole;
  }
})(); 