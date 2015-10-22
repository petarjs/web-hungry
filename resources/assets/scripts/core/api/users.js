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