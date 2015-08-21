(function () {

  angular.module('Hungry.core.auth', []);
  angular.module('Hungry.core.state', []);
  angular.module('Hungry.core.app-state', []);
  angular.module('Hungry.core.config', []);
  angular.module('Hungry.core.api-helpers', []);
  angular.module('Hungry.core.url-replacer', []);
  angular.module('Hungry.core.api.users', []);
  angular.module('Hungry.core.api.roles', []);
  angular.module('Hungry.app', []);
  angular.module('Hungry.super-admin.users', []);
  
  angular
    .module('Hungry', [
      'ui.router',
      'hungry.templates',

      'Hungry.core.auth',
      'Hungry.core.state',
      'Hungry.core.app-state',
      'Hungry.core.config',
      'Hungry.core.api-helpers',
      'Hungry.core.url-replacer',

      'Hungry.core.api.users',
      'Hungry.core.api.roles',

      'Hungry.app',
      'Hungry.super-admin.users'
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
      .state('app', {
        url: '/',
        abstract: true,
        template: '<div ui-view></div>',
        controller: 'AppController',
        resolve: {
          user: function(Users) {
            return Users.getUser(window.userId);
          },
          roles: function(Roles) {
            return Roles.getRoles();
          }
        }
      })
      .state('app.home', {
        url: '',
        templateUrl: 'home/home',
        role: 'user',
      })
      .state('app.users', {
        url: 'users',
        controller: 'UsersController as vm',
        templateUrl: 'super-admin/users/users',
        role: 'super-admin',
      });
  }

  function appRun ($rootScope, $state, Auth) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
      if (toState.role && !Auth.hasRole(toState.role)){
        $state.transitionTo("login");
        event.preventDefault(); 
      }
    });

    $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
      console.log(arguments);
    });

    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams){
      console.log(arguments);
    });

    $rootScope.helpers = {
      hasRole: Auth.hasRole
    };
  }

})(); 