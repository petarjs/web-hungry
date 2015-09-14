<?php

namespace Hungry\Http\Controllers\Admin;

use Illuminate\Http\Request;

use Hungry\Http\Requests;
use Hungry\Http\Controllers\Controller;
use Hungry\Models\Food;
use Hungry\Models\Menu;
use Hungry\Models\MenuFood;
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
      $menus = Menu::with(['menuFoods', 'menuFoods.menu', 'menuFoods.food'])->where('week', $week)->get();

      if($menus->isEmpty()) {
        $menus = Menu::createMenusForWeek($week);
      }

      return $menus;
    }

    /**
     * @Put("/{id}")
     */
    public function addFoodToMenu($id) {
      $foodId = \Input::get('food_id');

      $menu = Menu::find($id);

      $menuFood = MenuFood::create([
        'food_id' => $foodId,
        'menu_id' => $id
      ]);

      $menus = Menu::with(['menuFoods', 'menuFoods.menu', 'menuFoods.food'])->where('week', $menu->week)->get();

      return $menus;
    }

    /**
     * @Post("/publish")
     */
    public function publishMenus() {
      $week = \Input::get('week');
      Menu::where('week', $week)->update(['published' => true]);

      return Menu::where('week', $week)->get();
    }

    /**
     * @Delete("/food/{id}")
     *
     * @param  $id - id of the MenuFood to remove
     */
    public function removeMenuFood($id) {
      $menuFood = MenuFood::findOrFail($id);
      $week = $menuFood->menu->week;
      $menuFood->delete();

      $menus = Menu::with(['menuFoods', 'menuFoods.menu', 'menuFoods.food'])->where('week', $week)->get();

      return $menus;
    }
}
