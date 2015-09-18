@extends('layouts.site')

@section('content')

  <h1>Account not approved</h1>

  <h3>Please wait for admin to approve your account.</h3>

  <p>Note that this service is currently used only by Cosmic Dev emplyees.</p>

  <a href="{{ action('Auth\AuthController@getLogin') }}">
    Login
  </a>

@stop