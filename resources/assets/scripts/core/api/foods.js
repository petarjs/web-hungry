(function () {
  angular
    .module('Hungry.core.api.foods')
    .factory('Foods', FoodsFactory);

  function FoodsFactory($http, appConfig, UrlReplacer, ApiHelpers) {
    return {
      saveFood: saveFood,
      getFoods: getFoods
    };

    function saveFood(food) {
      var url = appConfig.api.concat('/admin/food/create');

      return $http.post(url, food).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }

    function getFoods() {
      var url = appConfig.api.concat('/admin/food');
      return $http.get(url).then(ApiHelpers.extractData, ApiHelpers.handleError);
    }
  }
})(); 