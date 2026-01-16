// Landing Screen - Simple click to continue
const landingScreen = document.getElementById('landingScreen');
let hasInteracted = false;
let shouldStartTypewriter = false;

// landing screen
landingScreen.addEventListener('click', (e) => {
  e.preventDefault();
  if (hasInteracted) return;
  hasInteracted = true;
  
  landingScreen.classList.add('fade-out');
  shouldStartTypewriter = true;
  
  // Auto-play music when user clicks
  const audio = document.getElementById('bgMusic');
  if (audio && !audio.src) {
    loadSong(0); 
  }
  audio.play().then(() => {
    const playIcon = document.getElementById('playIcon');
    playIcon.innerHTML = '<path d="M6 4h4v16H6zm8 0h4v16h-4z"/>';
    console.log('Music auto-playing!');
  }).catch(err => {
    console.log('Auto-play prevented:', err);
  });
  
  setTimeout(() => {
    landingScreen.style.display = 'none';
    
    startTitleScramble();
  }, 800);
});


function startTitleScramble() {
  const titleElement = document.getElementById('pageTitle');
  const titleText = 'evernight';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
  
  let currentIndex = 0;
  let scrambleFrames = 0;
  const scrambleDuration = 6;
  const delayBetweenChars = 50;

  function getRandomChar() {
    return chars[Math.floor(Math.random() * chars.length)];
  }

  function scrambleText() {
    if (currentIndex >= titleText.length) {
      
      titleElement.textContent = titleText;
      return;
    }

    let displayText = '';
    
    
    for (let i = 0; i < currentIndex; i++) {
      displayText += titleText[i];
    }
    
    
    if (scrambleFrames < scrambleDuration) {
      displayText += getRandomChar();
      scrambleFrames++;
    } else {
      displayText += titleText[currentIndex];
      currentIndex++;
      scrambleFrames = 0;
    }
    
    
    for (let i = currentIndex + 1; i < titleText.length; i++) {
      displayText += getRandomChar();
    }

    titleElement.textContent = displayText;
    setTimeout(scrambleText, delayBetweenChars);
  }
  
  
  setTimeout(scrambleText, 100);
}
// Particle Animation
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 + 0.2;
    this.opacity = Math.random() * 0.5 + 0.3;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;

    if (this.y > canvas.height) {
      this.y = -10;
      this.x = Math.random() * canvas.width;
    }
    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = '#8a74f9';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

const particles = [];
for (let i = 0; i < 100; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// songs
const songs = [
  { name: "From The Start", src: "https://raw.githubusercontent.com/bunsass/busn/main/asset/Laufey%20-%20From%20The%20Start.mp3" },
  { name: "Had I Not Seen the Sun", src: "https://raw.githubusercontent.com/bunsass/busn/main/asset/Had%20I%20Not%20Seen%20the%20Sun.mp3" },
  { name: "If I Can Stop One Heart From Breaking", src: "https://raw.githubusercontent.com/bunsass/busn/main/asset/If%20I%20Can%20Stop%20One%20Heart%20From%20Breaking.mp3" },
  { name: "Text 07", src: "https://raw.githubusercontent.com/bunsass/busn/main/asset/Text%2007%20WN%20ft%20267.mp3" }
];

let currentSong = 0;
const audio = document.getElementById('bgMusic');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volumeSlider = document.getElementById('volumeSlider');
const currentSongEl = document.getElementById('currentSong');

audio.volume = 0.7;

function loadSong(index) {
  audio.src = songs[index].src;
  currentSongEl.textContent = songs[index].name;
}

function togglePlay() {
  if (audio.paused) {
    if (!audio.src) loadSong(currentSong);
    audio.play();
    playIcon.innerHTML = '<path d="M6 4h4v16H6zm8 0h4v16h-4z"/>';
  } else {
    audio.pause();
    playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
  }
}

function nextSong() {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
  audio.play();
  playIcon.innerHTML = '<path d="M6 4h4v16H6zm8 0h4v16h-4z"/>';
}

function prevSong() {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
  audio.play();
  playIcon.innerHTML = '<path d="M6 4h4v16H6zm8 0h4v16h-4z"/>';
}

playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

// Volume Control
const volumeIcon = document.getElementById('volumeIcon');
const volumeControl = document.querySelector('.volume-control');

let volumeExpandTimeout;

volumeIcon.addEventListener('click', (e) => {
  e.stopPropagation();
  if (audio.volume > 0) {
    audio.dataset.previousVolume = audio.volume;
    audio.volume = 0;
    volumeSlider.value = 0;
    updateVolumeIcon(0);
  } else {
    const prevVol = audio.dataset.previousVolume || 0.7;
    audio.volume = prevVol;
    volumeSlider.value = prevVol;
    updateVolumeIcon(prevVol);
  }
});

volumeControl.addEventListener('touchstart', (e) => {
  if (e.target !== volumeIcon) {
    volumeControl.classList.add('expanded');
    clearTimeout(volumeExpandTimeout);
    volumeExpandTimeout = setTimeout(() => {
      volumeControl.classList.remove('expanded');
    }, 3000);
  }
});

document.addEventListener('touchstart', (e) => {
  if (!volumeControl.contains(e.target)) {
    volumeControl.classList.remove('expanded');
  }
});

volumeSlider.addEventListener('input', (e) => {
  audio.volume = e.target.value;
  updateVolumeIcon(e.target.value);
});

function updateVolumeIcon(volume) {
  const volumeIcon = document.getElementById('volumeIcon');
  if (volume == 0) {
    volumeIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
  } else if (volume < 0.5) {
    volumeIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M7 9v6h4l5 5V4l-5 5H7z"/></svg>';
  } else {
    volumeIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
  }
}

// Progress Bar
const progressBar = document.getElementById('progressBar');
const progressBarFill = document.getElementById('progressBarFill');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');

audio.addEventListener('timeupdate', () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progressBarFill.style.width = percent + '%';
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
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

audio.addEventListener('ended', nextSong);

loadSong(0);

// Proxy Configuration for API Calls
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
        console.log(`âœ… ${proxy.name} succeeded!`);
        return data;

      } catch (error) {
        console.warn(`âŒ ${proxy.name} failed (attempt ${attempt + 1}): ${error.message}`);
        
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }
  }

  throw new Error('All proxies failed after retries');
}

// Discord Presence
const DISCORD_ID = '1003100550700748871';

async function fetchDiscordPresence() {
  try {
    // Fetch from both APIs - dcdn for complete profile data, lanyard for live presence
    const [profileResponse, lanyardResponse] = await Promise.all([
      fetch(`https://dcdn.dstn.to/profile/${DISCORD_ID}`),
      fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`)
    ]);
    
    const profileData = await profileResponse.json();
    const lanyardData = await lanyardResponse.json();
    
    if (lanyardData.success) {
      displayDiscordPresence(lanyardData.data, profileData);
    }
  } catch (error) {
    console.error('Error fetching Discord presence:', error);
    document.getElementById('discordCard').innerHTML = '<div class="loading">unable to load presence</div>';
  }
}



function getElapsedTime(startTimestamp) {
  if (!startTimestamp) return '';
  
  const now = Date.now();
  const elapsed = now - startTimestamp;
  
  const hours = Math.floor(elapsed / (1000 * 60 * 60));
  const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
  
  if (hours > 0) {
    return `(${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')})`;
  } else {
    return `(${minutes}:${seconds.toString().padStart(2, '0')})`;
  }
}

function displayDiscordPresence(data, profileData) {
  const { discord_user, discord_status, activities, spotify } = data;
  const discordCard = document.getElementById('discordCard');
  const statusIndicator = document.getElementById('statusIndicator');
  const avatar = document.getElementById('profileAvatar');

  statusIndicator.className = `status-indicator ${discord_status}`;
  
  if (discord_user.avatar) {
    avatar.src = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png?size=128`;
  }

  const statusIcons = {
    online: '<svg fill="#43b581" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>',
    idle: '<svg fill="#faa61a" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm0-10h2v8h-2z"/></svg>',
    dnd: '<svg fill="#f04747" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/></svg>',
    offline: '<svg fill="#747f8d" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3"/></svg>'
  };

  let activityHTML = '';
  
  if (spotify) {
    const spotifyActivity = activities.find(a => a.name === 'Spotify');
    const elapsed = spotifyActivity ? getElapsedTime(spotifyActivity.timestamps?.start) : '';
    
   
    let progressHTML = '';
    if (spotifyActivity && spotifyActivity.timestamps) {
      const now = Date.now();
      const start = spotifyActivity.timestamps.start;
      const end = spotifyActivity.timestamps.end;
      const total = end - start;
      const current = now - start;
      const percentage = Math.min((current / total) * 100, 100);
      
      progressHTML = `
        <div style="margin-top: 8px;">
          <div style="width: 100%; height: 4px; background: rgba(29, 185, 84, 0.2); border-radius: 2px; overflow: hidden;">
            <div style="height: 100%; background: #1DB954; width: ${percentage}%; transition: width 1s linear;"></div>
          </div>
        </div>
      `;
    }
    
    activityHTML = `
      <div class="discord-activity">
        <div class="activity-header">
          <svg viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
          Listening to Spotify ${elapsed}
        </div>
        <div class="activity-details">${spotify.song}</div>
        <div class="activity-state">by ${spotify.artist}</div>
        ${progressHTML}
      </div>
    `;
  }

  const gameActivities = activities.filter(a => a.type === 0);
  if (gameActivities.length > 0) {
    const activity = gameActivities[0];
    const elapsed = getElapsedTime(activity.timestamps?.start);
    
    activityHTML += `
      <div class="discord-activity">
        <div class="activity-header">
          <svg viewBox="0 0 24 24" fill="#8a74f9"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          Playing a game ${elapsed}
        </div>
        <div class="activity-details">${activity.name}</div>
        ${activity.details ? `<div class="activity-state">${activity.details}</div>` : ''}
        ${activity.state ? `<div class="activity-state">${activity.state}</div>` : ''}
      </div>
    `;
  }


  const customStatus = activities.find(a => a.type === 4);
  if (!spotify && gameActivities.length === 0 && customStatus) {
    const emojiHTML = customStatus.emoji 
      ? customStatus.emoji.id 
        ? `<img src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${customStatus.emoji.animated ? 'gif' : 'png'}?size=20" alt="${customStatus.emoji.name}" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 6px;">` 
        : `<span style="margin-right: 6px; font-size: 16px;">${customStatus.emoji.name}</span>`
      : '';
    
    activityHTML = `
      <div class="discord-activity">
        <div class="activity-header">
          <svg viewBox="0 0 24 24" fill="#8a74f9"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
          Custom Status
        </div>
        <div class="activity-details" style="display: flex; align-items: center;">
          ${emojiHTML}${customStatus.state || ''}
        </div>
      </div>
    `;
  }

  let avatarDecorationHTML = '';
  if (discord_user.avatar_decoration_data) {
    const decorationAsset = discord_user.avatar_decoration_data.asset;
    avatarDecorationHTML = `<img class="discord-avatar-decoration" src="https://cdn.discordapp.com/avatar-decoration-presets/${decorationAsset}.png" alt="Decoration">`;
  }

  // Clan tag next to name
  let clanTagHTML = '';
  if (discord_user.primary_guild && discord_user.primary_guild.tag) {
    const clanTag = discord_user.primary_guild.tag;
    const badgeHash = discord_user.primary_guild.badge;
    const guildId = discord_user.primary_guild.identity_guild_id;
    clanTagHTML = `
      <div class="discord-clan-tag">
        <img src="https://cdn.discordapp.com/clan-badges/${guildId}/${badgeHash}.png?size=64" alt="${clanTag}">
        <span>${clanTag}</span>
      </div>
    `;
  }

  // Profile badges 
  let badgesHTML = '';
  if (profileData && profileData.badges && profileData.badges.length > 0) {
    const badgeElements = profileData.badges.map(badge => `
      <div class="discord-badge" title="${badge.description}">
        <img src="https://cdn.discordapp.com/badge-icons/${badge.icon}.png" alt="${badge.description}">
      </div>
    `).join('');
    badgesHTML = `<div class="discord-badges">${badgeElements}</div>`;
  }

  let html = `
    <div class="discord-card">
      <div class="discord-avatar-container">
        <img class="discord-avatar" src="https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png?size=128" alt="Discord Avatar">
        ${avatarDecorationHTML}
        <div class="discord-status-badge">
          ${statusIcons[discord_status] || statusIcons.offline}
        </div>
      </div>
      <div class="discord-info">
        <div class="discord-name-row">
          <div class="discord-name" id="discordUsername" data-username="${discord_user.username}"></div>
          ${clanTagHTML}
          ${badgesHTML}
        </div>
        ${activityHTML}
        <div class="discord-socials">
          <a href="https://discord.com/users/1003100550700748871" class="discord-social-link" target="_blank" title="Discord">
            <svg viewBox="0 0 24 24" fill="#5865f2">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </a>
          <a href="mailto:buiminhtriet57@gmail.com" class="discord-social-link" title="Email">
            <svg viewBox="0 0 24 24" fill="#fff">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </a>
          <a href="https://github.com/bunsass" class="discord-social-link" target="_blank" title="GitHub">
            <svg viewBox="0 0 24 24" fill="#fff">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a href="https://www.facebook.com/bunsass/" class="discord-social-link" target="_blank" title="Facebook">
            <svg viewBox="0 0 24 24" fill="#1877f2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  `;

  discordCard.innerHTML = html;
  
  // Start typewriter effect for username only after interaction
  const usernameElement = document.getElementById('discordUsername');
  if (usernameElement) {
    if (shouldStartTypewriter) {
      startTypewriter(usernameElement, discord_user.username);
    } else {
      // Wait for interaction before starting typewriter
      const checkInterval = setInterval(() => {
        if (shouldStartTypewriter) {
          startTypewriter(usernameElement, discord_user.username);
          clearInterval(checkInterval);
        }
      }, 100);
    }
  }
}

// Discord Username Typewriter Effect - Clean & Smooth
function startTypewriter(element, fullText) {
  let charIndex = 0;
  let isDeleting = false;
  let deleteToIndex = 0;
  
  function type() {
    // Typing phase
    if (!isDeleting && charIndex <= fullText.length) {
      element.textContent = fullText.substring(0, charIndex);
      charIndex++;
      setTimeout(type, 80 + Math.random() * 40); // Smooth typing speed
    } 
    // Pause when complete
    else if (!isDeleting && charIndex > fullText.length) {
      element.textContent = fullText;
      setTimeout(() => {
        isDeleting = true;
        // Randomly delete between 40-80% of the text
        const minDelete = Math.floor(fullText.length * 0.4);
        const maxDelete = Math.floor(fullText.length * 0.8);
        deleteToIndex = fullText.length - (Math.floor(Math.random() * (maxDelete - minDelete + 1)) + minDelete);
        type();
      }, 2500 + Math.random() * 1000); // Pause before deleting
    }
    // Deleting phase
    else if (isDeleting && charIndex > deleteToIndex) {
      charIndex--;
      element.textContent = fullText.substring(0, charIndex);
      setTimeout(type, 40 + Math.random() * 20); // Fast deletion
    }
    // Pause before retyping
    else if (isDeleting && charIndex === deleteToIndex) {
      isDeleting = false;
      setTimeout(type, 400 + Math.random() * 200);
    }
  }
  
  type();
}


function startTabTitleTypewriter() {
  const fullTitle = 'Bunsass';
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;
  
  function typeTab() {
    if (isPaused) {
      setTimeout(typeTab, 2000);
      isPaused = false;
      return;
    }
    
    if (!isDeleting && charIndex <= fullTitle.length) {
      document.title = fullTitle.substring(0, charIndex);
      charIndex++;
      setTimeout(typeTab, 150 + Math.random() * 100);
    } else if (!isDeleting && charIndex > fullTitle.length) {
      isPaused = true;
      isDeleting = true;
      setTimeout(typeTab, 3000);
    } else if (isDeleting && charIndex > 0) {
      charIndex--;
      document.title = fullTitle.substring(0, charIndex);
      setTimeout(typeTab, 80 + Math.random() * 50);
    } else if (isDeleting && charIndex === 0) {
      isPaused = true;
      isDeleting = false;
      setTimeout(typeTab, 500);
    }
  }
  
  typeTab();
}


startTabTitleTypewriter();


function copyToClipboard(text, element) {
  navigator.clipboard.writeText(text).then(() => {
    element.classList.add('copied');
    setTimeout(() => {
      element.classList.remove('copied');
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

async function fetchHSR() {
  const uid = '832796099';
  try {
    const apiUrl = `https://enka.network/api/hsr/uid/${uid}`;
    const data = await fetchWithProxyRotation(apiUrl);
    
    const player = data.detailInfo;
    
    const hsrHeader = document.querySelector('#hsrCard .game-header');
    hsrHeader.innerHTML = `
      <img class="game-icon" src="https://enka.network/ui/hsr/SpriteOutput/AvatarRoundIcon/1409.png" alt="HSR">
      <div>
        <div class="game-title">${player.nickname}</div>
        <div class="game-uid" onclick="copyToClipboard('832796099', this)" title="Click to copy UID">UID: 832796099 • Honkai: Star Rail</div>
      </div>
    `;
    
    document.getElementById('hsrStats').innerHTML = `
      <div class="game-stat">
        <span class="game-stat-label">level</span>
        <span class="game-stat-value">${player.level}</span>
      </div>
      <div class="game-stat">
        <span class="game-stat-label">characters</span>
        <span class="game-stat-value">${player.recordInfo?.avatarCount || 0}</span>
      </div>
      <div class="game-stat">
        <span class="game-stat-label">achievements</span>
        <span class="game-stat-value">${player.recordInfo?.achievementCount || 0}</span>
      </div>
    `;
  } catch (error) {
    console.error('Error fetching HSR:', error);
    document.getElementById('hsrStats').innerHTML = `
      <div class="skeleton skeleton-stat"></div>
      <div class="skeleton skeleton-stat"></div>
      <div class="skeleton skeleton-stat"></div>
    `;
  }
}



fetchHSR();
fetchDiscordPresence();
setInterval(fetchDiscordPresence, 30000);

// Update elapsed time every second
setInterval(() => {
  const activityHeaders = document.querySelectorAll('.activity-header');
  activityHeaders.forEach(header => {
    const timeMatch = header.textContent.match(/\((\d+):(\d+)\)/);
    if (timeMatch) {
      let minutes = parseInt(timeMatch[1]);
      let seconds = parseInt(timeMatch[2]);
      
      seconds++;
      if (seconds >= 60) {
        seconds = 0;
        minutes++;
      }
      
      const formattedTime = `(${minutes}:${seconds.toString().padStart(2, '0')})`;
      header.innerHTML = header.innerHTML.replace(/\(\d+:\d+\)/, formattedTime);
    }
  });
}, 1000);
