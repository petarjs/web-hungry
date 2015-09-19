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
    vm.totalUsers = 50;

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
    vm.getFoodOrdersForDay = getFoodOrdersForDay;
    vm.getFoodOrderPercentage = getFoodOrderPercentage;

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

    $scope.$watch(function() {
      return vm.day;
    }, function() {
      vm.getFoodOrdersForDay();
    });

    function activate() {
      
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

    function getFoodOrdersForDay() {
      var day = vm.week.clone().add(vm.day, 'days').format(appConfig.date.formatServer);

      Loader.start();
      Orders
        .getFoodOrdersForDay(day)
        .then(changeFoodOrders)
        .then(Loader.stop);
    }

    /**
     * Calculates percentage of orders of certain food
     * for the current day
     * @param  {Number} foodOrders number of orders of the specifed food
     * @return {Number}            percentage of orders, 0 <= x <= 100
     */
    function getFoodOrderPercentage(foodOrders) {
      console.log(foodOrders, vm.totalFoodOrders, foodOrders / vm.totalFoodOrders);
      return (foodOrders / vm.totalFoodOrders) * 100;
    }

    function getTotalOrdersNo() {
      return _.sum(vm.state.foodOrders, function(food) {
        return food.users.length;
      });
    }
  }

})(); 