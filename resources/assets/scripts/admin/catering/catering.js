(function () {
  'use strict';

  angular
    .module('Hungry.admin.catering')
    .controller('AdminCateringController', AdminCateringController);

  function AdminCateringController($sce, Orders, $stateParams, Loader, SweetAlert) {
    var vm = this;

    vm.trustedHtmlEmail = '';

    vm.sendEmail = sendEmail;

    activate();

    function activate() {
      vm.week = $stateParams.week;
      getHtmlEmail(vm.week);
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

    function sendEmail(week) {

      SweetAlert.swal({
         title: "Send email to catering?",
         text: "Are you sure you want to send this order email to catering?",
         type: "warning",
         showCancelButton: true,
         confirmButtonColor: "#DD6B55",
         confirmButtonText: "Yes, send it!",
         closeOnConfirm: false,
         showLoaderOnConfirm: true
      }, function(shouldSend) {
        if(shouldSend) {
          Orders
            .sendCateringEmail(week)
            .then(function() {
              SweetAlert.swal('Email sent!');
            }, function() {
              SweetAlert.swal('Error!');
            });
        }
      });
    }
  }
})(); 