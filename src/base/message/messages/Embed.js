"user strict";

const namedColors = require("color-name-list");

module.exports = class Embed {
  constructor(embed = {}) {
    this.type = "rich";
    this.title = "";
    this.description = "";
    this.color = 0;
    this.fields = [];
    this.url = "";
    this.timestamp = "";
    this.image = {
      url: "",
      proxy_url: "",
      height: 0,
      width: 0,
    };
    this.thumbnail = {
      url: "",
      proxy_url: "",
      height: 0,
      width: 0,
    };
    this.author = {
      name: "",
      url: "",
      icon_url: "",
      proxy_icon_url: "",
    };
    this.footer = {
      text: "",
      icon_url: "",
      proxy_icon_url: "",
    };

    Object.assign(this, embed);
  }

  // Function from https://stackoverflow.com/a/5717133
  static validURL(str) {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return Boolean(pattern.test(str));
  }

  setTitle(title = "") {
    this.title = title;
    return this;
  }

  setDescription(description = "") {
    this.description = description;
    return this;
  }

  setColor(color = "") {
    let findColor = color;
    if (!color.startsWith("#")) {
      findColor = namedColors.find(
        (fColor) => fColor.name.toLowerCase() === findColor.toLowerCase()
      ).hex;
    }
    this.color = parseInt(findColor.replace(/^#/u, ""), 16);
    return this;
  }

  setUrl(url = "") {
    this.url = url;
    return this;
  }

  addField(name = "", value = "", inline = false) {
    this.fields.push({
      name,
      value,
      inline,
    });
    return this;
  }

  setImage(imageUrl = "", proxyUrl = "", width = 0, height = 0) {
    if (
      !Embed.validURL(imageUrl) ||
      (!Embed.validURL(proxyUrl) && proxyUrl !== "")
    ) {
      throw new Error(
        `${
          Embed.validURL(imageUrl) ? "ProxyUrl" : "ImageUrl"
        } is not a valid url!`
      );
    }
    this.image.url = imageUrl;
    this.image.proxy_url = proxyUrl;
    this.image.width = width;
    this.image.height = height;
    return this;
  }

  setThumbnail(imageUrl = "", proxyUrl = "", width = 0, height = 0) {
    if (
      !Embed.validURL(imageUrl) ||
      (!Embed.validURL(proxyUrl) && proxyUrl !== "")
    ) {
      throw new Error(
        `${
          Embed.validURL(imageUrl) ? "ProxyUrl" : "ImageUrl"
        } is not a valid url!`
      );
    }
    this.thumbnail.url = imageUrl;
    this.thumbnail.proxy_url = proxyUrl;
    this.thumbnail.width = width;
    this.thumbnail.height = height;
    return this;
  }

  setAuthor(name = "", iconUrl = "", link = "", proxyLink = "") {
    if (!Embed.validURL(iconUrl) && iconUrl !== "") {
      throw new Error("IconUrl is not a valid url!");
    } else if (
      (!Embed.validURL(link) && link !== "") ||
      (!Embed.validURL(proxyLink) && proxyLink !== "")
    ) {
      throw new Error(
        `${Embed.validURL(link) ? "ProxyLink" : "Link"} is not a valid url!`
      );
    }
    this.author.name = name;
    this.author.icon_url = iconUrl;
    this.author.url = link;
    this.author.proxy_icon_url = proxyLink;
    return this;
  }

  setFooter(text = "", iconUrl = "", proxyIconUrl = "") {
    if (
      (!Embed.validURL(iconUrl) && iconUrl !== "") ||
      (!Embed.validURL(proxyIconUrl) && proxyIconUrl !== "")
    ) {
      throw new Error(
        `${
          Embed.validURL(iconUrl) ? "ProxyIconUrl" : "IconUrl"
        } is not a valid url!`
      );
    }
    this.footer.text = text;
    this.footer.icon_url = iconUrl;
    this.footer.proxy_icon_url = proxyIconUrl;
    return this;
  }

  setTimestamp(time = new Date().toISOString()) {
    this.timestamp = time;
    return this;
  }
};
