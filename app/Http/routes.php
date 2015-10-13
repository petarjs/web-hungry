<?php

date_default_timezone_set('Europe/Belgrade');
\Config::set('app.timezone', 'Europe/Belgrade');

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::controllers([
  'auth' => 'Auth\AuthController',
  'password' => 'Auth\PasswordController',
]);

Route::get('m', function() {
  return view('emails.menu-was-published', compact(Hungry\Models\User::first()));
});