(function () {
  angular
    .module('Hungry.core.api.orders')
    .factory('Orders', OrdersFactory);

  function OrdersFactory($http, appConfig, UrlReplacer, ApiHelpers) {
    return {
      getOrders: getOrders,
      orderMenuFood: orderMenuFood,
      getUserOrders: getUserOrders,
      getFoodOrdersForDay: getFoodOrdersForDay
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

    function getFoodOrdersForDay(day) {
      var url = appConfig.api.concat('/admin/orders/food?day=:day');
      var realUrl = UrlReplacer.replaceParams(url, {
        day: day,
      });

      return $http.get(realUrl).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }
  }
})(); 