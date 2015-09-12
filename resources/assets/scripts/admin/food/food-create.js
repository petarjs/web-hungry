(function () {
  angular
    .module('Hungry.admin.food')
    .controller('FoodCreateController', FoodCreateController);

  function FoodCreateController($rootScope, $stateParams, AppState, Users, user, $window, Foods, $state) {
    var vm = this;

    var state = {};
    var changeUsers = AppState.change('users');
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

    vm.isCurrentUser = isCurrentUser;
    vm.toggleRole = toggleRole;
    vm.isEdit = isEdit;

    vm.saveFood = saveFood;

    AppState.listen('users', function(users) { state.users = users; });
    AppState.listen('roles', function(roles) { state.roles = roles; });

    activate();

    function activate() {
      Users
        .getUsers()
        .then(changeUsers);
    }

    function isCurrentUser(user) {
      return user.id.toString() === $window.userId;
    }

    function toggleRole(user, role) {
      Users
        .toggleRole(user, role)
        .then(function(user) {
          var oldUser = _.findWhere(state.users, { id: user.id });
          oldUser.roles = user.roles;
          changeUsers(state.users);
        });
    }

    function saveFood(food) {
      vm.loading = true;
      var onFoodSaved = Foods.saveFood(food);
      onFoodSaved.then(function() {
        vm.loading = false;
        $state.go('app.food');
      });
    }

  }
})(); 