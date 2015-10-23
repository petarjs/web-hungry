<?php

namespace Hungry\Handlers\Events;

use Hungry\Events;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

use Hungry\Events\UserWasRegistered;
use Hungry\Models\User;

class EmailAdminUserRegistered
{
    /**
     * Create the event handler.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  Events  $event
     * @return void
     */
    public function handle(UserWasRegistered $event)
    {
      // dd($event);
      $admins = User::getSuperAdmins()->lists('email')->toArray();
      \Mail::send('emails.admin-user-was-registered', [], function ($m) use ($admins) {
        $m->to($admins)->subject('Users are waiting for approval');
      });
    }
}
