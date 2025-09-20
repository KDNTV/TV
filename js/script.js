document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const loadingOverlay = document.getElementById('loadingOverlay');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    const programTitle = document.getElementById('programTitle');
    const channelCards = document.querySelectorAll('.channel-card');

    // Channel data
    const channels = {
        '0': {
            name: 'BEIN NEWS',
            source: 'https://raw.githubusercontent.com/kidntv/KID/refs/heads/main/pos1.m3u8',
            description: 'شاشة البث الرئيسية'
        },
        '1': {
            name: 'BEIN GLOBAL',
            source: 'http://ibo.lynxiptv.com/live/said2024/123456789/222598.m3u8',
            description: 'قناة رياضية متخصصة'
        },
        '2': {
            name: 'BEIN 1',
            source: 'http://135.125.109.73:9000/beinsport1_.m3u8',
            description: 'القناة الأولى'
        },
        '3': {
            name: 'BEIN 2',
            source: 'https://example.com/channel3.m3u8',
            description: 'القناة الثانية'
        },
        '4': {
            name: 'BEIN 3',
            source: 'https://example.com/channel4.m3u8',
            description: 'القناة الثالثة'
        },
        '5': {
            name: 'BEIN 4',
            source: 'https://example.com/channel5.m3u8',
            description: 'القناة الرابعة'
        },
        '6': {
            name: 'BEIN 5',
            source: 'https://example.com/channel5.m3u8',
            description: 'القناة الخامسة'
        },
        '7': {
            name: 'BEIN 6',
            source: 'https://example.com/channel5.m3u8',
            description: 'القناة السادسة'
        },
        '8': {
            name: 'BEIN 7',
            source: 'https://example.com/channel5.m3u8',
            description: 'القناة السابعة'
        },
        '9': {
            name: 'BEIN 8',
            source: 'https://example.com/channel5.m3u8',
            description: 'القناة الثامنة'
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
        autostart: true,
        cast: {},
        logo: {
            file: "https://up6.cc/2025/08/175836245010381.jpg",
            position: 'bottom-right'
        },
        stretching: 'fill'
    });

    // Show notification function
    function showNotification(message, duration = 3000) {
        notificationText.textContent = message;
        notification.classList.add('visible');

        setTimeout(() => {
            notification.classList.remove('visible');
        }, duration);
    }

    // Show loading
    function showLoading() {
        loadingOverlay.classList.add('visible');
    }

    // Hide loading
    function hideLoading() {
        loadingOverlay.classList.remove('visible');
    }

    // Change channel function
    function changeChannel(channelId) {
        const channel = channels[channelId];
        if (!channel) return;

        showLoading();

        // Update active channel
        channelCards.forEach(card => card.classList.remove('active'));

        document.querySelector(`.channel-card[data-channel="${channelId}"]`).classList.add('active');

        // Update program info
        programTitle.textContent = channel.description;

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
            stretching: 'fill'
        });

        // Show notification
        showNotification(`جاري تحميل ${channel.name}`);

        // Hide loading when player is ready
        playerInstance.on('ready', function() {
            hideLoading();
        });

        // Handle errors
        playerInstance.on('error', function() {
            hideLoading();
            showNotification('حدث خطأ في تحميل القناة', 5000);
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
