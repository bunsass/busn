const DISCORD_ID = '1003100550700748871';
const LANYARD_API = `https://api.lanyard.rest/v1/users/${DISCORD_ID}`;
const HSR_UID = '832796099';

// Music playlist
const songs = [
  { name: "From The Start", src: "https://raw.githubusercontent.com/bunsass/busn/main/asset/Laufey%20-%20From%20The%20Start.mp3" },
  { name: "Had I Not Seen the Sun", src: "https://raw.githubusercontent.com/bunsass/busn/main/asset/Had%20I%20Not%20Seen%20the%20Sun.mp3" },
  { name: "If I Can Stop One Heart From Breaking", src: "https://raw.githubusercontent.com/bunsass/busn/main/asset/If%20I%20Can%20Stop%20One%20Heart%20From%20Breaking.mp3" },
  { name: "Text 07", src: "https://raw.githubusercontent.com/bunsass/busn/main/asset/Text%2007%20WN%20ft%20267.mp3" }
];

let currentSongIndex = 0;
const audio = document.getElementById('bgMusic');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volumeSlider = document.getElementById('volumeSlider');
const currentTrackDisplay = document.getElementById('currentTrack');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');

audio.volume = 0.7;

// Landing Screen Logic
const landingScreen = document.getElementById('landingScreen');
let hasInteracted = false;

landingScreen.addEventListener('click', (e) => {
  if (hasInteracted) return;
  hasInteracted = true;

  landingScreen.classList.add('fade-out');

  // Load and auto-play first song
  loadSong(0);
  audio.play().catch(err => {
    console.log('Auto-play prevented:', err);
  });
  updatePlayButton();

  setTimeout(() => {
    landingScreen.style.display = 'none';
  }, 800);
});

function loadSong(index) {
  currentSongIndex = index;
  audio.src = songs[index].src;
  currentTrackDisplay.textContent = songs[index].name;
}

function updatePlayButton() {
  playBtn.textContent = audio.paused ? '▶' : '⏸';
}

function togglePlay() {
  if (audio.paused) {
    if (!audio.src) loadSong(0);
    audio.play();
  } else {
    audio.pause();
  }
  updatePlayButton();
}

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  audio.play();
  updatePlayButton();
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  audio.play();
  updatePlayButton();
}

// Event Listeners
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

volumeSlider.addEventListener('input', (e) => {
  audio.volume = e.target.value;
});

// Progress Bar
audio.addEventListener('timeupdate', () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = percent + '%';
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
  totalTimeEl.textContent = formatTime(audio.duration);
});

progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  audio.currentTime = percent * audio.duration;
});

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

audio.addEventListener('ended', nextSong);

// Tab Navigation
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const targetTab = tab.dataset.tab;
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`${targetTab}-section`).classList.add('active');
  });
});

// Copy UID function
function copyUID() {
  const uidElement = document.getElementById('hsrUid');
  navigator.clipboard.writeText(HSR_UID).then(() => {
    uidElement.classList.add('copied');
    setTimeout(() => {
      uidElement.classList.remove('copied');
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

// Proxy rotation for API calls
const proxies = [
  {
    name: 'AllOrigins',
    url: (apiUrl) => `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`,
    parseResponse: async (response) => {
      const data = await response.json();
      return data.contents ? JSON.parse(data.contents) : data;
    }
  },
  {
    name: 'CORSProxy',
    url: (apiUrl) => `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`,
    parseResponse: async (response) => await response.json()
  },
  {
    name: 'CodeTabs',
    url: (apiUrl) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(apiUrl)}`,
    parseResponse: async (response) => await response.json()
  }
];

async function fetchWithProxyRotation(apiUrl, maxRetries = 3) {
  for (let i = 0; i < proxies.length; i++) {
    const proxy = proxies[i];
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`Trying ${proxy.name} (attempt ${attempt + 1})...`);
        
        const proxyUrl = proxy.url(apiUrl);
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await proxy.parseResponse(response);
        console.log(`✓ ${proxy.name} succeeded!`);
        return data;

      } catch (error) {
        console.warn(`✗ ${proxy.name} failed (attempt ${attempt + 1}): ${error.message}`);
        
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }
  }

  throw new Error('All proxies failed after retries');
}

// Fetch HSR Data
async function fetchHSR() {
  try {
    const apiUrl = `https://enka.network/api/hsr/uid/${HSR_UID}`;
    const data = await fetchWithProxyRotation(apiUrl);
    
    const player = data.detailInfo;
    
    document.getElementById('hsrStats').innerHTML = `
      <div class="game-stat">
        <span class="game-stat-label">Level</span>
        <span class="game-stat-value">${player.level}</span>
      </div>
      <div class="game-stat">
        <span class="game-stat-label">Characters</span>
        <span class="game-stat-value">${player.recordInfo?.avatarCount || 0}</span>
      </div>
      <div class="game-stat">
        <span class="game-stat-label">Achievements</span>
        <span class="game-stat-value">${player.recordInfo?.achievementCount || 0}</span>
      </div>
      <div class="game-stat">
        <span class="game-stat-label">Light Cones</span>
        <span class="game-stat-value">${player.recordInfo?.equipmentCount || 0}</span>
      </div>
    `;
  } catch (error) {
    console.error('Error fetching HSR data:', error);
    document.getElementById('hsrStats').innerHTML = `
      <div class="no-activity">Failed to load HSR stats</div>
    `;
  }
}

// Discord Presence
async function fetchDiscordPresence() {
  try {
    const [lanyardResponse, profileResponse] = await Promise.all([
      fetch(LANYARD_API),
      fetch(`https://dcdn.dstn.to/profile/${DISCORD_ID}`)
    ]);

    const data = await lanyardResponse.json();
    const profileData = await profileResponse.json();

    if (data.success) {
      updateProfile(data.data);
      updateActivity(data.data);
      updateBadges(profileData);
    }
  } catch (error) {
    console.error('Failed to fetch Discord presence:', error);
    document.getElementById('discord-activity').innerHTML = `
      <div class="no-activity">Failed to load Discord activity</div>
    `;
  }
}

function updateProfile(data) {
  const { discord_user, discord_status } = data;
  const avatarUrl = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png?size=256`;
  document.getElementById('user-avatar').src = avatarUrl;
  document.getElementById('display-name').textContent = discord_user.global_name || discord_user.username;
  document.getElementById('username').textContent = `@${discord_user.username}`;

  const statusBadge = document.getElementById('status-badge');
  const statusEmoji = document.getElementById('status-emoji');
  statusBadge.className = 'status-badge';

  switch(discord_status) {
    case 'online':
      statusEmoji.textContent = '✓';
      break;
    case 'idle':
      statusBadge.classList.add('idle');
      statusEmoji.textContent = '○';
      break;
    case 'dnd':
      statusBadge.classList.add('dnd');
      statusEmoji.textContent = '⊖';
      break;
    default:
      statusBadge.classList.add('offline');
      statusEmoji.textContent = '◯';
  }
}

function updateBadges(profileData) {
  const badgesContainer = document.getElementById('badges-container');

  if (!profileData || !profileData.badges || profileData.badges.length === 0) {
    badgesContainer.innerHTML = '<div class="no-activity" style="padding: 10px; font-size: 12px;">No badges yet</div>';
    return;
  }

  const badgeHTML = profileData.badges.map(badge => `
    <img
      src="https://cdn.discordapp.com/badge-icons/${badge.icon}.png"
      alt="${badge.description}"
      class="badge"
      title="${badge.description}"
    >
  `).join('');

  badgesContainer.innerHTML = badgeHTML;
}

function updateActivity(data) {
  const { activities, listening_to_spotify, spotify } = data;
  const activityContainer = document.getElementById('discord-activity');

  if (listening_to_spotify && spotify) {
    activityContainer.innerHTML = `
      <div class="activity-header">Listening to Spotify</div>
      <div class="activity-content">
        <img src="${spotify.album_art_url}" class="activity-image" alt="Album art">
        <div class="activity-info">
          <div class="activity-name">${spotify.song}</div>
          <div class="activity-details">by ${spotify.artist}</div>
          <div class="activity-state">${spotify.album}</div>
        </div>
      </div>
    `;
    return;
  }

  const activity = activities?.find(a => a.type === 0 || a.type === 1 || a.type === 2 || a.type === 3);

  if (activity) {
    const activityType = activity.type === 0 ? 'Playing' :
                       activity.type === 1 ? 'Streaming' :
                       activity.type === 2 ? 'Listening to' :
                       activity.type === 3 ? 'Watching' : 'Activity';

    activityContainer.innerHTML = `
      <div class="activity-header">${activityType}</div>
      <div class="activity-content no-image">
        <div class="activity-info">
          <div class="activity-name">${activity.name}</div>
          ${activity.details ? `<div class="activity-details">${activity.details}</div>` : ''}
          ${activity.state ? `<div class="activity-state">${activity.state}</div>` : ''}
        </div>
      </div>
    `;
    return;
  }

  activityContainer.innerHTML = '<div class="no-activity">No current activity</div>';
}

// Initialize
loadSong(0);
fetchDiscordPresence();
fetchHSR();
setInterval(fetchDiscordPresence, 30000);
