<!DOCTYPE html>
<html lang="en" ng-app="Hungry">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hungry</title>

  <!-- Fonts -->
  <link href='//fonts.googleapis.com/css?family=Roboto:400,300,800' rel='stylesheet' type='text/css'>
  <link href='//fonts.googleapis.com/css?family=Roboto+Slab:400,300,100,700' rel='stylesheet' type='text/css'>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.css">

  <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  <![endif]-->

  <link rel="stylesheet" href="{{ asset('css/vendors.css') }}"/>
  <link rel="stylesheet" href="{{ asset('css/app.css') }}"/>
  <script>
    var userId;
    var roles;
    @if(isset($user))
      userId = '{{ $user->id }}';
      roles = '{{ join($user->roles->lists('name')->toArray(), ",") }}';
    @endif

    var csrfToken = '{{ csrf_token() }}';

    var api = '{{ URL::to('/') . "/api" }}';
  </script>
</head>
<body>
  <div class="container">
    <header class="header" layout="row" layout-align="center center" layout-padding>
      <div class="__logo" flex="70" flex-sm="100" flex-md="80">
        <span class="cur-p" ng-click="$root.helpers.goHome()">
          HUNGRY
          <span class="__subtitle">Cosmic</span>
        </span>
        <span class="right __menu">
          <md-menu md-position-mode="target-right target">
            <md-button aria-label="Open menu" class="md-icon-button" ng-click="$mdOpenMenu($event)">
              <i class="material-icons">more_vert</i>
            </md-button>

            <md-menu-content width="4" ng-cloak>

              <md-menu-item ng-if="$root.helpers.hasRole('super-admin')" class="menu-header">
                <p flex>Super Admin</p>
              </md-menu-item>
              
              <md-menu-item ng-if="$root.helpers.hasRole('super-admin')">
                <md-button ui-sref="app.users">
                    <div layout="row" class="h100" layout-fill>
                      <p flex>Users</p>
                      <i class="material-icons">people</i>
                    </div>
                </md-button>
              </md-menu-item>

              <md-menu-item ng-if="$root.helpers.hasRole('admin')" class="menu-header">
                <p flex>Admin</p>
              </md-menu-item>

              <md-menu-item ng-if="$root.helpers.hasRole('admin')">
                <md-button ui-sref="app.admin-dashboard">
                    <div layout="row" class="h100" layout-fill>
                      <p flex>Dashboard</p>
                      <i class="material-icons">dashboard</i>
                    </div>
                </md-button>
              </md-menu-item>

              <md-menu-item ng-if="$root.helpers.hasRole('admin')">
                <md-button ui-sref="app.settings">
                    <div layout="row" class="h100" layout-fill>
                      <p flex>Settings</p>
                      <i class="material-icons">settings</i>
                    </div>
                </md-button>
              </md-menu-item>

              <md-menu-item ng-if="$root.helpers.hasRole('admin')">
                <md-button ui-sref="app.food">
                    <div layout="row" class="h100" layout-fill>
                      <p flex>Food</p>
                      <i class="material-icons">local_dining</i>
                    </div>
                </md-button>
              </md-menu-item>

              <md-menu-item ng-if="$root.helpers.hasRole('admin')">
                <md-button ui-sref="app.menus">
                    <div layout="row" class="h100" layout-fill>
                      <p flex>Menus</p>
                      <i class="material-icons">receipt</i>
                    </div>
                </md-button>
              </md-menu-item>

              <md-menu-item ng-if="$root.helpers.hasRole('admin')">
                <md-button ui-sref="app.orders">
                    <div layout="row" class="h100" layout-fill>
                      <p flex>Orders</p>
                      <i class="material-icons">reorder</i>
                    </div>
                </md-button>
              </md-menu-item>
              
              <md-menu-item ng-if="$root.helpers.hasRole('user')" class="menu-header">
                <p flex>User</p>
              </md-menu-item>

              <md-menu-item ng-if="$root.helpers.hasRole('user')">
                <md-button ui-sref="app.order-food">
                    <div layout="row" class="h100" layout-fill>
                      <p flex>Order Food</p>
                      <i class="material-icons">local_pizza</i>
                    </div>
                </md-button>
              </md-menu-item>

              <md-menu-item ng-if="$root.helpers.hasRole('user')">
                <md-button ng-href="{{ action('Auth\AuthController@getLogout') }}">
                  <div layout="row" class="h100" layout-fill>
                    <p flex>Logout</p>
                    <i class="material-icons">exit_to_app</i>
                  </div>
                </md-button>
              </md-menu-item>

            </md-menu-content>
          </md-menu>

        </span>
      </div>
    </header>
    
    <div layout="row" layout-align="center center" layout-padding>
      <div flex="70" flex-sm="100" flex-md="80" ui-view></div>
    </div>

    <div layout="row" layout-align="center center" class="footer" layout-padding>
      <div flex="70" flex-sm="100" flex-md="80" layout="row" layout-wrap>
        <div flex flex-sm="100">
          <h3>
            Made with lots of <i class="material-icons">favorite</i> and lots of <i class="material-icons">local_cafe</i> 
            <br>
            @ Cosmic Development!
          </h3>
        </div>
        <div flex flex-sm="100">
          <h3>Please contribute!</h3>
          <p>
            Request features, report bugs and develop your own code! <i class="material-icons">bug_report</i>
          </p>
          <a href="https://github.com/petarslovic/web-hungry">https://github.com/petarslovic/web-hungry</a>
          <br><br>
          <b>We're open source and open to pull requests!</b>
        </div>
      </div>
    </div>
  </div>

  <!-- Scripts -->
  <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.1/js/bootstrap.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/3.8.0/lodash.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.2/moment.min.js"></script>
  <script src="{{ asset('js/vendors.js') }}"></script>
  <script src="{{ asset('js/app.js') }}"></script>
  <script src="{{ asset('js/partials.js') }}"></script>
</body>
</html>
