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

      $data = $request->image;

      if($data) {
        list($type, $data) = explode(';', $data);
        list($typeStuff, $extension) = explode('/', $type);
        list(, $data) = explode(',', $data);
        $data = base64_decode($data);

        $imageUrl = 'uploads/' . $newFood->id . '.' . $extension;
        file_put_contents($imageUrl, $data);

        $newFood->image = $imageUrl;
        $newFood->save();
      }

      return $newFood;
    }
}
