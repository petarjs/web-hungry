<?php

namespace Hungry\Http\Controllers\Admin;

use Illuminate\Http\Request;

use Hungry\Http\Requests;
use Hungry\Http\Controllers\Controller;
use Hungry\Models\Food;
use Hungry\Http\Requests\FoodRequest;

/**
 * @Middleware("admin")
 * @Controller(prefix="api/admin/food")
 */
class FoodController extends Controller
{
    /**
     * @Get("/")
     */
    public function getIndex() {
      $food = Food::all();
      return $food;
    }

    /**
     * @Post("/create")
     */
    public function postCreate(FoodRequest $request) {
      $newFood = Food::create([
        'description' => $request->description
      ]);

      $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $request->image));
      $imageUrl = 'uploads/' . $newFood->id . '.jpg';
      file_put_contents($imageUrl, $data);

      $newFood->image = $imageUrl;
      $newFood->save();

      return $newFood;
    }
}
