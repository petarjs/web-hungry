(function () {
  angular
    .module('Hungry.user.food')
    .controller('OrderFoodController', OrderFoodController);

  function OrderFoodController($scope, AppState, user, $window, appConfig, Menus) {
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

    var changeMenus = AppState.change('menus');
    AppState.listen('menus', function(menus) { state.menus = menus; });

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

      Menus
        .getMenusForUser(vm.week.valueOf())
        .then(changeMenus)
        .then(function() { vm.loading = false; });
    }

    function setNextWeek() {
      vm.week = moment(vm.week).add(1, 'weeks').startOf('isoWeek');
    }

    function setPrevWeek() {
      vm.week = moment(vm.week).subtract(1, 'weeks').startOf('isoWeek');
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

  }
})(); 