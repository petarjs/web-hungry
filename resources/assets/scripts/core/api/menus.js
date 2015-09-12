(function () {
  angular
    .module('Hungry.core.api.menus')
    .factory('Menus', MenusFactory);

  function MenusFactory($http, appConfig, UrlReplacer, ApiHelpers) {
    return {
      getMenus: getMenus,
      addFoodToMenu: addFoodToMenu,
      publishMenu: publishMenu
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

    function addFoodToMenu(menu, food) {
      var url = appConfig.api.concat('/admin/menus/:id?food_id=:foodId');
      var realUrl = UrlReplacer.replaceParams(url, {
        id: menu.id,
        foodId: food.id
      });
      return $http.put(realUrl).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    function publishMenu(menu) {
      var url = appConfig.api.concat('/admin/menus/:id/publish');
      var realUrl = UrlReplacer.replaceParams(url, {
        id: menu.id
      });
      return $http.post(realUrl).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }
  }
})(); 