module.exports = class Presence {
  static ActivityTypes = {
    GAME: 0,
    STREAMING: 1,
    LISTENING: 2,
    WATCHING: 3,
    CUSTOM: 4,
    COMPETING: 5,
  };

  static StatusTypes = {
    ONLINE: "online",
    DONOTDISTURB: "dnd",
    IDLE: "idle",
    INVISIBLE: "invisible",
    OFFLINE: "offline",
  };

  set _activities(value) {
    for (let activity of value) {
      if (!activity.url) {
        delete activity.url;
      }
    }

    this.activities = value;

    this.updatePresence();
  }

  constructor(client = {}) {
    this.client = client;

    this.newActivity = (
      name = "",
      type = Presence.ActivityTypes.WATCHING,
      url = ""
    ) =>
      (this._activities = this.activities.concat([
        { name: name, type: type, url: url },
      ]));
    this.setActivity = (
      name = "",
      type = Presence.ActivityTypes.WATCHING,
      url = ""
    ) => (this._activities = [{ name: name, type: type, url: url }]);
    this.serialise = () => ({
      since: this.since,
      activities: this.activities,
      status: this.status,
      afk: this.afk,
    });

    this.updatePresence = () =>
      this.client.sendGatewayEvent(3, this.serialise());

    this.setInfo();
  }

  setInfo(
    status = Presence.StatusTypes.ONLINE,
    afk = false,
    since = new Date().getTime(),
    activities = []
  ) {
    this.since = since;
    this.status = status;
    this.afk = afk;

    if (this.activities) {
      this.activities.concat(activities);
      this.updatePresence();
    } else {
      this._activities = activities;
    }
  }
};
