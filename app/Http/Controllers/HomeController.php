<?php

namespace Hungry\Http\Controllers;

use Illuminate\Http\Request;

use Hungry\Http\Requests;
use Hungry\Http\Controllers\Controller;

class HomeController extends Controller
{
  /**
   * @Get("/home")
   * @return \Illuminate\View\View
   */
  public function getHome() {
    return view('site.home');
  }
}
