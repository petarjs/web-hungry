angular.module('Hungry.core.app-state').factory('AppState', function(StateService) {
  var state = {
    user: {},
    users: [],
    roles: [],
    foods: [],
    menus: [],
    orders: [],
    userOrders: [],
    foodOrders: []
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