(function () {
  angular
    .module('Hungry.user.food')
    .controller('OrderFoodController', OrderFoodController);

  function OrderFoodController($scope, AppState, user, $window, appConfig, Menus, Orders, $q) {
    var vm = this;

    var state = {};

    vm.state = state;
    vm.dayTabs = [{
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
    vm.loading = false;
    vm.selectedTabIndex = moment().isoWeekday() - 1;

    vm.setNextWeek = setNextWeek;
    vm.setPrevWeek = setPrevWeek;
    vm.getMenuFoodsForDay = getMenuFoodsForDay;
    vm.isOldMenu = isOldMenu;
    vm.orderMenuFood = orderMenuFood;
    vm.getOrderedForDay = getOrderedForDay;
    vm.onDayTabSelected = onDayTabSelected;

    var changeMenus = AppState.change('menus');
    var changeOrders = AppState.change('orders');

    AppState.listen('menus', function(menus) { state.menus = menus; });
    AppState.listen('orders', function(orders) { 
      state.orders = orders;
      vm.orderedForDay = vm.getOrderedForDay(vm.selectedTabIndex);
    });

    $scope.$watch(function() {
      return vm.week;
    }, function() {
      vm.weekStart = vm.week.format(appConfig.date.format);
      vm.weekEnd = moment(vm.week).add(4, 'days').format(appConfig.date.format);

      if(moment().isBetween(vm.week, moment(vm.week).add(4, 'days'))) {
        vm.selectedTabIndex = moment().isoWeekday() - 1;
      } else {
        vm.selectedTabIndex = 0;
      }

      activate();
    });

    function activate() {
      vm.loading = true;

      var menusLoading = Menus
        .getMenusForUser(vm.week.valueOf())
        .then(changeMenus);

      var ordersLoading = Orders
        .getOrders(vm.week.valueOf(), user)
        .then(changeOrders);

      $q
        .all([menusLoading, ordersLoading])
        .then(function() {
          vm.loading = false;
        });
    }

    function setNextWeek() {
      vm.week = moment(vm.week).add(1, 'weeks').startOf('isoWeek');
    }

    function setPrevWeek() {
      vm.week = moment(vm.week).subtract(1, 'weeks').startOf('isoWeek');
    }

    function isOldMenu(menu) {
      return (parseInt(menu.week, 10) * 1000) < moment().startOf('isoWeek').valueOf();
    }

    function getMenuFoodsForDay(dayIndex) {
      var day = vm.week.clone().add(dayIndex, 'days').format(appConfig.date.formatServer);
      var menu = _.findWhere(vm.state.menus, {
        date: day
      });

      if(menu) {
        return menu.menu_foods;
      } else {
        return [];
      }
    }

    function getOrderedForDay(dayIndex) {
      var day = vm.week.clone().add(dayIndex, 'days').format(appConfig.date.formatServer);
      var ordered = _.find(vm.state.orders, function(menuFood) {
        return menuFood.menu.date === day;
      });

      if(ordered) {
        return ordered;
      } else {
        return null;
      }
    }

    function orderMenuFood(menuFood) {
      Orders
        .orderMenuFood(menuFood, user)
        .then(changeOrders);
    }

    function onDayTabSelected(index) {
      vm.orderedForDay = vm.getOrderedForDay(index);
    }

  }
})(); 