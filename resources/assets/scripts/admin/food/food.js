(function () {
  angular
    .module('Hungry.admin.food')
    .controller('FoodController', FoodController);

  function FoodController(AppState, Users, user, $window, Foods) {
    var vm = this;

    var state = {};
    var changeUsers = AppState.change('users');
    var changeFoods = AppState.change('foods');

    vm.state = state;

    vm.isCurrentUser = isCurrentUser;
    vm.toggleRole = toggleRole;

    AppState.listen('users', function(users) { state.users = users; });
    AppState.listen('roles', function(roles) { state.roles = roles; });
    AppState.listen('foods', function(foods) { state.foods = foods; });

    activate();

    function activate() {
      Users
        .getUsers()
        .then(changeUsers);

      Foods
        .getFoods()
        .then(changeFoods);
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

  }
})(); 