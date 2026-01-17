export const UpdaterHelp = `
## NoCloud Updater

NoCloud Updater is a convenience feature aiming to make life with NoCloud a bit easier.

As it is built with privacy in mind, you will have to manually click a button to make it search for newer versions of NoCloud.
No daily update check means no daily pings to some external server.

By default, it's polling the GitHub API, meaning that I am not able to collect any data about you.

**Note: NoCloud Updater will always try to update you to the next chronological release. If you're multiple releases behind,
you will have to update multiple times in a row.**

As NoCloud Updater is just a convenience feature, there might be situations in which it doesn't work. In those situations,
you will have to do a manual update, which usually involves SSH access to the robot.

Sometimes, a configuration change might enable you to use the NoCloud Updater. In other instances, your model of robot might not
be able to use NoCloud Updater at all as there's not enough storage built in.
This is not a bug. That's just how it is (hardware limitation).

It is also worth noting that NoCloud Updater won't update the robot's firmware. It only updates the NoCloud binary.

`;
