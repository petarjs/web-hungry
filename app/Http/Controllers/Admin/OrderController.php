<?php

namespace Hungry\Http\Controllers\Admin;

use Illuminate\Http\Request;

use Hungry\Http\Requests;
use Hungry\Http\Controllers\Controller;
use Hungry\Models\MenuFood;
use Hungry\Models\User;
use Hungry\Models\Menu;
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
   * Returns number of orders for each food for the specified week
   * 
   */
  public function getFoodOrdersForWeek() {
    $week = \Input::get('week');

    $orderedFood = [];

    Food::all()->each(function ($food) use($week, &$orderedFood) {
      $arrayFood = $food->toArray();
      $arrayFood['num_orders'] = Menu::getNumOrdersForWeekAndFood($week, $food);
      $orderedFood[] = $arrayFood;
    });

    return $orderedFood;
  }

  /**
   * @Get("/numbers")
   *
   * Return the number of orders for a week and 
   * the total needed number of orders (numUsers * 5)
   */
  public function getFoodOrdersNumber() {
    $week = \Input::get('week');

    return [
      'num_orders' => Menu::getNumOrdersForWeek($week),
      'num_total_orders' => User::count() * 5
    ];
  }

  /**
   * @Get("/incomplete")
   *
   * Return the users who didn't complete the orders
   * for the specified week
   */
  public function getUsersWithIncompleteOrdersForWeek() {
    $week = \Input::get('week');
    return User::withIncompleteOrders($week);
  }

  /**
   * @Get("/get-catering-email")
   * 
   * Returns the html email to be sent to catering 
   * for the specified week
   */
  public function getCateringEmail() {
    $week = \Input::get('week');
    $data = Menu::getCateringEmailData($week);
    $html = \View::make('emails.catering-order', ['data' => $data, 'pretend' => true])->render();

    return $html;
  }
}
