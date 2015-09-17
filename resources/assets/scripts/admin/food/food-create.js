(function () {
  angular
    .module('Hungry.admin.food')
    .controller('FoodCreateController', FoodCreateController);

  function FoodCreateController($rootScope, $stateParams, AppState, Users, user, $window, Foods, $state, Loader) {
    var vm = this;

    var state = {};
    var changeFoods = AppState.change('foods');
    var isEdit = $stateParams.id;

    vm.state = state;
    vm.food = {
      description: '',
      image: ''
    };

    if(isEdit) {
      Foods
        .getFood($stateParams.id)
        .then(function(food) {
          vm.food = food;
        });
    }

    vm.isEdit = isEdit;

    vm.saveFood = saveFood;

    activate();

    function activate() {}

    function saveFood(food) {
      Loader.start();
      Foods.saveFood(food)
        .then(function() {
          Foods
            .getFoods()
            .then(changeFoods)
            .then(function() {
              Loader.stop();
              $state.go('app.food');
            });
        })
    }

  }
})(); 