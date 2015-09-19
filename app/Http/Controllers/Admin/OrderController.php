<?php

namespace Hungry\Http\Controllers\Admin;

use Illuminate\Http\Request;

use Hungry\Http\Requests;
use Hungry\Http\Controllers\Controller;
use Hungry\Models\MenuFood;
use Hungry\Models\User;
use Hungry\Models\Food;

/**
 * @Middleware("auth")
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

  /**
   * @Get("/users")
   *
   * Returns list of users with their ordered foods for the specified week
   */
  public function getUserOrders() {
    $week = \Input::get('week');
    $users = [];

    User::all()->each(function($user) use($week, &$users) {
      $arrayUser = $user->toArray();
      $arrayUser['menu_foods'] = User::find($user->id)->eatenFoodForWeek($week);
      $users[] = $arrayUser;
    });

    return $users;
  }

  /**
   * @Get("/food")
   *
   * Returns list of foods ordered for the specified day
   * and list of users that ordered it
   */
  public function getFoodOrdersForDay() {
    $day = \Input::get('day');

    $orderedFood = [];

    Food::all()->each(function ($food) use($day, &$orderedFood) {
      $arrayFood = $food->toArray();
      $arrayFood['users'] = User::all()->filter(function($user) use($day, $food) {
        $usersMenuFoods = $user->eatenFoodForDay($day);
        return $usersMenuFoods->contains(function($key, $menuFood) use($food) {
          return $menuFood->food_id == $food->id;
        });
      })->values();

      $orderedFood[] = $arrayFood;
    });

    return $orderedFood;
  }
}
