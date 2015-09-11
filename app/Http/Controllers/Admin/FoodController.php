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
        $newFood->image = $this->saveImage($data);
        $newFood->save();
      }

      return $newFood;
    }

    private function saveImage($base64) {
      list($type, $data) = explode(';', $base64);
      list($typeStuff, $extension) = explode('/', $type);
      list(, $data) = explode(',', $data);
      $data = base64_decode($data);

      $imageUrl = 'uploads/' . $newFood->id . '.' . $extension;
      file_put_contents($imageUrl, $data);

      return $imageUrl;
    }

    /**
     * @Delete("/{id}")
     */
    public function deleteFood($id) {
      Food::destroy($id);
    }

    /**
     * @Get("/{id}")
     */
    public function getFood($id) {
      return Food::find($id);
    }

    /**
     * @Put("/{id}")
     */
    public function editFood($id, FoodRequest $request) {
      $food = Food::findOrFail($id);
      $food->description = $request->description;
      $food->image = $this->saveImage($request->image);
      $food->save();
      return $food;
    }
}
