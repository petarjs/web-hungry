(function () {
    'use strict';
    angular
      .module('Hungry.admin.food')
      .controller('ChangeFoodCtrl', change);

      function change($mdDialog, AppState, orders, id) {
        var vm = this;

        vm.orderId = id;
        vm.orders = orders;
        //console.log(vm.orders);

        vm.changeOrder = changeOrder;
        vm.cancel = cancel;

        function cancel() {
          $mdDialog.cancel();
        }

        function changeOrder(newOrderId) {
          $mdDialog.hide(newOrderId);
        }


      }
})();