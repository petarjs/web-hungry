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
  // \Event::fire(new Hungry\Events\UserWasRegistered(Hungry\Models\User::first()));
  // \Event::fire(new Hungry\Events\MenuWasPublished(Hungry\Models\Menu::first()));
  // \Event::fire(new Hungry\Events\UserWasApproved(Hungry\Models\User::find(5)));
});

Route::get('t', function() {
  // return \Hungry\Models\Menu::getCateringEmailData(1445814000);
  $week = \Input::get('week');
  $date = Carbon\Carbon::createFromTimeStamp($week);
  $dateFormatted = $date->copy()->format('d.m.Y');
  $dateFormatted2 = $date->copy()->addDays(4)->format('d.m.Y');

  $users = Hungry\Models\User::getWeekPrintData($date);

  return Hungry\Models\User::first()->eatenFood;
  return $users;
});