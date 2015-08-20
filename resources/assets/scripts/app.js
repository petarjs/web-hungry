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
    $urlRouterProvider.otherwise('/login');
    // $locationProvider.html5Mode(true);

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