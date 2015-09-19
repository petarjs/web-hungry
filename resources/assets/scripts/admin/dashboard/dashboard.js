(function () {
  'use strict';

  angular
    .module('Hungry.admin.dashboard')
    .controller('DashboardController', DashboardController);

  function DashboardController($scope, user) {
    var vm = this;

    vm.user = user;
  }

})(); 