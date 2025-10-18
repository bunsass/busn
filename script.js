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
  const backgroundMusic = document.getElementById('background-music');
  const backgroundVideo = document.getElementById('background');
  
  if (!backgroundMusic || !backgroundVideo) {
    console.error("Media elements not found");
    return;
  }
  
  backgroundMusic.volume = 0.3;
  backgroundVideo.muted = true;
  
  // Try to play video silently
  backgroundVideo.play().catch(err => {
    console.warn("Failed to play background video:", err);
  });
}

// ========================================
// Custom Cursor Setup
// ========================================
function setupCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  
  if (!cursor) return;
  
  if (isTouchDevice) {
    document.body.classList.add('touch-device');
    
    document.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      cursor.style.left = touch.clientX + 'px';
      cursor.style.top = touch.clientY + 'px';
      cursor.style.display = 'block';
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      cursor.style.left = touch.clientX + 'px';
      cursor.style.top = touch.clientY + 'px';
      cursor.style.display = 'block';
    }, { passive: true });

    document.addEventListener('touchend', () => {
      cursor.style.display = 'none';
    }, { passive: true });
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
// Start Screen Handler (iOS Compatible)
// ========================================
function setupStartScreen() {
  const startScreen = document.getElementById('start-screen');
  const startText = document.getElementById('start-text');
  const profileBlock = document.getElementById('profile-block');
  const profileContainer = document.querySelector('.profile-container');
  const backgroundMusic = document.getElementById('background-music');
  
  if (!startScreen || !startText) return;
  
  // Typewriter effect for start screen
  const startMessage = "Click here to see the motion baby";
  let startTextContent = '';
  let startIndex = 0;
  let startCursorVisible = true;
  let typewriterInterval;
  let cursorInterval;

  function typeWriterStart() {
    if (startIndex < startMessage.length) {
      startTextContent = startMessage.slice(0, startIndex + 1);
      startIndex++;
      startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
      setTimeout(typeWriterStart, 100);
    } else {
      startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
    }
  }

  cursorInterval = setInterval(() => {
    startCursorVisible = !startCursorVisible;
    startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
  }, 500);

  typeWriterStart();
  
  // Single unified interaction handler
  function handleStartInteraction(e) {
    if (hasUserInteracted) return;
    
    e.preventDefault();
    e.stopPropagation();
    hasUserInteracted = true;
    
    // Clear intervals
    clearInterval(cursorInterval);
    
    // Hide start screen
    startScreen.style.opacity = '0';
    startScreen.style.pointerEvents = 'none';
    
    setTimeout(() => {
      startScreen.classList.add('hidden');
      startScreen.remove();
    }, 500);
    
    // Initialize audio
    if (backgroundMusic) {
      backgroundMusic.muted = false;
      backgroundMusic.volume = 0.3;
      currentAudio = backgroundMusic;
      
      // Promise-based audio play for better iOS handling
      const playPromise = backgroundMusic.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Background music started successfully");
          })
          .catch(err => {
            console.warn("Audio autoplay prevented:", err);
            // Set up click-anywhere-to-play fallback
            document.addEventListener('click', function audioFallback() {
              backgroundMusic.play().then(() => {
                console.log("Audio started after user interaction");
                document.removeEventListener('click', audioFallback);
              });
            }, { once: true });
          });
      }
    }
    
    // Show profile block
    if (profileBlock) {
      profileBlock.classList.remove('hidden');
      
      // Use GSAP if available, otherwise use CSS
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(profileBlock,
          { opacity: 0, y: -50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1, 
            ease: 'power2.out',
            onComplete: () => {
              profileBlock.classList.add('profile-appear');
              if (profileContainer) {
                profileContainer.classList.add('orbit');
              }
            }
          }
        );
      } else {
        profileBlock.style.opacity = '1';
        profileBlock.style.transform = 'translate(-50%, -50%)';
        if (profileContainer) {
          profileContainer.classList.add('orbit');
        }
      }
    }
    
    // Initialize typewriter effects
    typeWriterName();
    typeWriterBio();
    
    // Initialize cursor trail (desktop only)
    if (!isTouchDevice && typeof cursorTrailEffect !== 'undefined') {
      try {
        new cursorTrailEffect({
          length: 10,
          size: 8,
          speed: 0.2
        });
      } catch (err) {
        console.warn("Cursor trail initialization failed:", err);
      }
    }
  }
  
  // Attach single event listener that works for both touch and click
  startScreen.addEventListener('click', handleStartInteraction, { once: true });
  
  // For iOS Safari, also listen to touchend
  if (isTouchDevice) {
    startScreen.addEventListener('touchend', handleStartInteraction, { once: true, passive: false });
  }
}

// ========================================
// Typewriter Effects
// ========================================
function typeWriterName() {
  const profileName = document.getElementById('profile-name');
  if (!profileName) return;
  
  const name = "JAQLIV";
  let nameText = '';
  let nameIndex = 0;
  let isNameDeleting = false;
  let nameCursorVisible = true;

  function type() {
    if (!isNameDeleting && nameIndex < name.length) {
      nameText = name.slice(0, nameIndex + 1);
      nameIndex++;
    } else if (isNameDeleting && nameIndex > 0) {
      nameText = name.slice(0, nameIndex - 1);
      nameIndex--;
    } else if (nameIndex === name.length) {
      isNameDeleting = true;
      setTimeout(type, 10000);
      return;
    } else if (nameIndex === 0) {
      isNameDeleting = false;
    }
    
    profileName.textContent = nameText + (nameCursorVisible ? '|' : ' ');
    
    if (Math.random() < 0.1) {
      profileName.classList.add('glitch');
      setTimeout(() => profileName.classList.remove('glitch'), 200);
    }
    
    setTimeout(type, isNameDeleting ? 150 : 300);
  }

  setInterval(() => {
    nameCursorVisible = !nameCursorVisible;
    profileName.textContent = nameText + (nameCursorVisible ? '|' : ' ');
  }, 500);

  type();
}

function typeWriterBio() {
  const profileBio = document.getElementById('profile-bio');
  if (!profileBio) return;
  
  const bioMessages = [
    "Fu*k Guns.lol & Fakecrime.bio got banned too often, so I created my own.",
    "\"Hello, World!\""
  ];
  
  let bioText = '';
  let bioIndex = 0;
  let bioMessageIndex = 0;
  let isBioDeleting = false;
  let bioCursorVisible = true;

  function type() {
    if (!isBioDeleting && bioIndex < bioMessages[bioMessageIndex].length) {
      bioText = bioMessages[bioMessageIndex].slice(0, bioIndex + 1);
      bioIndex++;
    } else if (isBioDeleting && bioIndex > 0) {
      bioText = bioMessages[bioMessageIndex].slice(0, bioIndex - 1);
      bioIndex--;
    } else if (bioIndex === bioMessages[bioMessageIndex].length) {
      isBioDeleting = true;
      setTimeout(type, 2000);
      return;
    } else if (bioIndex === 0 && isBioDeleting) {
      isBioDeleting = false;
      bioMessageIndex = (bioMessageIndex + 1) % bioMessages.length;
    }
    
    profileBio.textContent = bioText + (bioCursorVisible ? '|' : ' ');
    
    if (Math.random() < 0.1) {
      profileBio.classList.add('glitch');
      setTimeout(() => profileBio.classList.remove('glitch'), 200);
    }
    
    setTimeout(type, isBioDeleting ? 75 : 150);
  }

  setInterval(() => {
    bioCursorVisible = !bioCursorVisible;
    profileBio.textContent = bioText + (bioCursorVisible ? '|' : ' ');
  }, 500);

  type();
}

// ========================================
// Volume Controls
// ========================================
function setupVolumeControls() {
  const volumeIcon = document.getElementById('volume-icon');
  const volumeSlider = document.getElementById('volume-slider');
  
  if (!volumeIcon || !volumeSlider) return;
  
  function toggleMute(e) {
    e.preventDefault();
    e.stopPropagation();
    
    isMuted = !isMuted;
    if (currentAudio) {
      currentAudio.muted = isMuted;
    }
    
    volumeIcon.innerHTML = isMuted
      ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>`
      : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
  }
  
  volumeIcon.addEventListener('click', toggleMute);
  
  if (isTouchDevice) {
    volumeIcon.addEventListener('touchend', toggleMute, { passive: false });
  }
  
  volumeSlider.addEventListener('input', () => {
    if (currentAudio) {
      currentAudio.volume = volumeSlider.value;
      isMuted = false;
      currentAudio.muted = false;
      volumeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
    }
  });
}

// ========================================
// Transparency Controls
// ========================================
function setupTransparencyControls() {
  const transparencySlider = document.getElementById('transparency-slider');
  const profileBlock = document.getElementById('profile-block');
  const skillsBlock = document.getElementById('skills-block');
  const socialIcons = document.querySelectorAll('.social-icon');
  const badges = document.querySelectorAll('.badge');
  const profilePicture = document.querySelector('.profile-picture');
  const profileName = document.getElementById('profile-name');
  const profileBio = document.getElementById('profile-bio');
  const visitorCount = document.getElementById('visitor-count');
  
  if (!transparencySlider) return;
  
  transparencySlider.addEventListener('input', () => {
    const opacity = transparencySlider.value;
    
    if (opacity == 0) {
      if (profileBlock) {
        profileBlock.style.background = 'rgba(0, 0, 0, 0)';
        profileBlock.style.borderColor = 'transparent';
        profileBlock.style.backdropFilter = 'none';
      }
      if (skillsBlock) {
        skillsBlock.style.background = 'rgba(0, 0, 0, 0)';
        skillsBlock.style.borderColor = 'transparent';
        skillsBlock.style.backdropFilter = 'none';
      }
    } else {
      if (profileBlock) {
        profileBlock.style.background = `rgba(0, 0, 0, ${opacity})`;
        profileBlock.style.borderColor = '';
        profileBlock.style.backdropFilter = `blur(${10 * opacity}px)`;
      }
      if (skillsBlock) {
        skillsBlock.style.background = `rgba(0, 0, 0, ${opacity})`;
        skillsBlock.style.borderColor = '';
        skillsBlock.style.backdropFilter = `blur(${10 * opacity}px)`;
      }
    }
    
    // Keep interactive elements fully visible
    [profilePicture, profileName, profileBio, visitorCount].forEach(el => {
      if (el) el.style.opacity = '1';
    });
    
    socialIcons.forEach(icon => {
      icon.style.opacity = '1';
      icon.style.pointerEvents = 'auto';
    });
    
    badges.forEach(badge => {
      badge.style.opacity = '1';
      badge.style.pointerEvents = 'auto';
    });
  });
}

// ========================================
// Theme Switching
// ========================================
function setupThemeSwitching() {
  const backgroundVideo = document.getElementById('background');
  const hackerOverlay = document.getElementById('hacker-overlay');
  const snowOverlay = document.getElementById('snow-overlay');
  const profileBlock = document.getElementById('profile-block');
  const skillsBlock = document.getElementById('skills-block');
  const volumeSlider = document.getElementById('volume-slider');
  const profileContainer = document.querySelector('.profile-container');
  
  const backgroundMusic = document.getElementById('background-music');
  const hackerMusic = document.getElementById('hacker-music');
  const rainMusic = document.getElementById('rain-music');
  const animeMusic = document.getElementById('anime-music');
  const carMusic = document.getElementById('car-music');

  function switchTheme(videoSrc, audio, themeClass, overlay = null, overlayOverProfile = false) {
    let primaryColor;
    switch (themeClass) {
      case 'home-theme': primaryColor = '#00CED1'; break;
      case 'hacker-theme': primaryColor = '#22C55E'; break;
      case 'rain-theme': primaryColor = '#1E3A8A'; break;
      case 'anime-theme': primaryColor = '#DC2626'; break;
      case 'car-theme': primaryColor = '#EAB308'; break;
      default: primaryColor = '#00CED1';
    }
    document.documentElement.style.setProperty('--primary-color', primaryColor);

    if (typeof gsap !== 'undefined' && backgroundVideo) {
      gsap.to(backgroundVideo, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          backgroundVideo.src = videoSrc;

          if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
          }
          currentAudio = audio;
          if (volumeSlider) {
            currentAudio.volume = volumeSlider.value;
          }
          currentAudio.muted = isMuted;
          currentAudio.play().catch(err => console.warn("Theme music play failed:", err));

          document.body.classList.remove('home-theme', 'hacker-theme', 'rain-theme', 'anime-theme', 'car-theme');
          document.body.classList.add(themeClass);

          if (hackerOverlay) hackerOverlay.classList.add('hidden');
          if (snowOverlay) snowOverlay.classList.add('hidden');
          
          if (profileBlock) profileBlock.style.zIndex = overlayOverProfile ? 10 : 20;
          if (skillsBlock) skillsBlock.style.zIndex = overlayOverProfile ? 10 : 20;
          
          if (overlay) {
            overlay.classList.remove('hidden');
          }

          gsap.to(backgroundVideo, {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
              if (profileContainer) {
                profileContainer.classList.remove('orbit');
                void profileContainer.offsetWidth;
                profileContainer.classList.add('orbit');
              }
            }
          });
        }
      });
    }
  }

  // Theme button setup
  const themes = [
    { id: 'home-theme', video: 'assets/background.mp4', audio: backgroundMusic, class: 'home-theme' },
    { id: 'hacker-theme', video: 'assets/hacker_background.mp4', audio: hackerMusic, class: 'hacker-theme', overlay: hackerOverlay },
    { id: 'rain-theme', video: 'assets/rain_background.mov', audio: rainMusic, class: 'rain-theme', overlay: snowOverlay, overlayOver: true },
    { id: 'anime-theme', video: 'assets/anime_background.mp4', audio: animeMusic, class: 'anime-theme' },
    { id: 'car-theme', video: 'assets/car_background.mp4', audio: carMusic, class: 'car-theme' }
  ];

  themes.forEach(theme => {
    const button = document.getElementById(theme.id);
    if (button) {
      button.addEventListener('click', () => {
        switchTheme(theme.video, theme.audio, theme.class, theme.overlay, theme.overlayOver);
      });
      
      if (isTouchDevice) {
        button.addEventListener('touchend', (e) => {
          e.preventDefault();
          switchTheme(theme.video, theme.audio, theme.class, theme.overlay, theme.overlayOver);
        }, { passive: false });
      }
    }
  });
}

// ========================================
// Visitor Counter
// ========================================
function initializeVisitorCounter() {
  const visitorCount = document.getElementById('visitor-count');
  if (!visitorCount) return;
  
  let totalVisitors = localStorage.getItem('totalVisitorCount');
  if (!totalVisitors) {
    totalVisitors = 921234;
    localStorage.setItem('totalVisitorCount', totalVisitors);
  } else {
    totalVisitors = parseInt(totalVisitors);
  }

  const hasVisited = localStorage.getItem('hasVisited');
  if (!hasVisited) {
    totalVisitors++;
    localStorage.setItem('totalVisitorCount', totalVisitors);
    localStorage.setItem('hasVisited', 'true');
  }

  visitorCount.textContent = totalVisitors.toLocaleString();
}

// ========================================
// Profile Picture Interactions
// ========================================
function setupProfilePicture() {
  const profilePicture = document.querySelector('.profile-picture');
  const profileContainer = document.querySelector('.profile-container');
  const glitchOverlay = document.querySelector('.glitch-overlay');
  
  if (!profilePicture || !profileContainer) return;
  
  profilePicture.addEventListener('mouseenter', () => {
    if (glitchOverlay) {
      glitchOverlay.style.opacity = '1';
      setTimeout(() => {
        glitchOverlay.style.opacity = '0';
      }, 500);
    }
  });

  function spinOrbit(e) {
    e.preventDefault();
    profileContainer.classList.remove('fast-orbit', 'orbit');
    void profileContainer.offsetWidth;
    profileContainer.classList.add('fast-orbit');
    
    setTimeout(() => {
      profileContainer.classList.remove('fast-orbit');
      void profileContainer.offsetWidth;
      profileContainer.classList.add('orbit');
    }, 500);
  }
  
  profilePicture.addEventListener('click', spinOrbit);
  
  if (isTouchDevice) {
    profilePicture.addEventListener('touchend', spinOrbit, { passive: false });
  }
}

// ========================================
// 3D Tilt Effect
// ========================================
function setup3DTilt() {
  const profileBlock = document.getElementById('profile-block');
  const skillsBlock = document.getElementById('skills-block');
  
  if (typeof gsap === 'undefined') return;
  
  function handleTilt(e, element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let clientX, clientY;

    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const mouseX = clientX - centerX;
    const mouseY = clientY - centerY;

    const maxTilt = 15;
    const tiltX = (mouseY / rect.height) * maxTilt;
    const tiltY = -(mouseX / rect.width) * maxTilt;

    gsap.to(element, {
      rotationX: tiltX,
      rotationY: tiltY,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000
    });
  }
  
  function resetTilt(element) {
    gsap.to(element, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  }
  
  [profileBlock, skillsBlock].forEach(block => {
    if (!block) return;
    
    block.addEventListener('mousemove', (e) => handleTilt(e, block));
    block.addEventListener('mouseleave', () => resetTilt(block));
    
    if (isTouchDevice) {
      block.addEventListener('touchmove', (e) => {
        e.preventDefault();
        handleTilt(e, block);
      }, { passive: false });
      
      block.addEventListener('touchend', () => resetTilt(block), { passive: true });
    }
  });
}

// ========================================
// Results/Skills Toggle
// ========================================
function setupResultsToggle() {
  const resultsButton = document.getElementById('results-theme');
  const profileBlock = document.getElementById('profile-block');
  const skillsBlock = document.getElementById('skills-block');
  const resultsHint = document.getElementById('results-hint');
  const pythonBar = document.getElementById('python-bar');
  const cppBar = document.getElementById('cpp-bar');
  const csharpBar = document.getElementById('csharp-bar');
  
  if (!resultsButton) return;
  
  let isShowingSkills = false;
  
  function toggleResults(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (typeof gsap === 'undefined') return;
    
    if (!isShowingSkills) {
      gsap.to(profileBlock, {
        x: -100,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          profileBlock.classList.add('hidden');
          skillsBlock.classList.remove('hidden');
          gsap.fromTo(skillsBlock,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
          );
          if (pythonBar) gsap.to(pythonBar, { width: '87%', duration: 2, ease: 'power2.out' });
          if (cppBar) gsap.to(cppBar, { width: '75%', duration: 2, ease: 'power2.out' });
          if (csharpBar) gsap.to(csharpBar, { width: '80%', duration: 2, ease: 'power2.out' });
        }
      });
      if (resultsHint) resultsHint.classList.remove('hidden');
      isShowingSkills = true;
    } else {
      gsap.to(skillsBlock, {
        x: 100,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          skillsBlock.classList.add('hidden');
          profileBlock.classList.remove('hidden');
          gsap.fromTo(profileBlock,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
          );
        }
      });
      if (resultsHint) resultsHint.classList.add('hidden');
      isShowingSkills = false;
    }
  }
  
  resultsButton.addEventListener('click', toggleResults);
  
  if (isTouchDevice) {
    resultsButton.addEventListener('touchend', toggleResults, { passive: false });
  }
}

// ========================================
// Initialize Everything
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM Content Loaded - Initializing...");
  
  // Initialize media
  initMedia();
  
  // Setup all features
  setupCustomCursor();
  setupStartScreen();
  setupVolumeControls();
  setupTransparencyControls();
  setupThemeSwitching();
  initializeVisitorCounter();
  setupProfilePicture();
  setup3DTilt();
  setupResultsToggle();
  
  console.log("Initialization complete");
});

// Load event for any additional initialization
window.addEventListener('load', () => {
  console.log("Window loaded");
  initMedia();
});
