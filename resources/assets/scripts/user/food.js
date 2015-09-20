(function () {
  angular
    .module('Hungry.user.food')
    .controller('OrderFoodController', OrderFoodController);

  function OrderFoodController($scope, AppState, user, $window, appConfig, Menus, Orders, $q, Loader) {
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
    vm.selectedTabIndex = moment().isoWeekday() - 1;

    vm.orderingAllowed = true;
    vm.orderDeadline = vm.orderDeadline = moment(vm.week).add(4, 'days').endOf('day');
    if(moment().isAfter(vm.orderDeadline)) {
      vm.orderDeadline.add(1, 'week');
    }

    if(vm.selectedTabIndex > 4) {
      vm.week = vm.week.add(1, 'week');
      vm.selectedTabIndex = 0;
    }

    vm.setNextWeek = setNextWeek;
    vm.setPrevWeek = setPrevWeek;
    vm.getMenuFoodsForDay = getMenuFoodsForDay;
    vm.isOldMenu = isOldMenu;
    vm.orderMenuFood = orderMenuFood;
    vm.getOrderedForDay = getOrderedForDay;

    var changeMenus = AppState.change('menus');
    var changeOrders = AppState.change('orders');

    AppState.listen('menus', function(menus) { 
      state.menus = menus; 
      updateTabs();
    });
    AppState.listen('orders', function(orders) { 
      state.orders = orders;
      
      updateTabs();
    });

    $scope.$watch(function() {
      return vm.week;
    }, function() {
      vm.weekStart = vm.week.format(appConfig.date.format);
      vm.weekEnd = moment(vm.week).add(4, 'days').format(appConfig.date.format);

      var isCurrentWeek = moment().isBetween(vm.week, moment(vm.week).add(4, 'days'));

      if(isCurrentWeek) {
        vm.selectedTabIndex = moment().isoWeekday() - 1;
      } else {
        vm.selectedTabIndex = 0;
      }

      if(isCurrentWeek || vm.week.isAfter(moment(), 'day')) {
        vm.orderingAllowed = true;
      } else {
        vm.orderingAllowed = false;
      }

      vm.orderDeadline = moment(vm.week).add(4, 'days').endOf('day');
      if(moment().isAfter(vm.orderDeadline)) {
        vm.orderDeadline.add(1, 'week');
      }

      activate();
    });

    function activate() {
      Loader.start();

      var menusLoading = Menus
        .getMenusForUser(vm.week.valueOf())
        .then(changeMenus);

      var ordersLoading = Orders
        .getOrders(vm.week.valueOf(), user)
        .then(changeOrders);

      $q
        .all([menusLoading, ordersLoading])
        .then(function() {
          Loader.stop();
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
        return menuFood.menu && (menuFood.menu.date === day);
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

    function updateTabs() {
      _.each(vm.dayTabs, function(tab, index) {
        tab.menuFoods = vm.getMenuFoodsForDay(index);
        tab.orderedForDay = getOrderedForDay(index);
      });
    }

  }
})(); 