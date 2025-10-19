<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="theme-color" content="#1a1425">
  <title>My Profile</title>
  <link rel="icon" type="image/x-icon" href="https://raw.githubusercontent.com/bunsass/busn/refs/heads/main/asset/Sticker_PPG_24_Evernight_02.ico">
  <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Background Particles -->
  <div id="particles"></div>

  <!-- Main Container -->
  <div class="container">
    <h1 id="greeting"></h1>
    <div class="subtitle">ブンサス</div>

    <!-- About Me -->
    <div class="card">
      <h2>About Me</h2>
      <p><strong>Name:</strong> Bui Minh Triet / buns</p>
      <p><strong>Location:</strong> Da lat, Vietnam</p>
      <p><strong>Birthday:</strong> 05/07/2011</p>
    </div>

    <!-- Discord Status -->
    <div class="card">
      <h2>💬 Discord Status</h2>
      <div id="discord-status">
        <div class="loading">Loading Discord status...</div>
      </div>
    </div>

    <!-- Contact -->
    <div class="card">
      <h2>Contact Me</h2>
      <ul class="contact-list">
        <li><strong>Email:</strong> <a href="mailto:buminhtriet57@gmail.com">click here to email me❤️</a></li>
        <li><strong>GitHub:</strong> <a href="https://github.com/bunsass" target="_blank">bunsass</a></li>
        <li><strong>Discord:</strong> <a href='https://discord.com/users/1003100550700748871' target="_blank">bunshevid_oguri</a></li>
        <li><strong>Facebook:</strong> <a href="https://www.facebook.com/bunsass/" target="_blank">bunsass</a></li>
      </ul>
    </div>

    <!-- Biography -->
    <div class="card">
      <h2>My Bio (*^▽^*)┛</h2>
      <p>Hello! I'm passionate about learning new stuffs, coding, and creating amazing experiences. I love learning new things and working on projects that make a difference. In my free time, I enjoy listening to music, playing games, and exploring new ideas. Let's connect and create something awesome together!</p>
    </div>

    <!-- Honkai Star Rail -->
    <div class="card game-card hsr-card">
      <h2>⭐ Honkai Star Rail Profile</h2>
      <div id="hsr-loading" class="loading">Loading player info...</div>
      <div id="hsr-error" class="error-box hidden"></div>
      <div id="hsr-player-info" class="hidden">
        <div class="player-info">
          <img id="hsr-avatar" src="" alt="Avatar" class="player-avatar">
          <div class="player-details">
            <h3 id="hsr-nickname"></h3>
            <p><span class="label">TL</span> <span id="hsr-level"></span> | <span class="label">EQ</span> <span id="hsr-world-level"></span></p>
            <p class="signature" id="hsr-signature"></p>
            <div class="stats">
              <span>🏆 <span id="hsr-achievements"></span></span>
              <span>⭐ <span id="hsr-su-stars"></span></span>
              <span>⚡ <span id="hsr-lightcones"></span></span>
            </div>
            <div class="uid">
              UID: <span id="hsr-uid"></span>
              <button class="copy-btn" id="copy-hsr-uid">📋 Copy</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Zenless Zone Zero -->
    <div class="card game-card zzz-card">
      <h2>⚡ Zenless Zone Zero Profile</h2>
      <div id="zzz-loading" class="loading">Loading player info...</div>
      <div id="zzz-error" class="error-box hidden"></div>
      <div id="zzz-player-info" class="hidden">
        <div class="player-info">
          <img id="zzz-avatar" src="" alt="Avatar" class="player-avatar">
          <div class="player-details">
            <h3 id="zzz-nickname"></h3>
            <p><span class="label">Level</span> <span id="zzz-level"></span></p>
            <p class="signature" id="zzz-signature"></p>
            <div class="stats">
              <span>⚔️ <span id="zzz-line-breaker"></span></span>
              <span>🛡️ <span id="zzz-shiyu"></span></span>
              <span>💥 <span id="zzz-disintegration"></span></span>
            </div>
            <div class="uid">
              UID: <span id="zzz-uid"></span>
              <button class="copy-btn" id="copy-zzz-uid">📋 Copy</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Spotify -->
    <div class="card">
      <h2>🎧 Featured Playlists</h2>
      <p>Check out my playlists :3</p>
      <iframe style="border-radius:12px; margin-top: 15px;" 
              src="https://open.spotify.com/embed/playlist/7iG4O8ZnFchAoh81RXIwVH?utm_source=generator" 
              width="100%" 
              height="380" 
              frameborder="0" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy">
      </iframe>
    </div>
  </div>

  <!-- Music Player -->
  <div id="music-player">
    <div id="album-art-container">
      <img id="album-art" src="https://cdn.discordapp.com/attachments/1416355899232223235/1428594030283067402/2229438d735a893d8f80cd69f4319678.png?ex=68f3115e&is=68f1bfde&hm=057e81965a0105dfcccc3332ed6256590129ffc2b7a1cf8387bed3f98d01c539&" alt="Album Art">
    </div>
    <div id="song-info" class="hidden"></div>
    <div id="music-controls" class="hidden">
      <div class="control-group">
        <label>🔊</label>
        <input type="range" id="volume" min="0" max="1" step="0.01" value="0.5">
      </div>
      <button class="control-btn" id="prev">⏮️ Previous</button>
      <button class="control-btn" id="play-pause">▶️ Play</button>
      <button class="control-btn" id="next">⏭️ Next</button>
      <button class="control-btn close-btn" id="close-controls">✖ Close</button>
    </div>
  </div>

  <audio id="audio" crossorigin="anonymous"></audio>

  <!-- Decorative Images -->
  <img class="decorative-image image1" src="https://raw.githubusercontent.com/bunsass/busn/main/asset/Character_Evernight_Eidolon_3.webp" alt="" loading="lazy" onerror="this.style.display='none'">
  <img class="decorative-image image2" src="https://raw.githubusercontent.com/bunsass/busn/main/asset/Character_Evernight_Eidolon_2.webp" alt="" loading="lazy" onerror="this.style.display='none'">
  <img class="decorative-image image3" src="https://raw.githubusercontent.com/bunsass/busn/main/asset/Character_Evernight_Eidolon_6.webp" alt="" loading="lazy" onerror="this.style.display='none'">
  <img class="decorative-image image4" src="https://raw.githubusercontent.com/bunsass/busn/main/asset/Character_Evernight_Eidolon_5.webp" alt="" loading="lazy" onerror="this.style.display='none'">
  <img class="image5" src="https://raw.githubusercontent.com/bunsass/busn/main/asset/Sticker_PPG_24_Evernight_03.webp" alt="" loading="lazy" onerror="this.style.display='none'">

  <script src="script.js"></script>
</body>
</html>
