(function () {
  angular
    .module('Hungry.user.food')
    .controller('OrderFoodController', OrderFoodController);

  function OrderFoodController($scope, AppState, user, $window, appConfig) {
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

    vm.setNextWeek = setNextWeek;
    vm.setPrevWeek = setPrevWeek;

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

    activate();

    function activate() {
    }

    function setNextWeek() {
      vm.week = moment(vm.week).add(1, 'weeks').startOf('isoWeek');
    }

    function setPrevWeek() {
      vm.week = moment(vm.week).subtract(1, 'weeks').startOf('isoWeek');
    }

  }
})(); 