// ========================================
// Utility Functions
// ========================================
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// ========================================
// Mobile Detection & Performance
// ========================================
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const particleCount = isMobile ? 5 : 30;

// ========================================
// Global State
// ========================================
let hasUserInteracted = false;
let audioContextUnlocked = false;

// ========================================
// Loading Screen
// ========================================
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => loadingScreen.style.display = 'none', 800);
    }
  }, 2000);
});

// ========================================
// Splash Screen - iOS FIXED
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const splashScreen = document.getElementById('splash-screen');
  const container = document.querySelector('.container');
  
  if (!splashScreen) return;
  
  const dismissSplash = (e) => {
    if (hasUserInteracted) return;
    hasUserInteracted = true;
    
    // Prevent default for iOS
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    document.body.classList.add('splash-dismissed', 'content-visible');
    splashScreen.classList.add('fade-out');
    if (container) container.classList.add('visible');
    
    setTimeout(() => splashScreen.style.display = 'none', 800);
    setTimeout(() => typeWriterEffect(), 300);
    
    // Unlock audio context on iOS
    if (isIOS) {
      unlockAudioContext();
    }
  };
  
  // Multiple event listeners for iOS compatibility
  splashScreen.addEventListener('click', dismissSplash, { passive: false });
  splashScreen.addEventListener('touchstart', dismissSplash, { passive: false });
  splashScreen.addEventListener('touchend', dismissSplash, { passive: false });
});

// ========================================
// Cursor Trail (Desktop Only)
// ========================================
if (!isMobile) {
  const canvas = document.getElementById('cursor-trail');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const maxParticles = 50;

  class TrailParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
      this.life = 1;
      this.decay = Math.random() * 0.02 + 0.01;
      this.color = `hsl(${Math.random() * 60 + 260}, 70%, 60%)`;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= this.decay;
      this.size *= 0.98;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.life;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  document.addEventListener('mousemove', (e) => {
    for (let i = 0; i < 2; i++) {
      particles.push(new TrailParticle(e.clientX, e.clientY));
    }
    if (particles.length > maxParticles) particles.splice(0, 2);
  });

  function animateTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].life <= 0 || particles[i].size <= 0.5) {
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(animateTrail);
  }

  animateTrail();
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ========================================
// Parallax Scrolling
// ========================================
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  document.querySelectorAll('.parallax-slow').forEach(el => {
    el.style.transform = `translateY(${scrolled * 0.1}px)`;
  });
  document.querySelectorAll('.parallax-medium').forEach(el => {
    el.style.transform = `translateY(${scrolled * 0.3}px)`;
  });
  document.querySelectorAll('.parallax-fast').forEach(el => {
    el.style.transform = `translateY(${scrolled * -0.05}px)`;
  });
}, { passive: true });

// ========================================
// Smooth Section Transitions
// ========================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

document.querySelectorAll('.section-fade').forEach(el => observer.observe(el));

// ========================================
// Typewriter Effect
// ========================================
function typeWriterEffect() {
  const greetingEl = document.getElementById('greeting');
  if (!greetingEl) return;
  
  const hour = new Date().getHours();
  const greetings = {
    morning: ['Good Morning, proxies!', 'Rise and Shine, Wanderer!', 'Good Morning, Trailblazer!'],
    afternoon: ['Good Afternoon, Traveler!', 'Hello There, Wanderer!', 'Good Afternoon, Trailblazer!', 'Good Afternoon, proxies!'],
    evening: ['Good Evening, Traveler!', 'Greetings, Night Wanderer!', 'Good Evening, Trailblazer!', 'Good Evening, proxies!'],
    night: ['Good Night, Stargazer!', 'Welcome, Night Owl!', 'Greetings, Moonlit Wanderer!', 'Good Night, proxies!']
  };
  
  let timeOfDay = hour >= 5 && hour < 12 ? 'morning' : hour >= 12 && hour < 17 ? 'afternoon' : hour >= 17 && hour < 21 ? 'evening' : 'night';
  const text = greetings[timeOfDay][Math.floor(Math.random() * greetings[timeOfDay].length)];
  
  let index = 0;
  greetingEl.textContent = '';
  
  function type() {
    if (index < text.length) {
      greetingEl.textContent += text.charAt(index);
      index++;
      setTimeout(type, 80);
    }
  }
  type();
}

// ========================================
// Background Particles
// ========================================
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < particleCount; i++) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  const size = isMobile ? Math.random() * 3 + 2 : Math.random() * 5 + 2;
  particle.style.width = size + 'px';
  particle.style.height = size + 'px';
  particle.style.left = Math.random() * 100 + '%';
  particle.style.top = Math.random() * 100 + '%';
  
  const colors = ['rgba(139, 92, 246, 0.4)', 'rgba(99, 102, 241, 0.3)', 'rgba(167, 139, 250, 0.3)', 'rgba(196, 181, 253, 0.3)', 'rgba(236, 72, 153, 0.3)'];
  particle.style.background = colors[Math.floor(Math.random() * colors.length)];
  particle.style.boxShadow = `0 0 ${size * 2}px ${particle.style.background}`;
  particle.style.animationDelay = Math.random() * 5 + 's';
  particle.style.animationDuration = (Math.random() * 5 + 8) + 's';
  particlesContainer.appendChild(particle);
}

// ========================================
// MUSIC PLAYER - iOS FIXED
// ========================================
const songs = [
  { title: "Time To love", url: "https://raw.githubusercontent.com/bunsass/busn/main/asset/Time%20To%20Love.mp3" },
  { title: "Had I Not Seen the Sun", url: "https://raw.githubusercontent.com/bunsass/busn/main/asset/Had%20I%20Not%20Seen%20the%20Sun.mp3" },
  { title: "if i can stop one heart from breaking", url: "https://raw.githubusercontent.com/bunsass/busn/main/asset/If%20I%20Can%20Stop%20One%20Heart%20From%20Breaking.mp3" }
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
const visualizerCanvas = document.getElementById('visualizer');
const visualizerCtx = visualizerCanvas ? visualizerCanvas.getContext('2d') : null;

if (visualizerCanvas) {
  visualizerCanvas.width = 120;
  visualizerCanvas.height = 60;
}

let audioContext, analyser, sourceNode, dataArray, bufferLength;
let isVisualizerActive = false;

// iOS Audio Context Unlock
function unlockAudioContext() {
  if (audioContextUnlocked) return;
  
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (audioContext.state === 'suspended') {
      audioContext.resume().then(() => {
        console.log('AudioContext unlocked on iOS');
        audioContextUnlocked = true;
      });
    } else {
      audioContextUnlocked = true;
    }
  } catch (e) {
    console.warn('Audio context unlock failed:', e);
  }
}

// Set initial volume
if (audio) {
  audio.volume = 0.5;
  if (volumeSlider) volumeSlider.value = 0.5;
}

function loadSong(index) {
  if (!audio) return;
  audio.src = songs[index].url;
  if (songInfo) songInfo.textContent = `♪ ${songs[index].title}`;
}

function play() {
  if (!audio) return;
  
  // iOS requires user gesture
  if (isIOS && !audioContextUnlocked) {
    unlockAudioContext();
  }
  
  const playPromise = audio.play();
  
  if (playPromise !== undefined) {
    playPromise.then(() => {
      if (albumArt) albumArt.classList.add('playing');
      if (playPauseBtn) playPauseBtn.textContent = '⏸ Pause';
      if (songInfo) songInfo.classList.add('show');
      initVisualizer();
    }).catch(err => {
      console.warn('Play failed:', err);
      // Show user-friendly message on iOS
      if (isIOS && playPauseBtn) {
        playPauseBtn.textContent = '▶ Tap to Play';
      }
    });
  }
}

function pause() {
  if (!audio) return;
  audio.pause();
  if (albumArt) albumArt.classList.remove('playing');
  if (playPauseBtn) playPauseBtn.textContent = '▶ Play';
  if (visualizerCanvas) visualizerCanvas.classList.remove('active');
  isVisualizerActive = false;
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

function initVisualizer() {
  if (!visualizerCanvas || !visualizerCtx) return;
  
  if (audioContext) {
    if (visualizerCanvas) visualizerCanvas.classList.add('active');
    isVisualizerActive = true;
    return;
  }
  
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    
    // Check if source already exists
    if (!sourceNode) {
      sourceNode = audioContext.createMediaElementSource(audio);
      sourceNode.connect(analyser);
    }
    
    analyser.connect(audioContext.destination);
    analyser.fftSize = 64;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    
    if (visualizerCanvas) visualizerCanvas.classList.add('active');
    isVisualizerActive = true;
    drawVisualizer();
  } catch (e) {
    console.warn('Visualizer failed:', e);
  }
}

function drawVisualizer() {
  if (!isVisualizerActive || !analyser || !visualizerCanvas || !visualizerCtx) return;
  
  requestAnimationFrame(drawVisualizer);
  analyser.getByteFrequencyData(dataArray);
  
  visualizerCtx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
  
  const barWidth = (visualizerCanvas.width / bufferLength) * 2;
  let x = 0;
  
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = (dataArray[i] / 255) * visualizerCanvas.height * 0.8;
    const gradient = visualizerCtx.createLinearGradient(0, visualizerCanvas.height, 0, 0);
    gradient.addColorStop(0, '#8b5cf6');
    gradient.addColorStop(1, '#ec4899');
    visualizerCtx.fillStyle = gradient;
    visualizerCtx.fillRect(x, visualizerCanvas.height - barHeight, barWidth - 1, barHeight);
    x += barWidth + 1;
  }
}

// Event handlers - iOS compatible
if (albumArtContainer) {
  // Click handler
  albumArtContainer.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    togglePlay();
    if (isMobile && musicControls) {
      menuOpen = !menuOpen;
      musicControls.classList.toggle('show', menuOpen);
    }
  }, { passive: false });

  // Touch handlers for iOS
  let touchStartTime = 0;
  
  albumArtContainer.addEventListener('touchstart', (e) => {
    touchStartTime = Date.now();
  }, { passive: true });
  
  albumArtContainer.addEventListener('touchend', (e) => {
    const touchDuration = Date.now() - touchStartTime;
    
    // Double tap detection
    if (touchDuration < 300) {
      const now = Date.now();
      if (window.lastTapTime && (now - window.lastTapTime) < 300) {
        e.preventDefault();
        nextSong();
        window.lastTapTime = 0;
      } else {
        window.lastTapTime = now;
      }
    }
  }, { passive: false });
}

if (playPauseBtn) {
  playPauseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    togglePlay();
  }, { passive: false });
}

if (prevBtn) {
  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    prevSong();
  }, { passive: false });
}

if (nextBtn) {
  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    nextSong();
  }, { passive: false });
}

if (volumeSlider) {
  volumeSlider.addEventListener('input', (e) => {
    if (audio) audio.volume = e.target.value;
  });
}

if (audio) {
  audio.addEventListener('ended', nextSong);
}

// Desktop hover
if (!isMobile && albumArt) {
  let hoverTimeout;
  albumArt.addEventListener('mouseenter', () => {
    hoverTimeout = setTimeout(() => {
      if (musicControls) musicControls.classList.add('show');
    }, 300);
  });
  
  albumArt.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimeout);
    setTimeout(() => {
      if (musicControls && !musicControls.matches(':hover')) {
        musicControls.classList.remove('show');
      }
    }, 300);
  });
  
  if (musicControls) {
    musicControls.addEventListener('mouseleave', () => {
      musicControls.classList.remove('show');
    });
  }
}

// Mobile: close on outside click
if (isMobile) {
  const closeMenuOutside = (e) => {
    if (!menuOpen) return;
    const musicPlayer = document.getElementById('music-player');
    if (musicPlayer && musicControls && !musicPlayer.contains(e.target) && !musicControls.contains(e.target)) {
      menuOpen = false;
      musicControls.classList.remove('show');
    }
  };
  
  document.addEventListener('touchstart', closeMenuOutside, { capture: true, passive: true });
  document.addEventListener('click', closeMenuOutside, { capture: true, passive: true });
  
  window.addEventListener('scroll', debounce(() => {
    if (menuOpen && musicControls) {
      menuOpen = false;
      musicControls.classList.remove('show');
    }
  }, 100), { passive: true });
}

if (closeButton) {
  closeButton.addEventListener('click', (e) => {
    e.preventDefault();
    menuOpen = false;
    if (musicControls) musicControls.classList.remove('show');
  }, { passive: false });
}

// ========================================
// Discord Status
// ========================================
const DISCORD_ID = '1003100550700748871';

async function fetchDiscordStatus() {
  const statusContainer = document.getElementById('discord-status');
  if (!statusContainer) return;
  
  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    if (data.success && data.data) {
      displayDiscordStatus(data.data);
    } else {
      throw new Error('Invalid response');
    }
  } catch (error) {
    console.warn('Discord unavailable:', error);
    statusContainer.innerHTML = `
      <p style="color: rgba(255, 255, 255, 0.7); text-align: center; padding: 20px;">
        Discord status currently unavailable<br>
        <small style="opacity: 0.6;">Make sure you're in the Lanyard Discord server</small>
      </p>
    `;
  }
}

function displayDiscordStatus(data) {
  const statusContainer = document.getElementById('discord-status');
  if (!statusContainer) return;
  
  const status = data.discord_status;
  const user = data.discord_user;
  const activities = data.activities || [];
  
  const statusConfig = {
    online: { text: 'Online', color: '#43b581' },
    idle: { text: 'Idle', color: '#faa61a' },
    dnd: { text: 'Do Not Disturb', color: '#f04747' },
    offline: { text: 'Offline', color: '#747f8d' }
  };
  
  const currentStatus = statusConfig[status] || statusConfig.offline;
  const activity = activities.find(a => a.type !== 4);
  
  let activityHTML = '';
  if (activity) {
    const activityTypes = { 0: 'Playing', 1: 'Streaming', 2: 'Listening to', 3: 'Watching', 5: 'Competing in' };
    const activityTitle = activityTypes[activity.type] || 'Activity';
    
    activityHTML = `
      <div class="discord-activity">
        <div class="discord-activity-title">${activityTitle}</div>
        <div class="discord-activity-name">${activity.name}</div>
        ${activity.details ? `<div class="discord-activity-details">${activity.details}</div>` : ''}
        ${activity.state ? `<div class="discord-activity-details">${activity.state}</div>` : ''}
      </div>
    `;
  }
  
  statusContainer.innerHTML = `
    <div class="discord-info">
      <div class="discord-avatar-container">
        <img src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128" alt="${user.username}" class="discord-avatar-img">
        <div class="status-indicator ${status}" style="background: ${currentStatus.color};"></div>
      </div>
      <div class="discord-details">
        <h3 class="discord-username">${user.global_name || user.username}</h3>
        <div class="discord-status-badge" style="border-color: ${currentStatus.color};">
          <span class="status-dot" style="background: ${currentStatus.color};"></span>
          ${currentStatus.text}
        </div>
        ${activityHTML}
      </div>
    </div>
  `;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    fetchDiscordStatus();
    setInterval(fetchDiscordStatus, 30000);
  });
} else {
  fetchDiscordStatus();
  setInterval(fetchDiscordStatus, 30000);
}

// ========================================
// Enka API - iOS FIXED
// ========================================
class EnkaAPI {
  constructor(config) {
    this.game = config.game;
    this.baseURL = config.baseURL;
    this.configuredUID = config.uid;
    this.elementIds = config.elementIds;
    this.proxies = [
      { name: 'AllOrigins', url: (u) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`, parse: (d) => d.contents ? JSON.parse(d.contents) : d },
      { name: 'Direct', url: (u) => u, parse: (d) => d }
    ];
    
    // Delay init on iOS to ensure DOM is ready
    if (isIOS) {
      setTimeout(() => this.init(), 500);
    } else {
      this.init();
    }
  }

  init() {
    this.fetchPlayerData(this.configuredUID);
  }

  async fetchPlayerData(uid) {
    this.showLoading(true);
    this.hideError();
    this.hidePlayerInfo();

    for (const proxy of this.proxies) {
      try {
        console.log(`Trying ${this.game} with ${proxy.name}...`);
        const response = await fetch(proxy.url(`${this.baseURL}/${uid}`), {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          mode: 'cors'
        });
        
        if (!response.ok) {
          console.warn(`${proxy.name} failed: ${response.status}`);
          continue;
        }
        
        const data = await response.json();
        const apiData = proxy.parse(data);
        
        if (!this.validateData(apiData)) {
          console.warn(`${proxy.name} returned invalid data`);
          continue;
        }
        
        console.log(`✅ ${this.game} loaded successfully with ${proxy.name}`);
        this.showLoading(false);
        this.hideError();
        this.displayPlayerData(apiData);
        this.showPlayerInfo();
        return;
      } catch (error) {
        console.warn(`${proxy.name} error:`, error.message);
        continue;
      }
    }
    
    console.error(`All ${this.game} proxies failed - using demo data`);
    this.showError('Unable to fetch live data. Displaying demo data.');
    this.showLoading(false);
    this.displayPlayerData(this.getMockData());
    this.showPlayerInfo();
  }

  showLoading(show) {
    const el = document.getElementById(this.elementIds.loading);
    if (el) el.classList.toggle('hidden', !show);
  }

  showError(msg) {
    const el = document.getElementById(this.elementIds.error);
    const textEl = document.getElementById(this.elementIds.errorText);
    if (el && textEl) {
      textEl.textContent = msg;
      el.classList.remove('hidden');
    }
  }

  hideError() {
    const el = document.getElementById(this.elementIds.error);
    if (el) el.classList.add('hidden');
  }

  showPlayerInfo() {
    const el = document.getElementById(this.elementIds.playerInfo);
    if (el) el.classList.remove('hidden');
  }

  hidePlayerInfo() {
    const el = document.getElementById(this.elementIds.playerInfo);
    if (el) el.classList.add('hidden');
  }
}

// HSR
class HSREnkaAPI extends EnkaAPI {
  constructor() {
    super({
      game: 'HSR',
      baseURL: 'https://enka.network/api/hsr/uid',
      uid: '832796099',
      elementIds: { loading: 'loading-indicator', error: 'error-message', errorText: 'error-text', playerInfo: 'hsr-player-info' }
    });
  }

  getMockData() {
    return {
      uid: this.configuredUID,
      detailInfo: {
        nickname: "Chamoi", level: 70, worldLevel: 6,
        signature: "Demo data - API unavailable", headIcon: 201409,
        recordInfo: { achievementCount: 10, maxRogueChallengeScore: 90, equipmentCount: 790 }
      }
    };
  }

  validateData(data) {
    return (data && data.detailInfo) || (data && data.uid && data.ttl);
  }

  displayPlayerData(data) {
    const info = data.detailInfo;
    if (!info) return;
    
    const set = (id, prop, val) => {
      const el = document.getElementById(id);
      if (el) el[prop] = val;
    };
    
    set('player-avatar', 'src', 'https://enka.network/ui/hsr/SpriteOutput/AvatarRoundIcon/Avatar/1409.png');
    set('player-nickname', 'textContent', info.nickname || 'Trailblazer');
    set('player-level', 'textContent', info.level || 70);
    set('world-level', 'textContent', info.worldLevel || 6);
    set('player-signature', 'textContent', info.signature || 'May this journey lead us starward.');
    set('achievement-count', 'textContent', info.recordInfo?.achievementCount || 0);
    set('su-stars', 'textContent', info.recordInfo?.maxRogueChallengeScore || 0);
    set('lightcones-count', 'textContent', info.recordInfo?.equipmentCount || 0);
    set('player-uid', 'textContent', data.uid || this.configuredUID);
    
    const copyBtn = document.getElementById('copy-hsr-uid');
    if (copyBtn) {
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(data.uid || this.configuredUID);
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy', 2000);
      };
    }
    
    this.showPlayerInfo();
  }
}

// ZZZ
class ZZZEnkaAPI extends EnkaAPI {
  constructor() {
    super({
      game: 'ZZZ',
      baseURL: 'https://enka.network/api/zzz/uid',
      uid: '1302036813',
      elementIds: { loading: 'zzz-loading-indicator', error: 'zzz-error-message', errorText: 'zzz-error-text', playerInfo: 'zzz-player-info' }
    });
  }

  getMockData() {
    return {
      uid: this.configuredUID,
      PlayerInfo: {
        SocialDetail: {
          ProfileDetail: { Nickname: 'Buns', Level: 60, Uid: this.configuredUID, AvatarId: 2021 },
          Desc: 'skibidi',
          MedalList: [{ MedalType: 3, Value: 0 }, { MedalType: 1, Value: 0 }, { MedalType: 7, Value: 0 }]
        }
      }
    };
  }

  validateData(data) {
    return (data && data.PlayerInfo && data.PlayerInfo.SocialDetail) || (data && data.uid && data.ttl);
  }

  displayPlayerData(data) {
    const socialDetail = data.PlayerInfo.SocialDetail;
    const profileDetail = socialDetail.ProfileDetail;
    
    const set = (id, prop, val) => {
      const el = document.getElementById(id);
      if (el) el[prop] = val;
    };
    
    set('zzz-player-avatar', 'src', 'https://enka.network/ui/zzz/IconInterKnotRole0013.png');
    set('zzz-player-nickname', 'textContent', profileDetail.Nickname || 'Proxy');
    set('zzz-player-level', 'textContent', profileDetail.Level || 60);
    set('zzz-player-signature', 'textContent', socialDetail.Desc || 'Welcome to New Eridu!');
    
    const medals = socialDetail.MedalList || [];
    set('line-breaker', 'textContent', medals.find(m => m.MedalType === 3)?.Value || 0);
    set('shiyu-defense', 'textContent', medals.find(m => m.MedalType === 1)?.Value || 0);
    set('disintegration', 'textContent', medals.find(m => m.MedalType === 7)?.Value || 0);
    set('zzz-player-uid', 'textContent', profileDetail.Uid || data.uid || this.configuredUID);
    
    const copyBtn = document.getElementById('copy-zzz-uid');
    if (copyBtn) {
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(profileDetail.Uid || data.uid || this.configuredUID);
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy', 2000);
      };
    }
    
    this.showPlayerInfo();
  }
}

// Initialize APIs
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new HSREnkaAPI();
    new ZZZEnkaAPI();
  });
} else {
  new HSREnkaAPI();
  new ZZZEnkaAPI();
}
