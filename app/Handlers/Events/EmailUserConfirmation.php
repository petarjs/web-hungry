<?php

namespace Hungry\Handlers\Events;

use Hungry\Events;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

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
     *
     * @Hears("UserWasRegistered")
     */
    public function handle(Events $event)
    {
      Mail::send('emails.welcome', ['user' => $event->user], function ($m) use ($user) {
        $m->to($user->email, $user->name)->subject('Welcome to Hungry!');
      });
    }
}
