---
title: Why NoCloud?
category: General
order: 6
---

# Why NoCloud?


First of all, please do **not** try to convince people to use NoCloud.

We all know how terribly it usually turns out when people try to convince their friends to use linux on their desktop.
Using NoCloud only makes sense if you understand its goals and feel like they are important to you. Everything else will fail.

It is perfectly fine to continue using the cloud if you don't really care about its downsides.
Do not flame people for doing that. You can be a bit snarky about downtimes, lag and other cloud shenanigans though :)

## Goals

### Vendor-agnostic abstraction

NoCloud should enable you to stop caring about your choice of vacuum robot as all supported models should (best case) behave pretty much the same.

This is great because it eliminates vendor lock-in and prevents you from having to re-learn UI/concepts/etc. The cost of this however is,
that some vendor-specific quirks like a special feature might not instantly or ever be available in NoCloud as they may not make sense in a generic abstraction.

### No cloud connectivity

Removing the cloud has a wide range of benefits.

#### No server dependency

The obvious upside of this is that all your data stays on your robot.
It also means that you won't need to have a working internet connection just to control your local vacuum robot anymore.

Commands usually execute much faster and more reliable, as they don't have to detour through some server in a datacenter
far away from you, which might be overloaded or even on fire.


Furthermore, the robot will continue working even after the vendor has ended support for that model and shut down the
corresponding servers. This is a huge issue with IoT devices. They brick all the time because the vendor 
- gets sold
- changes its business model
- runs out of venture capital
- is bankrupt
- gets hacked

and more.

#### No forced updates

You also don't have to fear forced firmware updates that paywall or even entirely remove a previously available feature.

Bricked devices caused by faulty forced firmware updates are also an issue that seems to happen from time to time.
One might for example push an update with extremely verbose logs enabled, leading to your flash wearing out and bricking your whole car.<br/>
You can't just not update to prevent those situations. It is also very hard/impossible to prove that a defect was caused
by the manufacturer.


Overall, forced firmware updates IMO are a very scary thing, because they clearly demonstrate that you're not the owner
of the device you've bought. One might argue that you also buy this "managed update service" with the device, however
is it really a service if you cannot opt out?

#### No account required

By using NoCloud, you don't need to give anyone your phone number or e-mail address just to use the robot you've bought.
This way, it will never be part of a data breach as it was never stored in the first place.
Did you know that there's a german word for that? *Datensparsamkeit* — privacy by design

You also don't have to periodically read some hard to understand 200-page ToS where you're basically forced to agree to
whatever the vendor wants from you as there often is no way to deny it while continuing to use the product.

#### No marketing

With NoCloud, you won't get any ads. You won't get push notifications notifying you about new product launches.
You won't get nagged by your property to upgrade to a new model or buy these new accessories for your existing one.

You also won't get emails from a third party trying to cross-sell you something.

#### Downsides

The downside of not using the manufacturer-provided cloud services is that now you're responsible for installing (security)
updates, allowing for remote connectivity to e.g., control your robot while not at home etc.<br/>
All that fancy cloud stuff.


### No phone app required

Many consumer IoT devices require you to have a smartphone to run the vendor app to provision and control it with no way of using your
desktop computer, laptop or a smartphone with a different operating system than android/iOS for that.

With NoCloud, you get a webinterface that can be used by any device with any operating system capable of running a recent
multi-platform browser including desktops, laptops, smartphones and maybe even your smart fridge.

At times, thanks to the fully responsive design, the experience can even be _objectively_ superior to what the vendor provides.
Some users for example reported that some vendor apps do not play well with tablets and instead just display the phone-optimized
views in an upscaled way on the large tablet screen, wasting all that screen real estate on black borders.

### Open Knowledge

NoCloud is released under a permissive license. You're free to understand and modify your instance of NoCloud as you like.
There's a lot of documentation. The code is pretty well-structured and features comments where required.

Even if for example the NoCloud Companion App were to become delisted from the store-thingy of your operating system,
you'd still have everything you need to be independent of that. Even if GitHub goes down, it doesn't matter.
Git is decentralized by default. Use a local backup. Use a backup somewhere else.

NoCloud however will **not** force-feed you information.<br/>
You will have to be willing to read and understand the information available.

## Further remarks

Please note that NoCloud has no customers.<br/>
It is provided free of charge with no warranty whatsoever.

Using NoCloud does not grant you the right to decide how to run the project, what its goals are, what its priorities are, etc.

This is different from using your robot as intended by the manufacturer, because in that situation, you're a paying customer.<br/>
If this is important to you, usage of NoCloud might not be a good choice.
