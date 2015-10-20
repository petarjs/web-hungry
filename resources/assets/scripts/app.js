(function () {

  angular.module('Hungry.core.auth', []);
  angular.module('Hungry.core.state', []);
  angular.module('Hungry.core.app-state', []);
  angular.module('Hungry.core.config', []);
  angular.module('Hungry.core.loader', []);
  angular.module('Hungry.core.api-helpers', []);
  angular.module('Hungry.core.url-replacer', []);
  angular.module('Hungry.core.api.users', []);
  angular.module('Hungry.core.api.roles', []);
  angular.module('Hungry.core.api.foods', []);
  angular.module('Hungry.core.api.menus', []);
  angular.module('Hungry.core.api.orders', []);
  angular.module('Hungry.app', []);
  angular.module('Hungry.super-admin.users', []);
  angular.module('Hungry.admin.food', []);
  angular.module('Hungry.admin.menus', []);
  angular.module('Hungry.admin.orders', []);
  angular.module('Hungry.admin.dashboard', []);
  angular.module('Hungry.admin.settings', []);
  angular.module('Hungry.user.food', []);
  
  angular
    .module('Hungry', [
      'ui.router',
      'file-data-url',
      'oitozero.ngSweetAlert',
      'hungry.templates',
      'ngMaterial',
      'angular-svg-round-progress',
      'timer',

      'Hungry.core.auth',
      'Hungry.core.state',
      'Hungry.core.app-state',
      'Hungry.core.config',
      'Hungry.core.loader',
      'Hungry.core.api-helpers',
      'Hungry.core.url-replacer',

      'Hungry.core.api.users',
      'Hungry.core.api.roles',
      'Hungry.core.api.foods',
      'Hungry.core.api.menus',
      'Hungry.core.api.orders',

      'Hungry.app',
      'Hungry.super-admin.users',
      'Hungry.admin.food',
      'Hungry.admin.menus',
      'Hungry.user.food',
      'Hungry.admin.orders',
      'Hungry.admin.dashboard',
      'Hungry.admin.settings'

    ])
    .config(configure)
    .run(appRun);

  function configure ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $mdThemingProvider) {
    $urlRouterProvider.otherwise('/');
    $urlMatcherFactoryProvider.strictMode(false);

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
          },
          foods: function(Foods) {
            return Foods.getFoods();
          }
        }
      })

      .state('app.home', {
        url: '',
        templateUrl: 'home/home',
        role: '',
      })
      
      .state('app.admin-dashboard', {
        url: 'admin/dashboard',
        controller: 'DashboardController as vm',
        templateUrl: 'admin/dashboard/dashboard',
        role: 'admin',
      })
      
      .state('app.settings', {
        url: 'admin/settings',
        controller: 'SettingsController as vm',
        templateUrl: 'admin/settings/settings',
        role: 'admin',
      })
      
      .state('app.users', {
        url: 'users',
        controller: 'UsersController as vm',
        templateUrl: 'super-admin/users/users',
        role: 'super-admin',
      })
      
      .state('app.food', {
        url: 'food',
        controller: 'FoodController as vm',
        templateUrl: 'admin/food/food',
        role: 'admin',
      })
      
      .state('app.food-create', {
        url: 'food/create',
        controller: 'FoodCreateController as vm',
        templateUrl: 'admin/food/create',
        role: 'admin',
      })
      
      .state('app.food-edit', {
        url: 'food/edit/:id',
        controller: 'FoodCreateController as vm',
        templateUrl: 'admin/food/create',
        role: 'admin',
      })

      .state('app.menus', {
        url: 'menus',
        controller: 'MenuController as vm',
        templateUrl: 'admin/menu/menu',
        role: 'admin',
      })

      .state('app.order-food', {
        url: 'order-food',
        controller: 'OrderFoodController as vm',
        templateUrl: 'user/food',
        role: 'user',
      })

      .state('app.orders', {
        url: 'admin/orders',
        controller: 'AdminOrdersController as vm',
        templateUrl: 'admin/orders/orders',
        role: 'admin',
      });

      $mdThemingProvider.theme('default')
          .primaryPalette('orange')
          .accentPalette('lime');
  }

  function appRun ($rootScope, $state, Auth, $http, $window, appConfig, Loader) {
    $http.defaults.headers.common['X-CSRF-TOKEN'] = $window.csrfToken;
    
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
      hasRole: Auth.hasRole,
      getDayName: getDayName,
      size: _.size,
      loader: Loader,
      getPhpWeek: getPhpWeek,
      appConfig: appConfig
    };

    function getDayName(day) {
      return moment(day).format('ddd');
    }

    function getPhpWeek(week) {
      return week / 1000;
    }
  }

})(); 