(function () {
  'use strict';

  angular
    .module('Hungry.admin.catering')
    .controller('AdminCateringController', AdminCateringController);

  function AdminCateringController($sce, Orders, $stateParams, Loader) {
    var vm = this;

    vm.trustedHtmlEmail = '';

    activate();

    function activate() {
      getHtmlEmail($stateParams.week);
    }

    function getHtmlEmail(week) {
      Loader.start();
      Orders
        .getCateringEmail(week)
        .then(function(emailHtml) {
          vm.trustedHtmlEmail = $sce.trustAsHtml(emailHtml);
        })
        .then(Loader.stop);
    }
  }
})(); 