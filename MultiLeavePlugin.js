const { Plugin } = require("vencord");

class MultiLeavePlugin extends Plugin {
  onStart() {
    this.addButton();
  }

  // Ajoute un bouton dans la barre d'outils pour ouvrir la fenêtre de sélection
  addButton() {
    const button = document.createElement("button");
    button.innerText = "Quitter plusieurs serveurs";
    button.style.padding = "5px 10px";
    button.style.fontSize = "14px";
    button.style.cursor = "pointer";
    button.addEventListener("click", () => this.openModal());

    const header = document.querySelector(".top-bar");
    header.appendChild(button);
  }

  // Crée la fenêtre modale avec la liste des serveurs
  openModal() {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.padding = "20px";
    modal.style.backgroundColor = "#fff";
    modal.style.borderRadius = "10px";
    modal.style.zIndex = "9999";

    const serverList = document.createElement("div");
    serverList.style.maxHeight = "300px";
    serverList.style.overflowY = "auto";

    // Liste tous les serveurs auxquels l'utilisateur appartient
    const servers = this.getServers();
    servers.forEach(server => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = server-${server.id};
      checkbox.dataset.serverId = server.id;

      const label = document.createElement("label");
      label.htmlFor = checkbox.id;
      label.innerText = server.name;

      const container = document.createElement("div");
      container.appendChild(checkbox);
      container.appendChild(label);
      serverList.appendChild(container);
    });

    const confirmButton = document.createElement("button");
    confirmButton.innerText = "Confirmer";
    confirmButton.style.marginTop = "10px";
    confirmButton.style.padding = "10px";
    confirmButton.style.cursor = "pointer";
    confirmButton.addEventListener("click", () => this.leaveServers());

    modal.appendChild(serverList);
    modal.appendChild(confirmButton);
    document.body.appendChild(modal);
  }

  // Récupère les serveurs auxquels l'utilisateur appartient
  getServers() {
    const servers = [];
    const serverElements = document.querySelectorAll(".guild");
    serverElements.forEach((serverElement) => {
      const serverName = serverElement.querySelector(".guild-name").textContent;
      const serverId = serverElement.getAttribute("data-id");
      servers.push({ name: serverName, id: serverId });
    });
    return servers;
  }

  // Quitte les serveurs sélectionnés
  leaveServers() {
    const checkboxes = document.querySelectorAll("input[type='checkbox']:checked");
    checkboxes.forEach((checkbox) => {
      const serverId = checkbox.dataset.serverId;
      this.leaveServer(serverId);
    });

    // Ferme la fenêtre modale
    document.querySelector(".modal").remove();
  }

  // Fonction pour quitter un serveur
  leaveServer(serverId) {
    const server = document.querySelector(.guild[data-id="${serverId}"]);
    if (server) {
      const contextMenu = server.querySelector(".guild-context-menu");
      if (contextMenu) {
        const leaveButton = contextMenu.querySelector(".leave-server");
        if (leaveButton) {
          leaveButton.click();
        }
      }
    }
  }
}

module.exports = MultiLeavePlugin;