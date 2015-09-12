(function () {
  angular
    .module('Hungry.admin.food')
    .controller('ChooseFoodController', ChooseFoodController);

  function ChooseFoodController(AppState, Users, $window, Foods, SweetAlert, $mdDialog) {
    var vm = this;

    var state = {};
    var changeFoods = AppState.change('foods');

    vm.state = state;

    vm.hide = hide;
    vm.cancel = cancel;
    vm.selectFood = selectFood;

    AppState.listen('foods', function(foods) { vm.state.foods = foods; });

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

  }
})(); 