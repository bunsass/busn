// ========================================
// Mobile Detection & Performance Optimization
// ========================================
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
const particleCount = isMobile ? 10 : 40; // Drastically reduced for performance

// ========================================
// Background Particles (Purple/blue mystical orbs)
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
  
  // Purple/blue/pink mystical particles matching Evernight theme
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
    title: "Had I Not Seen the Sun",
    url: "https://spontaneous-indigo-cgcjbksra5.edgeone.app/Had%20I%20Not%20Seen%20the%20Sun.mp3"
  },
  {
    title: "Time To love",
    url: "https://select-red-x4xaymxkyg.edgeone.app/Time%20To%20Love.mp3"
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

albumArt.addEventListener('click', (e) => {
  e.stopPropagation();
  
  if (audio.paused) {
    if (!audio.src) loadSong(currentSongIndex);
    playSong();
  } else {
    pauseSong();
  }
  
  // Toggle menu on mobile
  if (isMobile) {
    musicControls.classList.toggle('show');
  }
});

albumArt.addEventListener('dblclick', (e) => {
  e.preventDefault();
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  playSong();
});

// Desktop hover behavior
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

// Mobile: Close menu when clicking/touching outside
if (isMobile) {
  const closeMenu = (e) => {
    const musicPlayer = document.getElementById('music-player');
    const isClickInsidePlayer = musicPlayer.contains(e.target);
    const isClickInsideControls = musicControls.contains(e.target);
    
    if (!isClickInsidePlayer && !isClickInsideControls && musicControls.classList.contains('show')) {
      musicControls.classList.remove('show');
    }
  };
  
  // Listen to both click and touchstart for better mobile support
  document.addEventListener('click', closeMenu);
  document.addEventListener('touchstart', closeMenu);
}

playPauseBtn.addEventListener('click', (e) => {
  if (audio.paused) {
    if (!audio.src) loadSong(currentSongIndex);
    playSong();
  } else {
    pauseSong();
  }
});

prevBtn.addEventListener('click', (e) => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  playSong();
});

nextBtn.addEventListener('click', (e) => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  playSong();
});

volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
});

// ========================================
// Dynamic Greeting Based on Time
// ========================================
function updateGreeting() {
  const greetingEl = document.getElementById('greeting');
  const hour = new Date().getHours();
  
  const greetings = {
    morning: ['Good Morning, proxies!', 'Rise and Shine, Wanderer!', 'Good Morning, Trailblazer!'],
    afternoon: ['Good Afternoon, Traveler!', 'Hello There, Wanderer!', 'Good Afternoon, Trailblazer!', 'Good Afternoon, proxies!'],
    evening: ['Good Evening, Traveler!', 'Greetings, Night Wanderer!', 'Good Evening, Trailblazer!', 'Good Evening, proxies!'],
    night: ['Good Night, Stargazer!', 'Welcome, Night Owl!', 'Greetings, Moonlit Wanderer!' , 'Good Night, proxies!']
  };
  
  let timeOfDay;
  if (hour >= 5 && hour < 12) timeOfDay = 'morning';
  else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
  else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
  else timeOfDay = 'night';
  
  const greetingArray = greetings[timeOfDay];
  const randomGreeting = greetingArray[Math.floor(Math.random() * greetingArray.length)];
  
  if (greetingEl) {
    greetingEl.textContent = randomGreeting;
  }
}

// Initialize greeting on load
updateGreeting();

// ========================================
// Staggered Animations for Cards
// ========================================
const cards = document.querySelectorAll('.card');
cards.forEach((card, index) => {
  card.style.animationDelay = `${index * 0.1}s`;
});

// ========================================
// Honkai Star Rail API Integration
// ========================================
class HSREnkaAPI {
  constructor() {
    this.baseURL = 'https://enka.network/api/hsr/uid';
    // CONFIGURE YOUR UID HERE
    this.configuredUID = '832796099'; // Change this to your UID
    this.init();
  }

  init() {
    // Auto-fetch configured UID on page load
    this.fetchPlayerData(this.configuredUID);
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

  async fetchPlayerData(uid) {
    this.showLoading(true);
    this.hideError();
    this.hidePlayerInfo();

    const proxies = [
      {
        name: 'AllOrigins',
        url: (apiUrl) => `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`,
        parse: (data) => JSON.parse(data.contents)
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
        name: 'JSONProxy',
        url: (apiUrl) => `https://jsonp.afeld.me/?url=${encodeURIComponent(apiUrl)}`,
        parse: (data) => data
      }
    ];

    const apiUrl = `${this.baseURL}/${uid}`;
    let apiData = null;

    try {
      console.log('Fetching HSR data for UID:', uid);
      
      for (const proxy of proxies) {
        try {
          console.log(`Trying HSR with ${proxy.name}...`);
          
          const proxyUrl = proxy.url(apiUrl);
          const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            }
          });
          
          if (!response.ok) {
            console.warn(`${proxy.name} failed with status ${response.status}`);
            continue;
          }
          
          const data = await response.json();
          apiData = proxy.parse(data);
          
          // Validate HSR data structure
          if (!apiData || !apiData.detailInfo) {
            console.warn(`${proxy.name} returned invalid data structure`);
            continue;
          }
          
          console.log(`✅ Successfully fetched HSR data using ${proxy.name}`);
          console.log('HSR API Response:', apiData);
          this.displayPlayerData(apiData);
          this.showLoading(false);
          return;
          
        } catch (error) {
          console.warn(`${proxy.name} error:`, error.message);
          continue;
        }
      }
      
      // All proxies failed - use mock data
      console.log('All HSR proxies failed, using mock data');
      this.showError('Unable to fetch live data. Displaying demo data.');
      apiData = this.getMockData();
      this.displayPlayerData(apiData);
      
    } catch (error) {
      console.error('Error fetching HSR data:', error);
      this.showError('Failed to fetch player data. Displaying demo data.');
      this.displayPlayerData(this.getMockData());
    } finally {
      this.showLoading(false);
    }
  }

  displayPlayerData(data) {
    try {
      if (!data || !data.detailInfo) {
        throw new Error('Invalid player data received');
      }

      const player = data.detailInfo;
      
      // Update player nickname
      const nicknameEl = document.getElementById('player-nickname');
      if (nicknameEl) {
        nicknameEl.textContent = player.nickname || 'Unknown Player';
      }
      
      // Update player level
      const levelEl = document.getElementById('player-level');
      if (levelEl) {
        levelEl.textContent = player.level || '0';
      }
      
      // Update world level
      const worldLevelEl = document.getElementById('world-level');
      if (worldLevelEl) {
        worldLevelEl.textContent = player.worldLevel || '0';
      }
      
      // Update player signature
      const signatureEl = document.getElementById('player-signature');
      if (signatureEl) {
        signatureEl.textContent = player.signature || 'No signature set';
      }
      
      // Update achievement count
      const achievementEl = document.getElementById('achievement-count');
      if (achievementEl) {
        const achievementCount = player.recordInfo?.achievementCount || 
                                 player.finishAchievementNum || 
                                 player.achievementCount || '0';
        achievementEl.textContent = achievementCount;
      }
      
      // Update UID
      const uidEl = document.getElementById('player-uid');
      if (uidEl) {
        uidEl.textContent = data.uid || 'N/A';
      }
      
      // Update player avatar - HARDCODED
      const avatarEl = document.getElementById('player-avatar');
      if (avatarEl) {
        // Hardcoded avatar URL
        const avatarUrl = `https://enka.network/ui/hsr/SpriteOutput/AvatarRoundIcon/Avatar/1409.png`;
        
        console.log('Loading hardcoded HSR avatar from:', avatarUrl);
        
        avatarEl.onerror = () => {
          console.warn('HSR Avatar URL failed. Using placeholder.');
          const initial = player.nickname?.charAt(0) || 'HSR';
          avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initial)}&size=90&background=667eea&color=ffffff&bold=true`;
        };
        
        avatarEl.onload = () => {
          console.log('HSR Avatar loaded successfully');
        };
        
        avatarEl.src = avatarUrl;
      }
      
      // Update Simulated Universe Stats
      this.displaySimulatedUniverse(player);
      
      this.showPlayerInfo();
      
    } catch (error) {
      console.error('Error displaying player data:', error);
      this.showError('Failed to display player data. Please try again.');
    }
  }

  displaySimulatedUniverse(player) {
    try {
      // Get record info
      const recordInfo = player.recordInfo;
      
      if (!recordInfo) {
        console.warn('No record info available');
        document.getElementById('su-stars').textContent = '0';
        document.getElementById('hsr-exploration').textContent = '0%';
        return;
      }

      // Simulated Universe stars
      const suStarsEl = document.getElementById('su-stars');
      if (suStarsEl) {
        suStarsEl.textContent = recordInfo.maxRogueChallengeScore || '0';
      }

      // Exploration - calculate from book count (rough estimate)
      const explorationEl = document.getElementById('hsr-exploration');
      if (explorationEl && recordInfo.bookCount !== undefined) {
        const explorationPercent = Math.min(Math.round((recordInfo.bookCount / 120) * 100), 100);
        explorationEl.textContent = explorationPercent + '%';
      } else {
        explorationEl.textContent = '0%';
      }

      console.log('HSR Stats:', {
        suStars: recordInfo.maxRogueChallengeScore || 0,
        bookCount: recordInfo.bookCount || 0
      });
      
    } catch (error) {
      console.error('Error displaying HSR stats:', error);
      const suStarsEl = document.getElementById('su-stars');
      if (suStarsEl) suStarsEl.textContent = '0';
      const explorationEl = document.getElementById('hsr-exploration');
      if (explorationEl) explorationEl.textContent = '0%';
    }
  }

  showLoading(show) {
    const loadingEl = document.getElementById('loading-indicator');
    if (loadingEl) {
      if (show) {
        loadingEl.classList.remove('hidden');
      } else {
        loadingEl.classList.add('hidden');
      }
    }
  }

  showError(message) {
    const errorEl = document.getElementById('error-message');
    const errorTextEl = document.getElementById('error-text');
    
    if (errorEl && errorTextEl) {
      errorTextEl.textContent = message;
      errorEl.classList.remove('hidden');
    }
  }

  hideError() {
    const errorEl = document.getElementById('error-message');
    if (errorEl) {
      errorEl.classList.add('hidden');
    }
  }

  showPlayerInfo() {
    const playerInfoEl = document.getElementById('hsr-player-info');
    if (playerInfoEl) {
      playerInfoEl.classList.remove('hidden');
    }
  }

  hidePlayerInfo() {
    const playerInfoEl = document.getElementById('hsr-player-info');
    if (playerInfoEl) {
      playerInfoEl.classList.add('hidden');
    }
  }
}

// Initialize HSR API
const hsrAPI = new HSREnkaAPI();

// ========================================
// Zenless Zone Zero API Integration
// ========================================
class ZZZEnkaAPI {
  constructor() {
    this.baseURL = 'https://enka.network/api/zzz/uid';
    // CONFIGURE YOUR ZZZ UID HERE
    this.configuredUID = '1302036813'; // Change this to your ZZZ UID
    this.init();
  }

  init() {
    // Auto-fetch configured UID on page load
    this.fetchPlayerData(this.configuredUID);
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
            { MedalType: 3, MedalScore: 0 },
            { MedalType: 4, MedalScore: 0 }
          ]
        }
      }
    };
  }

  async fetchPlayerData(uid) {
    this.showLoading(true);
    this.hideError();
    this.hidePlayerInfo();

    const proxies = [
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
      },
      {
        name: 'JSONProxy',
        url: (apiUrl) => `https://jsonp.afeld.me/?url=${encodeURIComponent(apiUrl)}`,
        parse: (data) => data
      }
    ];

    const apiUrl = `${this.baseURL}/${uid}`;
    let apiData = null;

    try {
      console.log('Fetching ZZZ data for UID:', uid);

      for (const proxy of proxies) {
        try {
          console.log(`Trying ZZZ with ${proxy.name}...`);
          
          const proxyUrl = proxy.url(apiUrl);
          const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            }
          });
          
          if (!response.ok) {
            console.warn(`${proxy.name} failed with status ${response.status}`);
            continue;
          }
          
          const data = await response.json();
          apiData = proxy.parse(data);
          
          // Validate ZZZ data structure
          if (!apiData || !apiData.PlayerInfo) {
            console.warn(`${proxy.name} returned invalid data structure`);
            continue;
          }
          
          console.log(`✅ Successfully fetched ZZZ data using ${proxy.name}`);
          console.log('ZZZ API Response:', apiData);
          this.displayPlayerData(apiData);
          this.showLoading(false);
          return;
          
        } catch (error) {
          console.warn(`${proxy.name} error:`, error.message);
          continue;
        }
      }

      // All proxies failed - use mock data
      console.log('All ZZZ proxies failed, using mock data');
      this.showError('Unable to fetch live data. Displaying demo data.');
      apiData = this.getMockData();
      this.displayPlayerData(apiData);

    } catch (error) {
      console.error('Error fetching ZZZ data:', error);
      this.showError('Failed to fetch player data. Displaying demo data.');
      this.displayPlayerData(this.getMockData());
    } finally {
      this.showLoading(false);
    }
  }

  displayPlayerData(data) {
    try {
      console.log('ZZZ Data Structure:', data);
      
      const playerInfo = data.PlayerInfo;
      if (!playerInfo || !playerInfo.SocialDetail || !playerInfo.SocialDetail.ProfileDetail) {
        console.error('Invalid ZZZ data structure:', data);
        throw new Error('Invalid player data structure');
      }
      
      const player = playerInfo.SocialDetail.ProfileDetail;
      const socialDetail = playerInfo.SocialDetail;
      
      // Update player nickname
      const nicknameEl = document.getElementById('zzz-player-nickname');
      if (nicknameEl) {
        nicknameEl.textContent = player.Nickname || 'Unknown Player';
      }
      
      // Update player level
      const levelEl = document.getElementById('zzz-player-level');
      if (levelEl) {
        levelEl.textContent = player.Level || '0';
      }
      
      // Update player signature/description
      const signatureEl = document.getElementById('zzz-player-signature');
      if (signatureEl) {
        signatureEl.textContent = socialDetail.Desc || 'No signature set';
      }
      
      // Update UID
      const uidEl = document.getElementById('zzz-player-uid');
      if (uidEl) {
        uidEl.textContent = player.Uid || data.uid || 'N/A';
      }
      
      // Update player avatar - HARDCODED
      const avatarEl = document.getElementById('zzz-player-avatar');
      if (avatarEl) {
        // Hardcoded avatar URL
        const avatarUrl = `https://enka.network/ui/zzz/IconInterKnotRole0013.png`;
        
        console.log('Loading hardcoded ZZZ avatar from:', avatarUrl);
        
        avatarEl.onerror = () => {
          console.warn('ZZZ Avatar URL failed. Using placeholder.');
          const initial = (player.Nickname || 'ZZZ').charAt(0);
          avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initial)}&size=90&background=e63946&color=ffffff&bold=true`;
        };
        
        avatarEl.onload = () => {
          console.log('ZZZ Avatar loaded successfully');
        };
        
        avatarEl.src = avatarUrl;
      }
      
      // Update ZZZ Challenge Stats
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
      
      console.log('ZZZ Medals:', medals);
      
      let shiyuStars = 0;
      let exploration = 0;
      
      medals.forEach(medal => {
        if (medal.MedalType === 3) {
          shiyuStars = medal.MedalScore || medal.Value || 0;
        } else if (medal.MedalType === 4) {
          exploration = medal.MedalScore || medal.Value || 0;
        }
      });

      const shiyuEl = document.getElementById('shiyu-defense');
      if (shiyuEl) {
        shiyuEl.textContent = shiyuStars;
      }

      const explorationEl = document.getElementById('exploration-progress');
      if (explorationEl) {
        explorationEl.textContent = exploration + '%';
      }

      console.log('ZZZ Challenge Stats:', { shiyuDefense: shiyuStars, exploration });
      
    } catch (error) {
      console.error('Error displaying ZZZ challenge data:', error);
      document.getElementById('shiyu-defense').textContent = '0';
      document.getElementById('exploration-progress').textContent = '0%';
    }
  }

  showLoading(show) {
    const loadingEl = document.getElementById('zzz-loading-indicator');
    if (loadingEl) {
      if (show) {
        loadingEl.classList.remove('hidden');
      } else {
        loadingEl.classList.add('hidden');
      }
    }
  }

  showError(message) {
    const errorEl = document.getElementById('zzz-error-message');
    const errorTextEl = document.getElementById('zzz-error-text');
    
    if (errorEl && errorTextEl) {
      errorTextEl.textContent = message;
      errorEl.classList.remove('hidden');
    }
  }

  hideError() {
    const errorEl = document.getElementById('zzz-error-message');
    if (errorEl) {
      errorEl.classList.add('hidden');
    }
  }

  showPlayerInfo() {
    const playerInfoEl = document.getElementById('zzz-player-info');
    if (playerInfoEl) {
      playerInfoEl.classList.remove('hidden');
    }
  }

  hidePlayerInfo() {
    const playerInfoEl = document.getElementById('zzz-player-info');
    if (playerInfoEl) {
      playerInfoEl.classList.add('hidden');
    }
  }
}

// Initialize ZZZ API
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
  });
}

// Attach copy functions
document.getElementById('copy-hsr-uid').addEventListener('click', function() {
  const uidText = document.getElementById('player-uid').textContent;
  copyUID(uidText, 'copy-hsr-uid');
});

document.getElementById('copy-zzz-uid').addEventListener('click', function() {
  const uidText = document.getElementById('zzz-player-uid').textContent;
  copyUID(uidText, 'copy-zzz-uid');
});
