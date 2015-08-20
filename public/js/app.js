(function () {
  
  angular
    .module('Hungry', [
      'ui.router',
      'hungry.templates',

      'Hungry.core.auth',
      'Hungry.app'
    ])
    .config(configureRoutes);

  function configureRoutes ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('login', {
        url: "/login",
        templateUrl: "login/login"
      })
      .state('home', {
        url: "/",
        templateUrl: "home/home"
      });
  }
  
  angular.module('Hungry.core.auth', []);
  angular.module('Hungry.app', []);
})(); 
(function () {
  angular
    .module('Hungry.app')
    .controller('AppController', AppController);

  function AppController(Auth) {
    var vm = this;

    vm.hasRole = Auth.hasRole;
  }
})(); 
(function () {
  angular
    .module('Hungry.core.auth')
    .service('Auth', Auth);

  function Auth ($window) {
    var roles = $window.roles.split(',');

    return {
      hasRole: hasRole
    };

    function hasRole (role) {
      return roles.indexOf(role) !== -1;
    }
  }
})(); 