(function () {
  angular
    .module('Hungry.core.api.orders')
    .factory('Orders', OrdersFactory);

  function OrdersFactory($http, appConfig, UrlReplacer, ApiHelpers) { 
    return {
      getOrders: getOrders,
      orderMenuFood: orderMenuFood,
      getUserOrders: getUserOrders,
      changeUserOrder: changeUserOrder,
      deleteUserOrder: deleteUserOrder,
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

    function deleteUserOrder(menuFoodId){
      var url = appConfig.api.concat('/admin/orders/food/delete?id=:menu_food_id');
      var realUrl = UrlReplacer.replaceParams(url, {
        menu_food_id: menuFoodId
      });

      return $http.post(realUrl).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    function changeUserOrder(newId, oldId){
      var url = appConfig.api.concat('/admin/orders/food/change?new=:new_id&old=:old_id');
      var realUrl = UrlReplacer.replaceParams(url, {
        new_id: newId,
        old_id: oldId
      });

      return $http.post(realUrl).then(ApiHelpers.extractData, ApiHelpers.handleError);
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