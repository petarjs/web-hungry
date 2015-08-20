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
    users: []
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
      api: window.api
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
    .module('Hungry.core.api.users')
    .factory('Users', UsersFactory);

  function UsersFactory($http, appConfig, UrlReplacer, ApiHelpers) {
    return {
      getUser: getUser,
      getUsers: getUsers
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