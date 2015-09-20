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

    var loaderCount = 0;

    return {
      start: start,
      stop: stop,
      isLoading: isLoading
    };

    function start() {
      if(loaderCount === 0) {
        $mdToast.show(toastConfig);
      }

      loaderCount++;
    }

    function stop() {
      if(loaderCount === 0) {
        return;
      }

      loaderCount--;

      if(loaderCount === 0) {
        $mdToast.hide();
      }
    }

    function isLoading() {
      return loaderCount > 0;
    }
  }
})(); 