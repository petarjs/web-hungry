(function () {
  angular
    .module('Hungry.app')
    .controller('AppController', AppController);

  function AppController(AppState, user) {
    var vm = this;

    var state = {};
    var changeUser = AppState.change('user');

    AppState.listen('user', function(user) { state.user = user; });

    activate();

    function activate() {
      changeUser(user);
    }

  }
})(); 