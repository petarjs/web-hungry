(function () {
  angular
    .module('Hungry.admin.menus')
    .controller('MenuController', MenuController);

  function MenuController($scope, $q, AppState, appConfig, user, $window, Foods, Menus, SweetAlert, $mdDialog) {
    var vm = this;

    var state = {};
    var changeUsers = AppState.change('users');
    var changeFoods = AppState.change('foods');
    var changeMenus = AppState.change('menus');

    vm.state = state;
    vm.loading = false;

    /**
     * Current week start date (monday)
     * @type Moment
     */
    vm.week = moment().startOf('isoWeek');

    vm.showFoodDialog = showFoodDialog;

    AppState.listen('foods', function(foods) { state.foods = foods; });
    AppState.listen('menus', function(menus) { state.menus = menus; });

    $scope.$watch(function() {
      return vm.week;
    }, function() {
      vm.weekStart = vm.week.format(appConfig.date.format);
      vm.weekEnd = vm.week.add(4, 'days').format(appConfig.date.format);
    });

    activate();

    function activate() {
      vm.loading = true;

      var foodsLoading = Foods
        .getFoods()
        .then(changeFoods);

      var menusLoading = Menus
        .getMenus(vm.week.valueOf())
        .then(changeMenus);

      $q.all([foodsLoading, menusLoading]).then(function() { vm.loading = false; });
    }

    function setNextWeek() {
      vm.week = vm.week.add(1, 'weeks').startOf('isoWeek');
    }

    function setPrevWeek() {
      vm.week = vm.week.subtract(1, 'weeks').startOf('isoWeek');
    }

    function showFoodDialog(menu, ev) {
      $mdDialog.show({
        controller: 'ChooseFoodController as vm',
        templateUrl: 'admin/food/choose',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        locals: {
          menu: menu
        }
      })
      .then(function(food) {
        vm.loading = true;
        Menus
          .addFoodToMenu(menu, food)
          .then(changeMenus)
          .then(function() {
            vm.loading = false;
          });
      }, function onUserCanceled() {
        
      });
    }

  }
})(); 