<?php

namespace Hungry\Http\Controllers\Admin;

use Illuminate\Http\Request;

use Hungry\Http\Requests;
use Hungry\Http\Controllers\Controller;
use Hungry\Models\Food;
use Hungry\Http\Requests\FoodRequest;

/**
 * @Controller(prefix="api/admin/food")
 */
class FoodController extends Controller
{
    /**
     * @Get("/")
     * @Middleware("user")
     *
     * Show all foods
     * 
     */
    public function getIndex() {
      $food = Food::all();
      return $food;
    }

    /**
     * @Post("/create")
     * @Middleware("admin")
     * 
     * Admin creates a food.
     * 
     */
    public function postCreate(FoodRequest $request) {
      $newFood = Food::create([
        'description' => $request->description
      ]);

      $data = $request->image;

      if($data) {
        $imageUrl = $newFood->getImageUrl();
        $newFood->image = $this->saveImage($data, $imageUrl);
        $newFood->save();
      }

      return $newFood;
    }

    /**
     * Save base64 image to disk and return it's path.
     */
    private function saveImage($base64, $url) {
      list($type, $data) = explode(';', $base64);
      list($typeStuff, $extension) = explode('/', $type);
      list(, $data) = explode(',', $data);
      $data = base64_decode($data);
      $url .= '.' . $extension;

      file_put_contents($url, $data);
      return $url;
    }

    /**
     * @Delete("/{id}")
     * @Middleware("admin")
     *
     * Admin deletes a food.
     * 
     */
    public function deleteFood($id) {
      Food::destroy($id);
    }

    /**
     * @Get("/{id}")
     * @Middleware("user")
     *
     * Get details about a food.
     * 
     */
    public function getFood($id) {
      return Food::find($id);
    }

    /**
     * @Put("/{id}")
     * @Middleware("admin")
     *
     * Admin edits a food.
     * 
     */
    public function editFood($id, FoodRequest $request) {
      $food = Food::findOrFail($id);
      $food->description = $request->description;
      if($food->image != $request->image) {
        $imageUrl = $food->getImageUrl();
        $food->image = $this->saveImage($request->image, $imageUrl);
      }
      $food->save();
      return $food;
    }

    /**
     * @Put("/{id}/toggle-default")
     * @Middleware("admin")
     *
     * Admin makes a food default or not.
     * 
     */
    public function toggleDefault($id) {
      $food = Food::findOrFail($id);
      $food->toggleDefault();
      return $food;
    }
}
