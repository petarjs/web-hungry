<?php

namespace Hungry\Http\Controllers\Admin;

use Illuminate\Http\Request;

use Hungry\Http\Requests;
use Hungry\Http\Controllers\Controller;
use Hungry\Models\Food;
use Hungry\Models\Menu;
use Hungry\Models\MenuFood;
use Hungry\Http\Requests\FoodRequest;

use Hungry\Events\MenuWasPublished; 

/**
 * @Controller(prefix="api/admin/menus")
 */
class MenuController extends Controller
{
    /**
     * @Get("/")
     * @Middleware("admin")
     *
     * Return menus for a specific week.
     * If there are no menus for that week,
     * create them.
     * 
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
     * @Get("/user")
     * @Middleware("user")
     *
     * Return menus for the specified week to user.
     * 
     */
    public function getMenusUser() {
      $week = \Input::get('week');

      if(Menu::isPublishedForWeek($week)) {
        return Menu::with(['menuFoods', 'menuFoods.menu', 'menuFoods.food'])->where('week', $week)->get();
      } else {
        return [];
      }
    }

    /**
     * @Put("/{id}")
     * @Middleware("admin")
     *
     * Admin adds a food to the menu.
     * 
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
     * @Middleware("admin")
     *
     * Admin publishes the menu.
     * 
     */
    public function publishMenus() {
      $week = \Input::get('week');
      Menu::where('week', $week)->update(['published' => true]);

      \Event::fire(new MenuWasPublished(Menu::where('week', $week)->first()));

      return Menu::with(['menuFoods', 'menuFoods.menu', 'menuFoods.food'])->where('week', $week)->get();
    }

    /**
     * @Delete("/food/{id}")
     * @Middleware("admin")
     *
     * Admin removes menuFood from the menu.
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
