(function () {
  
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
      .state('app', {
        url: '',
        abstract: true,
        controller: 'AppController',
        resolve: {
          user: function(Users) {
            return Users.getUser(window.userId);
          }
        }
      })
      .state('app.home', {
        url: '/',
        templateUrl: 'home/home',
        role: 'user',
      });
  }

  function appRun ($rootScope, $state, Auth) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
      if (toState.role && !Auth.hasRole(toState.role)){
        $state.transitionTo("login");
        event.preventDefault(); 
      }
    });

    $rootScope.helpers = {
      hasRole: Auth.hasRole
    };
  }
  
  angular.module('Hungry.core.auth', []);
  angular.module('Hungry.core.state', []);
  angular.module('Hungry.core.app-state', []);
  angular.module('Hungry.core.config', []);
  angular.module('Hungry.core.api-helpers', []);
  angular.module('Hungry.core.url-replacer', []);
  angular.module('Hungry.core.api.users', []);
  angular.module('Hungry.app', []);

})(); 