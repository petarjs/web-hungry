<?php

namespace Hungry\Http\Controllers\SuperAdmin;

use Illuminate\Http\Request;

use Hungry\Http\Requests;
use Hungry\Http\Controllers\Controller;
use Hungry\Models\User;

/**
 * @Middleware("super-admin")
 * @Controller(prefix="super-admin/users")
 */
class UserController extends Controller
{
    /**
     * @Get("/")
     */
    public function getIndex() {
      $users = User::all();

      return view('super-admin.users.index', compact('users'));
    }
}
