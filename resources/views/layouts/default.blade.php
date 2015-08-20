<!DOCTYPE html>
<html lang="en" ng-app="Hungry">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hungry</title>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.0/css/materialize.min.css">

  <!-- Fonts -->
  <link href='//fonts.googleapis.com/css?family=Roboto:400,300,800' rel='stylesheet' type='text/css'>
  <link href='//fonts.googleapis.com/css?family=Roboto+Slab:400,300,100,700' rel='stylesheet' type='text/css'>

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

    var api = '{{ URL::to('/') . "/api" }}';
  </script>
</head>
<body>
  <div class="container">
    <header class="header">
      <div class="__logo">
        HUNGRY
        <span class="__subtitle">Cosmic</span>
        <span class="right __menu">
          <a class="dropdown-button" href="#" data-activates="main-menu">
            <i class="__icon fa fa-ellipsis-v"></i>
          </a>
          <ul id='main-menu' class='dropdown-content'>
            <li><a ng-if="$root.helpers.hasRole('super-admin')" href="{{ action('SuperAdmin\UserController@getIndex') }}">Users</a></li>
            <li><a ng-if="$root.helpers.hasRole('admin')" href="{{ action('Admin\FoodController@getIndex') }}">Food</a></li>
            <li class="divider"></li>
            <li><a ng-if="$root.helpers.hasRole('user')" href="{{ action('Auth\AuthController@getLogout') }}">Logout</a></li>
          </ul>
        </span>
      </div>
    </header>

    <div ui-view></div>
  </div>

  <!-- Scripts -->
  <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.1/js/bootstrap.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/3.8.0/lodash.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.2/moment.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.0/js/materialize.min.js"></script>
  <script src="{{ asset('js/vendors.js') }}"></script>
  <script src="{{ asset('js/app.js') }}"></script>
  <script src="{{ asset('js/partials.js') }}"></script>
</body>
</html>
