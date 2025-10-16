// Background Particles
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 30; i++) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.width = Math.random() * 8 + 3 + 'px';
  particle.style.height = particle.style.width;
  particle.style.left = Math.random() * 100 + '%';
  particle.style.top = Math.random() * 100 + '%';
  particle.style.background = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
  particle.style.animationDelay = Math.random() * 8 + 's';
  particle.style.animationDuration = Math.random() * 10 + 8 + 's';
  particlesContainer.appendChild(particle);
}

// Music Player
const songs = [
  {
    title: "Lofi Beats",
    url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3"
  },
  {
    title: "Chill Vibes",
    url: "https://cdn.pixabay.com/audio/2022/03/10/audio_2c4e038c7b.mp3"
  },
  {
    title: "Ambient Dreams",
    url: "https://cdn.pixabay.com/audio/2022/01/18/audio_d1718ab41b.mp3"
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

albumArt.addEventListener('click', () => {
  if (audio.paused) {
    if (!audio.src) loadSong(currentSongIndex);
    playSong();
  } else {
    pauseSong();
  }
});

albumArt.addEventListener('dblclick', (e) => {
  e.preventDefault();
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  playSong();
});

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

playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    if (!audio.src) loadSong(currentSongIndex);
    playSong();
  } else {
    pauseSong();
  }
});

prevBtn.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  playSong();
});

nextBtn.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  playSong();
});

volumeSlider.addEventListener('input', (e) => {
  audio.volume = e.target.value;
});

audio.addEventListener('ended', () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  playSong();
});

// Staggered card animations
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

  async fetchPlayerData(uid) {
    this.showLoading(true);
    this.hideError();
    this.hidePlayerInfo();

    try {
      console.log('Fetching HSR data for UID:', uid);
      
      // Use AllOrigins proxy (most reliable)
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`${this.baseURL}/${uid}`)}`;
      
      console.log('Using AllOrigins proxy for HSR...');
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Parse AllOrigins wrapper
      let apiData;
      try {
        apiData = JSON.parse(data.contents);
      } catch (e) {
        throw new Error('Failed to parse API response');
      }
      
      // Validate HSR data structure
      if (!apiData || !apiData.detailInfo) {
        throw new Error('Invalid HSR API response structure');
      }
      
      console.log('Successfully fetched HSR data');
      console.log('HSR API Response:', apiData);
      this.displayPlayerData(apiData);
      
    } catch (error) {
      console.error('Error fetching HSR data:', error);
      this.showError(`Failed to fetch player data: ${error.message}. Please refresh the page.`);
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
        achievementEl.textContent = player.recordInfo?.achievementCount || '0';
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
        
        console.log('Loading hardcoded avatar from:', avatarUrl);
        
        avatarEl.onerror = () => {
          console.warn('Avatar URL failed. Using placeholder.');
          const initial = player.nickname?.charAt(0) || 'HSR';
          avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initial)}&size=90&background=667eea&color=ffffff&bold=true`;
        };
        
        avatarEl.onload = () => {
          console.log('Avatar loaded successfully');
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
      // Get Simulated Universe stars from recordInfo
      const recordInfo = player.recordInfo;
      
      if (!recordInfo) {
        console.warn('No record info available');
        document.getElementById('su-stars').textContent = '0';
        return;
      }

      // The maxRogueChallengeScore is the total stars in Simulated Universe
      const suStarsEl = document.getElementById('su-stars');
      if (suStarsEl && recordInfo.maxRogueChallengeScore !== undefined) {
        suStarsEl.textContent = recordInfo.maxRogueChallengeScore;
      } else {
        suStarsEl.textContent = '0';
      }

      console.log('Simulated Universe stars:', recordInfo.maxRogueChallengeScore || 0);
      
    } catch (error) {
      console.error('Error displaying Simulated Universe data:', error);
      const suStarsEl = document.getElementById('su-stars');
      if (suStarsEl) suStarsEl.textContent = '0';
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
      const apiData = proxy.parse(data);
      
      // Validate ZZZ data structure
      if (!apiData || !apiData.PlayerInfo) {
        console.warn(`${proxy.name} returned invalid data structure`);
        continue;
      }
      
      console.log(`✅ Successfully fetched ZZZ data using ${proxy.name}`);
      console.log('ZZZ API Response:', apiData);
      this.displayPlayerData(apiData);
      this.showLoading(false); // ← ADD THIS LINE
      return;
      
    } catch (error) {
      console.warn(`${proxy.name} error:`, error.message);
      continue;
    }
  }

  // All proxies failed
  console.error('All ZZZ proxies failed');
  this.showError('Failed to fetch player data. All proxy services failed. Please try again later.');
  this.showLoading(false);
}

  displayPlayerData(data) {
    try {
      console.log('ZZZ Data Structure:', data);
      
      // ZZZ API has structure: PlayerInfo.SocialDetail.ProfileDetail
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
      
      // Update ZZZ Challenge Stats - use medal data
      this.displayChallengeStats(playerInfo);
      
      this.showPlayerInfo();
      
    } catch (error) {
      console.error('Error displaying ZZZ player data:', error);
      console.error('Full error:', error);
      this.showError(`Failed to display player data: ${error.message}`);
    }
  }

  displayChallengeStats(playerInfo) {
    try {
      // Get medals from SocialDetail
      const medals = playerInfo.SocialDetail?.MedalList || [];
      
      console.log('ZZZ Medals:', medals);
      
      // Medal types: 1=Battle, 3=Shiyu Defense, 4=Exploration
      // Find the relevant medals
      let shiyuStars = 0;
      
      medals.forEach(medal => {
        if (medal.MedalType === 3) {
          // Shiyu Defense
          shiyuStars = medal.MedalScore || medal.Value || 0;
        }
      });

      // Shiyu Defense
      const shiyuEl = document.getElementById('shiyu-defense');
      if (shiyuEl) {
        shiyuEl.textContent = shiyuStars;
      }

      console.log('ZZZ Challenge Stats:', {
        shiyuDefense: shiyuStars
      });
      
    } catch (error) {
      console.error('Error displaying ZZZ challenge data:', error);
      document.getElementById('shiyu-defense').textContent = '0';
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