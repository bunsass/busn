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
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const particleCount = isMobile ? 5 : 30;

// Fix for Safari full-screen viewport issues
if (isIOS || isSafari) {
  const fixViewport = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  fixViewport();
  window.addEventListener('resize', fixViewport);
  window.addEventListener('orientationchange', fixViewport);
}

// ========================================
// Global State
// ========================================
let hasUserInteracted = false;

// ========================================
// Loading & Splash Screen Handler
// ========================================
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 800);
    }
  }, 2000);
});

// ========================================
// Splash Screen Handler
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const splashScreen = document.getElementById('splash-screen');
  const container = document.querySelector('.container');
  const audio = document.getElementById('audio');
  
  if (!splashScreen) return;
  
  function handleSplashClick(e) {
    if (hasUserInteracted) return;
    
    e.preventDefault();
    e.stopPropagation();
    hasUserInteracted = true;
    
    console.log("Splash screen clicked - starting experience");
    
    document.body.classList.add('splash-dismissed');
    document.body.classList.add('content-visible');
    
    splashScreen.classList.add('fade-out');
    
    if (container) {
      container.classList.add('visible');
    }
    
    setTimeout(() => {
      splashScreen.style.display = 'none';
    }, 800);
    
    if (audio && songs.length > 0) {
      audio.volume = 0.5;
      audio.load();
      loadSong(currentSongIndex);
      
      const playAttempt = () => {
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Audio autoplay successful");
              updateAudioUI(true);
            })
            .catch(err => {
              console.warn("Audio autoplay blocked:", err);
              console.log("Audio ready for manual play");
            });
        }
      };
      
      playAttempt();
    }
    
    setTimeout(() => {
      typeWriterEffect();
    }, 300);
  }
  
  splashScreen.addEventListener('click', handleSplashClick, { once: true });
  splashScreen.addEventListener('touchend', handleSplashClick, { once: true, passive: false });
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
// Typewriter Effect for Greeting
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

const visualizerCanvas = document.getElementById('visualizer');
const visualizerCtx = visualizerCanvas.getContext('2d');
visualizerCanvas.width = 120;
visualizerCanvas.height = 60;

let audioContext = null;
let analyser = null;
let sourceNode = null;
let dataArray = null;
let bufferLength = 0;
let isVisualizerActive = false;

function updateAudioUI(isPlaying) {
  const albumArt = document.getElementById('album-art');
  const playPauseBtn = document.getElementById('play-pause');
  const songInfo = document.getElementById('song-info');
  
  if (isPlaying) {
    if (albumArt) albumArt.classList.add('playing');
    if (playPauseBtn) playPauseBtn.textContent = '⏸ Pause';
    if (songInfo) {
      songInfo.textContent = `♪ ${songs[currentSongIndex].title}`;
      songInfo.classList.add('show');
    }
    
    if (!audioContext) setupAudioContext();
    if (audioContext) {
      visualizerCanvas.classList.add('active');
      isVisualizerActive = true;
      drawVisualizer();
    }
  }
}

function setupAudioContext() {
  if (!audioContext) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContext();
      analyser = audioContext.createAnalyser();
      
      if (!sourceNode) {
        sourceNode = audioContext.createMediaElementSource(audio);
        sourceNode.connect(analyser);
      }
      
      analyser.connect(audioContext.destination);
      analyser.fftSize = 64;
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      return true;
    } catch (error) {
      console.warn('Audio visualizer not supported:', error);
      return false;
    }
  }
  
  if (audioContext.state === 'suspended') {
    audioContext.resume();
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
  console.log("playSong called - current song:", songs[currentSongIndex].title);
  
  if (!audio.src || audio.src === '') {
    console.log("No audio source, loading song");
    loadSong(currentSongIndex);
  }
  
  if (!audioContext) {
    setupAudioContext();
  }
  
  if (audioContext && audioContext.state === 'suspended') {
    console.log("Resuming suspended audio context");
    audioContext.resume().then(() => {
      console.log("Audio context resumed");
    });
  }
  
  if (isIOS || isSafari) {
    audio.load();
  }
  
  const playPromise = audio.play();
  
  if (playPromise !== undefined) {
    playPromise.then(() => {
      console.log("Playback started successfully");
      albumArt.classList.add('playing');
      playPauseBtn.textContent = '⏸ Pause';
      songInfo.classList.add('show');
      
      if (audioContext) {
        visualizerCanvas.classList.add('active');
        isVisualizerActive = true;
        drawVisualizer();
      }
    }).catch(error => {
      console.error('Playback prevented:', error);
      console.log('Error details:', {
        name: error.name,
        message: error.message,
        audioState: audio.readyState,
        audioSrc: audio.src,
        audioContextState: audioContext?.state
      });
      
      albumArt.classList.remove('playing');
      playPauseBtn.textContent = '▶ Play';
      
      if (error.name === 'NotAllowedError' || error.name === 'NotSupportedError') {
        console.log("Attempting recovery...");
        audio.load();
      }
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
  
  console.log("Album art clicked");
  console.log("Audio state:", {
    paused: audio.paused,
    src: audio.src,
    readyState: audio.readyState,
    hasUserInteracted: hasUserInteracted
  });
  
  if (audio.paused) {
    if (!audio.src || audio.src === '') {
      console.log("Loading song first");
      loadSong(currentSongIndex);
    }
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

albumArt.addEventListener('touchend', (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  console.log("Album art touched");
  
  if (audio.paused) {
    if (!audio.src || audio.src === '') {
      loadSong(currentSongIndex);
    }
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
}, { passive: false });

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
  e.preventDefault();
  
  console.log("Play/Pause button clicked");
  
  if (audio.paused) {
    if (!audio.src || audio.src === '') loadSong(currentSongIndex);
    playSong();
  } else {
    pauseSong();
  }
});

playPauseBtn.addEventListener('touchend', (e) => {
  e.stopPropagation();
  e.preventDefault();
  
  console.log("Play/Pause button touched");
  
  if (audio.paused) {
    if (!audio.src || audio.src === '') loadSong(currentSongIndex);
    playSong();
  } else {
    pauseSong();
  }
}, { passive: false });

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

fetchDiscordStatus();
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
          if (data.contents) {
            try {
              return JSON.parse(data.contents);
            } catch (e) {
              console.warn('AllOrigins parse error:', e);
              return null;
            }
          }
          return data;
        }
      },
      {
        name: 'CodeTabs',
        url: (apiUrl) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(apiUrl)}`,
        parse: (data) => data
      },
      {
        name: 'CORSProxy.io',
        url: (apiUrl) => `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`,
        parse: (data) => data
      },
      {
        name: 'ThingProxy',
        url: (apiUrl) => `https://thingproxy.freeboard.io/fetch/${apiUrl}`,
        parse: (data) => data
      },
      {
        name: 'CORS.SH',
        url: (apiUrl) => `https://cors.sh/${apiUrl}`,
        parse: (data) => data
      },
      {
        name: 'CORS Anywhere',
        url: (apiUrl) => `https://cors-anywhere.herokuapp.com/${apiUrl}`,
        parse: (data) => data
      },
      {
        name: 'JSONProxy',
        url: (apiUrl) => `https://jsonp.afeld.me/?url=${encodeURIComponent(apiUrl)}`,
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
    
    console.log(`\n${'='.repeat(80)}`);
    console.log(`🎮 Testing ${this.game} - UID: ${uid}`);
    console.log(`🔗 API URL: ${apiUrl}`);
    console.log(`${'='.repeat(80)}\n`);
    
    for (const proxy of this.proxies) {
      try {
        console.log(`\n🔄 Trying ${proxy.name}...`);
        
        const proxyUrl = proxy.url(apiUrl);
        console.log(`   Proxy URL: ${proxyUrl}`);
        
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: { 
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          },
          mode: 'cors',
          credentials: 'omit'
        });
        
        console.log(`   Status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
          console.warn(`   ❌ ${proxy.name} failed with status ${response.status}`);
          continue;
        }
        
        const data = await response.json();
        console.log(`   ✅ ${proxy.name} SUCCESS!`);
        
        let apiData = proxy.parse(data);
        
        if (proxy.name === 'AllOrigins' && data.contents) {
          console.log(`   📦 Parsing AllOrigins wrapper...`);
          try {
            apiData = JSON.parse(data.contents);
            console.log(`   ✅ Successfully parsed AllOrigins contents`);
          } catch (e) {
            console.warn(`   ⚠️ Failed to parse AllOrigins contents:`, e.message);
            continue;
          }
        }
        
        console.log(`   📊 Data structure:`, apiData);
        
        if (!this.validateData(apiData)) {
          console.warn(`   ❌ ${proxy.name} returned invalid data structure`);
          console.log(`   Expected fields not found`);
          continue;
        }
        
        console.log(`\n🎉 SUCCESS! Using ${proxy.name} for ${this.game}`);
        console.log(`${'='.repeat(80)}\n`);
        
        this.showLoading(false);
        this.hideError();
        this.displayPlayerData(apiData);
        this.showPlayerInfo();
        return;
        
      } catch (error) {
        console.warn(`   ❌ ${proxy.name} error:`, error.message);
        continue;
      }
    }
    
    console.error(`\n💔 All ${this.game} proxies failed`);
    console.log(`Possible reasons:`);
    console.log(`  • API is down or rate-limited`);
    console.log(`  • UID is invalid or private`);
    console.log(`  • All proxy services are blocked`);
    console.log(`  • Safari full-screen mode may block CORS`);
    console.log(`  • Try again in a few minutes\n`);
    
    this.showError('Unable to fetch live data. Displaying demo data.');
    this.showLoading(false);
    this.displayPlayerData(this.getMockData());
    this.showPlayerInfo();
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

  validateData(data) {
    if (data && data.detailInfo) return true;
    if (data && data.uid && data.ttl) return true;
    return false;
  }

  displayPlayerData(data) {
    try {
      const info = data.detailInfo;
      
      if (!info) {
        console.error('❌ HSR: detailInfo not found in data');
        return;
      }
      
      console.log('🔍 HSR: Displaying player data:', info);
      
      const avatarImg = document.getElementById('player-avatar');
      if (avatarImg) {
        const avatarUrl = info.headIcon 
          ? `https://enka.network/ui/hsr/SpriteOutput/AvatarRoundIcon/Avatar/${info.headIcon}.png`
          : 'https://enka.network/ui/hsr/SpriteOutput/AvatarRoundIcon/Avatar/1409.png';
        avatarImg.src = avatarUrl;
        avatarImg.onerror = () => {
          avatarImg.src = 'https://enka.network/ui/hsr/SpriteOutput/AvatarRoundIcon/Avatar/1409.png';
        };
      }
      
      const nicknameEl = document.getElementById('player-nickname');
      if (nicknameEl) nicknameEl.textContent = info.nickname || 'Trailblazer';
      
      const levelEl = document.getElementById('player-level');
      if (levelEl) levelEl.textContent = info.level || 70;
      
      const worldLevelEl = document.getElementById('world-level');
      if (worldLevelEl) worldLevelEl.textContent = info.worldLevel || 6;
      
      const signatureEl = document.getElementById('player-signature');
      if (signatureEl) signatureEl.textContent = info.signature || 'May this journey lead us starward.';
      
      const achievementEl = document.getElementById('achievement-count');
      if (achievementEl) achievementEl.textContent = info.recordInfo?.achievementCount || 0;
      
      const suStarsEl = document.getElementById('su-stars');
      if (suStarsEl) suStarsEl.textContent = info.recordInfo?.maxRogueChallengeScore || 0;
      
      const lightConesEl = document.getElementById('lightcones-count');
      if (lightConesEl) lightConesEl.textContent = info.recordInfo?.equipmentCount || 0;
      
      const uidEl = document.getElementById('player-uid');
      if (uidEl) uidEl.textContent = data.uid || this.configuredUID;
      
      const copyBtn = document.getElementById('copy-hsr-uid');
      if (copyBtn) {
        copyBtn.onclick = () => {
          navigator.clipboard.writeText(data.uid || this.configuredUID);
          copyBtn.textContent = '✓ Copied!';
          setTimeout(() => {
            copyBtn.textContent = '📋 Copy';
          }, 2000);
        };
      }
      
      console.log('✅ HSR: Successfully displayed player data');
      this.showPlayerInfo();
      
    } catch (error) {
      console.error('❌ HSR: Error displaying player data:', error);
      console.error('Data received:', data);
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
            Nickname: 'Buns',
            Level: 60,
            Uid: this.configuredUID,
            AvatarId: 2021
          },
          Desc: 'skibidi',
          MedalList: [
            { MedalType: 3, Value: 0 },
            { MedalType: 1, Value: 0 },
            { MedalType: 7, Value: 0 }
          ]
        }
      }
    };
  }

  validateData(data) {
    if (data && data.PlayerInfo && data.PlayerInfo.SocialDetail) return true;
    if (data && data.uid && data.ttl) return true;
    return false;
  }

  displayPlayerData(data) {
    const socialDetail = data.PlayerInfo.SocialDetail;
    const profileDetail = socialDetail.ProfileDetail;
    
    const avatarImg = document.getElementById('zzz-player-avatar');
    if (avatarImg) {
      avatarImg.src = 'https://enka.network/ui/zzz/IconInterKnotRole0013.png';
      avatarImg.onerror = () => {
        avatarImg.src = 'https://raw.githubusercontent.com/bunsass/busn/main/asset/Sticker_PPG_24_Evernight_03.webp';
      };
    }
    
    const nicknameEl = document.getElementById('zzz-player-nickname');
    if (nicknameEl) nicknameEl.textContent = profileDetail.Nickname || 'Proxy';
    
    const levelEl = document.getElementById('zzz-player-level');
    if (levelEl) levelEl.textContent = profileDetail.Level || 60;
    
    const signatureEl = document.getElementById('zzz-player-signature');
    if (signatureEl) signatureEl.textContent = socialDetail.Desc || 'Welcome to New Eridu!';
    
    const medals = socialDetail.MedalList || [];
    
    const lineBreakerMedal = medals.find(m => m.MedalType === 3);
    const lineBreakerEl = document.getElementById('line-breaker');
    if (lineBreakerEl) lineBreakerEl.textContent = lineBreakerMedal?.Value || 0;
    
    const shiyuMedal = medals.find(m => m.MedalType === 1);
    const shiyuEl = document.getElementById('shiyu-defense');
    if (shiyuEl) shiyuEl.textContent = shiyuMedal?.Value || 0;
    
    const disintegrationMedal = medals.find(m => m.MedalType === 7);
    const disintegrationEl = document.getElementById('disintegration');
    if (disintegrationEl) disintegrationEl.textContent = disintegrationMedal?.Value || 0;
    
    const uidEl = document.getElementById('zzz-player-uid');
    if (uidEl) uidEl.textContent = profileDetail.Uid || data.uid || this.configuredUID;
    
    const copyBtn = document.getElementById('copy-zzz-uid');
    if (copyBtn) {
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(profileDetail.Uid || data.uid || this.configuredUID);
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
          copyBtn.textContent = '📋 Copy';
        }, 2000);
      };
    }
    
    this.showPlayerInfo();
  }
}

// Initialize both game APIs
new HSREnkaAPI();
new ZZZEnkaAPI();
