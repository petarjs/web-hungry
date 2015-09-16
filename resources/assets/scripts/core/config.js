(function () {
  angular
    .module('Hungry.core.config')
    .constant('appConfig', {
      api: window.api,
      date: {
        format: 'DD.MM.YY.',
        formatServer: 'YYYY-MM-DD 00:00:00'
      }
    });

})(); 