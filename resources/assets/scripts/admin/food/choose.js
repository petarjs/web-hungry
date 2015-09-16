(function () {
  angular
    .module('Hungry.admin.food')
    .controller('ChooseFoodController', ChooseFoodController);

  function ChooseFoodController($scope, AppState, Users, $window, Foods, SweetAlert, $mdDialog, appConfig, menu) {
    var vm = this;

    var state = {};
    var changeFoods = AppState.change('foods');

    vm.state = state;
    vm.menu = menu;
    vm.menuDate = moment(menu.date).format(appConfig.date.format)

    vm.hide = hide;
    vm.cancel = cancel;
    vm.selectFood = selectFood;
    vm.isAlreadySelected = isAlreadySelected;

    AppState.listen('foods', function(foods) { 
      vm.state.foods = foods; 
      vm.foodsDisplay = filterSelectedFoods(vm.state.foods); 
    });

    activate();

    function activate() {}

    function hide() {
      $mdDialog.hide();
    }

    function cancel() {
      $mdDialog.cancel();
    }

    function selectFood(food) {
      $mdDialog.hide(food);
    }

    function filterSelectedFoods(foods) {
      return _.filter(foods, function(food) {
        var alreadyInMenu = _.some(menu.menu_foods, function(menuFood) {
          return menuFood.food.id === food.id;
        });

        return !alreadyInMenu;
      });
    }

    function isAlreadySelected(food) {
      return _.some(menu.menu_foods, function(menuFood) {
        return menuFood.food.id === food.id;
      });
    }

  }
})(); 