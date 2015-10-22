<?php

namespace Hungry\Handlers\Events;

use Hungry\Events;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

use Hungry\Events\AdminSentCateringEmail;
use Hungry\Models\Menu;

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

      $data = Menu::getCateringEmailData($event->week);
      \Mail::send('emails.catering-order', ['data' => $data], function ($m) use ($email, $data) {
        $m->to($email)->subject('Narudzbina za ' . $data->keys()->first() .' - ' . $data->keys()->last());
      });
    }
}
