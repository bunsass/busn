// ========================================
// Mobile Detection
// ========================================
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// ========================================
// Initialize Media Elements
// ========================================
let hasUserInteracted = false;
let currentAudio = null;
let isMuted = false;

function initMedia() {
  console.log("initMedia called");
  const audio = document.getElementById('audio');
  
  if (audio) {
    audio.volume = 0.5;
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
  const container = document.querySelector('.container');
  
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
    setupSplashScreen(splashScreen, container);
  }
}

// ========================================
// Splash Screen Handler (iOS Compatible)
// ========================================
function setupSplashScreen(splashScreen, container) {
  // Single unified interaction handler
  function handleSplashInteraction(e) {
    if (hasUserInteracted) return;
    
    e.preventDefault();
    e.stopPropagation();
    hasUserInteracted = true;
    
    console.log("Splash screen clicked");
    
    // SMOOTH fade transition - no white flash
    splashScreen.style.transition = 'opacity 0.8s ease-out';
    splashScreen.style.opacity = '0';
    splashScreen.style.pointerEvents = 'none';
    
    // Make container visible smoothly
    if (container) {
      container.style.transition = 'opacity 0.8s ease-in';
      container.style.opacity = '1';
    }
    
    setTimeout(() => {
      splashScreen.classList.add('hidden');
      splashScreen.remove();
    }, 800);
    
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
  const albumArtContainer = document.getElementById('album-art-container');
  const playPauseBtn = document.getElementById('play-pause');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const volumeSlider = document.getElementById('volume');
  const songInfo = document.getElementById('song-info');
  const musicControls = document.getElementById('music-controls');
  
  if (!audio) return;
  
  currentAudio = audio;
  audio.volume = 0.5;
  
  // Ensure album art loads properly on iOS
  if (albumArt && isIOS) {
    albumArt.style.display = 'block';
    albumArt.style.visibility = 'visible';
    albumArt.style.opacity = '1';
    // Force iOS to render the image
    const imgSrc = albumArt.src;
    albumArt.src = '';
    setTimeout(() => {
      albumArt.src = imgSrc;
    }, 10);
  }
  
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
  
  // Album art click handler - works for both desktop and mobile
  if (albumArtContainer) {
    const handleAlbumClick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      
      if (audio.paused) {
        if (!audio.src || audio.src === '') loadSong(currentSongIndex);
        playSong();
      } else {
        pauseSong();
      }
      
      // Toggle menu on mobile
      if (isMobile && musicControls) {
        menuOpen = !menuOpen;
        if (menuOpen) {
          musicControls.classList.add('show');
        } else {
          musicControls.classList.remove('show');
        }
      }
    };
    
    albumArtContainer.addEventListener('click', handleAlbumClick);
    
    if (isTouchDevice) {
      albumArtContainer.addEventListener('touchend', handleAlbumClick, { passive: false });
    }
  }
  
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (audio.paused) {
        if (!audio.src || audio.src === '') loadSong(currentSongIndex);
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
  if (!isMobile && albumArtContainer && musicControls) {
    let hoverTimeout;
    
    albumArtContainer.addEventListener('mouseenter', () => {
      hoverTimeout = setTimeout(() => {
        musicControls.classList.add('show');
      }, 300);
    });

    albumArtContainer.addEventListener('mouseleave', () => {
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

// ========================================
// Game APIs Initialization
// ========================================
function initializeGameAPIs() {
  // Initialize HSR and ZZZ APIs
  try {
    const hsrAPI = new HSREnkaAPI();
    const zzzAPI = new ZZZEnkaAPI();
    console.log("Game APIs initialized successfully");
  } catch (error) {
    console.error("Error initializing game APIs:", error);
  }
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
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    
    const originalText = btn.innerHTML;
    btn.innerHTML = '✗ Failed';
    btn.style.background = 'linear-gradient(135deg, #ef4444, #b91c1c)';
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
    }, 2000);
  });
}

// Setup copy UID buttons
function setupCopyButtons() {
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
  
  // Setup copy buttons
  setupCopyButtons();
});

// Additional load event
window.addEventListener('load', () => {
  console.log("Window load event fired");
});
