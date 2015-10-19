<?php

namespace Hungry\Events;

use Hungry\Events\Event;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

use Hungry\Models\Menu;

class MenuWasPublished extends Event
{
    use SerializesModels;

    public $menu;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Menu $menu)
    {
        $this->menu = $menu;
    }

    /**
     * Get the channels the event should be broadcast on.
     *
     * @return array
     */
    public function broadcastOn()
    {
        return [];
    }
}
