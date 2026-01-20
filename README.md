<div align="center">
    <img src="https://github.com/DGAlexandru/NoCloud/blob/main/assets/logo/NoCloud_logo_with_name.svg" width="800" alt="NoCloud">
    <p align="center"><h2>Free your vacuum from the cloud</h2></p>
</div>

NoCloud is a cloud replacement for vacuum robots enabling local-only operation. It isn't a custom firmware. You can think of it as a <i>brain parasite</i> for the vendor firmware... a good-intended parasite :D<br/>
Here's a diagram illustrating the core operation principle:

[<img src="https://github.com/DGAlexandru/NoCloud/raw/main/docs/_pages/general/img/operation_principle.png" height=450>](https://github.com/DGAlexandru/NoCloud/raw/main/docs/_pages/general/img/operation_principle.png)

Because NoCloud isn't a custom firmware, it cannot really change how the robot operates.<br/>
What it can do however is protect your data and enable you to connect your robot
to your Home Automation system without having to detour through a vendor Cloud, which,
apart from the whole data problematic, might not be reachable due to your Internet connection
being down or some servers in the datacenter being on fire.

Not having to leave your local network of course also benefits the latency of commands, status reports etc.

As such, it protects your data through not sharing it with anyone by being fully local, saves you from in-app ads, upselling, sudden subscriptions
and all the other fun enshittification tactics and playbooks.

NoCloud aims to be proof that easy to use and reliable smart appliances are possible without any Cloud and/or account requirements.
Maybe at some point it might help convince vendors that there is another way of doing things.

NoCloud also aims to be a generic abstraction, providing a responsive webinterface that allows controlling the robot, that (should) works on all of your devices: it can be used on phones, tablets as well as on your desktop computer.

To integrate with other systems, it provides a **REST-interface** with inbuilt **Swagger UI** as documentation.
Additionally, it integrates with **Home Assistant** and other smarthome systems (of your choice) using **MQTT**.

Being a generic abstraction, NoCloud won't be a "feature-complete" reimplementation of the vendor apps, as that would also
mean inheriting all of their technical debt.
It does however support everything you need to have a proper, modern, cloud-free robot vacuum.

While being published under the Apache-2.0 license and clearly being FOSS, the governance and development model NoCloud operates under
is to be understood as that of "Freeware with source available". It is evidently much more than that when it comes to the freedoms provided by true FOSS,
but it is not the FOSS that only knows "community-driven" you might be used to from corporate co-option and come to expect when you read "FOSS".

For more information, check out the [newcomer guide](https://github.com/DGAlexandru/NoCloud/blob/main/docs/_pages/general/newcomer-guide.md),
the [getting started guide](https://github.com/DGAlexandru/NoCloud/blob/main/docs/_pages/general/getting-started.md) 
and also the docs in general at [https://Valetudo.cloud](https://Valetudo.cloud)

There, you will find a list of [supported robots](https://github.com/DGAlexandru/NoCloud/blob/main/docs/_pages/general/supported-robots.md).

## Screenshots

### Phone/Mobile
<img width="360" src="https://github.com/user-attachments/assets/21b6cb92-43e8-4c49-b7f4-e15bedaab094" /> <img width="360" src="https://github.com/user-attachments/assets/e4b32931-1116-4d19-bece-e48746a89664" />

<img width="360" src="https://github.com/user-attachments/assets/4fdad83d-3df1-4d24-929b-004ce6b3bff0" /> <img width="360" src="https://github.com/user-attachments/assets/422d54c8-6546-4616-9cd6-c1239be78c32" />

### Tablet/Desktop

<img width="1024" src="https://github.com/user-attachments/assets/28e7dea0-db0a-482b-92ba-8e9774b2416f" />

<img width="1024" src="https://github.com/user-attachments/assets/f9217069-ee10-42f4-8897-0c90703201b7" />

<img width="1024" src="https://github.com/user-attachments/assets/d7281e75-32c7-4a1e-a10b-95aef3b06a78" />


## NoCloud is a garden
This project is the hobby of some random guy on the internet. There is no intent to commercialize it, grow it
or expand the target audience of it. In fact, there is intent to explicitly not do that.

Think of NoCloud as a privately-owned public garden. You can visit it any time for free and enjoy it.
You can spend time there, and you can bring an infinite amount of friends with you to enjoy it.
You can walk the pathways built there. You can sit on some patch of grass and maybe watch a Duck or something.
You can leave a tip in the tip jar at the entrance if you really enjoy it and want to support it flourish.

You can take inspiration from it and bring that home to your own garden, giving it a personal twist and adapting it as needed.
You can even make friendly suggestions if you have a really good idea that ties into the vision that is already there.

But, at the end of the day, you must understand that it is still privately-owned. You're on someone else's property
over which you have no power at all. You will have to show the necessary respect. And - most importantly - you need to
understand that letting you into this garden is a gift and should be treated as such.

If you don't like this garden because you don't like how it's structured, or you feel like it's missing something, or maybe
I choose the wrong flowers to plant over there that's fine. It's just not for you then. You can leave at any time.

There is simply no ground to stand on to demand change to the garden. It doesn't matter if it would attract more people
or if all the other gardens in town are doing something in a specific way. It doesn't matter if your idea of what gardens
even are differs.<br/>
This at the end of the day is simply private property with free public access as a gift to everyone.

When it comes to software development, _everyone_ has access to infinite plots of undeveloped land that they can claim at any time.
Therefore, a garden being build with a specific vision does not take away the ability for anyone else to build their own garden with a different vision.

## Further questions?

> [!IMPORTANT]  
> Before asking/joining/interacting, remember that you're entering a workshop that - fueled by naive optimism - was made partially accessible to the public under strict conditions.
>
> I hang out there in my free time, and, as any human, I'd like to spend my free time pleasantly and surrounded by people that understand and respect me.
> Contrary to e.g. your workplace, where tolerating is all that is expected of you, understanding cannot be made optional in such a space, as the economics that allow it to exist would otherwise not work out.

1. [dust_announce - Very low frequency updates about Valetudo and Rooting](https://t.me/dust_announce)

2. [Valetudo Telegram group](https://t.me/+2MsKV8kILxJhNDAy)

3. [So you've been banned?](https://github.com/DGAlexandru/NoCloud/blob/main/docs/_pages/general/so-youve-been-banned.md)
Be aware that there is an automod active on Telegram that will automatically kick users without a username and/or a screen name with less than 2 characters.
If you're unable to join, make sure that your account passes those requirements, as they are necessary for the moderation tools to work.

Any other mediums such as IRC, Matrix or Reddit are unofficial channels not connected to the project and might contain incorrect or outdated information.

## Contributing

Make sure to familiarize yourself with the [./CONTRIBUTING.md](./CONTRIBUTING.md)


## Honourable mentions

NoCloud is a fork of [Valetudo](https://github.com/Hypfer/Valetudo) which is developed by [Hypfer](https://github.com/Hypfer)

NoCloud is further developed using JetBrains IDEs such as [WebStorm](https://www.jetbrains.com/webstorm/).
Licenses for those have been provided for free by JetBrains to the project in context of [their open source support program](https://jb.gg/OpenSourceSupport) since multiple years now.

Thanks!
