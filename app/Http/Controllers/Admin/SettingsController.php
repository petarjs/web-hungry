<?php

namespace Hungry\Http\Controllers\Admin;

use Illuminate\Http\Request;

use Hungry\Http\Requests;
use Hungry\Http\Controllers\Controller;
use Hungry\Models\Food;
use Hungry\Http\Requests\FoodRequest;

use Hungry\Http\Requests\SettingsRequest;
use Hungry\Models\Settings;

/**
 * @Middleware("auth")
 * @Controller(prefix="api/admin/settings")
 */
class SettingsController extends Controller
{
    /**
     * @Get("/")
     */
    public function get() {
      return Settings::getAllSettings();
    }

    /**
     * @Post("/")
     */
    public function post(SettingsRequest $request) {
      Settings::setCateringEmail($request->catering_email);
      return Settings::getAllSettings();
    }
}
