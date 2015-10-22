(function () {
  angular
    .module('Hungry.super-admin.users')
    .controller('UsersController', UsersController);

  function UsersController(AppState, Users, user, $window, Loader) {
    var vm = this;

    var state = {};
    var changeUsers = AppState.change('users');

    vm.state = state;

    vm.isCurrentUser = isCurrentUser;
    vm.toggleRole = toggleRole;
    vm.deleteUser = deleteUser;

    AppState.listen('users', function(users) { state.users = users; });
    AppState.listen('roles', function(roles) { state.roles = roles; });

    activate();

    function activate() {
      Loader.start();
      Users
        .getUsers()
        .then(changeUsers)
        .then(Loader.stop);
    }

    function isCurrentUser(user) {
      return user.id.toString() === $window.userId;
    }

    function toggleRole(user, role) {
      Loader.start();
      Users
        .toggleRole(user, role)
        .then(function(user) {
          var oldUser = _.findWhere(state.users, { id: user.id });
          oldUser.roles = user.roles;
          changeUsers(state.users);
        })
        .then(Loader.stop);
    }

    function deleteUser(user) {
      Loader.start();
      Users
        .deleteUser(user.id)
        .then(changeUsers)
        .then(Loader.stop);
    }

  }
})(); 