<?php

namespace Hungry\Providers;

use Illuminate\Contracts\Events\Dispatcher as DispatcherContract;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

use Hungry\Events\UserWasRegistered;
use Hungry\Handlers\Events\EmailUserConfirmation;

use Hungry\Events\MenuWasPublished;
use Hungry\Handlers\Events\EmailNewMenu;

use Hungry\Events\UserWasApproved;
use Hungry\Handlers\Events\EmailUserApproval;

use Hungry\Events\AdminSentCateringEmail;
use Hungry\Handlers\Events\EmailCatering;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        UserWasRegistered::class => [
            EmailUserConfirmation::class,
        ],
        MenuWasPublished::class => [
            EmailNewMenu::class
        ],
        UserWasApproved::class => [
            EmailUserApproval::class
        ],
        AdminSentCateringEmail::class => [
            EmailCatering::class
        ]

    ];

    /**
     * Register any other events for your application.
     *
     * @param  \Illuminate\Contracts\Events\Dispatcher  $events
     * @return void
     */
    public function boot(DispatcherContract $events)
    {
        parent::boot($events);

        //
    }
}
