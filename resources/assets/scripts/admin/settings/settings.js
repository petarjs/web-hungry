(function () {
  'use strict';

  angular
    .module('Hungry.admin.settings')
    .controller('SettingsController', SettingsController);

  function SettingsController(Settings, AppState) {
    var vm = this;

    vm.state = {};

    var changeSettings = AppState.change('settings');
    AppState.listen('settings', function(settings) { vm.state.settings = settings; });

    vm.saveCateringEmail = saveCateringEmail;

    activate();

    function activate() {
      getSettings();
    }

    function saveCateringEmail(email) {
      Settings
        .setSettings({
          catering_email: email
        })
        .then(changeSettings);
    }

    function getSettings() {
      Settings
        .getSettings()
        .then(changeSettings);
    }
  }
})(); 