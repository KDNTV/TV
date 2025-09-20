document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const loadingOverlay = document.getElementById('loadingOverlay');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    const programTitle = document.getElementById('programTitle');
    const channelCards = document.querySelectorAll('.channel-card');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    // Show error message about stream limitations
    if (errorMessage) errorMessage.style.display = 'block';

    // Channel data with working test streams
    const channels = {
        '0': {
            name: 'TEST STREAM',
            source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
            description: 'بث تجريبي - Test Stream'
        },
        '1': {
            name: 'AL JAZEERA',
            source: 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8',
            description: 'قناة الجزيرة الدولية'
        },
        '2': {
            name: 'FRANCE 24',
            source: 'https://live.france24.com/fr24/ar/hls/live.m3u8',
            description: 'قناة فرانس 24 العربية'
        },
        '3': {
            name: 'BBC WORLD',
            source: 'https://bbcwshls-i.akamaihd.net/hls/live/2530591/ws-arablive/master.m3u8',
            description: 'بي بي سي عربي'
        },
        '4': {
            name: 'DW TV',
            source: 'https://dwstream6-lh.akamaihd.net/i/dwstream6_live@123962/master.m3u8',
            description: 'قناة دويتشه فيله العربية'
        },
        '5': {
            name: 'EURONEWS',
            source: 'https://euronews-al.secure.footprint.net/eu1-al/_definst_/euronews-ar/playlist.m3u8',
            description: 'يورونيوز عربي'
        }
    };

    // Setup JWPlayer
    jwplayer.key = 'XSuP4qMl+9tK17QNb+4+th2Pm9AWgMO/cYH8CI0HGGr7bdjo';
    const playerInstance = jwplayer("player");

    // Initialize player with default setup
    playerInstance.setup({
        image: "https://up6.cc/2025/08/175836245010381.jpg",
        width: "100%",
        height: "100%",
        aspectratio: "16:9",
        mute: false,
        autostart: false, // Changed to false to prevent auto-playing
        cast: {},
        logo: {
            file: "https://up6.cc/2025/08/175836245010381.jpg",
            position: 'bottom-right'
        },
        stretching: 'uniform'
    });

    // Show notification function
    function showNotification(message, duration = 3000) {
        if (notification && notificationText) {
            notificationText.textContent = message;
            notification.classList.add('visible');

            setTimeout(() => {
                notification.classList.remove('visible');
            }, duration);
        }
    }

    // Show loading
    function showLoading() {
        if (loadingOverlay) loadingOverlay.classList.add('visible');
    }

    // Hide loading
    function hideLoading() {
        if (loadingOverlay) loadingOverlay.classList.remove('visible');
    }

    // Change channel function
    function changeChannel(channelId) {
        const channel = channels[channelId];
        if (!channel) return;

        showLoading();

        // Update active channel
        channelCards.forEach(card => card.classList.remove('active'));

        const activeCard = document.querySelector(`.channel-card[data-channel="${channelId}"]`);
        if (activeCard) activeCard.classList.add('active');

        // Update program info
        if (programTitle) programTitle.textContent = channel.description;

        // Setup player with new source
        playerInstance.setup({
            playlist: [{
                image: "https://up6.cc/2025/08/175836245010381.jpg",
                sources: [{
                    default: true,
                    type: "hls",
                    file: channel.source,
                    label: "0"
                }]
            }],
            width: "100%",
            height: "100%",
            aspectratio: "16:9",
            mute: false,
            autostart: true,
            cast: {},
            logo: {
                file: "https://up6.cc/2025/08/175836245010381.jpg",
                position: 'bottom-right'
            },
            stretching: 'uniform'
        });

        // Show notification
        showNotification(`جاري تحميل ${channel.name}`);

        // Hide loading when player is ready
        playerInstance.on('ready', function() {
            hideLoading();
        });

        // Handle errors
        playerInstance.on('error', function(e) {
            hideLoading();
            console.error('Player error:', e);
            showNotification('حدث خطأ في تحميل القناة. جرب قناة أخرى.', 5000);
        });
    }

    // Add click event to channel cards
    channelCards.forEach(card => {
        card.addEventListener('click', function() {
            const channelId = this.getAttribute('data-channel');
            changeChannel(channelId);
        });
    });

    // Load channel based on URL parameter
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    const channelId = getQueryParam('channel') || '0';
    changeChannel(channelId);
});
