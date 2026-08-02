async function loadVersions() {
  const versionsList = document.getElementById("versionsList");
  
  // Skip if we aren't on a page with the versions list (e.g., update.html)
  if (!versionsList) return;

  try {
    const res = await fetch("https://advait8370.github.io/aura-launcher-cloud/clients.json");
    const clients = await res.json();

    versionsList.innerHTML = "";

    clients.forEach(client => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${client.name}</h3>
        <p>Minecraft ${client.mc}</p>
      `;
      versionsList.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    versionsList.innerHTML = `<div class="card">Failed to load versions</div>`;
  }
}

async function loadReleases() {
  const downloadBtn = document.getElementById("downloadBtn");
  const latestVersion = document.getElementById("latestVersion");
  const releaseNotes = document.getElementById("releaseNotes");

  try {
    // Fetch all recent releases instead of just the latest
    const res = await fetch("https://api.github.com/repos/Advait8370/aura-client/releases");
    const releases = await res.json();

    if (!releases || releases.length === 0) {
      throw new Error("No releases found");
    }

    const latestRelease = releases[0];

    // --- Update Index Page Elements (if they exist) ---
    if (latestVersion) {
      latestVersion.textContent = `Latest Version: ${latestRelease.tag_name}`;
    }

    if (downloadBtn) {
      const exeAsset = latestRelease.assets.find(asset => asset.name.endsWith(".exe"));
      if (exeAsset) {
        downloadBtn.href = exeAsset.browser_download_url;
        downloadBtn.textContent = `Download ${latestRelease.tag_name}`;
      } else {
        downloadBtn.textContent = "Download Unavailable";
      }
    }

    // --- Update Release Notes / Changelog Page (if it exists) ---
    if (releaseNotes) {
      // Clear the "Loading..." text
      releaseNotes.innerHTML = "";
      
      // Remove the 'card' class from parent container so we can generate multiple distinct cards
      releaseNotes.className = "cards"; 
      releaseNotes.style.gridTemplateColumns = "1fr"; // Stack them vertically

      // Display up to 5 most recent releases
      const recentReleases = releases.slice(0, 5);

      recentReleases.forEach(release => {
        // Fixed: replaced raw line break with "<br>"
        const bodyText = release.body ? release.body.replace(/\n/g, "<br>") : "No release notes available.";
        const date = new Date(release.published_at).toLocaleDateString();

        const updateCard = document.createElement("div");
        updateCard.className = "card";
        updateCard.style.textAlign = "left";
        
        updateCard.innerHTML = `
          <h3 style="margin-top: 0; color: #22c55e;">${release.name || release.tag_name} <span style="font-size: 14px; color: #9ca3af; float: right;">${date}</span></h3>
          <p style="margin-bottom: 0;">${bodyText}</p>
        `;
        
        releaseNotes.appendChild(updateCard);
      });
    }

  } catch (err) {
    console.error(err);
    if (latestVersion) latestVersion.textContent = "Failed to load latest release";
    if (releaseNotes) releaseNotes.innerHTML = "Release information unavailable.";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadVersions();
  await loadReleases();
});
