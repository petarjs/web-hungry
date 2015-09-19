(function () {
  angular
    .module('Hungry.admin.menus')
    .controller('MenuController', MenuController);

  function MenuController($scope, AppState, appConfig, user, $window, Foods, Menus, SweetAlert, $mdDialog, Loader) {
    var vm = this;

    var state = {};
    var changeUsers = AppState.change('users');
    var changeFoods = AppState.change('foods');
    var changeMenus = AppState.change('menus');
    vm.changeMenus = changeMenus;

    vm.state = state;
    vm.loading = false;
    vm.menusPublished = false;

    /**
     * Current week start date (monday)
     * @type Moment
     */
    vm.week = moment().startOf('isoWeek');

    vm.day = moment().isoWeekday() - 1;

    // if it's weekend, default to monday next week.
    if(vm.day > 4) {
      vm.week = vm.week.add(1, 'week');
    }

    vm.showFoodDialog = showFoodDialog;
    vm.setNextWeek = setNextWeek;
    vm.setPrevWeek = setPrevWeek;
    vm.publishMenus = publishMenus;
    vm.removeMenuFood = removeMenuFood;
    vm.isOldMenu = isOldMenu;

    AppState.listen('foods', function(foods) { state.foods = foods; });
    AppState.listen('menus', function(menus) { state.menus = menus; checkMenusPublished(); });

    $scope.$watch(function() {
      return vm.week;
    }, function() {
      vm.weekStart = vm.week.format(appConfig.date.format);
      vm.weekEnd = moment(vm.week).add(4, 'days').format(appConfig.date.format);
      activate();
    });

    function activate() {
      vm.loading = true;
      Loader.start();

      Menus
        .getMenus(vm.week.valueOf())
        .then(changeMenus)
        .then(function() { vm.loading = false; Loader.stop(); });
    }

    function setNextWeek() {
      vm.week = moment(vm.week).add(1, 'weeks').startOf('isoWeek');
    }

    function setPrevWeek() {
      vm.week = moment(vm.week).subtract(1, 'weeks').startOf('isoWeek');
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
        Loader.start();

        Menus
          .addFoodToMenu(menu, food)
          .then(changeMenus)
          .then(function() {
            vm.loading = false;
            Loader.stop();
          });
      }, function onUserCanceled() {
        
      });
    }

    function publishMenus(week) {
      SweetAlert.swal({
         title: "Publish menus for this week?",
         text: "When you publish the menus, users will be able to see them and order food.",
         type: "info",
         showCancelButton: true,
         confirmButtonText: "Publish",
         closeOnConfirm: false,
         showLoaderOnConfirm: true
      }, function(shouldPublish) {
        if(shouldPublish) {
          Menus
            .publishMenus(week)
            .then(vm.changeMenus)
            .then(function() {
              SweetAlert.swal('Menus published!');
            });
        }
      });
    }

    function checkMenusPublished() {
      vm.menusPublished = _.all(vm.state.menus, function(menu) {
        return menu.published;
      });
    }

    function removeMenuFood(menuFood) {
      vm.loading = true;
      Loader.start();

      Menus
        .removeMenuFood(menuFood)
        .then(vm.changeMenus)
        .then(function() {
          vm.loading = false;
          Loader.stop();
        });
    }

    function isOldMenu(menu) {
      return (parseInt(menu.week, 10) * 1000) < moment().startOf('isoWeek').valueOf();
    }

  }
})(); 