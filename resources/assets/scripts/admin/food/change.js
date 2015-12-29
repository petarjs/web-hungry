(function () {
    'use strict';
    angular
      .module('Hungry.admin.food')
      .controller('ChangeFoodCtrl', change);

      function change($mdDialog, AppState, orders, id) {
        var vm = this;

        var state = {};
        vm.state = state; 

        vm.orderId = id;
        vm.orders = orders;
        console.log(vm.orders);
        vm.selectFood = selectFood;
        vm.cancel = cancel;

        function cancel() {
          $mdDialog.cancel();
        }

        function selectFood(food) {
          $mdDialog.hide(food);
        }


      }
})();