// ========================================
// Mobile Detection
// ========================================
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

// ========================================
// Initialize Media Elements
// ========================================
let hasUserInteracted = false;
let currentAudio = null;
let isMuted = false;

function initMedia() {
  console.log("initMedia called");
  const backgroundMusic = document.getElementById('audio');
  const backgroundVideo = document.getElementById('background');
  
  if (backgroundMusic) {
    backgroundMusic.volume = 0.5;
  }
}

// ========================================
// Custom Cursor Setup
// ========================================
function setupCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  
  if (!cursor) return;
  
  if (isTouchDevice) {
    document.body.classList.add('touch-device');
    cursor.style.display = 'none';
  } else {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursor.style.display = 'block';
    });

    document.addEventListener('mousedown', () => {
      cursor.style.transform = 'scale(0.8) translate(-50%, -50%)';
    });

    document.addEventListener('mouseup', () => {
      cursor.style.transform = 'scale(1) translate(-50%, -50%)';
    });
  }
}

// ========================================
// Loading & Splash Screen Handler
// ========================================
function setupLoadingAndSplash() {
  const loadingScreen = document.getElementById('loading-screen');
  const splashScreen = document.getElementById('splash-screen');
  
  // Show loading screen first, then splash
  window.addEventListener('load', () => {
    console.log("Window loaded");
    
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
          loadingScreen.remove();
        }, 800);
      }
      
      // Show splash screen after loading
      if (splashScreen) {
        splashScreen.classList.remove('hidden');
      }
    }, 2000);
  });
  
  // Setup splash screen interaction
  if (splashScreen) {
    setupSplashScreen(splashScreen);
  }
}

// ========================================
// Splash Screen Handler (iOS Compatible)
// ========================================
function setupSplashScreen(splashScreen) {
  // Single unified interaction handler
  function handleSplashInteraction(e) {
    if (hasUserInteracted) return;
    
    e.preventDefault();
    e.stopPropagation();
    hasUserInteracted = true;
    
    console.log("Splash screen clicked");
    
    // Hide splash screen
    splashScreen.style.opacity = '0';
    splashScreen.style.pointerEvents = 'none';
    
    setTimeout(() => {
      splashScreen.classList.add('hidden');
      splashScreen.remove();
    }, 500);
    
    // Initialize audio
    const audio = document.getElementById('audio');
    if (audio) {
      audio.volume = 0.5;
      currentAudio = audio;
      
      // Try to play first song
      const songs = [
        {
          title: "Time To love",
          url: "https://raw.githubusercontent.com/bunsass/busn/main/asset/Time%20To%20Love.mp3"
        }
      ];
      
      audio.src = songs[0].url;
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio started successfully");
            const albumArt = document.getElementById('album-art');
            if (albumArt) albumArt.classList.add('playing');
            
            const playPauseBtn = document.getElementById('play-pause');
            if (playPauseBtn) playPauseBtn.textContent = '⏸ Pause';
            
            const songInfo = document.getElementById('song-info');
            if (songInfo) {
              songInfo.textContent = `♪ ${songs[0].title}`;
              songInfo.classList.add('show');
            }
          })
          .catch(err => {
            console.warn("Audio autoplay prevented:", err);
            // Set up click-anywhere-to-play fallback
            document.addEventListener('click', function audioFallback() {
              audio.play().then(() => {
                console.log("Audio started after user interaction");
                document.removeEventListener('click', audioFallback);
                
                const albumArt = document.getElementById('album-art');
                if (albumArt) albumArt.classList.add('playing');
                
                const playPauseBtn = document.getElementById('play-pause');
                if (playPauseBtn) playPauseBtn.textContent = '⏸ Pause';
              });
            }, { once: true });
          });
      }
    }
    
    // Start typewriter effects
    typeWriterEffect();
    
    // Initialize all other features
    initializeAllFeatures();
  }
  
  // Attach event listeners
  splashScreen.addEventListener('click', handleSplashInteraction, { once: true });
  
  if (isTouchDevice) {
    splashScreen.addEventListener('touchend', handleSplashInteraction, { once: true, passive: false });
  }
}

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
// Initialize All Features After Splash
// ========================================
function initializeAllFeatures() {
  console.log("Initializing all features...");
  
  // Initialize particles
  initializeParticles();
  
  // Setup music player
  setupMusicPlayer();
  
  // Fetch Discord status
  fetchDiscordStatus();
  
  // Setup scroll animations
  setupScrollAnimations();
  
  // Initialize game APIs
  initializeGameAPIs();
  
  console.log("All features initialized");
}

// ========================================
// Background Particles
// ========================================
function initializeParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;
  
  const particleCount = isMobile ? 5 : 30;
  
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
}

// ========================================
// Music Player Setup
// ========================================
function setupMusicPlayer() {
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
  
  if (!audio) return;
  
  currentAudio = audio;
  audio.volume = 0.5;
  
  function loadSong(index) {
    const song = songs[index];
    audio.src = song.url;
    if (songInfo) songInfo.textContent = `♪ ${song.title}`;
  }
  
  function playSong() {
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        if (albumArt) albumArt.classList.add('playing');
        if (playPauseBtn) playPauseBtn.textContent = '⏸ Pause';
        if (songInfo) songInfo.classList.add('show');
      }).catch(error => {
        console.warn('Playback prevented:', error);
      });
    }
  }
  
  function pauseSong() {
    audio.pause();
    if (albumArt) albumArt.classList.remove('playing');
    if (playPauseBtn) playPauseBtn.textContent = '▶ Play';
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
  
  // Event listeners
  if (audio) {
    audio.addEventListener('ended', () => {
      playNextSong();
    });
  }
  
  let menuOpen = false;
  
  if (albumArt) {
    albumArt.addEventListener('click', (e) => {
      e.stopPropagation();
      
      if (audio.paused) {
        if (!audio.src) loadSong(currentSongIndex);
        playSong();
      } else {
        pauseSong();
      }
      
      if (isMobile && musicControls) {
        menuOpen = !menuOpen;
        if (menuOpen) {
          musicControls.classList.add('show');
        } else {
          musicControls.classList.remove('show');
        }
      }
    });
  }
  
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (audio.paused) {
        if (!audio.src) loadSong(currentSongIndex);
        playSong();
      } else {
        pauseSong();
      }
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playPrevSong();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playNextSong();
    });
  }
  
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      e.stopPropagation();
      audio.volume = volumeSlider.value;
    });
  }
  
  const closeButton = document.getElementById('close-controls');
  if (closeButton && musicControls) {
    closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      menuOpen = false;
      musicControls.classList.remove('show');
    });
  }
  
  // Desktop hover behavior
  if (!isMobile && albumArt && musicControls) {
    albumArt.addEventListener('mouseenter', () => {
      setTimeout(() => {
        musicControls.classList.add('show');
      }, 300);
    });

    albumArt.addEventListener('mouseleave', () => {
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
}

// ========================================
// Scroll Animations
// ========================================
function setupScrollAnimations() {
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
}

// ========================================
// Discord Status (Lanyard API)
// ========================================
const DISCORD_ID = '1003100550700748871';

async function fetchDiscordStatus() {
  const statusContainer = document.getElementById('discord-status');
  if (!statusContainer) return;
  
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
        Discord status currently unavailable
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

// ========================================
// Game APIs (Placeholder - add your existing code)
// ========================================
function initializeGameAPIs() {
  // Add your HSR and ZZZ API code here
  console.log("Game APIs initialized");
}

// ========================================
// Copy UID functionality
// ========================================
function copyUID(uidText, buttonId) {
  navigator.clipboard.writeText(uidText).then(() => {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ Copied!';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

const copyHsrBtn = document.getElementById('copy-hsr-uid');
if (copyHsrBtn) {
  copyHsrBtn.addEventListener('click', function() {
    const uidText = document.getElementById('player-uid')?.textContent;
    if (uidText) copyUID(uidText, 'copy-hsr-uid');
  });
}

const copyZzzBtn = document.getElementById('copy-zzz-uid');
if (copyZzzBtn) {
  copyZzzBtn.addEventListener('click', function() {
    const uidText = document.getElementById('zzz-player-uid')?.textContent;
    if (uidText) copyUID(uidText, 'copy-zzz-uid');
  });
}

// ========================================
// Initialize on DOM Ready
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM Content Loaded - Setting up...");
  
  // Initialize media
  initMedia();
  
  // Setup custom cursor
  setupCustomCursor();
  
  // Setup loading and splash screens
  setupLoadingAndSplash();
});

// Additional load event
window.addEventListener('load', () => {
  console.log("Window load event fired");
});
