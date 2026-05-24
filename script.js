const CLIENTS_JSON = "https://advait8370.github.io/aura-launcher-cloud/clients.json";

async function loadVersions() {
  const list = document.getElementById("versionsList");

  try {
    const res = await fetch(CLIENTS_JSON);
    const clients = await res.json();

    list.innerHTML = clients.map(client => `
      <div class="card">
        <h3>${client.name}</h3>
        <p>Minecraft ${client.mc || client.profile}</p>
      </div>
    `).join("");
  } catch {
    list.innerHTML = "<div class='card'>Could not load versions.</div>";
  }
}

loadVersions();
