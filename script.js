// ========================================
// Utility Functions
// ========================================
const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
const particleCount = isMobile ? 10 : 30;

// ========================================
// Greeting
// ========================================
function updateGreeting() {
  const greetingEl = document.getElementById('greeting');
  if (!greetingEl) return;
  
  const hour = new Date().getHours();
  const greetings = {
    morning: ['Good Morning, proxies!', 'Rise and Shine, Wanderer!', 'Good Morning, Trailblazer!'],
    afternoon: ['Good Afternoon, Traveler!', 'Hello There, Wanderer!', 'Good Afternoon, proxies!'],
    evening: ['Good Evening, Traveler!', 'Greetings, Night Wanderer!', 'Good Evening, proxies!'],
    night: ['Good Night, Stargazer!', 'Welcome, Night Owl!', 'Good Night, proxies!']
  };
  
  let timeOfDay = hour >= 5 && hour < 12 ? 'morning' : 
                  hour >= 12 && hour < 17 ? 'afternoon' : 
                  hour >= 17 && hour < 21 ? 'evening' : 'night';
  
  const options = greetings[timeOfDay];
  greetingEl.textContent = options[Math.floor(Math.random() * options.length)];
}

// ========================================
// Particles
// ========================================
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    const colors = ['rgba(139, 92, 246, 0.4)', 'rgba(99, 102, 241, 0.3)', 'rgba(167, 139, 250, 0.3)', 'rgba(236, 72, 153, 0.3)'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.animationDelay = Math.random() * 5 + 's';
    particle.style.animationDuration = (Math.random() * 5 + 8) + 's';
    container.appendChild(particle);
  }
}

// ========================================
// Discord Status
// ========================================
const DISCORD_ID = '1003100550700748871';

async function fetchDiscordStatus() {
  const container = document.getElementById('discord-status');
  if (!container) return;
  
  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
    const data = await response.json();
    
    if (data.success && data.data) {
      displayDiscordStatus(data.data);
    } else {
      throw new Error('Invalid response');
    }
  } catch (error) {
    console.warn('Discord status error:', error);
    container.innerHTML = '<p style="color: rgba(255, 255, 255, 0.7); text-align: center; padding: 20px;">Discord status unavailable</p>';
  }
}

function displayDiscordStatus(data) {
  const container = document.getElementById('discord-status');
  if (!container) return;
  
  const statusConfig = {
    online: { text: 'Online', color: '#43b581' },
    idle: { text: 'Idle', color: '#faa61a' },
    dnd: { text: 'Do Not Disturb', color: '#f04747' },
    offline: { text: 'Offline', color: '#747f8d' }
  };
  
  const currentStatus = statusConfig[data.discord_status] || statusConfig.offline;
  const user = data.discord_user;
  const activity = (data.activities || []).find(a => a.type !== 4);
  
  let activityHTML = '';
  if (activity) {
    const activityTypes = { 0: 'Playing', 1: 'Streaming', 2: 'Listening to', 3: 'Watching', 5: 'Competing in' };
    const activityTitle = activityTypes[activity.type] || 'Activity';
    
    activityHTML = `
      <div class="discord-activity">
        <strong>${activityTitle}</strong> ${activity.name}
        ${activity.details ? `<div style="opacity: 0.8; margin-top: 4px;">${activity.details}</div>` : ''}
      </div>
    `;
  }
  
  container.innerHTML = `
    <div class="discord-info">
      <img src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128" alt="${user.username}" class="discord-avatar">
      <div class="discord-details">
        <h3>${user.global_name || user.username}</h3>
        <div class="discord-status">
          <span class="status-dot" style="background: ${currentStatus.color};"></span>
          ${currentStatus.text}
        </div>
        ${activityHTML}
      </div>
    </div>
  `;
}

// ========================================
// Music Player
// ========================================
const songs = [
  { title: "Time To Love", url: "https://raw.githubusercontent.com/bunsass/busn/main/asset/Time%20To%20Love.mp3" },
  { title: "Had I Not Seen the Sun", url: "https://raw.githubusercontent.com/bunsass/busn/main/asset/Had%20I%20Not%20Seen%20the%20Sun.mp3" },
  { title: "If I Can Stop One Heart From Breaking", url: "https://raw.githubusercontent.com/bunsass/busn/main/asset/If%20I%20Can%20Stop%20One%20Heart%20From%20Breaking.mp3" }
];

let currentSongIndex = 0;
let menuOpen = false;

const audio = document.getElementById('audio');
const albumArt = document.getElementById('album-art');
const albumArtContainer = document.getElementById('album-art-container');
const playPauseBtn = document.getElementById('play-pause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const volumeSlider = document.getElementById('volume');
const songInfo = document.getElementById('song-info');
const musicControls = document.getElementById('music-controls');
const closeButton = document.getElementById('close-controls');

if (audio) audio.volume = 0.5;

function loadSong(index) {
  if (!audio) return;
  audio.src = songs[index].url;
  if (songInfo) songInfo.textContent = `♪ ${songs[index].title}`;
}

function play() {
  if (!audio) return;
  audio.play().then(() => {
    if (albumArt) albumArt.classList.add('playing');
    if (playPauseBtn) playPauseBtn.textContent = '⏸ Pause';
    if (songInfo) songInfo.classList.remove('hidden');
  }).catch(err => console.warn('Play failed:', err));
}

function pause() {
  if (!audio) return;
  audio.pause();
  if (albumArt) albumArt.classList.remove('playing');
  if (playPauseBtn) playPauseBtn.textContent = '▶ Play';
}

function togglePlay() {
  if (!audio) return;
  if (!audio.src) loadSong(currentSongIndex);
  audio.paused ? play() : pause();
}

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  play();
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  play();
}

// Event Listeners
if (albumArtContainer) {
  albumArtContainer.addEventListener('click', () => {
    togglePlay();
    if (isMobile && musicControls) {
      menuOpen = !menuOpen;
      musicControls.classList.toggle('hidden', !menuOpen);
    }
  });
}

if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);
if (prevBtn) prevBtn.addEventListener('click', prevSong);
if (nextBtn) nextBtn.addEventListener('click', nextSong);
if (volumeSlider) volumeSlider.addEventListener('input', (e) => { 
  if (audio) audio.volume = e.target.value; 
});
if (audio) audio.addEventListener('ended', nextSong);
if (closeButton) closeButton.addEventListener('click', () => {
  menuOpen = false;
  if (musicControls) musicControls.classList.add('hidden');
});

// Desktop hover
if (!isMobile && albumArt && musicControls) {
  let hoverTimeout;
  albumArt.addEventListener('mouseenter', () => {
    hoverTimeout = setTimeout(() => musicControls.classList.remove('hidden'), 300);
  });
  albumArt.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimeout);
    setTimeout(() => {
      if (!musicControls.matches(':hover')) musicControls.classList.add('hidden');
    }, 300);
  });
  musicControls.addEventListener('mouseleave', () => musicControls.classList.add('hidden'));
}

// ========================================
// Game APIs with CORS Proxy
// ========================================

// CORS Proxy helper
async function fetchWithProxy(url) {
  // Try direct first
  try {
    const response = await fetch(url);
    if (response.ok) return await response.json();
  } catch (e) {
    console.log('Direct fetch failed, trying proxy...');
  }
  
  // Try with AllOrigins proxy
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (response.ok) {
      const data = await response.json();
      return JSON.parse(data.contents);
    }
  } catch (e) {
    console.warn('Proxy fetch failed:', e);
  }
  
  throw new Error('All fetch attempts failed');
}

// ========================================
// HSR API
// ========================================
class HSRAPI {
  constructor() {
    this.uid = '832796099';
    this.apiUrl = 'https://enka.network/api/hsr/uid';
    this.init();
  }

  async init() {
    this.showLoading(true);
    await this.fetchData();
  }

  showLoading(show) {
    const el = document.getElementById('hsr-loading');
    if (el) el.classList.toggle('hidden', !show);
  }

  showError(msg) {
    const el = document.getElementById('hsr-error');
    if (el) {
      el.textContent = msg;
      el.classList.remove('hidden');
    }
  }

  showPlayerInfo(show) {
    const el = document.getElementById('hsr-player-info');
    if (el) el.classList.toggle('hidden', !show);
  }

  async fetchData() {
    try {
      const data = await fetchWithProxy(`${this.apiUrl}/${this.uid}`);
      
      if (data && (data.detailInfo || (data.uid && data.ttl))) {
        this.showLoading(false);
        this.displayData(data);
        this.showPlayerInfo(true);
      } else {
        throw new Error('Invalid data');
      }
    } catch (error) {
      console.warn('HSR API error:', error);
      this.showLoading(false);
      this.showError('Unable to load live data. Displaying demo data.');
      this.displayData(this.getMockData());
      this.showPlayerInfo(true);
    }
  }

  getMockData() {
    return {
      uid: this.uid,
      detailInfo: {
        nickname: "Chamoi",
        level: 70,
        worldLevel: 6,
        signature: "Demo data - API unavailable",
        headIcon: 201409,
        recordInfo: {
          achievementCount: 10,
          maxRogueChallengeScore: 90,
          equipmentCount: 790
        }
      }
    };
  }

  displayData(data) {
    const info = data.detailInfo;
    if (!info) return;

    const set = (id, content) => {
      const el = document.getElementById(id);
      if (el) el.textContent = content;
    };

    const setAttr = (id, attr, value) => {
      const el = document.getElementById(id);
      if (el) el[attr] = value;
    };

    setAttr('hsr-avatar', 'src', info.headIcon ? 
      `https://enka.network/ui/hsr/SpriteOutput/AvatarRoundIcon/Avatar/${info.headIcon}.png` : 
      'https://enka.network/ui/hsr/SpriteOutput/AvatarRoundIcon/Avatar/1409.png'
    );
    set('hsr-nickname', info.nickname || 'Trailblazer');
    set('hsr-level', info.level || 70);
    set('hsr-world-level', info.worldLevel || 6);
    set('hsr-signature', info.signature || 'May this journey lead us starward.');
    set('hsr-achievements', info.recordInfo?.achievementCount || 0);
    set('hsr-su-stars', info.recordInfo?.maxRogueChallengeScore || 0);
    set('hsr-lightcones', info.recordInfo?.equipmentCount || 0);
    set('hsr-uid', data.uid || this.uid);

    const copyBtn = document.getElementById('copy-hsr-uid');
    if (copyBtn) {
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(data.uid || this.uid);
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy', 2000);
      };
    }
  }
}

// ========================================
// ZZZ API
// ========================================
class ZZZAPI {
  constructor() {
    this.uid = '1302036813';
    this.apiUrl = 'https://enka.network/api/zzz/uid';
    this.init();
  }

  async init() {
    this.showLoading(true);
    await this.fetchData();
  }

  showLoading(show) {
    const el = document.getElementById('zzz-loading');
    if (el) el.classList.toggle('hidden', !show);
  }

  showError(msg) {
    const el = document.getElementById('zzz-error');
    if (el) {
      el.textContent = msg;
      el.classList.remove('hidden');
    }
  }

  showPlayerInfo(show) {
    const el = document.getElementById('zzz-player-info');
    if (el) el.classList.toggle('hidden', !show);
  }

  async fetchData() {
    try {
      const data = await fetchWithProxy(`${this.apiUrl}/${this.uid}`);
      
      if (data && data.PlayerInfo && data.PlayerInfo.SocialDetail) {
        this.showLoading(false);
        this.displayData(data);
        this.showPlayerInfo(true);
      } else {
        throw new Error('Invalid data');
      }
    } catch (error) {
      console.warn('ZZZ API error:', error);
      this.showLoading(false);
      this.showError('Unable to load live data. Displaying demo data.');
      this.displayData(this.getMockData());
      this.showPlayerInfo(true);
    }
  }

  getMockData() {
    return {
      uid: this.uid,
      PlayerInfo: {
        SocialDetail: {
          ProfileDetail: {
            Nickname: 'Buns',
            Level: 60,
            Uid: this.uid,
            AvatarId: 2021
          },
          Desc: 'Welcome to New Eridu!',
          MedalList: [
            { MedalType: 3, Value: 0 },
            { MedalType: 1, Value: 0 },
            { MedalType: 7, Value: 0 }
          ]
        }
      }
    };
  }

  displayData(data) {
    const socialDetail = data.PlayerInfo.SocialDetail;
    const profileDetail = socialDetail.ProfileDetail;

    const set = (id, content) => {
      const el = document.getElementById(id);
      if (el) el.textContent = content;
    };

    const setAttr = (id, attr, value) => {
      const el = document.getElementById(id);
      if (el) el[attr] = value;
    };

    setAttr('zzz-avatar', 'src', 'https://enka.network/ui/zzz/IconInterKnotRole0013.png');
    set('zzz-nickname', profileDetail.Nickname || 'Proxy');
    set('zzz-level', profileDetail.Level || 60);
    set('zzz-signature', socialDetail.Desc || 'Welcome to New Eridu!');

    const medals = socialDetail.MedalList || [];
    set('zzz-line-breaker', medals.find(m => m.MedalType === 3)?.Value || 0);
    set('zzz-shiyu', medals.find(m => m.MedalType === 1)?.Value || 0);
    set('zzz-disintegration', medals.find(m => m.MedalType === 7)?.Value || 0);
    set('zzz-uid', profileDetail.Uid || data.uid || this.uid);

    const copyBtn = document.getElementById('copy-zzz-uid');
    if (copyBtn) {
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(profileDetail.Uid || data.uid || this.uid);
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy', 2000);
      };
    }
  }
}

// ========================================
// Initialize Everything
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  updateGreeting();
  createParticles();
  fetchDiscordStatus();
  new HSRAPI();
  new ZZZAPI();
  
  // Refresh Discord status every 30 seconds
  setInterval(fetchDiscordStatus, 30000);
});
