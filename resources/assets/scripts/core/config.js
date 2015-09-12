(function () {
  angular
    .module('Hungry.core.config')
    .constant('appConfig', {
      api: window.api,
      date: {
        format: 'DD.MM.YY.'
      }
    });

})(); 