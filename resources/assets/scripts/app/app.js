(function () {
  angular
    .module('Hungry.app')
    .controller('AppController', AppController);

  function AppController(AppState, user, roles) {
    var vm = this;

    var state = {};
    var changeUser = AppState.change('user');
    var changeRoles = AppState.change('roles');

    AppState.listen('user', function(user) { state.user = user; });
    AppState.listen('roles', function(roles) { state.roles = roles; });

    activate();

    function activate() {
      changeUser(user);
      changeRoles(roles);
    }

  }
})(); 