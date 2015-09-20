<?php

namespace Hungry\Http\Controllers;

use Illuminate\Http\Request;

use Hungry\Http\Requests;
use Hungry\Http\Controllers\Controller;
use Hungry\Models\User;
use Carbon\Carbon;

/**
 * @Middleware("auth")
 * @Controller(prefix="orders")
 */
class OrderController extends Controller {

  /**
   * @Get("/print/today")
   */
  public function printTodayOrders() {
    $date = Carbon::now();
    $dateFormatted = Carbon::now()->format('d.m.Y');

    $users = User::getPrintData($date->toDateTimeString());

    return view('admin.orders.print', compact('users', 'dateFormatted'));
  }
}
