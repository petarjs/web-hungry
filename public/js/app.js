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
  angular.module('Hungry.core.api.settings', []);
  angular.module('Hungry.app', []);
  angular.module('Hungry.super-admin.users', []);
  angular.module('Hungry.admin.food', []);
  angular.module('Hungry.admin.menus', []);
  angular.module('Hungry.admin.orders', []);
  angular.module('Hungry.admin.dashboard', []);
  angular.module('Hungry.admin.settings', []);
  angular.module('Hungry.admin.catering', []);
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
      'Hungry.core.api.settings',

      'Hungry.app',
      'Hungry.super-admin.users',
      'Hungry.admin.food',
      'Hungry.admin.menus',
      'Hungry.user.food',
      'Hungry.admin.orders',
      'Hungry.admin.dashboard',
      'Hungry.admin.settings',
      'Hungry.admin.catering'

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
          user: function(Users, Loader) {
            Loader.start();
            return Users.getUser(window.userId).then(function(r) { Loader.stop(); return r; });
          },
          roles: function(Roles, Loader) {
            Loader.start();
            return Roles.getRoles().then(function(r) { Loader.stop(); return r; });
          },
          foods: function(Foods, Loader) {
            Loader.start();
            return Foods.getFoods().then(function(r) { Loader.stop(); return r; });
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
      })

      .state('app.catering', {
        url: 'admin/catering/:week',
        controller: 'AdminCateringController as vm',
        templateUrl: 'admin/catering/catering',
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
      appConfig: appConfig,
      goHome: goHome
    };

    function getDayName(day) {
      return moment(day).format('ddd');
    }

    function getPhpWeek(week) {
      return week / 1000;
    }

    function goHome() {
      window.location.href = '/';
    }
  }

})(); 
(function () {
  angular
    .module('Hungry.app')
    .controller('AppController', AppController);

  function AppController(AppState, Auth, user, roles, foods, $state) {
    var vm = this;

    if(!user.roles || !user.roles.length) {
      window.location.href = '/auth/login';
    }

    if($state.is('app.home')) {
      if(Auth.hasRole('admin')) {
        $state.go('app.admin-dashboard');
      } else if(Auth.hasRole('user')) {
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
(function () {
  angular
    .module('Hungry.core.api-helpers')
    .service('ApiHelpers', ApiHelpers);

  function ApiHelpers() {
    return {
      extractData: extractData,
      handleError: handleError
    };

    function extractData(response) {
      return response.data;
    }

    function handleError(error) {
      console.log(error);
      return error;
    }
  }
})(); 
angular.module('Hungry.core.app-state').factory('AppState', function(StateService) {
  var state = {
    user: {},
    users: [],
    roles: [],
    foods: [],
    menus: [],
    orders: [],
    userOrders: [],
    foodOrders: [],
    usersIncompleteOrders: [],
    settings: {}
  };

  var listeners = [];

  var get    = StateService.get(state);
  var change = StateService.change(state, listeners);
  var listen = StateService.listen(state, listeners);

  return {
    get: get,
    change: change,
    listen: listen
  };
});
(function () {
  angular
    .module('Hungry.core.config')
    .constant('appConfig', {
      api: window.api,
      date: {
        format: 'DD.MM.YY.',
        formatServer: 'YYYY-MM-DD 00:00:00'
      }
    });

})(); 
angular.module('Hungry.core.state').factory('StateService', function() {
  var clone = R.clone;
  var curry = R.curry;
  var filter = R.filter;

  function get(state) {
    return function() {
      return clone(state);
    };
  }

  function getStateProp(state, prop) {
    return clone(state[prop]);
  }

  var change = curry(function(state, listeners, prop, data) {
    var sameProp = filter(function(l) { return l.prop === prop; });

    state[prop] = data;

    R.forEach(function(listener) {
      listener.action(getStateProp(state, listener.prop));
    }, sameProp(listeners));

    return getStateProp(state, prop);
  });

  var listen = curry(function(state, listeners, prop, action) {
    var listener = {prop: prop, action: action};
    listeners.push(listener);

    var unsubscribe = function() {
      return listeners.splice(listeners.indexOf(listener), 1);
    };

    action(getStateProp(state, prop));

    return unsubscribe;
  });

  return {
    get: get,
    change: change,
    listen: listen
  };
});
(function () {
  angular
    .module('Hungry.core.url-replacer')
    .service('UrlReplacer', UrlReplacer);

  function UrlReplacer() {
    var placeholderSymbol = ':';

    return {
      setPlaceholderSymbol: setPlaceholderSymbol,
      replaceParams: replaceParams
    }

    function setPlaceholderSymbol(symbol) {
      placeholderSymbol = symbol;
    };

    function replaceParams(url, data){
      var joinedKeys = _.map(_.keys(data), function(key) {
        return placeholderSymbol + key;
      }).join('|');
      var re = new RegExp(joinedKeys, 'gi');

      return url.replace(re, function(matched){
          return data[matched.replace(placeholderSymbol, '')];
      });
    };

  }
})(); 
(function () {
  angular
    .module('Hungry.user.food')
    .controller('OrderFoodController', OrderFoodController);

  function OrderFoodController($scope, AppState, user, $window, appConfig, Menus, Orders, $q, Loader) {
    var vm = this;

    var state = {};

    vm.state = state;
    vm.dayTabs = [{
      title: 'Mon'
    }, {
      title: 'Tue'
    }, {
      title: 'Wed'
    }, {
      title: 'Thu'
    }, {
      title: 'Fri'
    }];

    /**
     * Current week start date (monday)
     * @type Moment
     */
    vm.week = moment().add(1, 'week').startOf('isoWeek');
    vm.selectedTabIndex = moment().isoWeekday() - 1;

    vm.orderingAllowed = true;
    vm.orderDeadline = moment().add(4, 'days').endOf('day');
    if(moment().isAfter(vm.orderDeadline)) {
      vm.orderDeadline.add(1, 'week');
    }

    if(vm.selectedTabIndex > 4) {
      vm.week = vm.week.add(1, 'week');
      vm.selectedTabIndex = 0;
    }

    vm.setNextWeek = setNextWeek;
    vm.setPrevWeek = setPrevWeek;
    vm.getMenuFoodsForDay = getMenuFoodsForDay;
    vm.isOldMenu = isOldMenu;
    vm.orderMenuFood = orderMenuFood;
    vm.getOrderedForDay = getOrderedForDay;

    var changeMenus = AppState.change('menus');
    var changeOrders = AppState.change('orders');

    AppState.listen('menus', function(menus) { 
      state.menus = menus; 
      updateTabs();
    });
    AppState.listen('orders', function(orders) { 
      state.orders = orders;
      
      updateTabs();
    });

    $scope.$watch(function() {
      return vm.week;
    }, function() {
      vm.weekStart = vm.week.format(appConfig.date.format);
      vm.weekEnd = moment(vm.week).add(4, 'days').format(appConfig.date.format);

      var isCurrentWeek = moment().isBetween(vm.week, moment(vm.week).add(4, 'days'));

      if(isCurrentWeek) {
        vm.selectedTabIndex = moment().isoWeekday() - 1;
      } else {
        vm.selectedTabIndex = 0;
      }

      if(vm.week.isAfter(moment(), 'day')) {
        vm.orderingAllowed = true;
      } else {
        // vm.orderingAllowed = false;
      }

      activate();
    });

    function activate() {
      Loader.start();

      var menusLoading = Menus
        .getMenusForUser(vm.week.valueOf())
        .then(changeMenus);

      var ordersLoading = Orders
        .getOrders(vm.week.valueOf(), user)
        .then(changeOrders);

      $q
        .all([menusLoading, ordersLoading])
        .then(function() {
          Loader.stop();
        });
    }

    function setNextWeek() {
      vm.week = moment(vm.week).add(1, 'weeks').startOf('isoWeek');
    }

    function setPrevWeek() {
      vm.week = moment(vm.week).subtract(1, 'weeks').startOf('isoWeek');
    }

    function isOldMenu(menu) {
      return (parseInt(menu.week, 10) * 1000) < moment().startOf('isoWeek').valueOf();
    }

    function getMenuFoodsForDay(dayIndex) {
      var day = vm.week.clone().add(dayIndex, 'days').format(appConfig.date.format);
      var menu = _.find(vm.state.menus, function(menu) {
        return moment(menu.date, appConfig.date.formatServer).format(appConfig.date.format) === day;
      });

      if(menu) {
        return menu.menu_foods;
      } else {
        return [];
      }
    }

    function getOrderedForDay(dayIndex) {
      var day = vm.week.clone().add(dayIndex, 'days').format(appConfig.date.format);
      var ordered = _.find(vm.state.orders, function(menuFood) {
        return menuFood.menu && 
          (moment(menuFood.menu.date, appConfig.date.formatServer).format(appConfig.date.format) === day);
      });

      if(ordered) {
        return ordered;
      } else {
        return null;
      }
    }

    function orderMenuFood(menuFood) {
      Orders
        .orderMenuFood(menuFood, user)
        .then(changeOrders);
    }

    function updateTabs() {
      _.each(vm.dayTabs, function(tab, index) {
        tab.menuFoods = vm.getMenuFoodsForDay(index);
        tab.orderedForDay = getOrderedForDay(index);
      });
    }

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

    function hasRole (role, user) {
      if(!user) {
        return roles.indexOf(role) !== -1;
      } else {
        return !!_.findWhere(user.roles, {
          name: role
        });
      }
    }
  }
})(); 
(function () {
  angular
    .module('Hungry.core.api.foods')
    .factory('Foods', FoodsFactory);

  function FoodsFactory($http, appConfig, UrlReplacer, ApiHelpers) {
    return {
      saveFood: saveFood,
      getFoods: getFoods,
      getFood: getFood,
      deleteFood: deleteFood,
      toggleDefault: toggleDefault
    };

    function saveFood(food) {
      if(food.id) {
        return updateFood(food);
      } else {
        return createFood(food);
      }
    }

    function createFood(food) {
      var url = appConfig.api.concat('/admin/food/create');

      return $http.post(url, food).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    function updateFood(food) {
      var url = appConfig.api.concat('/admin/food/:id');
      var realUrl = UrlReplacer.replaceParams(url, {
        id: food.id
      });

      return $http.put(realUrl, food).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    function getFoods() {
      var url = appConfig.api.concat('/admin/food');
      return $http.get(url).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    function getFood(id) {
      var url = appConfig.api.concat('/admin/food/:id');
      var realUrl = UrlReplacer.replaceParams(url, {
        id: id
      });

      return $http.get(realUrl).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    function deleteFood(food) {
      var url = appConfig.api.concat('/admin/food/:id');
      var realUrl = UrlReplacer.replaceParams(url, {
        id: food.id
      });

      return $http.delete(realUrl).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    function toggleDefault(food) {
      var url = appConfig.api.concat('/admin/food/:id/toggle-default');
      var realUrl = UrlReplacer.replaceParams(url, {
        id: food.id
      });

      return $http
        .put(realUrl)
        .then(ApiHelpers.extractData, ApiHelpers.handleError)
        .then(function(updatedFood) {
          food.default = !food.default;
        });
    }
  }
})(); 
(function () {
  angular
    .module('Hungry.core.api.menus')
    .factory('Menus', MenusFactory);

  function MenusFactory($http, appConfig, UrlReplacer, ApiHelpers) {
    return {
      getMenus: getMenus,
      getMenusForUser: getMenusForUser,
      addFoodToMenu: addFoodToMenu,
      publishMenus: publishMenus,
      removeMenuFood: removeMenuFood
    };

    /**
     * Gets menus for a week specified by week
     * @param  {string} week - timestamp of the monday for a week
     */
    function getMenus(week) {
      var phpWeek = week/1000;
      var url = appConfig.api.concat('/admin/menus?week=:week');
      var realUrl = UrlReplacer.replaceParams(url, {
        week: phpWeek
      });
      return $http.get(realUrl).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    /**
     * Gets menus for a week for user
     * @param  {string} week - timestamp of the monday for a week
     */
    function getMenusForUser(week) {
      var phpWeek = week/1000;
      var url = appConfig.api.concat('/admin/menus/user?week=:week');
      var realUrl = UrlReplacer.replaceParams(url, {
        week: phpWeek
      });
      return $http.get(realUrl).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    function addFoodToMenu(menu, food) {
      var url = appConfig.api.concat('/admin/menus/:id?food_id=:foodId');
      var realUrl = UrlReplacer.replaceParams(url, {
        id: menu.id,
        foodId: food.id
      });
      return $http.put(realUrl).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    function publishMenus(week) {
      var phpWeek = week/1000;
      var url = appConfig.api.concat('/admin/menus/publish?week=:week');
      var realUrl = UrlReplacer.replaceParams(url, {
        week: phpWeek
      });
      return $http.post(realUrl).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    function removeMenuFood(menuFood) {
      var url = appConfig.api.concat('/admin/menus/food/:id');
      var realUrl = UrlReplacer.replaceParams(url, {
        id: menuFood.id
      });
      return $http.delete(realUrl).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }
  }
})(); 
(function () {
  angular
    .module('Hungry.core.api.orders')
    .factory('Orders', OrdersFactory);

  function OrdersFactory($http, appConfig, UrlReplacer, ApiHelpers) {
    return {
      getOrders: getOrders,
      orderMenuFood: orderMenuFood,
      getUserOrders: getUserOrders,
      getFoodOrdersForWeek: getFoodOrdersForWeek,
      getOrderNumbersForWeek: getOrderNumbersForWeek,
      getUsersWithIncompleteOrders: getUsersWithIncompleteOrders,
      getCateringEmail: getCateringEmail,
      sendCateringEmail: sendCateringEmail
    };

    function getOrders(week, user) {
      var phpWeek = week/1000;
      var url = appConfig.api.concat('/admin/orders?week=:week&user_id=:userId');
      var realUrl = UrlReplacer.replaceParams(url, {
        week: phpWeek,
        userId: user.id
      });

      return $http.get(realUrl).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    function orderMenuFood(menuFood, user) {
      var url = appConfig.api.concat('/admin/orders/create?menu_food_id=:menuFoodId&user_id=:userId');
      var realUrl = UrlReplacer.replaceParams(url, {
        menuFoodId: menuFood.id,
        userId: user.id
      });

      return $http.post(realUrl).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    function getUserOrders(week) {
      var phpWeek = week/1000;

      var url = appConfig.api.concat('/admin/orders/users?week=:week');
      var realUrl = UrlReplacer.replaceParams(url, {
        week: phpWeek,
      });

      return $http.get(realUrl).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    function getFoodOrdersForWeek(week) {
      var phpWeek = week/1000;
      
      var url = appConfig.api.concat('/admin/orders/food?week=:week');
      var realUrl = UrlReplacer.replaceParams(url, {
        week: phpWeek
      });

      return $http.get(realUrl).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    function getOrderNumbersForWeek(week) {
      var phpWeek = week/1000;

      var url = appConfig.api.concat('/admin/orders/numbers?week=:week');
      var realUrl = UrlReplacer.replaceParams(url, {
        week: phpWeek,
      });

      return $http.get(realUrl).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    function getUsersWithIncompleteOrders(week) {
      var phpWeek = week/1000;

      var url = appConfig.api.concat('/admin/orders/incomplete?week=:week');
      var realUrl = UrlReplacer.replaceParams(url, {
        week: phpWeek,
      });

      return $http.get(realUrl).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    function getCateringEmail(week) {
      var phpWeek = week/1000;

      var url = appConfig.api.concat('/admin/orders/get-catering-email?week=:week');
      var realUrl = UrlReplacer.replaceParams(url, {
        week: phpWeek,
      });

      return $http.get(realUrl).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    function sendCateringEmail(week) {
      var phpWeek = week/1000;

      var url = appConfig.api.concat('/admin/orders/send-catering-email?week=:week');
      var realUrl = UrlReplacer.replaceParams(url, {
        week: phpWeek,
      });

      return $http.get(realUrl).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }
  }
})(); 
(function () {
  angular
    .module('Hungry.core.api.roles')
    .factory('Roles', RolesFactory);

  function RolesFactory($http, appConfig, UrlReplacer, ApiHelpers) {
    return {
      getRoles: getRoles
    };

    function getRoles() {
      var url = appConfig.api.concat('/roles');
      return $http.get(url, {
        cache: true
      }).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }
  }
})(); 
(function () {
  angular
    .module('Hungry.core.api.settings')
    .factory('Settings', SettingsFactory);

  function SettingsFactory($http, appConfig, UrlReplacer, ApiHelpers) {
    return {
      getSettings: getSettings,
      setSettings: setSettings
    };

    function getSettings() {
      var url = appConfig.api.concat('/admin/settings');
      return $http.get(url, {
        cache: true
      }).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    function setSettings(settings) {
      var url = appConfig.api.concat('/admin/settings');
      return $http
        .post(url, settings)
        .then(ApiHelpers.extractData, ApiHelpers.handleError);
    }
  }
})(); 
(function () {
  angular
    .module('Hungry.core.api.users')
    .factory('Users', UsersFactory);

  function UsersFactory($http, appConfig, UrlReplacer, ApiHelpers) {
    return {
      getUser: getUser,
      getUsers: getUsers,
      toggleRole: toggleRole,
      deleteUser: deleteUser
    };

    function getUser(id) {
      var url = appConfig.api.concat('/users/:id');
      var realUrl = UrlReplacer.replaceParams(url, {
        id: id
      });

      return $http.get(realUrl).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    function getUsers() {
      var url = appConfig.api.concat('/users');
      return $http.get(url).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    function toggleRole(user, role) {
      var url = appConfig.api.concat('/users/:id/toggle-role/:roleId');
      var realUrl = UrlReplacer.replaceParams(url, {
        id: user.id,
        roleId: role.id
      });

      return $http.put(realUrl).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    function deleteUser(id) {
      var url = appConfig.api.concat('/users/:id');
      var realUrl = UrlReplacer.replaceParams(url, {
        id: id
      });

      return $http.delete(realUrl).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }
  }
})(); 
(function () {
  'use strict';

  angular
    .module('Hungry.core.loader')
    .service('Loader', LoaderService);

  function LoaderService($mdToast) {
    var toastConfig = {
      position: 'top right',
      parent: angular.element(document.body),
      templateUrl: 'core/loader/loader',
      hideDelay: false
    };

    var loaderCount = 0;

    return {
      start: start,
      stop: stop,
      isLoading: isLoading
    };

    function start() {
      if(loaderCount === 0) {
        $mdToast.show(toastConfig);
      }

      loaderCount++;
    }

    function stop() {
      if(loaderCount === 0) {
        return;
      }

      loaderCount--;

      if(loaderCount === 0) {
        $mdToast.hide();
      }
    }

    function isLoading() {
      return loaderCount > 0;
    }
  }
})(); 
(function () {
  angular
    .module('Hungry.admin.food')
    .controller('ChooseFoodController', ChooseFoodController);

  function ChooseFoodController($scope, AppState, Users, $window, Foods, SweetAlert, $mdDialog, appConfig, menu) {
    var vm = this;

    var state = {};
    var changeFoods = AppState.change('foods');

    vm.state = state;
    vm.menu = menu;
    vm.menuDate = moment(menu.date).format(appConfig.date.format)

    vm.hide = hide;
    vm.cancel = cancel;
    vm.selectFood = selectFood;
    vm.isAlreadySelected = isAlreadySelected;

    AppState.listen('foods', function(foods) { 
      vm.state.foods = foods; 
    });

    activate();

    function activate() {}

    function hide() {
      $mdDialog.hide();
    }

    function cancel() {
      $mdDialog.cancel();
    }

    function selectFood(food) {
      $mdDialog.hide(food);
    }

    function isAlreadySelected(food) {
      return _.some(menu.menu_foods, function(menuFood) {
        return menuFood.food.id === food.id;
      });
    }

  }
})(); 
(function () {
  angular
    .module('Hungry.admin.food')
    .controller('FoodCreateController', FoodCreateController);

  function FoodCreateController($rootScope, $stateParams, AppState, Users, user, $window, Foods, $state, Loader) {
    var vm = this;

    var state = {};
    var changeFoods = AppState.change('foods');
    var isEdit = $stateParams.id;

    vm.state = state;
    vm.food = {
      description: '',
      image: ''
    };

    if(isEdit) {
      Foods
        .getFood($stateParams.id)
        .then(function(food) {
          vm.food = food;
        });
    }

    vm.isEdit = isEdit;

    vm.saveFood = saveFood;

    activate();

    function activate() {}

    function saveFood(food) {
      Loader.start();
      Foods.saveFood(food)
        .then(function() {
          Foods
            .getFoods()
            .then(changeFoods)
            .then(function() {
              Loader.stop();
              $state.go('app.food');
            });
        })
    }

  }
})(); 
(function () {
  angular
    .module('Hungry.admin.food')
    .controller('FoodController', FoodController);

  function FoodController($scope, AppState, Users, user, $window, Foods, SweetAlert, Loader, $mdBottomSheet) {
    var vm = this;

    var state = {};
    var changeFoods = AppState.change('foods');

    vm.state = state;

    vm.deleteFood = deleteFood;
    vm.toggleDefault = toggleDefault;

    AppState.listen('foods', function(foods) { state.foods = foods; });

    activate();

    function activate() {
      Foods
        .getFoods()
        .then(changeFoods);
    }

    function deleteFood(food) {
      SweetAlert.swal({
         title: "Delete this food?",
         text: "Your will not be able to recover this!",
         type: "warning",
         showCancelButton: true,
         confirmButtonColor: "#DD6B55",
         confirmButtonText: "Yes, delete it!",
         closeOnConfirm: false,
         showLoaderOnConfirm: true
      }, function(shouldDelete) {
        if(shouldDelete) {
          Foods
            .deleteFood(food)
            .then(function() {
              Foods
                .getFoods()
                .then(changeFoods)
                .then(function() {
                  SweetAlert.swal('Delete successful!');
                });
            });
        }
      });
    }

    function toggleDefault(food) {
      Loader.start();

      Foods
        .toggleDefault(food)
        .then(Loader.stop);
    }

  }
})(); 
(function () {
  'use strict';

  angular
    .module('Hungry.admin.catering')
    .controller('AdminCateringController', AdminCateringController);

  function AdminCateringController($sce, Orders, $state, $stateParams, Loader, SweetAlert) {
    var vm = this;

    vm.trustedHtmlEmail = '';

    vm.sendEmail = sendEmail;
    vm.goToDashboard = goToDashboard;

    activate();

    function activate() {
      vm.week = $stateParams.week;
      getHtmlEmail(vm.week);
    }

    function getHtmlEmail(week) {
      Loader.start();
      Orders
        .getCateringEmail(week)
        .then(function(emailHtml) {
          vm.trustedHtmlEmail = $sce.trustAsHtml(emailHtml);
        })
        .then(Loader.stop);
    }

    function sendEmail(week) {

      if(Loader.isLoading()) {
        return;
      }

      SweetAlert.swal({
         title: "Send email to catering?",
         text: "Are you sure you want to send this order email to catering?",
         type: "warning",
         showCancelButton: true,
         confirmButtonColor: "#DD6B55",
         confirmButtonText: "Yes, send it!",
         closeOnConfirm: false,
         showLoaderOnConfirm: true
      }, function(shouldSend) {
        if(shouldSend) {
          Orders
            .sendCateringEmail(week)
            .then(function() {
              SweetAlert.swal('Email sent!');
            }, function() {
              SweetAlert.swal('Error!');
            });
        }
      });
    }

    function goToDashboard() {
      $state.go('app.admin-dashboard');
    }
  }
})(); 
(function () {
  angular
    .module('Hungry.admin.menus')
    .controller('MenuController', MenuController);

  function MenuController($scope, AppState, appConfig, user, $window, Foods, Menus, SweetAlert, $mdDialog, Loader) {
    var vm = this;

    var state = {};
    var changeUsers = AppState.change('users');
    var changeFoods = AppState.change('foods');
    var changeMenus = AppState.change('menus');
    vm.changeMenus = changeMenus;

    vm.state = state;
    vm.loading = false;
    vm.menusPublished = false;

    /**
     * Current week start date (monday)
     * @type Moment
     */
    vm.week = moment().add(1, 'week').startOf('isoWeek');

    vm.day = moment().isoWeekday() - 1;

    // if it's weekend, default to monday next week.
    if(vm.day > 4) {
      vm.week = vm.week.add(1, 'week');
    }

    vm.showFoodDialog = showFoodDialog;
    vm.setNextWeek = setNextWeek;
    vm.setPrevWeek = setPrevWeek;
    vm.publishMenus = publishMenus;
    vm.removeMenuFood = removeMenuFood;
    vm.isOldMenu = isOldMenu;

    AppState.listen('foods', function(foods) { state.foods = foods; });
    AppState.listen('menus', function(menus) { state.menus = menus; checkMenusPublished(); });

    $scope.$watch(function() {
      return vm.week;
    }, function() {
      vm.weekStart = vm.week.format(appConfig.date.format);
      vm.weekEnd = moment(vm.week).add(4, 'days').format(appConfig.date.format);
      activate();
    });

    function activate() {
      vm.loading = true;
      Loader.start();

      Menus
        .getMenus(vm.week.valueOf())
        .then(changeMenus)
        .then(function() { vm.loading = false; Loader.stop(); });
    }

    function setNextWeek() {
      vm.week = moment(vm.week).add(1, 'weeks').startOf('isoWeek');
    }

    function setPrevWeek() {
      vm.week = moment(vm.week).subtract(1, 'weeks').startOf('isoWeek');
    }

    function showFoodDialog(menu, ev) {
      $mdDialog.show({
        controller: 'ChooseFoodController as vm',
        templateUrl: 'admin/food/choose',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        locals: {
          menu: menu
        }
      })
      .then(function(food) {
        vm.loading = true;
        Loader.start();

        Menus
          .addFoodToMenu(menu, food)
          .then(changeMenus)
          .then(function() {
            vm.loading = false;
            Loader.stop();
          });
      }, function onUserCanceled() {
        
      });
    }

    function publishMenus(week) {
      SweetAlert.swal({
         title: "Publish menus for this week?",
         text: "When you publish the menus, users will be able to see them and order food.",
         type: "info",
         showCancelButton: true,
         confirmButtonText: "Publish",
         closeOnConfirm: false,
         showLoaderOnConfirm: true
      }, function(shouldPublish) {
        if(shouldPublish) {
          Menus
            .publishMenus(week)
            .then(vm.changeMenus)
            .then(function() {
              SweetAlert.swal('Menus published!');
            });
        }
      });
    }

    function checkMenusPublished() {
      vm.menusPublished = _.all(vm.state.menus, function(menu) {
        return menu.published;
      });
    }

    function removeMenuFood(menuFood) {
      vm.loading = true;
      Loader.start();

      Menus
        .removeMenuFood(menuFood)
        .then(vm.changeMenus)
        .then(function() {
          vm.loading = false;
          Loader.stop();
        });
    }

    function isOldMenu(menu) {
      return (parseInt(menu.week, 10) * 1000) < moment().startOf('isoWeek').valueOf();
    }

  }
})(); 
(function () {
  'use strict';

  angular
    .module('Hungry.admin.orders')
    .controller('AdminOrdersController', AdminOrdersController);

  function AdminOrdersController($scope, Loader, Orders, appConfig, AppState) {
    var vm = this;

    var state = {};
    var changeUserOrders = AppState.change('userOrders');
    
    AppState.listen('userOrders', function(userOrders) { state.userOrders = userOrders; });

    vm.state = state;

    vm.days = [{
      title: 'Mon'
    }, {
      title: 'Tue'
    }, {
      title: 'Wed'
    }, {
      title: 'Thu'
    }, {
      title: 'Fri'
    }];

    /**
     * Current week start date (monday)
     * @type Moment
     */
    vm.week = moment().add(1, 'week').startOf('isoWeek');

    vm.day = moment().isoWeekday() - 1;

    // if it's weekend, default to monday next week.
    if(vm.day > 4) {
      vm.week = vm.week.add(1, 'week');
      vm.day = 0;
    }

    vm.setNextWeek = setNextWeek;
    vm.setPrevWeek = setPrevWeek;
    vm.getOrderedFoodForDay = getOrderedFoodForDay;

    $scope.$watch(function() {
      return vm.week;
    }, function() {
      vm.weekStart = vm.week.format(appConfig.date.format);
      vm.weekEnd = moment(vm.week).add(4, 'days').format(appConfig.date.format);

      if(moment().isBetween(vm.week, moment(vm.week).add(4, 'days'))) {
        vm.day = moment().isoWeekday() - 1;
      } else {
        vm.day = 0;
      }

      activate();
    });

    function activate() {
      Loader.start();

      Orders
        .getUserOrders(vm.week.valueOf())
        .then(changeUserOrders)
        .then(Loader.stop);
    }

    function setNextWeek() {
      vm.week = moment(vm.week).add(1, 'weeks').startOf('isoWeek');
    }

    function setPrevWeek() {
      vm.week = moment(vm.week).subtract(1, 'weeks').startOf('isoWeek');
    }

    function getOrderedFoodForDay(user) {
      var day = vm.week.clone().add(vm.day, 'days').format(appConfig.date.format);

      var orderedMenuFood = _.find(user.menu_foods, function(menuFood) {
        return menuFood.menu && 
          (moment(menuFood.menu.date, appConfig.date.formatServer).format(appConfig.date.format) === day);
      });

      if(orderedMenuFood) {
        return orderedMenuFood;
      } else {
        return null;
      }
    }
  }

})();
(function () {
  'use strict';

  angular
    .module('Hungry.admin.dashboard')
    .controller('DashboardController', DashboardController);

  function DashboardController($scope, user, Orders, appConfig, AppState, Loader) {
    var vm = this;

    var state = {};
    vm.state = state;

    var changeFoodOrders = AppState.change('foodOrders');
    AppState.listen('foodOrders', function(foodOrders) { 
      state.foodOrders = foodOrders;
      vm.totalFoodOrders = getTotalOrdersNo(); 
    });

    var changeUsersIncompleteOrders = AppState.change('usersIncompleteOrders');
    AppState.listen('usersIncompleteOrders', function(usersIncompleteOrders) { 
      state.usersIncompleteOrders = usersIncompleteOrders; 
    });

    vm.user = user;

    /**
     * Number of orders for current week.
     * @type {Number}
     */
    vm.numOrders = 0;

    /**
     * Total needed orders for a week.
     * (number of users * 5 days in a week)
     * @type {Number}
     */
    vm.numTotalOrders = 0;

    vm.days = [{
      title: 'Mon'
    }, {
      title: 'Tue'
    }, {
      title: 'Wed'
    }, {
      title: 'Thu'
    }, {
      title: 'Fri'
    }];

    /**
     * Current week start date (monday)
     * @type Moment
     */
    vm.week = moment().startOf('isoWeek');

    vm.day = moment().isoWeekday() - 1;

    // if it's weekend, default to monday next week.
    if(vm.day > 4) {
      vm.week = vm.week.add(1, 'week');
      vm.day = 0;
    }

    vm.setNextWeek = setNextWeek;
    vm.setPrevWeek = setPrevWeek;
    vm.getNoOrdersForDay = getNoOrdersForDay;
    vm.getFoodOrdersForWeek = getFoodOrdersForWeek;
    vm.getFoodOrderPercentage = getFoodOrderPercentage;
    vm.getOrderNumbersForWeek = getOrderNumbersForWeek;
    vm.getUsersWithIncompleteOrders = getUsersWithIncompleteOrders;
    vm.sendMenuToCatering = sendMenuToCatering;

    $scope.$watch(function() {
      return vm.week;
    }, function() {
      vm.weekStart = vm.week.format(appConfig.date.format);
      vm.weekEnd = moment(vm.week).add(4, 'days').format(appConfig.date.format);

      if(moment().isBetween(vm.week, moment(vm.week).add(4, 'days'))) {
        vm.day = moment().isoWeekday() - 1;
      } else {
        vm.day = 0;
      }

      activate();
    });

    function activate() {
      vm.getOrderNumbersForWeek();
      vm.getFoodOrdersForWeek();
      vm.getUsersWithIncompleteOrders();
    }

    function setNextWeek() {
      vm.week = moment(vm.week).add(1, 'weeks').startOf('isoWeek');
    }

    function setPrevWeek() {
      vm.week = moment(vm.week).subtract(1, 'weeks').startOf('isoWeek');
    }

    function getNoOrdersForDay(week, day) {
      return day * 3 + 10;
    }

    function getFoodOrdersForWeek() {
      Loader.start();
      Orders
        .getFoodOrdersForWeek(vm.week.valueOf())
        .then(changeFoodOrders)
        .then(Loader.stop);
    }

    /**
     * Calculates percentage of orders of certain food
     * for the current week
     * @param  {Number} foodOrders number of orders of the specifed food
     * @return {Number}            percentage of orders, 0 <= x <= 100
     */
    function getFoodOrderPercentage(food) {
      if(!vm.totalFoodOrders || vm.totalFoodOrders === 0) {
        return 0;
      }
      return (food.num_orders / vm.totalFoodOrders) * 100;
    }

    function getTotalOrdersNo() {
      return _.sum(vm.state.foodOrders, 'num_orders');
    }

    function getOrderNumbersForWeek(week) {
      Loader.start();

      Orders
        .getOrderNumbersForWeek(vm.week.valueOf())
        .then(function(orderNumbers) {
          vm.numOrders = orderNumbers.num_orders;
          vm.numTotalOrders = orderNumbers.num_total_orders;
        })
        .then(Loader.stop);
    }
    
    function getUsersWithIncompleteOrders() {
      Loader.start();

      Orders
        .getUsersWithIncompleteOrders(vm.week.valueOf())
        .then(changeUsersIncompleteOrders)
        .then(Loader.stop);
    }
  }

  function sendMenuToCatering(week) {
    // TODO
  }
})(); 
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
(function () {
  'use strict';

  angular
    .module('Hungry.admin.settings')
    .controller('SettingsController', SettingsController);

  function SettingsController(Settings, AppState, Loader) {
    var vm = this;

    vm.state = {};

    var changeSettings = AppState.change('settings');
    AppState.listen('settings', function(settings) { vm.state.settings = settings; });

    vm.saveCateringEmail = saveCateringEmail;

    activate();

    function activate() {
      getSettings();
    }

    function saveCateringEmail(email) {
      Loader.start();
      Settings
        .setSettings({
          catering_email: email
        })
        .then(changeSettings)
        .then(Loader.stop);
    }

    function getSettings() {
      Loader.start();
      Settings
        .getSettings()
        .then(changeSettings)
        .then(Loader.stop);
    }
  }
})(); 