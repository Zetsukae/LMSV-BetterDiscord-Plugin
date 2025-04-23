/**
 * @name LeaveMultipleServersManual
 * @author Zetsukae
 * @authorId 1015566773669601282
 * @version 1.4.1
 * @description Select multiple servers to leave, but leave them manually. If you want the instant version, check out my Github. However, if you download it directly, you will recognize the potential risks.
 * @source https://github.com/Zetsukae/LMSV-BetterDiscord-Plugin?tab=License-1-ov-file
 * @license CC BY-NC 4.0
 * @tags BetterDiscord, Server Management, Discord Plugin, Leave Servers
 */

module.exports = class {
    start() {
        console.log("LeaveMultipleServersManual loaded.");
    }

    stop() {}

    getSettingsPanel() {
        const container = document.createElement("div");
        container.style.padding = "20px";

        const button = document.createElement("button");
        button.innerText = "Manage Servers";
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

    showToast(msg, type = "info") {
        if (typeof BdApi.showToast === "function") {
            BdApi.showToast(msg, { type });
        } else {
            alert('${type.toUpperCase()}: ${msg}');
        }
    }

    showServerList() {
        const GuildStore = BdApi.findModuleByProps("getGuilds", "getGuild");
        const GuildActions = BdApi.findModuleByProps("leaveGuild");
        const CurrentUser = BdApi.findModuleByProps("getCurrentUser");
        const myId = CurrentUser.getCurrentUser().id;
        const guilds = GuildStore.getGuilds();

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
        title.innerText = "Click the button to leave a server:";
        modal.appendChild(title);

        const list = document.createElement("div");
        list.style.marginTop = "15px";

        for (const [id, guild] of Object.entries(guilds)) {
            const item = document.createElement("div");
            item.style.display = "flex";
            item.style.alignItems = "center";
            item.style.justifyContent = "space-between";
            item.style.marginBottom = "10px";

            const left = document.createElement("div");
            left.style.display = "flex";
            left.style.alignItems = "center";

            const icon = document.createElement("img");
            icon.style.width = "24px";
            icon.style.height = "24px";
            icon.style.borderRadius = "50%";
            icon.style.marginRight = "8px";

            if (guild.icon && id) {
                const format = guild.icon.startsWith("a_") ? "gif" : "png";
                icon.src = `https://cdn.discordapp.com/icons/${id}/${guild.icon}.${format}?size=64`;
            } else {
                icon.src = `https://cdn.discordapp.com/embed/avatars/0.png`;
            }

            const label = document.createElement("span");
            label.innerText = guild.name || `Server ID: ${id}`;

            left.appendChild(icon);
            left.appendChild(label);

            const leaveButton = document.createElement("button");
            leaveButton.innerText = "Leave";
            leaveButton.style.padding = "5px 10px";
            leaveButton.style.background = "#f04747";
            leaveButton.style.color = "white";
            leaveButton.style.border = "none";
            leaveButton.style.borderRadius = "5px";
            leaveButton.style.cursor = "pointer";
            leaveButton.onclick = () => {
                if (guild.ownerId === myId) {
                    this.showOwnerModal(guild.name);
                } else {
                    this.showConfirmationModal(guild.name, id, GuildActions, item);
                }
            };

            item.appendChild(left);
            item.appendChild(leaveButton);
            list.appendChild(item);
        }

        modal.appendChild(list);

        const closeBtn = document.createElement("button");
        closeBtn.innerText = "Close";
        closeBtn.style.marginTop = "15px";
        closeBtn.style.padding = "5px 10px";
        closeBtn.style.background = "#4f545c";
        closeBtn.style.color = "white";
        closeBtn.style.border = "none";
        closeBtn.style.borderRadius = "5px";
        closeBtn.style.cursor = "pointer";
        closeBtn.onclick = () => document.body.removeChild(overlay);

        modal.appendChild(closeBtn);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    showConfirmationModal(serverName, id, GuildActions, item) {
        const overlay = document.createElement("div");
        overlay.style = `
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
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
            min-width: 300px;
        `;
        modal.onclick = (e) => e.stopPropagation();

        const title = document.createElement("h3");
        title.innerText = `Are you sure you want to leave "${serverName}"?`;
        modal.appendChild(title);

        const buttons = document.createElement("div");
        buttons.style.display = "flex";
        buttons.style.justifyContent = "space-between";
        buttons.style.marginTop = "15px";

        const confirm = document.createElement("button");
        confirm.innerText = "Confirm";
        confirm.style.padding = "5px 10px";
        confirm.style.background = "#f04747";
        confirm.style.color = "white";
        confirm.style.border = "none";
        confirm.style.borderRadius = "5px";
        confirm.style.cursor = "pointer";
        confirm.onclick = () => {
            try {
                GuildActions.leaveGuild(id);
                this.showToast(`Left: ${serverName}`, "success");
                item.remove();
                document.body.removeChild(overlay);
            } catch (e) {
                this.showToast(`Failed to leave server ${serverName}: ${e.message}`, "error");
            }
        };

        const cancel = document.createElement("button");
        cancel.innerText = "Cancel";
        cancel.style.padding = "5px 10px";
        cancel.style.background = "#4f545c";
        cancel.style.color = "white";
        cancel.style.border = "none";
        cancel.style.borderRadius = "5px";
        cancel.style.cursor = "pointer";
        cancel.onclick = () => document.body.removeChild(overlay);

        buttons.appendChild(confirm);
        buttons.appendChild(cancel);
        modal.appendChild(buttons);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    showOwnerModal(serverName) {
        const overlay = document.createElement("div");
        overlay.style = `
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
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
            min-width: 300px;
            text-align: center;
        `;
        modal.onclick = (e) => e.stopPropagation();

        const title = document.createElement("h3");
        title.innerText = `"${serverName}" - You're the owner of this server and cannot leave it.`;
        modal.appendChild(title);

        const closeBtn = document.createElement("button");
        closeBtn.innerText = "Close";
        closeBtn.style.marginTop = "15px";
        closeBtn.style.padding = "5px 10px";
        closeBtn.style.background = "#4f545c";
        closeBtn.style.color = "white";
        closeBtn.style.border = "none";
        closeBtn.style.borderRadius = "5px";
        closeBtn.style.cursor = "pointer";
        closeBtn.onclick = () => document.body.removeChild(overlay);

        modal.appendChild(closeBtn);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }
};
