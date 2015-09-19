(function () {
  angular
    .module('Hungry.app')
    .controller('AppController', AppController);

  function AppController(AppState, user, roles, foods, $state) {
    var vm = this;

    if(!user.roles || !user.roles.length) {
      window.location.href = '/auth/login';
    }

    if($state.is('app.home')) {
      if(user.roles.indexOf('admin') !== 0) {
        $state.go('app.admin-dashboard');
      } else if(user.roles.indexOf('user') !== 0) {
        $state.go('app.order-food');
      }
    }

    var state = {};
    var changeUser = AppState.change('user');
    var changeRoles = AppState.change('roles');
    var changeFoods = AppState.change('foods');

    AppState.listen('user', function(user) { state.user = user; });
    AppState.listen('roles', function(roles) { state.roles = roles; });
    AppState.listen('foods', function(foods) { state.foods = foods; });

    activate();

    function activate() {
      changeUser(user);
      changeRoles(roles);
      changeFoods(foods);
    }

  }
})(); 