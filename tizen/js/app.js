// RedFlix Smart TV App - Main Application
var App = (function() {
    var API_BASE = '';
    var currentScreen = 'home';
    var currentChannel = null;
    var channels = [];
    var content = [];
    var user = null;
    var accessCode = null;
    
    function init() {
        console.log('RedFlix TV App initializing...');
        loadConfig();
        Navigation.init();
        Player.init();
        checkAuth();
        hideLoading();
        console.log('RedFlix TV App initialized');
    }
    
    function loadConfig() {
        API_BASE = localStorage.getItem('api_base') || 'https://api.redflix.com';
    }
    
    function checkAuth() {
        var token = localStorage.getItem('token');
        accessCode = localStorage.getItem('access_code');
        
        if (token) {
            validateToken(token);
        } else if (accessCode) {
            validateAccessCode(accessCode);
        } else {
            showLoginScreen();
        }
    }
    
    function validateToken(token) {
        fetch(API_BASE + '/api/auth/me', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .then(function(response) {
            if (response.ok) return response.json();
            throw new Error('Invalid token');
        })
        .then(function(data) {
            user = data;
            loadContent();
            showHomeScreen();
        })
        .catch(function(error) {
            console.error('Token validation failed:', error);
            localStorage.removeItem('token');
            showLoginScreen();
        });
    }
    
    function validateAccessCode(code) {
        fetch(API_BASE + '/api/access-codes/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: code })
        })
        .then(function(response) {
            if (response.ok) return response.json();
            throw new Error('Invalid access code');
        })
        .then(function(data) {
            if (data.valid) {
                loadContent();
                showHomeScreen();
            } else {
                localStorage.removeItem('access_code');
                showLoginScreen();
            }
        })
        .catch(function(error) {
            console.error('Access code validation failed:', error);
            localStorage.removeItem('access_code');
            showLoginScreen();
        });
    }
    
    function loadContent() {
        fetch(API_BASE + '/api/content?type=live')
        .then(function(response) { return response.json(); })
        .then(function(data) {
            channels = data.filter(function(item) { return item.isLive && item.channelNumber; });
            channels.sort(function(a, b) { return a.channelNumber - b.channelNumber; });
        })
        .catch(function(error) {
            console.error('Error loading channels:', error);
        });
        
        fetch(API_BASE + '/api/content')
        .then(function(response) { return response.json(); })
        .then(function(data) {
            content = data;
            renderContent();
        })
        .catch(function(error) {
            console.error('Error loading content:', error);
        });
    }
    
    function renderContent() {
        var app = document.getElementById('app');
        if (!app) return;
        
        var html = '<div class="main-container">';
        html += '<header class="header">';
        html += '<div class="logo">RedFlix</div>';
        html += '<nav class="nav">';
        html += '<button data-focusable="true" data-screen="home" class="nav-item">Inicio</button>';
        html += '<button data-focusable="true" data-screen="movies" class="nav-item">Filmes</button>';
        html += '<button data-focusable="true" data-screen="series" class="nav-item">Series</button>';
        html += '<button data-focusable="true" data-screen="channels" class="nav-item">Canais</button>';
        html += '<button data-focusable="true" data-screen="search" class="nav-item">Buscar</button>';
        html += '</nav>';
        html += '</header>';
        html += '<main class="content-area" id="content-area">';
        html += renderHomeContent();
        html += '</main>';
        html += '</div>';
        
        app.innerHTML = html;
        
        document.querySelectorAll('.nav-item').forEach(function(item) {
            item.addEventListener('click', function() {
                var screen = this.getAttribute('data-screen');
                navigateToScreen(screen);
            });
        });
        
        Navigation.updateFocusableElements();
    }
    
    function renderHomeContent() {
        var html = '<section class="content-section">';
        html += '<h2>Continuar Assistindo</h2>';
        html += '<div class="content-row" id="continue-watching"></div>';
        html += '</section>';
        
        html += '<section class="content-section">';
        html += '<h2>Filmes Populares</h2>';
        html += '<div class="content-row">';
        var movies = content.filter(function(item) { return item.type === 'movie'; }).slice(0, 10);
        movies.forEach(function(movie) { html += renderContentCard(movie); });
        html += '</div></section>';
        
        html += '<section class="content-section">';
        html += '<h2>Series Populares</h2>';
        html += '<div class="content-row">';
        var series = content.filter(function(item) { return item.type === 'series'; }).slice(0, 10);
        series.forEach(function(serie) { html += renderContentCard(serie); });
        html += '</div></section>';
        
        return html;
    }
    
    function renderContentCard(item) {
        var posterUrl = item.posterPath || '/images/placeholder.png';
        if (posterUrl.startsWith('/')) posterUrl = API_BASE + posterUrl;
        
        return '<div class="content-card" data-focusable="true" data-id="' + item.id + '" onclick="App.playContent(' + item.id + ')">' +
            '<img src="' + posterUrl + '" alt="' + item.title + '">' +
            '<div class="card-title">' + item.title + '</div></div>';
    }
    
    function navigateToScreen(screen) {
        currentScreen = screen;
        var contentArea = document.getElementById('content-area');
        
        switch (screen) {
            case 'home': contentArea.innerHTML = renderHomeContent(); break;
            case 'movies': contentArea.innerHTML = renderMoviesContent(); break;
            case 'series': contentArea.innerHTML = renderSeriesContent(); break;
            case 'channels': contentArea.innerHTML = renderChannelsContent(); break;
            case 'search': showSearchScreen(); break;
        }
        Navigation.updateFocusableElements();
    }
    
    function renderMoviesContent() {
        var html = '<section class="content-section"><h2>Todos os Filmes</h2><div class="content-grid">';
        content.filter(function(item) { return item.type === 'movie'; }).forEach(function(movie) { html += renderContentCard(movie); });
        return html + '</div></section>';
    }
    
    function renderSeriesContent() {
        var html = '<section class="content-section"><h2>Todas as Series</h2><div class="content-grid">';
        content.filter(function(item) { return item.type === 'series'; }).forEach(function(serie) { html += renderContentCard(serie); });
        return html + '</div></section>';
    }
    
    function renderChannelsContent() {
        var html = '<section class="content-section"><h2>Canais ao Vivo</h2><div class="channels-grid">';
        channels.forEach(function(channel) {
            html += '<div class="channel-card" data-focusable="true" data-channel="' + channel.channelNumber + '" onclick="App.goToChannel(' + channel.channelNumber + ')">';
            html += '<div class="channel-number">' + channel.channelNumber + '</div>';
            html += '<div class="channel-name">' + channel.title + '</div></div>';
        });
        return html + '</div></section>';
    }
    
    function showSearchScreen() {
        var contentArea = document.getElementById('content-area');
        var html = '<section class="search-section"><h2>Buscar</h2>';
        html += '<div class="search-container"><input type="text" id="search-input" data-focusable="true" placeholder="Digite para buscar..." class="search-input"></div>';
        html += '<div class="search-results" id="search-results"></div></section>';
        contentArea.innerHTML = html;
        
        var searchInput = document.getElementById('search-input');
        searchInput.addEventListener('focus', function() { console.log('Search input focused - virtual keyboard should appear'); });
        searchInput.addEventListener('input', function() { performSearch(this.value); });
        Navigation.updateFocusableElements();
    }
    
    function performSearch(query) {
        if (query.length < 2) { document.getElementById('search-results').innerHTML = ''; return; }
        var results = content.filter(function(item) { return item.title.toLowerCase().includes(query.toLowerCase()); });
        var html = '<div class="content-grid">';
        results.forEach(function(item) { html += renderContentCard(item); });
        document.getElementById('search-results').innerHTML = html + '</div>';
        Navigation.updateFocusableElements();
    }
    
    function playContent(id) {
        var item = content.find(function(c) { return c.id === id; });
        if (item && item.streamUrl) { showPlayerScreen(); Player.play(item.streamUrl); }
    }
    
    function goToChannel(channelNumber) {
        var channel = channels.find(function(c) { return c.channelNumber === channelNumber; });
        if (channel) {
            currentChannel = channel;
            showPlayerScreen();
            Player.play(channel.streamUrl);
            showChannelInfo(channel);
        } else {
            showMessage('Canal ' + channelNumber + ' nao encontrado');
        }
    }
    
    function changeChannel(direction) {
        if (!currentChannel) { if (channels.length > 0) goToChannel(channels[0].channelNumber); return; }
        var currentIndex = channels.findIndex(function(c) { return c.channelNumber === currentChannel.channelNumber; });
        var newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < channels.length) goToChannel(channels[newIndex].channelNumber);
    }
    
    function showChannelInfo(channel) {
        var overlay = document.getElementById('channel-info');
        if (!overlay) { overlay = document.createElement('div'); overlay.id = 'channel-info'; overlay.className = 'channel-info-overlay'; document.body.appendChild(overlay); }
        overlay.innerHTML = '<div class="channel-number">' + channel.channelNumber + '</div><div class="channel-name">' + channel.title + '</div>';
        overlay.classList.add('visible');
        setTimeout(function() { overlay.classList.remove('visible'); }, 3000);
    }
    
    function showPlayerScreen() { document.getElementById('app').classList.add('player-mode'); }
    function hidePlayerScreen() { document.getElementById('app').classList.remove('player-mode'); Player.stop(); }
    
    function showLoginScreen() {
        var app = document.getElementById('app');
        app.innerHTML = '<div class="login-screen"><div class="login-container"><h1>RedFlix</h1><p>Digite seu codigo de acesso</p>' +
            '<input type="text" id="access-code-input" data-focusable="true" placeholder="Codigo de acesso" class="login-input">' +
            '<button data-focusable="true" onclick="App.submitAccessCode()" class="login-button">Entrar</button></div></div>';
        Navigation.updateFocusableElements();
    }
    
    function submitAccessCode() {
        var code = document.getElementById('access-code-input').value;
        if (code) { localStorage.setItem('access_code', code); validateAccessCode(code); }
    }
    
    function showHomeScreen() { renderContent(); }
    function goBack() { if (document.getElementById('app').classList.contains('player-mode')) hidePlayerScreen(); else if (currentScreen !== 'home') navigateToScreen('home'); }
    function onVideoEnded() { if (currentChannel) changeChannel(1); else hidePlayerScreen(); }
    
    function showMessage(message) {
        var msgEl = document.getElementById('message-overlay');
        if (!msgEl) { msgEl = document.createElement('div'); msgEl.id = 'message-overlay'; msgEl.className = 'message-overlay'; document.body.appendChild(msgEl); }
        msgEl.textContent = message; msgEl.classList.add('visible');
        setTimeout(function() { msgEl.classList.remove('visible'); }, 3000);
    }
    
    function hideLoading() { var loading = document.getElementById('loading'); if (loading) loading.style.display = 'none'; }
    
    document.addEventListener('DOMContentLoaded', init);
    
    return { init: init, goToChannel: goToChannel, changeChannel: changeChannel, playContent: playContent, goBack: goBack, onVideoEnded: onVideoEnded, submitAccessCode: submitAccessCode };
})();
