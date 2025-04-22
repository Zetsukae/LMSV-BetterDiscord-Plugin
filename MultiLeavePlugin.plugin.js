/**
 * @name MultiLeavePlugin
 * @version 1.0.1
 * @description Allows you to leave multiple servers at once, with a button next to the inbox icon.
 * @author Zetsukae
 * @github https://github.com/Zetsukae/MultiLeaveBDPlugin
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
    const inboxButton = document.querySelector('[class*="inbox-"]');

    if (!inboxButton || !inboxButton.parentElement) return;

    const button = document.createElement("button");
    button.id = "multi-leave-button";
    button.innerText = "⇾ Leave Servers";
    button.style.marginRight = "8px";
    button.style.padding = "4px 8px";
    button.style.fontSize = "12px";
    button.style.cursor = "pointer";
    button.style.background = "transparent";
    button.style.border = "1px solid #ccc";
    button.style.borderRadius = "4px";
    button.style.color = "#ccc";

    button.addEventListener("mouseenter", () => {
      button.style.background = "#40444b";
    });

    button.addEventListener("mouseleave", () => {
      button.style.background = "transparent";
    });

    button.addEventListener("click", () => this.openModal());

    // Insert the button before the inbox icon
    inboxButton.parentElement.insertBefore(button, inboxButton);
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

    BdApi.showToast(Left ${checkboxes.length} server(s)., { type: "success" });
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
