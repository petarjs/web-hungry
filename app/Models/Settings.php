<?php

namespace Hungry\Models;

use Illuminate\Database\Eloquent\Model;

class Settings extends Model
{
    protected $table = 'settings';

    public static function init() {
      self::createIfNotExists();
    }

    public static function getAllSettings() {
      return self::first();
    }

    public static function getCateringEmail() {
      return self::first()->catering_email;
    }

    public static function setCateringEmail($email) {
      $s = self::first();
      $s->catering_email = $email;
      $s->save();
    }

    private static function createIfNotExists() {
      if(!self::first()) {
        self::create();
      }
    }
}
