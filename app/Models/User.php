<?php

namespace Hungry\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Zizaco\Entrust\Traits\EntrustUserTrait;

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
      });
    }

    public function eatenFoodForDay($day) {
      return $this->eatenFood()->with(['menu', 'food'])->get()->filter(function($menuFood) use($day) {
        return $menuFood->menu->date == $day;
      });
    }

    public static function withIncompleteOrders($week) {
      return self::all()->filter(function($user) use($week) {
        $orderedFood = $user->eatenFood->filter(function($menuFood) use($week) {
          return $menuFood->menu->week == $week;
        });

        // if 5 ordered meals for week, count the user as incomplete
        return $orderedFood->count() != 5;
      });
    }

    public static function getPrintData($date) {
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
}
