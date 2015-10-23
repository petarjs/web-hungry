@extends('layouts.site')

@section('content')

<div class="ta-c">
  <h1>Account not approved</h1>

  <h3>Please wait for our admin to approve your account.</h3>

  <p>Note that this service is currently used only by Cosmic Development emplyees.</p>

  <a href="{{ action('Auth\AuthController@getLogin') }}" class="md-raised md-primary md-button md-default-theme">
    Login
  </a>
</div>

@stop