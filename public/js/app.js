(function () {
  
  angular
    .module('Hungry', [
      'ui.router',
      'hungry.templates',

      'Hungry.core.auth',
      'Hungry.app'
    ])
    .config(configureRoutes)
    .run(appRun);

  function configureRoutes ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'login/login',
        role: ''
      })
      .state('home', {
        url: '/',
        templateUrl: 'home/home',
        role: 'user'
      });
  }

  function appRun ($rootScope, $state, Auth) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
      if (toState.role && !Auth.hasRole(toState.role)){
        // User isn’t authenticated
        $state.transitionTo("login");
        event.preventDefault(); 
      }
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
    var roles = $window.roles ? $window.roles.split(',') : [];

    return {
      hasRole: hasRole
    };

    function hasRole (role) {
      return roles.indexOf(role) !== -1;
    }
  }
})(); 