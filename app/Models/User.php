<?php

namespace Hungry\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Zizaco\Entrust\Traits\EntrustUserTrait;
use Hungry\Events\UserWasApproved;

class User extends Model implements AuthenticatableContract, CanResetPasswordContract
{
    use Authenticatable, CanResetPassword, EntrustUserTrait;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'email', 'google_id', 'avatar'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['password', 'remember_token', 'created_at', 'updated_at', 'google_id'];

    public function eatenFood() {
      return $this->belongsToMany('Hungry\Models\MenuFood', 'eats');
    }

    public function likedFood() {
      return $this->belongsToMany('Hungry\Models\Food', 'likes');
    }

    public function eatenFoodForWeek($week) {
      return $this->eatenFood()->with(['menu', 'food'])->get()->filter(function($menuFood) use($week) {
        return $menuFood->menu->week == $week;
      })->toArray();
    }

    public function eatenFoodForDay($day) {
      return $this->eatenFood()->with(['menu', 'food'])->get()->filter(function($menuFood) use($day) {
        return $menuFood->menu->date == $day;
      })->toArray();
    }

    public function approve() {
      $this->is_approved = true;
      $this->save();
      \Event::fire(new UserWasApproved($this));
    }

    public static function withIncompleteOrders($week) {
      return self::all()->filter(function($user) use($week) {
        $orderedFood = $user->eatenFood->filter(function($menuFood) use($week) {
          return $menuFood->menu->week == $week;
        });

        // if not 5 ordered meals for week, count the user as incomplete
        return $orderedFood->count() != 5;
      });
    }

    public static function getPrintData($carbonDate) {
      $date = $carbonDate->toDateTimeString();
      $users = self::all();
      $usersArray = [];
      $users->each(function($user) use ($date, &$usersArray) {
        $userArray = $user->toArray();

        $userArray['ordered_food'] = $user->eatenFood->filter(function($menuFood) use ($date) {
          return $menuFood->menu->date == $date;
        })->map(function($menuFood) {
          return $menuFood->food->description;
        })->first();

        $usersArray[] = $userArray;
      });

      return $usersArray;
    }

    public static function getWeekPrintData($carbonDate) {
      $week = $carbonDate->startOfWeek();
      $days = collect([
        $week,
        $week->copy()->addDays(1),
        $week->copy()->addDays(2),
        $week->copy()->addDays(3),
        $week->copy()->addDays(4)
      ]);

      $users = self::all();
      $usersArray = [];
      $users->each(function($user) use ($week, $days, &$usersArray) {
        $userArray = $user->toArray();


        $userArray['ordered_food'] = $days->map(function($day) use($user) {
          return collect(\DB::table('eats')
                            ->join('users', 'users.id', '=', 'eats.user_id')
                            ->join('menu_foods', 'menu_foods.id', '=', 'eats.menu_food_id')
                            ->join('menus', 'menus.id', '=', 'menu_foods.menu_id')
                            ->join('foods', 'foods.id', '=', 'menu_foods.food_id')
                            ->where('users.id', $user->id)
                            ->where('menus.date', $day)
                            ->select('foods.description')
                            ->get())
                  ->map(function($food) {
                    return $food->description;
                  })->first();
        });

        $usersArray[] = $userArray;
      });

      return $usersArray;
    }

    public static function getSuperAdmins() {
      return self::whereHas(
        'roles', function($q){
          $q->where('name', 'super-admin');
        }
      )->get();
    }
}
