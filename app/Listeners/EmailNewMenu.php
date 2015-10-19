<?php

namespace Hungry\Listeners;

use Hungry\Events\MenuWasPublished;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class EmailNewMenu
{
    /**
     * Create the event listener.
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
     * @param  MenuWasPublished  $event
     * @return void
     */
    public function handle(MenuWasPublished $event)
    {
        //
    }
}
