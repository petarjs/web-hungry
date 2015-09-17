(function () {
  'use strict';

  angular
    .module('Hungry.core.loader')
    .service('Loader', LoaderService);

  function LoaderService($mdToast) {
    var toastConfig = {
      position: 'top right',
      parent: angular.element(document.body),
      templateUrl: 'core/loader/loader',
      hideDelay: false
    };

    return {
      start: start,
      stop: stop
    };

    function start() {
      $mdToast.show(toastConfig);
    }

    function stop() {
      $mdToast.hide();
    }
  }
})(); 