<?php

namespace Hungry\Events;

use Hungry\Events\Event;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

use Hungry\Models\Menu;

class AdminSentCateringEmail extends Event
{
    use SerializesModels;

    public $week;
    public $email;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($week, $email)
    {
        $this->week = $week;
        $this->email = $email;
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
