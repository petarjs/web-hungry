<?php

namespace Hungry\Http\Controllers;

use Illuminate\Http\Request;

use Hungry\Http\Requests;
use Hungry\Http\Controllers\Controller;
use Hungry\Models\User;
use Carbon\Carbon;

/**
 * @Controller(prefix="orders")
 */
class OrderController extends Controller {

  /**
   * @Middleware("admin")
   * @Get("/print/today")
   */
  public function printTodayOrders() {
    $date = Carbon::now();
    $dateFormatted = Carbon::now()->format('d.m.Y');

    $users = User::getPrintData($date);

    return view('admin.orders.print', compact('users', 'dateFormatted'));
  }

  /**
   * @Middleware("admin")
   * @Get("/print/week")
   */
  public function printWeekOrders() {
    $week = \Input::get('week');
    $date = Carbon::createFromTimeStamp($week);
    $dateFormatted = $date->copy()->format('d.m.Y');
    $dateFormatted2 = $date->copy()->addDays(4)->format('d.m.Y');

    $users = User::getWeekPrintData($date);
    
    return view('admin.orders.print-week', compact('users', 'dateFormatted', 'dateFormatted2'));
  }
}
