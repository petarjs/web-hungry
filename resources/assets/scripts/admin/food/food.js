(function () {
  angular
    .module('Hungry.admin.food')
    .controller('FoodController', FoodController);

  function FoodController(AppState, Users, user, $window, Foods, SweetAlert) {
    var vm = this;

    var state = {};
    var changeFoods = AppState.change('foods');

    vm.state = state;

    vm.deleteFood = deleteFood;

    AppState.listen('foods', function(foods) { state.foods = foods; });

    activate();

    function activate() {
      Foods
        .getFoods()
        .then(changeFoods);
    }

    function deleteFood(food) {
      SweetAlert.swal({
         title: "Delete this food?",
         text: "Your will not be able to recover this!",
         type: "warning",
         showCancelButton: true,
         confirmButtonColor: "#DD6B55",
         confirmButtonText: "Yes, delete it!",
         closeOnConfirm: false,
         showLoaderOnConfirm: true
      }, function(shouldDelete) {
        if(shouldDelete) {
          Foods
            .deleteFood(food)
            .then(function() {
              Foods
                .getFoods()
                .then(changeFoods)
                .then(function() {
                  SweetAlert.swal('Delete successful!');
                });
            });
        }
      });
    }

  }
})(); 