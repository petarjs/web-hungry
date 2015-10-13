(function () {
  'use strict';

  angular
    .module('Hungry.admin.orders')
    .controller('AdminOrdersController', AdminOrdersController);

  function AdminOrdersController($scope, Loader, Orders, appConfig, AppState) {
    var vm = this;

    var state = {};
    var changeUserOrders = AppState.change('userOrders');
    
    AppState.listen('userOrders', function(userOrders) { state.userOrders = userOrders; });

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
    }

    function setNextWeek() {
      vm.week = moment(vm.week).add(1, 'weeks').startOf('isoWeek');
    }

    function setPrevWeek() {
      vm.week = moment(vm.week).subtract(1, 'weeks').startOf('isoWeek');
    }

    function getOrderedFoodForDay(user) {
      var day = vm.week.clone().add(vm.day, 'days').format(appConfig.date.formatServer);

      var orderedMenuFood = _.find(user.menu_foods, function(menuFood) {
        return menuFood.menu && (menuFood.menu.date === day);
      });

      if(orderedMenuFood) {
        return orderedMenuFood;
      } else {
        return null;
      }
    }
  }

})();