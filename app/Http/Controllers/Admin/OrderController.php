<?php

namespace Hungry\Http\Controllers\Admin;

use Illuminate\Http\Request;

use Hungry\Http\Requests;
use Hungry\Http\Controllers\Controller;
use Hungry\Models\MenuFood;
use Hungry\Models\User;

/**
 * @Middleware("admin")
 * @Controller(prefix="api/admin/orders")
 */
class OrderController extends Controller
{
  /**
   * @Get("/")
   */
  public function getIndex() {
    $week = \Input::get('week');
    $userId = \Input::get('user_id');
    $user = User::findOrFail($userId);

    return $user->eatenFoodForWeek($week);
  }

  /**
   * @Post("/create")
   */
  public function createOrder() {
    $userId = \Input::get('user_id');
    $menuFoodId = \Input::get('menu_food_id');

    $user = User::findOrFail($userId);
    $menuFood = MenuFood::findOrFail($menuFoodId);

    $user->eatenFood()->attach($menuFood);

    return $user->eatenFoodForWeek($menuFood->menu->week);
  }
}
