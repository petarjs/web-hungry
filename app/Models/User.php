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
        return $menuFood->menu->week === $week;
      });
    }
}
