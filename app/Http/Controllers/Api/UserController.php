<?php

namespace Hungry\Http\Controllers\Api;

use Illuminate\Http\Request;

use Hungry\Http\Requests;
use Hungry\Http\Controllers\Controller;
use Hungry\Models\User;
use Hungry\Models\Role;

/**
 * @Controller(prefix="api/users")
 */
class UserController extends Controller
{
    /**
     * @Get("/")
     * @Middleware("super-admin")
     */
    public function getUsers() {
      $users = User::with('roles');

      return \Response::json($users, 200);
    }

    /**
     * @Get("/{id}")
     */
    public function getUser($id) {
      $user = User::with('roles')->find($id);

      return \Response::json($user, 200);
    }

    
}
