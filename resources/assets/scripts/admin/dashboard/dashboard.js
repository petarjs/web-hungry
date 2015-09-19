(function () {
  'use strict';

  angular
    .module('Hungry.admin.dashboard')
    .controller('DashboardController', DashboardController);

  function DashboardController($scope, user, Loader, Orders, appConfig, AppState) {
    var vm = this;

    var state = {};
    vm.state = state;

    var changeFoodOrders = AppState.change('foodOrders');
    AppState.listen('foodOrders', function(foodOrders) { 
      state.foodOrders = foodOrders;
      vm.totalFoodOrders = getTotalOrdersNo(); 
    });

    vm.user = user;

    /**
     * Number of orders for current week.
     * @type {Number}
     */
    vm.numOrders = 0;

    /**
     * Total needed orders for a week.
     * (number of users * 5 days in a week)
     * @type {Number}
     */
    vm.numTotalOrders = 0;

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
    vm.week = moment().startOf('isoWeek');

    vm.day = moment().isoWeekday() - 1;

    // if it's weekend, default to monday next week.
    if(vm.day > 4) {
      vm.week = vm.week.add(1, 'week');
      vm.day = 0;
    }

    vm.setNextWeek = setNextWeek;
    vm.setPrevWeek = setPrevWeek;
    vm.getNoOrdersForDay = getNoOrdersForDay;
    vm.getFoodOrdersForWeek = getFoodOrdersForWeek;
    vm.getFoodOrderPercentage = getFoodOrderPercentage;
    vm.getOrderNumbersForWeek = getOrderNumbersForWeek;

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
      vm.getOrderNumbersForWeek();
      vm.getFoodOrdersForWeek();
    }

    function setNextWeek() {
      vm.week = moment(vm.week).add(1, 'weeks').startOf('isoWeek');
    }

    function setPrevWeek() {
      vm.week = moment(vm.week).subtract(1, 'weeks').startOf('isoWeek');
    }

    function getNoOrdersForDay(week, day) {
      return day * 3 + 10;
    }

    function getFoodOrdersForWeek() {
      Loader.start();
      Orders
        .getFoodOrdersForWeek(vm.week.valueOf())
        .then(changeFoodOrders)
        .then(Loader.stop);
    }

    /**
     * Calculates percentage of orders of certain food
     * for the current week
     * @param  {Number} foodOrders number of orders of the specifed food
     * @return {Number}            percentage of orders, 0 <= x <= 100
     */
    function getFoodOrderPercentage(food) {
      return (food.num_orders / vm.totalFoodOrders) * 100;
    }

    function getTotalOrdersNo() {
      return _.sum(vm.state.foodOrders, 'num_orders');
    }

    function getOrderNumbersForWeek(week) {
      Loader.start();

      Orders
        .getOrderNumbersForWeek(vm.week.valueOf())
        .then(function(orderNumbers) {
          vm.numOrders = orderNumbers.num_orders;
          vm.numTotalOrders = orderNumbers.num_total_orders;
        })
        .then(Loader.stop);
    }
  }

})(); 