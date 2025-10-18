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
const particleCount = isMobile ? 5 : 30;

// ========================================
// Loading Screen
// ========================================
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  const splashScreen = document.getElementById('splash-screen');
  
  // Show splash screen immediately
  splashScreen.classList.remove('hidden');
  
  setTimeout(() => {
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
      loadingScreen.remove();
    }, 800);
  }, 2000);
});

// ========================================
// Cursor Trail Effect
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
    if (particles.length > maxParticles) {
      particles.splice(0, 2);
    }
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
  
  const slowElements = document.querySelectorAll('.parallax-slow');
  const mediumElements = document.querySelectorAll('.parallax-medium');
  const fastElements = document.querySelectorAll('.parallax-fast');
  
  slowElements.forEach(el => {
    el.style.transform = `translateY(${scrolled * 0.1}px)`;
  });
  
  mediumElements.forEach(el => {
    el.style.transform = `translateY(${scrolled * 0.3}px)`;
  });
  
  fastElements.forEach(el => {
    el.style.transform = `translateY(${scrolled * -0.05}px)`;
  });
});

// ========================================
// Smooth Section Transitions
// ========================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.section-fade').forEach(el => {
  observer.observe(el);
});

// ========================================
// Splash Screen & Autoplay
// ========================================
let splashInteracted = false;

function handleSplashInteraction(e) {
  console.log('Splash interaction triggered!', e.type); // Debug log
  
  if (splashInteracted) {
    console.log('Already interacted, ignoring');
    return;
  }
  
  splashInteracted = true;
  console.log('Processing splash interaction...');
  
  // Prevent default behavior
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  const splashScreen = document.getElementById('splash-screen');
  if (!splashScreen) {
    console.log('Splash screen not found!');
    return;
  }
  
  console.log('Fading out splash screen...');
  splashScreen.classList.add('fade-out');
  
  // Show music player after splash interaction
  const musicPlayer = document.getElementById('music-player');
  const songInfo = document.getElementById('song-info');
  if (musicPlayer) musicPlayer.style.display = 'block';
  if (songInfo) songInfo.style.display = 'none'; // Keep hidden until playing
  
  // Load and autoplay first song after user interaction
  loadSong(currentSongIndex);
  
  // Wait for audio to be ready, then play
  audio.addEventListener('canplay', function autoplayHandler() {
    playSong();
    audio.removeEventListener('canplay', autoplayHandler);
  }, { once: true });
  
  setTimeout(() => {
    typeWriterEffect();
  }, 300);
  
  setTimeout(() => {
    if (splashScreen && splashScreen.parentNode) {
      splashScreen.remove();
      console.log('Splash screen removed');
    }
  }, 800);
}

// Wait for page to fully load before setting up events
window.addEventListener('load', () => {
  console.log('Page loaded, setting up splash screen...');
  
  // Small delay to ensure everything is ready
  setTimeout(() => {
    const splashScreen = document.getElementById('splash-screen');
    
    if (!splashScreen) {
      console.error('Splash screen element not found!');
      return;
    }
    
    console.log('Splash screen found, adding event listeners...');
    
    // Remove any existing pointer-events restrictions
    splashScreen.style.pointerEvents = 'auto';
    
    // Simplified event handling - just use touchstart and click
    splashScreen.addEventListener('touchstart', (e) => {
      console.log('touchstart detected');
      handleSplashInteraction(e);
    }, { passive: false });
    
    splashScreen.addEventListener('click', (e) => {
      console.log('click detected');
      handleSplashInteraction(e);
    });
    
    // Add visual feedback for debugging
    splashScreen.addEventListener('touchstart', () => {
      splashScreen.style.opacity = '0.8';
    }, { passive: true });
    
    splashScreen.addEventListener('touchend', () => {
      splashScreen.style.opacity = '1';
    }, { passive: true });
    
    console.log('Event listeners added successfully');
  }, 100);
});

// Add multiple event listeners for better compatibility
splashScreen.addEventListener('click', handleSplashInteraction);
splashScreen.addEventListener('touchstart', handleSplashInteraction);
splashScreen.addEventListener('touchend', handleSplashInteraction);
// For iOS Safari specifically
splashScreen.addEventListener('pointerdown', handleSplashInteraction);

// ========================================
// Typewriter Effect for Greeting
// ========================================
function typeWriterEffect() {
  const greetingEl = document.getElementById('greeting');
  const hour = new Date().getHours();
  
  const greetings = {
    morning: ['Good Morning, proxies!', 'Rise and Shine, Wanderer!', 'Good Morning, Trailblazer!'],
    afternoon: ['Good Afternoon, Traveler!', 'Hello There, Wanderer!', 'Good Afternoon, Trailblazer!', 'Good Afternoon, proxies!'],
    evening: ['Good Evening, Traveler!', 'Greetings, Night Wanderer!', 'Good Evening, Trailblazer!', 'Good Evening, proxies!'],
    night: ['Good Night, Stargazer!', 'Welcome, Night Owl!', 'Greetings, Moonlit Wanderer!', 'Good Night, proxies!']
  };
  
  let timeOfDay;
  if (hour >= 5 && hour < 12) timeOfDay = 'morning';
  else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
  else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
  else timeOfDay = 'night';
  
  const greetingArray = greetings[timeOfDay];
  const text = greetingArray[Math.floor(Math.random() * greetingArray.length)];
  
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
  
  const colors = [
    'rgba(139, 92, 246, 0.4)',
    'rgba(99, 102, 241, 0.3)',
    'rgba(167, 139, 250, 0.3)',
    'rgba(196, 181, 253, 0.3)',
    'rgba(236, 72, 153, 0.3)'
  ];
  particle.style.background = colors[Math.floor(Math.random() * colors.length)];
  particle.style.boxShadow = `0 0 ${size * 2}px ${particle.style.background}`;
  particle.style.animationDelay = Math.random() * 5 + 's';
  particle.style.animationDuration = (Math.random() * 5 + 8) + 's';
  particlesContainer.appendChild(particle);
}

// ========================================
// Music Player & Visualizer
// ========================================
const songs = [
  {
    title: "Time To love",
    url: "https://raw.githubusercontent.com/bunsass/busn/main/asset/Time%20To%20Love.mp3"
  },
  {
    title: "Had I Not Seen the Sun",
    url: "https://raw.githubusercontent.com/bunsass/busn/main/asset/Had%20I%20Not%20Seen%20the%20Sun.mp3"
  },
  {
    title: "if i can stop one heart from breaking",
    url: "https://raw.githubusercontent.com/bunsass/busn/main/asset/If%20I%20Can%20Stop%20One%20Heart%20From%20Breaking.mp3"
  }
];

let currentSongIndex = 0;
const audio = document.getElementById('audio');
const albumArt = document.getElementById('album-art');
const playPauseBtn = document.getElementById('play-pause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const volumeSlider = document.getElementById('volume');
const songInfo = document.getElementById('song-info');
const musicControls = document.getElementById('music-controls');

// Visualizer Setup
const visualizerCanvas = document.getElementById('visualizer');
const visualizerCtx = visualizerCanvas.getContext('2d');
visualizerCanvas.width = 120;
visualizerCanvas.height = 60;

let audioContext, analyser, dataArray, bufferLength, isVisualizerActive = false;
let sourceNode = null;

function setupAudioContext() {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      
      // Only create source node once
      if (!sourceNode) {
        sourceNode = audioContext.createMediaElementSource(audio);
        sourceNode.connect(analyser);
      }
      
      analyser.connect(audioContext.destination);
      analyser.fftSize = 64;
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      return true;
    } catch (error) {
      console.warn('Audio visualizer not supported:', error);
      return false;
    }
  }
  return true;
}

function drawVisualizer() {
  if (!analyser || !isVisualizerActive) return;
  
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

audio.volume = 0.5;

function loadSong(index) {
  const song = songs[index];
  audio.src = song.url;
  songInfo.textContent = `♪ ${song.title}`;
}

function playSong() {
  // Setup visualizer only once
  if (!audioContext) {
    setupAudioContext();
  }
  
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
  const playPromise = audio.play();
  
  if (playPromise !== undefined) {
    playPromise.then(() => {
      albumArt.classList.add('playing');
      playPauseBtn.textContent = '⏸ Pause';
      songInfo.classList.add('show');
      
      if (audioContext) {
        visualizerCanvas.classList.add('active');
        isVisualizerActive = true;
        drawVisualizer();
      }
    }).catch(error => {
      console.warn('Playback prevented:', error);
      albumArt.classList.remove('playing');
      playPauseBtn.textContent = '▶ Play';
    });
  }
}

function pauseSong() {
  audio.pause();
  albumArt.classList.remove('playing');
  playPauseBtn.textContent = '▶ Play';
  visualizerCanvas.classList.remove('active');
  isVisualizerActive = false;
}

function playNextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  playSong();
}

function playPrevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  playSong();
}

audio.addEventListener('ended', () => {
  playNextSong();
});

let menuOpen = false;

function closeMenu() {
  if (menuOpen) {
    menuOpen = false;
    musicControls.classList.remove('show');
  }
}

albumArt.addEventListener('click', (e) => {
  e.stopPropagation();
  
  if (audio.paused) {
    if (!audio.src) loadSong(currentSongIndex);
    playSong();
  } else {
    pauseSong();
  }
  
  if (isMobile) {
    menuOpen = !menuOpen;
    if (menuOpen) {
      musicControls.classList.add('show');
    } else {
      musicControls.classList.remove('show');
    }
  }
});

albumArt.addEventListener('dblclick', (e) => {
  e.preventDefault();
  playNextSong();
});

if (!isMobile) {
  let hoverTimeout;
  albumArt.addEventListener('mouseenter', () => {
    hoverTimeout = setTimeout(() => {
      musicControls.classList.add('show');
    }, 300);
  });

  albumArt.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimeout);
    setTimeout(() => {
      if (!musicControls.matches(':hover')) {
        musicControls.classList.remove('show');
      }
    }, 300);
  });

  musicControls.addEventListener('mouseleave', () => {
    musicControls.classList.remove('show');
  });
}

if (isMobile) {
  const handleOutsideInteraction = (e) => {
    if (!menuOpen) return;
    
    const musicPlayer = document.getElementById('music-player');
    const musicControls = document.getElementById('music-controls');
    
    const isClickInsidePlayer = musicPlayer && musicPlayer.contains(e.target);
    const isClickInsideControls = musicControls && musicControls.contains(e.target);
    
    if (!isClickInsidePlayer && !isClickInsideControls) {
      closeMenu();
    }
  };
  
  document.addEventListener('touchstart', handleOutsideInteraction, true);
  document.addEventListener('click', handleOutsideInteraction, true);
  
  const debouncedCloseMenu = debounce(closeMenu, 100);
  window.addEventListener('scroll', () => {
    if (menuOpen) {
      debouncedCloseMenu();
    }
  }, { passive: true });
}

playPauseBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (audio.paused) {
    if (!audio.src) loadSong(currentSongIndex);
    playSong();
  } else {
    pauseSong();
  }
});

prevBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  playPrevSong();
});

nextBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  playNextSong();
});

volumeSlider.addEventListener('input', (e) => {
  e.stopPropagation();
  audio.volume = volumeSlider.value;
});

const closeButton = document.getElementById('close-controls');
if (closeButton) {
  closeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    menuOpen = false;
    musicControls.classList.remove('show');
  }, true);
  
  closeButton.addEventListener('touchend', (e) => {
    e.stopPropagation();
    e.preventDefault();
    menuOpen = false;
    musicControls.classList.remove('show');
  }, true);
}

// ========================================
// Discord Status (Lanyard API)
// ========================================
const DISCORD_ID = '1003100550700748871';

async function fetchDiscordStatus() {
  const statusContainer = document.getElementById('discord-status');
  
  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.data) {
      displayDiscordStatus(data.data);
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.warn('Discord status unavailable:', error.message);
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
  
  // Find main activity (exclude custom status type 4)
  const activity = activities.find(a => a.type !== 4);
  
  let activityHTML = '';
  if (activity) {
    const activityTypes = {
      0: 'Playing',
      1: 'Streaming', 
      2: 'Listening to',
      3: 'Watching',
      5: 'Competing in'
    };
    
    const activityTitle = activityTypes[activity.type] || 'Activity';
    const activityName = activity.name;
    const details = activity.details || '';
    const state = activity.state || '';
    
    activityHTML = `
      <div class="discord-activity">
        <div class="discord-activity-title">${activityTitle}</div>
        <div class="discord-activity-name">${activityName}</div>
        ${details ? `<div class="discord-activity-details">${details}</div>` : ''}
        ${state ? `<div class="discord-activity-details">${state}</div>` : ''}
      </div>
    `;
  }
  
  const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
  
  statusContainer.innerHTML = `
    <div class="discord-info">
      <div class="discord-avatar-container">
        <img src="${avatarUrl}" alt="${user.username}" class="discord-avatar-img">
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

// Fetch Discord status on load
fetchDiscordStatus();
// Refresh every 30 seconds
setInterval(fetchDiscordStatus, 30000);

// ========================================
// Enka API Base Class
// ========================================
class EnkaAPI {
  constructor(config) {
    this.game = config.game;
    this.baseURL = config.baseURL;
    this.configuredUID = config.uid;
    this.elementIds = config.elementIds;
    this.proxies = [
      {
        name: 'AllOrigins',
        url: (apiUrl) => `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`,
        parse: (data) => {
          try {
            return JSON.parse(data.contents);
          } catch {
            return null;
          }
        }
      },
      {
        name: 'CodeTabs',
        url: (apiUrl) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(apiUrl)}`,
        parse: (data) => data
      },
      {
        name: 'Direct',
        url: (apiUrl) => apiUrl,
        parse: (data) => data
      }
    ];
    this.init();
  }

  init() {
    this.fetchPlayerData(this.configuredUID);
  }

  async fetchPlayerData(uid) {
    this.showLoading(true);
    this.hideError();
    this.hidePlayerInfo();

    const apiUrl = `${this.baseURL}/${uid}`;
    
    try {
      console.log(`Fetching ${this.game} data for UID:`, uid);
      
      for (const proxy of this.proxies) {
        try {
          console.log(`Trying ${this.game} with ${proxy.name}...`);
          
          const proxyUrl = proxy.url(apiUrl);
          const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
          
          if (!response.ok) {
            console.warn(`${proxy.name} failed with status ${response.status}`);
            continue;
          }
          
          const data = await response.json();
          const apiData = proxy.parse(data);
          
          if (!this.validateData(apiData)) {
            console.warn(`${proxy.name} returned invalid data structure`);
            continue;
          }
          
          console.log(`✅ Successfully fetched ${this.game} data using ${proxy.name}`);
          this.displayPlayerData(apiData);
          this.showLoading(false);
          return;
          
        } catch (error) {
          console.warn(`${proxy.name} error:`, error.message);
          continue;
        }
      }
      
      console.log(`All ${this.game} proxies failed, using mock data`);
      this.showError('Unable to fetch live data. Displaying demo data.');
      const apiData = this.getMockData();
      this.displayPlayerData(apiData);
      
    } catch (error) {
      console.error(`Error fetching ${this.game} data:`, error);
      this.showError('Failed to fetch player data. Displaying demo data.');
      this.displayPlayerData(this.getMockData());
    } finally {
      this.showLoading(false);
    }
  }

  showLoading(show) {
    const loadingEl = document.getElementById(this.elementIds.loading);
    if (loadingEl) {
      loadingEl.classList.toggle('hidden', !show);
    }
  }

  showError(message) {
    const errorEl = document.getElementById(this.elementIds.error);
    const errorTextEl = document.getElementById(this.elementIds.errorText);
    
    if (errorEl && errorTextEl) {
      errorTextEl.textContent = message;
      errorEl.classList.remove('hidden');
    }
  }

  hideError() {
    const errorEl = document.getElementById(this.elementIds.error);
    if (errorEl) errorEl.classList.add('hidden');
  }

  showPlayerInfo() {
    const playerInfoEl = document.getElementById(this.elementIds.playerInfo);
    if (playerInfoEl) playerInfoEl.classList.remove('hidden');
  }

  hidePlayerInfo() {
    const playerInfoEl = document.getElementById(this.elementIds.playerInfo);
    if (playerInfoEl) playerInfoEl.classList.add('hidden');
  }
}

// ========================================
// Honkai Star Rail API
// ========================================
class HSREnkaAPI extends EnkaAPI {
  constructor() {
    super({
      game: 'HSR',
      baseURL: 'https://enka.network/api/hsr/uid',
      uid: '832796099',
      elementIds: {
        loading: 'loading-indicator',
        error: 'error-message',
        errorText: 'error-text',
        playerInfo: 'hsr-player-info'
      }
    });
  }

  getMockData() {
    return {
      uid: this.configuredUID,
      detailInfo: {
        nickname: "Trailblazer",
        level: 70,
        worldLevel: 6,
        signature: "Demo data - API unavailable",
        recordInfo: {
          achievementCount: 800,
          maxRogueChallengeScore: 9,
          bookCount: 85
        }
      }
    };
  }

  validateData(data) {
    return data && data.detailInfo;
  }

  displayPlayerData(data) {
    try {
      if (!data || !data.detailInfo) {
        throw new Error('Invalid player data received');
      }

      const player = data.detailInfo;
      
      const nicknameEl = document.getElementById('player-nickname');
      if (nicknameEl) nicknameEl.textContent = player.nickname || 'Unknown Player';
      
      const levelEl = document.getElementById('player-level');
      if (levelEl) levelEl.textContent = player.level || '0';
      
      const worldLevelEl = document.getElementById('world-level');
      if (worldLevelEl) worldLevelEl.textContent = player.worldLevel || '0';
      
      const signatureEl = document.getElementById('player-signature');
      if (signatureEl) signatureEl.textContent = player.signature || 'No signature set';
      
      const achievementEl = document.getElementById('achievement-count');
      if (achievementEl) {
        const achievementCount = player.recordInfo?.achievementCount || 
                                 player.finishAchievementNum || 
                                 player.achievementCount || '0';
        achievementEl.textContent = achievementCount;
      }
      
      const uidEl = document.getElementById('player-uid');
      if (uidEl) uidEl.textContent = data.uid || 'N/A';
      
      const avatarEl = document.getElementById('player-avatar');
      if (avatarEl) {
        const avatarUrl = `https://enka.network/ui/hsr/SpriteOutput/AvatarRoundIcon/Avatar/1409.png`;
        avatarEl.onerror = () => {
          const initial = player.nickname?.charAt(0) || 'HSR';
          avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initial)}&size=90&background=667eea&color=ffffff&bold=true`;
        };
        avatarEl.src = avatarUrl;
      }
      
      this.displaySimulatedUniverse(player);
      this.showPlayerInfo();
      
    } catch (error) {
      console.error('Error displaying player data:', error);
      this.showError('Failed to display player data. Please try again.');
    }
  }

  displaySimulatedUniverse(player) {
    try {
      const recordInfo = player.recordInfo;
      
      if (!recordInfo) {
        document.getElementById('su-stars').textContent = '0';
        document.getElementById('hsr-exploration').textContent = '0%';
        return;
      }

      const suStarsEl = document.getElementById('su-stars');
      if (suStarsEl) suStarsEl.textContent = recordInfo.maxRogueChallengeScore || '0';

      const explorationEl = document.getElementById('hsr-exploration');
      if (explorationEl && recordInfo.bookCount !== undefined) {
        const explorationPercent = Math.min(Math.round((recordInfo.bookCount / 120) * 100), 100);
        explorationEl.textContent = explorationPercent + '%';
      } else if (explorationEl) {
        explorationEl.textContent = '0%';
      }
      
    } catch (error) {
      console.error('Error displaying HSR stats:', error);
      document.getElementById('su-stars').textContent = '0';
      document.getElementById('hsr-exploration').textContent = '0%';
    }
  }
}

// ========================================
// Zenless Zone Zero API
// ========================================
class ZZZEnkaAPI extends EnkaAPI {
  constructor() {
    super({
      game: 'ZZZ',
      baseURL: 'https://enka.network/api/zzz/uid',
      uid: '1302036813',
      elementIds: {
        loading: 'zzz-loading-indicator',
        error: 'zzz-error-message',
        errorText: 'zzz-error-text',
        playerInfo: 'zzz-player-info'
      }
    });
  }

  getMockData() {
    return {
      uid: this.configuredUID,
      PlayerInfo: {
        SocialDetail: {
          ProfileDetail: {
            Nickname: "Proxy",
            Level: 50,
            Uid: this.configuredUID
          },
          Desc: "Demo data - API unavailable",
          MedalList: [
            { MedalType: 1, MedalScore: 0 },
            { MedalType: 3, MedalScore: 0 },
            { MedalType: 7, MedalScore: 0 }
          ]
        }
      }
    };
  }

  validateData(data) {
    return data && data.PlayerInfo;
  }

  displayPlayerData(data) {
    try {
      const playerInfo = data.PlayerInfo;
      if (!playerInfo || !playerInfo.SocialDetail || !playerInfo.SocialDetail.ProfileDetail) {
        throw new Error('Invalid player data structure');
      }
      
      const player = playerInfo.SocialDetail.ProfileDetail;
      const socialDetail = playerInfo.SocialDetail;
      
      const nicknameEl = document.getElementById('zzz-player-nickname');
      if (nicknameEl) nicknameEl.textContent = player.Nickname || 'Unknown Player';
      
      const levelEl = document.getElementById('zzz-player-level');
      if (levelEl) levelEl.textContent = player.Level || '0';
      
      const signatureEl = document.getElementById('zzz-player-signature');
      if (signatureEl) signatureEl.textContent = socialDetail.Desc || 'No signature set';
      
      const uidEl = document.getElementById('zzz-player-uid');
      if (uidEl) uidEl.textContent = player.Uid || data.uid || 'N/A';
      
      const avatarEl = document.getElementById('zzz-player-avatar');
      if (avatarEl) {
        const avatarUrl = `https://enka.network/ui/zzz/IconInterKnotRole0013.png`;
        avatarEl.onerror = () => {
          const initial = (player.Nickname || 'ZZZ').charAt(0);
          avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initial)}&size=90&background=e63946&color=ffffff&bold=true`;
        };
        avatarEl.src = avatarUrl;
      }
      
      this.displayChallengeStats(playerInfo);
      this.showPlayerInfo();
      
    } catch (error) {
      console.error('Error displaying ZZZ player data:', error);
      this.showError(`Failed to display player data: ${error.message}`);
    }
  }

  displayChallengeStats(playerInfo) {
    try {
      const medals = playerInfo.SocialDetail?.MedalList || [];
      
      let shiyuStars = 0;
      let lineBreaker = 0;
      let disintegration = 0;
      
      medals.forEach(medal => {
        if (medal.MedalType === 1) shiyuStars = medal.MedalScore || medal.Value || 0;
        else if (medal.MedalType === 3) lineBreaker = medal.MedalScore || medal.Value || 0;
        else if (medal.MedalType === 7) disintegration = medal.MedalScore || medal.Value || 0;
      });

      const shiyuEl = document.getElementById('shiyu-defense');
      if (shiyuEl) shiyuEl.textContent = shiyuStars;

      const lineBreakerEl = document.getElementById('line-breaker');
      if (lineBreakerEl) lineBreakerEl.textContent = lineBreaker;

      const disintegrationEl = document.getElementById('disintegration');
      if (disintegrationEl) disintegrationEl.textContent = disintegration;
      
    } catch (error) {
      console.error('Error displaying ZZZ challenge data:', error);
      const shiyuEl = document.getElementById('shiyu-defense');
      const lineBreakerEl = document.getElementById('line-breaker');
      const disintegrationEl = document.getElementById('disintegration');
      
      if (shiyuEl) shiyuEl.textContent = '0';
      if (lineBreakerEl) lineBreakerEl.textContent = '0';
      if (disintegrationEl) disintegrationEl.textContent = '0';
    }
  }
}

// Initialize APIs
const hsrAPI = new HSREnkaAPI();
const zzzAPI = new ZZZEnkaAPI();

// ========================================
// Copy UID functionality
// ========================================
function copyUID(uidText, buttonId) {
  navigator.clipboard.writeText(uidText).then(() => {
    const btn = document.getElementById(buttonId);
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ Copied!';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
    const btn = document.getElementById(buttonId);
    const originalText = btn.innerHTML;
    btn.innerHTML = '✗ Failed';
    btn.style.background = 'linear-gradient(135deg, #ef4444, #b91c1c)';
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
    }, 2000);
  });
}

document.getElementById('copy-hsr-uid').addEventListener('click', function() {
  const uidText = document.getElementById('player-uid').textContent;
  copyUID(uidText, 'copy-hsr-uid');
});

document.getElementById('copy-zzz-uid').addEventListener('click', function() {
  const uidText = document.getElementById('zzz-player-uid').textContent;
  copyUID(uidText, 'copy-zzz-uid');
});
