// Загрузка популярных видео
function loadTrendingVideos() {
    const loader = document.getElementById('loader');
    const videoGrid = document.getElementById('videoGrid');
    
    loader.style.display = 'flex';
    videoGrid.innerHTML = '';
    
    fetch('https://nyc1.iv.ggtyler.dev/api/v1/trending?region=RU')
        .then(response => response.json())
        .then(data => {
            loader.style.display = 'none';
            
            data.forEach((video, index) => {
                const videoCard = document.createElement('div');
                videoCard.className = 'video-card';
                videoCard.style.setProperty('--delay', index);
                videoCard.innerHTML = `
                    <div class="video-thumbnail" onclick="watchVideo('${video.videoId}')">
                        <img src="${video.videoThumbnails[3].url}" alt="${video.title}">
                        <div class="video-duration">${formatDuration(video.lengthSeconds)}</div>
                    </div>
                    <div class="video-info">
                        <h3 class="video-title">${video.title}</h3>
                        <div class="video-channel">${video.author}</div>
                        <div class="video-meta">
                            <span>${video.viewCount.toLocaleString()} просмотров</span>
                            <span>${new Date(video.published * 1000).toLocaleDateString()}</span>
                        </div>
                    </div>
                `;
                videoGrid.appendChild(videoCard);
            });
        })
        .catch(error => {
            console.error('Ошибка:', error);
            loader.innerHTML = '<p>Не удалось загрузить видео. Попробуйте позже.</p>';
        });
}

// Загрузка результатов поиска
function loadSearchResults(query) {
    const loader = document.getElementById('loader');
    const videoGrid = document.getElementById('videoGrid');
    
    loader.style.display = 'flex';
    videoGrid.innerHTML = '';
    
    fetch(`https://nyc1.iv.ggtyler.dev/api/v1/search?q=${encodeURIComponent(query)}&type=video`)
        .then(response => response.json())
        .then(data => {
            loader.style.display = 'none';
            
            if (data.length === 0) {
                videoGrid.innerHTML = '<p class="no-results">Ничего не найдено. Попробуйте другой запрос.</p>';
                return;
            }
            
            data.forEach((video, index) => {
                const videoCard = document.createElement('div');
                videoCard.className = 'video-card';
                videoCard.style.setProperty('--delay', index);
                videoCard.innerHTML = `
                    <div class="video-thumbnail" onclick="watchVideo('${video.videoId}')">
                        <img src="${video.videoThumbnails[3].url}" alt="${video.title}">
                        <div class="video-duration">${formatDuration(video.lengthSeconds)}</div>
                    </div>
                    <div class="video-info">
                        <h3 class="video-title">${video.title}</h3>
                        <div class="video-channel">${video.author}</div>
                        <div class="video-meta">
                            <span>${video.viewCount.toLocaleString()} просмотров</span>
                            <span>${new Date(video.published * 1000).toLocaleDateString()}</span>
                        </div>
                    </div>
                `;
                videoGrid.appendChild(videoCard);
            });
        })
        .catch(error => {
            console.error('Ошибка:', error);
            loader.innerHTML = '<p>Ошибка поиска. Попробуйте позже.</p>';
        });
}

// Загрузка видео для просмотра
function loadVideo(videoId) {
    const loader = document.getElementById('loader');
    const videoFrame = document.getElementById('videoFrame');
    const videoInfo = document.getElementById('videoInfo');
    
    loader.style.display = 'block';
    videoFrame.style.display = 'none';
    
    fetch(`https://nyc1.iv.ggtyler.dev/api/v1/videos/${videoId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('videoTitle').textContent = data.title;
            document.getElementById('videoAuthor').textContent = data.author;
            document.getElementById('videoViews').textContent = `${data.viewCount.toLocaleString()} просмотров`;
            document.getElementById('videoDate').textContent = new Date(data.published * 1000).toLocaleDateString();
            document.getElementById('videoDescription').textContent = data.description;
            
            videoFrame.src = `https://invidious.nerdvpn.de/embed/${videoId}`;
            videoFrame.style.display = 'block';
            loader.style.display = 'none';
            
            videoFrame.onload = function() {
                console.log('Видео загружено');
            };
            
            videoFrame.onerror = function() {
                console.log('Ошибка загрузки видео, пробуем снова...');
                setTimeout(() => {
                    videoFrame.src = `https://invidious.nerdvpn.de/embed/${videoId}?retry=${Date.now()}`;
                }, 2000);
            };
        })
        .catch(error => {
            console.error('Ошибка:', error);
            loader.innerHTML = '<p>Не удалось загрузить видео. Попробуйте позже.</p>';
        });
}

// Форматирование длительности видео
function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    return [h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s]
        .filter(Boolean)
        .join(':');
}

// Перенаправление на страницу просмотра
function watchVideo(videoId) {
    if (document.cookie.includes('username')) {
        window.location.href = `watch.html?id=${videoId}`;
    } else {
        alert("Авторизуйтесь для просмотра видео");
        window.location.href = 'login.html';
    }
}