/**
 * @name LeaveMultipleServersVanilla
 * @author Zetsukae
 * @version 1.2.2
 * @description Leave multiple servers at once, with server icons, names — V.1.2.1 / only created by Zetsukae
 * @github https://github.com/Zetsukae/LMSV-BetterDiscord-Plugin
 */

module.exports = class {
    start() {
        console.log("LeaveMultipleServersVanilla loaded.");
    }

    stop() {}

    getSettingsPanel() {
        const container = document.createElement("div");
        container.style.padding = "20px";

        const button = document.createElement("button");
        button.innerText = "Leave Multiple Servers";
        button.style.padding = "10px 20px";
        button.style.background = "#7289da";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.onclick = () => this.showServerList();

        container.appendChild(button);
        return container;
    }

    showServerList() {
        const { getGuilds, getGuild } = BdApi.findModuleByProps("getGuilds", "getGuild");
        const { leaveGuild } = BdApi.findModuleByProps("leaveGuild");
        const { getCurrentUser } = BdApi.findModuleByProps("getCurrentUser");
        const myId = getCurrentUser().id;
        const guilds = getGuilds();

        const overlay = document.createElement("div");
        overlay.style = `
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 9999;
        `;
        overlay.onclick = () => document.body.removeChild(overlay);

        const modal = document.createElement("div");
        modal.style = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2f3136;
            padding: 20px;
            border-radius: 10px;
            color: white;
            max-height: 80vh;
            overflow-y: auto;
            min-width: 300px;
        `;
        modal.onclick = (e) => e.stopPropagation();

        const title = document.createElement("h3");
        title.innerText = "Select servers to leave:";
        modal.appendChild(title);

        const list = document.createElement("div");
        list.style.marginTop = "15px";

        const selectedServers = [];

        for (const [id, guild] of Object.entries(guilds)) {
            const item = document.createElement("div");
            item.style.display = "flex";
            item.style.alignItems = "center";
            item.style.marginBottom = "8px";

            const icon = document.createElement("img");
            icon.style.width = "24px";
            icon.style.height = "24px";
            icon.style.borderRadius = "50%";
            icon.style.marginRight = "8px";

            if (guild.icon) {
                icon.src = `https://cdn.discordapp.com/icons/${id}/${guild.icon}.png`;
            } else {
                icon.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
            }

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = id;
            checkbox.style.marginRight = "8px";
            checkbox.onchange = (e) => {
                if (e.target.checked) {
                    selectedServers.push(id);
                } else {
                    const index = selectedServers.indexOf(id);
                    if (index > -1) selectedServers.splice(index, 1);
                }
            };

            const label = document.createElement("span");
            const guildData = getGuild(id);
            if (guildData && guildData.name) {
                label.innerText = guildData.name;
            } else {
                label.innerText = `Server ID: ${id}`;
            }

            item.appendChild(icon);
            item.appendChild(checkbox);
            item.appendChild(label);
            list.appendChild(item);
        }

        modal.appendChild(list);

        const actions = document.createElement("div");
        actions.style.marginTop = "15px";
        actions.style.textAlign = "right";

        const confirmButton = document.createElement("button");
        confirmButton.innerText = "Confirm";
        confirmButton.style.marginRight = "10px";
        confirmButton.style.padding = "5px 10px";
        confirmButton.style.background = "#7289da";
        confirmButton.style.color = "white";
        confirmButton.style.border = "none";
        confirmButton.style.borderRadius = "5px";
        confirmButton.style.cursor = "pointer";
        confirmButton.onclick = () => {
            selectedServers.forEach(guildId => {
                const guildData = getGuild(guildId);
                if (guildData.ownerId === myId) {
                    BdApi.showToast(`Cannot leave ${guildData.name}, you are the owner!`, { type: "error" });
                } else {
                    BdApi.showToast(`Successfully left server: ${guildData.name}`, { type: "success" });
                    leaveGuild(guildId);
                }
            });
            document.body.removeChild(overlay);
        };

        const cancelButton = document.createElement("button");
        cancelButton.innerText = "Cancel";
        cancelButton.style.padding = "5px 10px";
        cancelButton.style.background = "#4f545c";
        cancelButton.style.color = "white";
        cancelButton.style.border = "none";
        cancelButton.style.borderRadius = "5px";
        cancelButton.style.cursor = "pointer";
        cancelButton.onclick = () => document.body.removeChild(overlay);

        actions.appendChild(confirmButton);
        actions.appendChild(cancelButton);
        modal.appendChild(actions);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }
};
