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

async function fetchHSRProfile(uid) {
  try {
    hsrContent.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading Trailblazer data...</p>
      </div>
    `;

    // Use CORS proxy to bypass CORS restrictions
    const corsProxy = 'https://api.allorigins.win/raw?url=';
    const apiUrl = `https://enka.network/api/hsr/uid/${uid}`;
    const response = await fetch(corsProxy + encodeURIComponent(apiUrl));
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const data = await response.json();
    displayProfile(data, uid);
  } catch (error) {
    console.error('Error fetching HSR profile:', error);
    hsrContent.innerHTML = `
      <div class="error-message">
        <p>⚠️ Could not load profile. Please check your UID and try again.</p>
        <p style="font-size: 0.9rem; color: #9b9baf; margin-top: 10px;">
          Make sure your profile is set to public in-game and the UID is correct.
        </p>
        <div class="uid-input-container">
          <input type="text" class="uid-input" id="uidInput" placeholder="Enter your UID" value="${uid}">
          <button class="load-btn" onclick="loadProfile()">Load Profile</button>
        </div>
      </div>
    `;
  }
}

function displayProfile(data, uid) {
  const player = data.detailInfo;
  const characters = data.detailInfo.avatarDetailList || [];

  // Sort characters by level and rarity
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
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22%3E%3Ccircle cx=%2240%22 cy=%2240%22 r=%2240%22 fill=%22%23764ba2%22/%3E%3Ctext x=%2240%22 y=%2240%22 font-size=%2220%22 fill=%22white%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E%3F%3C/text%3E%3C/svg%3E'">
                <div class="character-name">${getCharacterName(char.avatarId)}</div>
                <div class="character-level">Lv. ${char.level}</div>
              </a>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="uid-input-container">
        <button class="load-btn" onclick="changeUID()">Change UID</button>
      </div>
    </div>
  `;
}

function getCharacterName(avatarId) {
  // Complete character ID to name mapping
  const names = {
    '1001': 'March 7th',
    '1002': 'Dan Heng',
    '1003': 'Himeko',
    '1004': 'Welt',
    '1005': 'Kafka',
    '1006': 'Silver Wolf',
    '1008': 'Arlan',
    '1009': 'Asta',
    '1013': 'Herta',
    '1014': 'Aglaea',
    '1015': 'Mydei',
    '1101': 'Bronya',
    '1102': 'Seele',
    '1103': 'Serval',
    '1104': 'Gepard',
    '1105': 'Natasha',
    '1106': 'Pela',
    '1107': 'Clara',
    '1108': 'Sampo',
    '1109': 'Hook',
    '1110': 'Lynx',
    '1111': 'Luka',
    '1112': 'Topaz',
    '1201': 'Qingque',
    '1202': 'Tingyun',
    '1203': 'Luocha',
    '1204': 'Jing Yuan',
    '1205': 'Blade',
    '1206': 'Sushang',
    '1207': 'Yukong',
    '1208': 'Fu Xuan',
    '1209': 'Yanqing',
    '1210': 'Guinaifen',
    '1211': 'Bailu',
    '1212': 'Jingliu',
    '1213': 'Dan Heng IL',
    '1214': 'Xueyi',
    '1215': 'Hanya',
    '1217': 'Huohuo',
    '1218': 'Jiaoqiu',
    '1220': 'Feixiao',
    '1221': 'Yunli',
    '1222': 'Lingsha',
    '1223': 'Moze',
    '1224': 'March 7th',
    '1225': 'Fugue',
    '1301': 'Gallagher',
    '1302': 'Argenti',
    '1303': 'Ruan Mei',
    '1304': 'Aventurine',
    '1305': 'Dr. Ratio',
    '1306': 'Sparkle',
    '1307': 'Black Swan',
    '1308': 'Acheron',
    '1309': 'Robin',
    '1310': 'Firefly',
    '1312': 'Misha',
    '1313': 'Sunday',
    '1314': 'Jade',
    '1315': 'Boothill',
    '1317': 'Rappa',
    '1401': 'The Herta',
    '1402': 'Aglaea',
    '1403': 'Tribbie',
    '1404': 'Mydei',
    '1405': 'Anaxa',
    '1406': 'Cipher',
    '1407': 'Castorice',
    '1408': 'Phainon',
    '1409': 'Hyacine',
    '1410': 'Hysilens',
    '1412': 'Cerydra',
    '1413': 'Evernight',
    '1414': 'Seraph',
    '8001': 'Trailblazer',
    '8002': 'Trailblazer',
    '8003': 'Trailblazer',
    '8004': 'Trailblazer',
    '8005': 'Trailblazer',
    '8006': 'Trailblazer',
    '8007': 'Trailblazer',
    '8008': 'Trailblazer'
  };
  return names[avatarId] || 'Unknown';
}

function loadProfile() {
  const uidInput = document.getElementById('uidInput');
  if (uidInput && uidInput.value) {
    fetchHSRProfile(uidInput.value);
  }
}

function changeUID() {
  hsrContent.innerHTML = `
    <div style="text-align: center; padding: 30px;">
      <p style="margin-bottom: 15px; color: #c8c8d4;">Enter your Honkai: Star Rail UID:</p>
      <div class="uid-input-container">
        <input type="text" class="uid-input" id="uidInput" placeholder="Enter your UID" value="${defaultUID}">
        <button class="load-btn" onclick="loadProfile()">Load Profile</button>
      </div>
    </div>
  `;
}

// Auto-fetch profile on page load
window.addEventListener('load', () => {
  fetchHSRProfile(defaultUID);
});