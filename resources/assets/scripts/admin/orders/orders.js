(function () {
  'use strict';

  angular
    .module('Hungry.admin.orders')
    .controller('AdminOrdersController', AdminOrdersController);

  function AdminOrdersController($scope, Loader, Orders, Menus, appConfig, AppState, $mdDialog, SweetAlert) {
    var vm = this;
  
    var state = {};
    var changeUserOrders = AppState.change('userOrders');
    var changeMenus      = AppState.change('menus');
    
    AppState.listen('userOrders', function(userOrders) {
      state.userOrders = userOrders;
    });

    AppState.listen('menus', function(menus) {
      state.menus = menus;
    });

    vm.state = state;

    vm.days = [{
      title: 'Mon'
    }, {
      title: 'Tue'
    }, {
      title: 'Wed'
    }, {
      title: 'Thu'
    }, {
      title: 'Fri'
    }];

    /**
     * Current week start date (monday)
     * @type Moment
     */
    vm.week = moment().add(1, 'week').startOf('isoWeek');

    vm.day = moment().isoWeekday() - 1;

    // if it's weekend, default to monday next week.
    if(vm.day > 4) {
      vm.week = vm.week.add(1, 'week');
      vm.day = 0;
    }

    vm.setNextWeek = setNextWeek;
    vm.setPrevWeek = setPrevWeek;
    vm.getOrderedFoodForDay = getOrderedFoodForDay;

    $scope.$watch(function() {
      return vm.week;
    }, function() {
      vm.weekStart = vm.week.format(appConfig.date.format);
      vm.weekEnd = moment(vm.week).add(4, 'days').format(appConfig.date.format);

      if(moment().isBetween(vm.week, moment(vm.week).add(4, 'days'))) {
        vm.day = moment().isoWeekday() - 1;
      } else {
        vm.day = 0;
      }

      activate();
    });

    function activate() {
      Loader.start();

      Orders
        .getUserOrders(vm.week.valueOf())
        .then(changeUserOrders)
        .then(Loader.stop);

      Menus
          .getMenus(vm.week.valueOf())
          .then(changeMenus);
    }

    function setNextWeek() {
      vm.week = moment(vm.week).add(1, 'weeks').startOf('isoWeek');
    }

    function setPrevWeek() {
      vm.week = moment(vm.week).subtract(1, 'weeks').startOf('isoWeek');
    }

    function getOrderedFoodForDay(user) {
      var day = vm.week.clone().add(vm.day, 'days').format(appConfig.date.format);

      var orderedMenuFood = _.find(user.menu_foods, function(menuFood) {
        return menuFood.menu && 
          (moment(menuFood.menu.date, appConfig.date.formatServer).format(appConfig.date.format) === day);
      });

      if(orderedMenuFood) {
        return orderedMenuFood;
      } else {
        return null;
      }
    }


    function getOrdersForDay(){
      var day = vm.week.clone().add(vm.day, 'days').format(appConfig.date.format);

      var menu = _.find(vm.state.menus, function(menu) {
        return moment(menu.date, appConfig.date.formatServer).format(appConfig.date.format) === day;
      });

      if(menu) {
        return menu.menu_foods;
      } else {
        return [];
      }
    }

    vm.changeFoodDialog = changeFoodDialog;
    vm.deleteOrder      = deleteOrder;

    function changeFoodDialog(id, ev) {

      var parentEl = angular.element(document.body);
      vm.dayOrders = getOrdersForDay();

      $mdDialog.show({
        parent: parentEl,
        targetEvent: ev,
        templateUrl: 'admin/food/change',
        controller: 'ChangeFoodCtrl as vm',
        clickOutsideToClose:true,
        locals: {
          orders: vm.dayOrders,
          id: id
        }
      }).then(function(order){
        Loader.start();
        Orders
          .changeOrder(order)
          .then(function(){
            refresh();
            Loader.stop();
          });
      });
    }

    function refresh() {
      Orders
        .getUserOrders(vm.week.valueOf())
        .then(changeUserOrders);

      Menus
          .getMenus(vm.week.valueOf())
          .then(changeMenus);
    }

    function deleteOrder(menuFoodId) {
      SweetAlert.swal({
        title: "Delete this order?",
        text: "Your will not be able to recover this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false,
        closeOnCancel: false,
        showLoaderOnConfirm: true
      }, function(deleteOrder) {
          if(deleteOrder){
            Loader.start();
            Orders
              .deleteUserOrder(menuFoodId)
              .then(function(){
                refresh();
                Loader.stop();
                SweetAlert.swal('Order deleted!');
              });
          } 
      });
    }



  }

})();