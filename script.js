// Starfield Generation
const starfield = document.getElementById('starfield');
for (let i = 0; i < 200; i++) {
  const star = document.createElement('div');
  star.className = 'star';
  star.style.width = star.style.height = Math.random() * 3 + 'px';
  star.style.left = Math.random() * 100 + '%';
  star.style.top = Math.random() * 100 + '%';
  star.style.animationDuration = (Math.random() * 3 + 2) + 's';
  star.style.animationDelay = Math.random() * 3 + 's';
  starfield.appendChild(star);
}

// Floating Particles
function createParticle() {
  const particle = document.createElement('div');
  particle.className = 'particle';
  const size = Math.random() * 8 + 3;
  particle.style.width = particle.style.height = size + 'px';
  particle.style.left = Math.random() * 100 + '%';
  particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
  particle.style.animationDelay = Math.random() * 5 + 's';
  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), 25000);
}
setInterval(createParticle, 300);

// Glitch Text Effect
const glitchName = document.getElementById('glitch-name');
const name = 'EVERNIGHT';
name.split('').forEach((char, i) => {
  const span = document.createElement('span');
  span.className = 'glitch-char';
  span.textContent = char;
  span.style.animationDelay = (i * 0.2) + 's';
  glitchName.appendChild(span);
});

// Music Player System
const songs = [
  {
    name: "Time To Love",
    src: "https://raw.githubusercontent.com/bunsass/busn/main/asset/Time%20To%20Love.mp3"
  },
  {
    name: "Had I Not Seen the Sun",
    src: "https://raw.githubusercontent.com/bunsass/busn/main/asset/Had%20I%20Not%20Seen%20the%20Sun.mp3"
  },
  {
    name: "If I Can Stop One Heart From Breaking",
    src: "https://raw.githubusercontent.com/bunsass/busn/main/asset/If%20I%20Can%20Stop%20One%20Heart%20From%20Breaking.mp3"
  }
];

let currentSong = 0;
const audio = document.getElementById('bgMusic');
const moonDisk = document.getElementById('moonDisk');
const songInfo = document.getElementById('songInfo');
const songName = document.getElementById('songName');
const controls = document.getElementById('musicControls');
const volumeSlider = document.getElementById('volumeSlider');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

audio.volume = 0.7;

// Mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let lastTap = 0;
let tapTimeout = null;

function loadSong(index) {
  audio.src = songs[index].src;
  songName.textContent = songs[index].name;
}

function playSong() {
  audio.play().catch(err => {
    console.log('Play error:', err);
  });
  moonDisk.classList.add('playing');
  songInfo.classList.add('show');
}

function pauseSong() {
  audio.pause();
  moonDisk.classList.remove('playing');
}

function togglePlay() {
  if (audio.paused) {
    if (!audio.src) loadSong(currentSong);
    playSong();
  } else {
    pauseSong();
  }
}

function nextSong() {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
  playSong();
}

// Enhanced mobile tap handling
if (isMobile) {
  moonDisk.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    
    clearTimeout(tapTimeout);
    
    if (tapLength < 500 && tapLength > 0) {
      // Double tap detected
      nextSong();
    } else {
      // Single tap - wait to see if double tap coming
      tapTimeout = setTimeout(() => {
        togglePlay();
      }, 300);
    }
    
    lastTap = currentTime;
  }, { passive: false });

  // Show controls on long press
  let longPressTimer;
  moonDisk.addEventListener('touchstart', (e) => {
    longPressTimer = setTimeout(() => {
      controls.classList.add('show');
    }, 500);
  });

  moonDisk.addEventListener('touchend', () => {
    clearTimeout(longPressTimer);
  });

  moonDisk.addEventListener('touchmove', () => {
    clearTimeout(longPressTimer);
  });

  // Close controls when tapping outside
  document.addEventListener('touchstart', (e) => {
    if (!controls.contains(e.target) && !moonDisk.contains(e.target)) {
      controls.classList.remove('show');
    }
  });
} else {
  // Desktop click handlers
  moonDisk.addEventListener('click', togglePlay);

  moonDisk.addEventListener('dblclick', (e) => {
    e.preventDefault();
    nextSong();
  });

  // Desktop hover logic
  let controlTimeout;
  moonDisk.addEventListener('mouseenter', () => {
    clearTimeout(controlTimeout);
    controls.classList.add('show');
  });

  moonDisk.addEventListener('mouseleave', () => {
    controlTimeout = setTimeout(() => {
      if (!controls.matches(':hover')) {
        controls.classList.remove('show');
      }
    }, 300);
  });

  controls.addEventListener('mouseenter', () => {
    clearTimeout(controlTimeout);
  });

  controls.addEventListener('mouseleave', () => {
    controls.classList.remove('show');
  });
}

audio.addEventListener('ended', () => {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
  playSong();
});

volumeSlider.addEventListener('input', (e) => {
  audio.volume = e.target.value;
});

playBtn.addEventListener('click', togglePlay);

prevBtn.addEventListener('click', () => {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
  playSong();
});

nextBtn.addEventListener('click', nextSong);

// Honkai Star Rail Profile System
const hsrContent = document.getElementById('hsrContent');

// Default UID - auto-loads on page load
const defaultUID = '832796099';

// Warp history data
let warpHistoryData = null;
let isWarpHistoryVisible = false;

// Multiple CORS proxies for rotation
const corsProxies = [
  {
    name: 'AllOrigins',
    url: (apiUrl) => `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`,
    parseResponse: async (response) => {
      const data = await response.json();
      return JSON.parse(data.contents);
    }
  },
  {
    name: 'CORSProxy.io',
    url: (apiUrl) => `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`,
    parseResponse: async (response) => await response.json()
  },
  {
    name: 'CodeTabs',
    url: (apiUrl) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(apiUrl)}`,
    parseResponse: async (response) => await response.json()
  }
];

let currentProxyIndex = 0;
let retryCount = 0;
const maxRetries = corsProxies.length * 2;

async function fetchHSRProfile(uid, autoRetry = true) {
  try {
    hsrContent.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading Trailblazer data...</p>
        ${retryCount > 0 ? `<p style="font-size: 0.85rem; color: #9b9baf; margin-top: 10px;">Trying proxy ${currentProxyIndex + 1}/${corsProxies.length} - Attempt ${retryCount + 1}/${maxRetries}</p>` : ''}
      </div>
    `;

    const apiUrl = `https://enka.network/api/hsr/uid/${uid}`;
    const proxy = corsProxies[currentProxyIndex];
    const proxyUrl = proxy.url(apiUrl);
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${proxy.name} failed`);
    }

    const data = await proxy.parseResponse(response);
    
    if (!data.uid && !data.detailInfo) {
      throw new Error('Invalid HSR data structure received');
    }
    
    retryCount = 0;
    currentProxyIndex = 0;
    
    displayProfile(data, uid);
  } catch (error) {
    console.error(`Error fetching HSR profile (${corsProxies[currentProxyIndex].name}, Attempt ${retryCount + 1}):`, error);
    
    if (autoRetry && retryCount < maxRetries) {
      retryCount++;
      currentProxyIndex = (currentProxyIndex + 1) % corsProxies.length;
      const delay = 1000;
      
      hsrContent.innerHTML = `
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Connection issue, trying another route...</p>
          <p style="font-size: 0.85rem; color: #9b9baf; margin-top: 10px;">
            Using ${corsProxies[currentProxyIndex].name} proxy (${retryCount}/${maxRetries})
          </p>
        </div>
      `;
      
      setTimeout(() => fetchHSRProfile(uid, true), delay);
    } else {
      retryCount = 0;
      currentProxyIndex = 0;
      
      hsrContent.innerHTML = `
        <div class="error-message">
          <p>🌙 Unable to connect to the stars...</p>
          <p style="font-size: 0.9rem; color: #9b9baf; margin-top: 10px;">
            All connection routes failed. This could be due to:
          </p>
          <ul style="text-align: left; max-width: 400px; margin: 15px auto; color: #9b9baf; font-size: 0.85rem;">
            <li>Enka Network API is down or under maintenance</li>
            <li>Profile not set to public in-game</li>
            <li>Invalid UID (${uid})</li>
            <li>Proxy services temporarily blocked</li>
          </ul>
          <div class="uid-input-container" style="margin-top: 20px;">
            <button class="load-btn" onclick="retryFetch('${uid}')">🔄 Retry Connection</button>
          </div>
        </div>
      `;
    }
  }
}

function retryFetch(uid) {
  retryCount = 0;
  currentProxyIndex = 0;
  fetchHSRProfile(uid, true);
}

function displayProfile(data, uid) {
  const player = data.detailInfo;
  const characters = data.detailInfo.avatarDetailList || [];

  const sortedChars = characters
    .slice(0, 8)
    .sort((a, b) => b.level - a.level);

  hsrContent.innerHTML = `
    <div class="hsr-profile">
      <div class="profile-header">
        <img src="https://enka.network/ui/hsr/SpriteOutput/AvatarRoundIcon/Avatar/1409.png" 
             alt="Profile Avatar" 
             class="profile-avatar"
             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23a78bfa%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2250%22 font-size=%2224%22 fill=%22white%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EHSR%3C/text%3E%3C/svg%3E'">
        <div class="profile-info">
          <h3>${player.nickname || 'Trailblazer'}</h3>
          <p style="color: #9b9baf;">UID: ${player.uid}</p>
          <p style="color: #c084fc; margin-top: 5px;">${player.signature || 'May this journey lead us starward.'}</p>
        </div>
      </div>

      <div class="profile-stats">
        <div class="stat-box">
          <div class="stat-label">Trailblaze Level</div>
          <div class="stat-value">${player.level || 0}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Characters</div>
          <div class="stat-value">${player.recordInfo?.avatarCount || 0}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Achievements</div>
          <div class="stat-value">${player.recordInfo?.achievementCount || 0}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Simulated Universe</div>
          <div class="stat-value">${player.recordInfo?.maxRogueChallengeScore || 0}</div>
        </div>
      </div>

      ${sortedChars.length > 0 ? `
        <div class="characters-showcase">
          <h3 style="color: #a78bfa; font-family: 'Cinzel', serif; margin-bottom: 10px; text-align: center;">
            Featured Characters
          </h3>
          <div class="characters-grid">
            ${sortedChars.map(char => `
              <a href="https://enka.network/hsr/${uid}/" target="_blank" class="character-card">
                <img src="https://enka.network/ui/hsr/SpriteOutput/AvatarRoundIcon/${char.avatarId}.png" 
                     alt="${getCharacterName(char.avatarId)}" 
                     class="character-icon"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22%3E%3Ccircle cx=%2240%22 cy=%2240%22 r=%2240%22 fill=%22%23764ba2%22/%3E%3Ctext x=%2240%22 y=%4240%22 font-size=%2220%22 fill=%22white%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E%3F%3C/text%3E%3C/svg%3E'">
                <div class="character-name">${getCharacterName(char.avatarId)}</div>
                <div class="character-level">Lv. ${char.level}</div>
              </a>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="warp-history-section">
        <button class="toggle-warp-btn" onclick="toggleWarpHistory('${uid}')">
          <span id="warpToggleIcon">▼</span> Show Warp History
        </button>
        <div id="warpHistoryContent" style="display: none;">
          <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading warp history...</p>
          </div>
        </div>
      </div>

      <div class="uid-input-container">
      </div>
    </div>
  `;
}

function getCharacterName(avatarId) {
  const names = {
    '1001': 'March 7th', '1002': 'Dan Heng', '1003': 'Himeko', '1004': 'Welt',
    '1005': 'Kafka', '1006': 'Silver Wolf', '1008': 'Arlan', '1009': 'Asta',
    '1013': 'Herta', '1014': 'Aglaea', '1015': 'Mydei', '1101': 'Bronya',
    '1102': 'Seele', '1103': 'Serval', '1104': 'Gepard', '1105': 'Natasha',
    '1106': 'Pela', '1107': 'Clara', '1108': 'Sampo', '1109': 'Hook',
    '1110': 'Lynx', '1111': 'Luka', '1112': 'Topaz', '1201': 'Qingque',
    '1202': 'Tingyun', '1203': 'Luocha', '1204': 'Jing Yuan', '1205': 'Blade',
    '1206': 'Sushang', '1207': 'Yukong', '1208': 'Fu Xuan', '1209': 'Yanqing',
    '1210': 'Guinaifen', '1211': 'Bailu', '1212': 'Jingliu', '1213': 'Dan Heng IL',
    '1214': 'Xueyi', '1215': 'Hanya', '1217': 'Huohuo', '1218': 'Jiaoqiu',
    '1220': 'Feixiao', '1221': 'Yunli', '1222': 'Lingsha', '1223': 'Moze',
    '1224': 'March 7th', '1225': 'Fugue', '1301': 'Gallagher', '1302': 'Argenti',
    '1303': 'Ruan Mei', '1304': 'Aventurine', '1305': 'Dr. Ratio', '1306': 'Sparkle',
    '1307': 'Black Swan', '1308': 'Acheron', '1309': 'Robin', '1310': 'Firefly',
    '1312': 'Misha', '1313': 'Sunday', '1314': 'Jade', '1315': 'Boothill',
    '1317': 'Rappa', '1401': 'The Herta', '1402': 'Aglaea', '1403': 'Tribbie',
    '1404': 'Mydei', '1405': 'Anaxa', '1406': 'Cipher', '1407': 'Castorice',
    '1408': 'Phainon', '1409': 'Hyacine', '1410': 'Hysilens', '1412': 'Cerydra',
    '1413': 'Evernight', '1414': 'Seraph',
    '8001': 'Trailblazer', '8002': 'Trailblazer', '8003': 'Trailblazer',
    '8004': 'Trailblazer', '8005': 'Trailblazer', '8006': 'Trailblazer',
    '8007': 'Trailblazer', '8008': 'Trailblazer'
  };
  return names[avatarId] || 'Unknown';
}

// Auto-fetch profile on page load
window.addEventListener('load', () => {
  fetchHSRProfile(defaultUID);
});

// Toggle Warp History
async function toggleWarpHistory(uid) {
  const warpContent = document.getElementById('warpHistoryContent');
  const toggleBtn = document.querySelector('.toggle-warp-btn');
  
  if (isWarpHistoryVisible) {
    warpContent.style.display = 'none';
    toggleBtn.innerHTML = '<span id="warpToggleIcon">▼</span> Show Warp History';
    isWarpHistoryVisible = false;
  } else {
    warpContent.style.display = 'block';
    toggleBtn.innerHTML = '<span id="warpToggleIcon">▲</span> Hide Warp History';
    isWarpHistoryVisible = true;
    
    if (!warpHistoryData) {
      await fetchWarpHistory(uid);
    }
  }
}

// Fetch Warp History from StarDB
async function fetchWarpHistory(uid) {
  const warpContent = document.getElementById('warpHistoryContent');
  
  try {
    warpContent.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading warp history...</p>
      </div>
    `;
    
    const response = await fetch(`https://stardb.gg/api/warps/${uid}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    warpHistoryData = data;
    
    displayWarpHistory(data);
  } catch (error) {
    console.error('Error fetching warp history:', error);
    warpContent.innerHTML = `
      <div class="error-message" style="padding: 20px;">
        <p>Unable to load warp history</p>
        <p style="font-size: 0.9rem; color: #9b9baf; margin-top: 10px;">
          The warp data might not be available or the API is temporarily down.
        </p>
      </div>
    `;
  }
}

// Display Warp History with Tabs
function displayWarpHistory(data) {
  const warpContent = document.getElementById('warpHistoryContent');
  
  console.log('Warp API Response:', data);
  
  // Process each banner type separately
  const characterBanner = data.character || [];
  const lightConeBanner = data.light_cone || []; // Fixed: use light_cone with underscore
  const standardBanner = data.standard || [];
  
  // Filter and calculate pity for Character Event Banner (5-star characters only)
  const characterEventPulls = processWarps(characterBanner, 'character');
  
  // Filter and calculate pity for Light Cone Event Banner (5-star light cones only)
  const lightConeEventPulls = processWarps(lightConeBanner, 'light_cone');
  
  // Filter and calculate pity for Standard Banner (both characters and light cones)
  const standardPulls = processWarps(standardBanner, 'both');
  
  warpContent.innerHTML = `
    <div class="warp-history-list">
      <div class="warp-tabs">
        <button class="warp-tab active" data-tab="character">
          Character Event (${characterEventPulls.length})
        </button>
        <button class="warp-tab" data-tab="lightcone">
          Light Cone Event (${lightConeEventPulls.length})
        </button>
        <button class="warp-tab" data-tab="standard">
          Standard (${standardPulls.length})
        </button>
      </div>
      
      <div class="warp-tab-content active" data-content="character">
        ${renderWarpList(characterEventPulls, 'Character Event Banner')}
      </div>
      
      <div class="warp-tab-content" data-content="lightcone">
        ${renderWarpList(lightConeEventPulls, 'Light Cone Event Banner')}
      </div>
      
      <div class="warp-tab-content" data-content="standard">
        ${renderWarpList(standardPulls, 'Standard Banner')}
      </div>
    </div>
  `;
  
  // Add tab switching functionality
  const tabs = warpContent.querySelectorAll('.warp-tab');
  const contents = warpContent.querySelectorAll('.warp-tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      tab.classList.add('active');
      warpContent.querySelector(`[data-content="${targetTab}"]`).classList.add('active');
    });
  });
}

// Process warps and calculate pity
function processWarps(warps, filterType) {
  if (!warps || warps.length === 0) return [];
  
  // Filter based on type
  let filtered;
  if (filterType === 'character') {
    filtered = warps.filter(w => w.rarity === 5 && w.type === 'character');
  } else if (filterType === 'light_cone') {
    filtered = warps.filter(w => w.rarity === 5 && w.type === 'light_cone');
  } else { // both for standard
    filtered = warps.filter(w => w.rarity === 5);
  }
  
  // Sort by newest first
  filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Calculate pity for each pull
  return filtered.map(pull => {
    const pullIndex = warps.findIndex(w => w.id === pull.id);
    let pityCount = 1;
    
    // Count backwards until we find the previous 5-star of the same type
    for (let i = pullIndex - 1; i >= 0; i--) {
      if (warps[i].rarity === 5 && 
          (filterType === 'both' || warps[i].type === pull.type)) {
        break;
      }
      pityCount++;
    }
    
    return {
      ...pull,
      pity: pityCount
    };
  });
}

// Render warp list HTML
function renderWarpList(warps, bannerName) {
  if (warps.length === 0) {
    return `
      <div class="error-message" style="padding: 20px;">
        <p>No 5-star pulls found in this banner</p>
      </div>
    `;
  }
  
  return `
    <h4 style="color: #c084fc; font-family: 'Cinzel', serif; text-align: center; margin-bottom: 15px; margin-top: 15px;">
      5⭐ ${bannerName} (${warps.length} total)
    </h4>
    <div class="warp-items">
      ${warps.map(warp => {
        // Check if it's a light cone - light cones have item_id starting with 2 (20xxx or 21xxx or 23xxx)
        const isLightCone = warp.type === 'light_cone' || String(warp.item_id).startsWith('2');
        const imageUrl = isLightCone 
          ? `https://stardb.gg/api/static/StarRailResWebp/icon/light_cone/${warp.item_id}.webp`
          : `https://stardb.gg/api/static/StarRailResWebp/icon/character/${warp.item_id}.webp`;
        
        // Determine pity color based on pull count
        let pityClass = 'pity-green';
        let borderColor = 'rgba(34, 197, 94, 0.3)';
        if (warp.pity >= 70) {
          pityClass = 'pity-red';
          borderColor = 'rgba(239, 68, 68, 0.3)';
        } else if (warp.pity >= 30) {
          pityClass = 'pity-yellow';
          borderColor = 'rgba(251, 191, 36, 0.3)';
        }
        
        return `
          <div class="warp-item ${pityClass}" style="border-color: ${borderColor};">
            <div class="warp-item-header">
              <img src="${imageUrl}" 
                   alt="${warp.name}" 
                   class="warp-character-icon ${isLightCone ? 'lightcone-icon' : ''}"
                   onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%2230%22 fill=%22%23fbbf24%22/%3E%3Ctext x=%2230%22 y=%2230%22 font-size=%2216%22 fill=%22white%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E5â˜…%3C/text%3E%3C/svg%3E'">
              <div class="warp-item-info">
                <div class="warp-character-name">${warp.name}</div>
                <div class="warp-pulls">Pulled in ${warp.pity} warps</div>
                <div class="warp-date">${new Date(warp.timestamp).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</div>
                <div class="warp-banner-type">${isLightCone ? '🔷 Light Cone' : '⭐ Character'}</div>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// Helper function to determine which banner the warp came from
function getBannerTypeFromData(warp, allData) {
  if (allData.character && allData.character.some(w => w.id === warp.id)) {
    return 'Character Event Banner';
  }
  if (allData.standard && allData.standard.some(w => w.id === warp.id)) {
    return 'Standard Banner';
  }
  if (allData.departure && allData.departure.some(w => w.id === warp.id)) {
    return 'Departure Banner';
  }
  if (allData.collab && allData.collab.some(w => w.id === warp.id)) {
    return 'Collaboration Banner';
  }
  return 'Unknown Banner';
}
// Get banner name
function getBannerName(bannerCode) {
  const banners = {
    '1': 'Standard Banner',
    '2': 'Character Event',
    '11': 'Light Cone Event',
    '12': 'Character Event'
  };
  return banners[bannerCode] || 'Unknown Banner';
}