(function () {
  'use strict';

  angular
    .module('Hungry.admin.settings')
    .controller('SettingsController', SettingsController);

  function SettingsController() {
    var vm = this;

    vm.saveCateringEmail = saveCateringEmail;

    function saveCateringEmail(email) {
      
    }
  }
})(); 