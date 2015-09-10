(function () {
  angular
    .module('Hungry.admin.food')
    .controller('FoodCreateController', FoodCreateController);

  function FoodCreateController($rootScope, AppState, Users, user, $window, Foods, $state) {
    var vm = this;

    var state = {};
    var changeUsers = AppState.change('users');
    

    vm.state = state;
    vm.food = {
      description: '',
      image: ''
    };

    vm.isCurrentUser = isCurrentUser;
    vm.toggleRole = toggleRole;

    vm.saveFood = saveFood;

    AppState.listen('users', function(users) { state.users = users; });
    AppState.listen('roles', function(roles) { state.roles = roles; });

    $rootScope.$on('dropzone:uploaded', onImageUploaded);

    activate();

    function activate() {
      Users
        .getUsers()
        .then(changeUsers);
    }

    function isCurrentUser(user) {
      return user.id.toString() === $window.userId;
    }

    function toggleRole(user, role) {
      Users
        .toggleRole(user, role)
        .then(function(user) {
          var oldUser = _.findWhere(state.users, { id: user.id });
          oldUser.roles = user.roles;
          changeUsers(state.users);
        });
    }

    function saveFood(food) {

      var onFoodSaved = Foods.saveFood(food);
        onFoodSaved.then(function() {
          $state.go('app.food');
        });
    }

    function onImageUploaded(ev, response) {
      vm.food.image = response.url;
    }

  }
})(); 