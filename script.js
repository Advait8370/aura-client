const versionsList =
  document.getElementById("versionsList");

const downloadBtn =
  document.getElementById("downloadBtn");

const latestVersion =
  document.getElementById("latestVersion");

const releaseNotes =
  document.getElementById("releaseNotes");

async function loadVersions() {

  try {

    const res = await fetch(
      "https://advait8370.github.io/aura-launcher-cloud/clients.json"
    );

    const clients = await res.json();

    versionsList.innerHTML = "";

    clients.forEach(client => {

      const card =
        document.createElement("div");

      card.className = "card";

      card.innerHTML = `
        <h3>${client.name}</h3>
        <p>Minecraft ${client.mc}</p>
      `;

      versionsList.appendChild(card);

    });

  } catch (err) {

    console.error(err);

    versionsList.innerHTML =
      `<div class="card">
        Failed to load versions
      </div>`;

  }

}

async function loadLatestRelease() {

  try {

    const res = await fetch(
      "https://api.github.com/repos/Advait8370/aura-client/releases/latest"
    );

    const release =
      await res.json();

    if (!release.tag_name) {
      throw new Error(
        "Latest release not found"
      );
    }

    if (latestVersion) {

      latestVersion.textContent =
        `Latest Version: ${release.tag_name}`;

    }

    const exeAsset =
      release.assets.find(asset =>
        asset.name.endsWith(".exe")
      );

    if (downloadBtn && exeAsset) {

      downloadBtn.href =
        exeAsset.browser_download_url;

      downloadBtn.textContent =
        `Download ${release.tag_name}`;

    }

    if (releaseNotes) {

      releaseNotes.innerHTML =
        release.body
          ? release.body.replace(/\n/g, "<br>")
          : "No release notes available.";

    }

  } catch (err) {

    console.error(err);

    if (latestVersion) {

      latestVersion.textContent =
        "Failed to load latest release";

    }

    if (releaseNotes) {

      releaseNotes.innerHTML =
        "Release information unavailable.";

    }

  }

}

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    await loadVersions();

    await loadLatestRelease();

  }
);
