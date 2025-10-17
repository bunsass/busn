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
// Splash Screen & Autoplay
// ========================================
const splashScreen = document.getElementById('splash-screen');

splashScreen.addEventListener('click', () => {
  splashScreen.classList.add('fade-out');
  
  if (!audio.src) {
    loadSong(currentSongIndex);
  }
  playSong();
  
  setTimeout(() => {
    typeWriterEffect();
  }, 300);
  
  setTimeout(() => {
    splashScreen.remove();
  }, 800);
});

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
// Music Player
// ========================================
const songs = [
  {
    title: "Time To love",
    url: "https://select-red-x4xaymxkyg.edgeone.app/Time%20To%20Love.mp3"
  },
  {
    title: "Had I Not Seen the Sun",
    url: "https://spontaneous-indigo-cgcjbksra5.edgeone.app/Had%20I%20Not%20Seen%20the%20Sun.mp3"
  },
  {
    title: "if i can stop one heart from breaking",
    url: "https://inquisitive-azure-jxdjgly1ow.edgeone.app/If%20I%20Can%20Stop%20One%20Heart%20From%20Breaking.mp3"
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

audio.volume = 0.5;

function loadSong(index) {
  const song = songs[index];
  audio.src = song.url;
  songInfo.textContent = `♪ ${song.title}`;
}

function playSong() {
  audio.play();
  albumArt.classList.add('playing');
  playPauseBtn.textContent = '⏸ Pause';
  songInfo.classList.add('show');
}

function pauseSong() {
  audio.pause();
  albumArt.classList.remove('playing');
  playPauseBtn.textContent = '▶ Play';
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

// Auto-play next song when current song ends
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

setTimeout(() => {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });
}, 100);

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
        name: 'CodeTabs',
        url: (apiUrl) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(apiUrl)}`,
        parse: (data) => data
      },
      {
        name: 'AllOrigins',
        url: (apiUrl) => `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`,
        parse: (data) => JSON.parse(data.contents)
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
    btn.innerHTML = '❌ Failed';
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
