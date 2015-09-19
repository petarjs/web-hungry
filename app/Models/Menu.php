<?php

namespace Hungry\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Menu extends Model
{
  protected $casts = [
    'published' => 'boolean',
  ];

  protected $fillable = [
    'date',
    'published',
    'week',
    'created_at',
    'updated_at'
  ];

  public function getDates() {
      return array(static::CREATED_AT, static::UPDATED_AT, 'date');
  }

  public function menuFoods() {
    return $this->hasMany('Hungry\Models\MenuFood');
  }

  public static function createMenusForWeek($week) {
    $now = Carbon::now('utc')->toDateTimeString();

    $weekMon = Carbon::createFromTimeStamp( (int) $week);
    $weekDays = [
      'mon' => $weekMon,
      'tue' => $weekMon->copy()->addDays(1),
      'wed' => $weekMon->copy()->addDays(2),
      'thu' => $weekMon->copy()->addDays(3),
      'fri' => $weekMon->copy()->addDays(4)
    ];

    $defaultFoods = Food::where('default', true)->get();

    $newMenus = [];
    foreach ($weekDays as $dayAbbr => $day) {
      $newMenu = Menu::create([
        'date' => $day,
        'week' => $week,
        'published' => false,
        'created_at' => $now,
        'updated_at' => $now
      ]);

      foreach ($defaultFoods as $defaultFood) {
        MenuFood::create([
          'food_id' => $defaultFood->id,
          'menu_id' => $newMenu->id
        ]);
      }

      $newMenus[] = $newMenu->id;
    }

    return self::with(['menuFoods', 'menuFoods.menu', 'menuFoods.food'])->find($newMenus);
  }

  public static function isPublishedForWeek($week) {
    $publishedMenus = self::where('week', $week)->where('published', true)->get();
    return !$publishedMenus->isEmpty();
  }

  public static function getNumOrdersForWeek($week) {
    return self::where('week', $week)->get()->sum(function($menu) {
      return $menu->menuFoods->sum(function($menuFood) {
        return $menuFood->eatenBy->count();
      });
    });
  }
}
