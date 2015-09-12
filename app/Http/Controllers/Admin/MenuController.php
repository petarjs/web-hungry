<?php

namespace Hungry\Http\Controllers\Admin;

use Illuminate\Http\Request;

use Hungry\Http\Requests;
use Hungry\Http\Controllers\Controller;
use Hungry\Models\Food;
use Hungry\Models\Menu;
use Hungry\Http\Requests\FoodRequest;

/**
 * @Middleware("admin")
 * @Controller(prefix="api/admin/menus")
 */
class MenuController extends Controller
{
    /**
     * @Get("/")
     */
    public function getIndex() {
      $week = \Input::get('week');
      $menus = Menu::with('menuFoods')->where('week', $week)->get();

      if($menus->isEmpty()) {
        $menus = Menu::createMenusForWeek($week);
      }

      return $menus;
    }
}
