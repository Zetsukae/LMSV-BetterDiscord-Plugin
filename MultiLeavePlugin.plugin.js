/**
 * @name LeaveMultipleServers
 * @author Zetsukae
 * @version 1.0.0
 * @description Leave Multiple Servers more easily !
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
        button.innerText = "Gérer les serveurs";
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
        title.innerText = "Clique sur chaque bouton pour quitter un serveur :";
        modal.appendChild(title);

        const list = document.createElement("div");
        list.style.marginTop = "15px";

        for (const [id, guild] of Object.entries(guilds)) {
            const item = document.createElement("div");
            item.style.display = "flex";
            item.style.alignItems = "center";
            item.style.marginBottom = "10px";
            item.style.justifyContent = "space-between";

            const left = document.createElement("div");
            left.style.display = "flex";
            left.style.alignItems = "center";

            const icon = document.createElement("img");
            icon.style.width = "24px";
            icon.style.height = "24px";
            icon.style.borderRadius = "50%";
            icon.style.marginRight = "8px";
            icon.src = guild.icon 
                ? https://cdn.discordapp.com/icons/${id}/${guild.icon}.png
                : https://cdn.discordapp.com/embed/avatars/0.png;

            const label = document.createElement("span");
            label.innerText = guild.name || Server ID: ${id};

            left.appendChild(icon);
            left.appendChild(label);

            const leaveButton = document.createElement("button");
            leaveButton.innerText = "Quitter";
            leaveButton.style.padding = "5px 10px";
            leaveButton.style.background = "#f04747";
            leaveButton.style.color = "white";
            leaveButton.style.border = "none";
            leaveButton.style.borderRadius = "5px";
            leaveButton.style.cursor = "pointer";
            leaveButton.onclick = () => {
                if (guild.ownerId === myId) {
                    BdApi.showToast(Impossible de quitter ${guild.name} : vous êtes le propriétaire., { type: "error" });
                } else {
                    GuildActions.leaveGuild(id);
                    BdApi.showToast(Vous avez quitté : ${guild.name}, { type: "success" });
                    item.remove();
                }
            };

            item.appendChild(left);
            item.appendChild(leaveButton);
            list.appendChild(item);
        }

        modal.appendChild(list);

        const closeBtn = document.createElement("button");
        closeBtn.innerText = "Fermer";
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
