<?php

namespace Hungry\Http\Controllers\Admin;

use Illuminate\Http\Request;

use Hungry\Http\Requests;
use Hungry\Http\Controllers\Controller;
use Hungry\Models\Food;

/**
 * @Middleware("admin")
 * @Controller(prefix="admin/food")
 */
class FoodController extends Controller
{
    /**
     * @Get("/")
     */
    public function getIndex() {
      $food = Food::all();

      return view('admin.food.index', compact('food'));
    }
}
