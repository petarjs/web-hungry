<?php

namespace Hungry\Handlers\Events;

use Hungry\Events;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

use Hungry\Events\UserWasRegistered;

class EmailUserConfirmation
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
      $user = $event->user;
      \Mail::send('emails.welcome', ['user' => $user], function ($m) use ($user) {
        $m->to($user->email, $user->name)->subject('Welcome to Hungry!');
      });
    }
}
