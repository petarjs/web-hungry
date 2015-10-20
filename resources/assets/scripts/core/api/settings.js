(function () {
  angular
    .module('Hungry.core.api.settings')
    .factory('Settings', SettingsFactory);

  function SettingsFactory($http, appConfig, UrlReplacer, ApiHelpers) {
    return {
      getSettings: getSettings,
      setSettings: setSettings
    };

    function getSettings() {
      var url = appConfig.api.concat('/admin/settings');
      return $http.get(url, {
        cache: true
      }).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    function setSettings(settings) {
      var url = appConfig.api.concat('/admin/settings');
      return $http
        .post(url, settings)
        .then(ApiHelpers.extractData, ApiHelpers.handleError);
    }
  }
})(); 