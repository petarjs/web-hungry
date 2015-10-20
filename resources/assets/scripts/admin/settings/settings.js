(function () {
  'use strict';

  angular
    .module('Hungry.admin.settings')
    .controller('SettingsController', SettingsController);

  function SettingsController(Settings, AppState, Loader) {
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
      Loader.start();
      Settings
        .setSettings({
          catering_email: email
        })
        .then(changeSettings)
        .then(Loader.stop);
    }

    function getSettings() {
      Loader.start();
      Settings
        .getSettings()
        .then(changeSettings)
        .then(Loader.stop);
    }
  }
})(); 