/**
 * @name MultiLeavePlugin
 * @version 1.0.0
 * @description Allows you to leave multiple servers at once.
 * @author Zetsukae
 */

module.exports = class MultiLeavePlugin {
  start() {
    this.addButton();
  }

  stop() {
    const button = document.getElementById("multi-leave-button");
    if (button) button.remove();
  }

  addButton() {
    const toolbar = document.querySelector('[class*="toolbar-"]');
    if (!toolbar) return;

    const button = document.createElement("button");
    button.id = "multi-leave-button";
    button.innerText = "Leave Multiple Servers";
    button.style.marginLeft = "10px";
    button.style.padding = "5px 10px";
    button.style.cursor = "pointer";

    button.addEventListener("click", () => this.openModal());

    toolbar.appendChild(button);
  }

  openModal() {
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.background = "#2f3136";
    modal.style.color = "#fff";
    modal.style.padding = "20px";
    modal.style.borderRadius = "8px";
    modal.style.zIndex = 9999;
    modal.style.maxHeight = "500px";
    modal.style.overflowY = "auto";
    modal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";

    const serverList = document.createElement("div");

    const servers = this.getServers();
    servers.forEach(server => {
      const container = document.createElement("div");
      container.style.marginBottom = "5px";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = server-${server.id};
      checkbox.dataset.serverId = server.id;

      const label = document.createElement("label");
      label.htmlFor = checkbox.id;
      label.innerText = server.name;
      label.style.marginLeft = "5px";

      container.appendChild(checkbox);
      container.appendChild(label);
      serverList.appendChild(container);
    });

    const confirmButton = document.createElement("button");
    confirmButton.innerText = "Confirm";
    confirmButton.style.marginTop = "10px";
    confirmButton.style.padding = "8px";
    confirmButton.style.cursor = "pointer";
    confirmButton.addEventListener("click", () => {
      this.leaveSelectedServers();
      modal.remove();
    });

    modal.appendChild(serverList);
    modal.appendChild(confirmButton);
    document.body.appendChild(modal);
  }

  getServers() {
    const servers = [];
    const guilds = BdApi.findModuleByProps("getGuilds")?.getGuilds?.();
    if (!guilds) return [];

    for (const [id, guild] of Object.entries(guilds)) {
      servers.push({ id, name: guild.name });
    }
    return servers;
  }

  leaveSelectedServers() {
    const checkboxes = document.querySelectorAll("input[type='checkbox']:checked");
    checkboxes.forEach((checkbox) => {
      const serverId = checkbox.dataset.serverId;
      this.leaveServer(serverId);
    });
  }

  leaveServer(guildId) {
    const GuildActions = BdApi.findModuleByProps("leaveGuild");
    if (GuildActions && GuildActions.leaveGuild) {
      GuildActions.leaveGuild(guildId);
    } else {
      BdApi.showToast("Failed to leave server: module not found.", { type: "error" });
    }
  }
};
