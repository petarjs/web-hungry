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