<?php

namespace Hungry\Http\Controllers;

use Illuminate\Http\Request;

use Hungry\Http\Requests;
use Hungry\Http\Controllers\Controller;

class HomeController extends Controller
{
  /**
   * @Get("/")
   * @Middleware("user")
   * @return \Illuminate\View\View
   */
  public function getHome() {
    return view('site.home');
  }

  /**
   * @Get("/user-unauthorized")
   * @return \Illuminate\View\View
   */
  public function getUserUnauthorized() {
    return view('site.user-unauthorized');
  }
}
