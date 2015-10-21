<?php

namespace Hungry\Handlers\Events;

use Hungry\Events;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

use Hungry\Events\AdminSentCateringEmail;

class EmailCatering
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
    public function handle(AdminSentCateringEmail $event)
    {
      // dd($event);
      $email = $event->email;
      \Mail::send('emails.catering-order', [], function ($m) use ($email) {
        $m->to($email, 'Ketering')->subject('Narudzbina za ...');
      });
    }
}
