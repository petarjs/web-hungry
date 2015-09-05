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

      return view('admin.food.index', compact('food'));
    }

    /**
     * @Post("/create")
     */
    public function postCreate(FoodRequest $request) {
      $newFood = Food::create([
        'description' => $request->description,
        'image' => $request->image
      ]);

      return $newFood;
    }

    /**
     * @Post("/upload")
     */
    public function uploadImage() {
      $image  = \Input::file('image');

      if($image) {
        $destinationPath = public_path() . '/uploads';
        $filename = $image->getClientOriginalName();

        $upload_success = \Input::file('image')->move($destinationPath, $filename);

        if($upload_success) {
          return \Response::json(['url' => $destinationPath . '/' . $filename], 200);
        } else {
          return \Response::json('error', 400);
        }
      }
    }
}
