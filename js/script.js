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
        // قنوات BEIN
        '0': { name: 'BEIN 1', source: 'https://raw.githubusercontent.com/alysjc7-dot/VBB/refs/heads/main/1.m3u8', description: 'قناة بي إن الرياضية 1' },
        '1': { name: 'BEIN 2', source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', description: 'قناة بي إن الرياضية 2' },
        '2': { name: 'BEIN 3', source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', description: 'قناة بي إن الرياضية 3' },
        '3': { name: 'BEIN 4', source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', description: 'قناة بي إن الرياضية 4' },
        '4': { name: 'BEIN 5', source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', description: 'قناة بي إن الرياضية 5' },
        '5': { name: 'BEIN 6', source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', description: 'قناة بي إن الرياضية 6' },
        '6': { name: 'BEIN 7', source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', description: 'قناة بي إن الرياضية 7' },
        '7': { name: 'BEIN 8', source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', description: 'قناة بي إن الرياضية 8' },
        '8': { name: 'BEIN 9', source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', description: 'قناة بي إن الرياضية 9' },
        
        // قنوات الثمانية
        '9': { name: 'الثمانية 1', source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', description: 'قناة الثمانية 1' },
        '10': { name: 'الثمانية 2', source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', description: 'قناة الثمانية 2' },
        
        // قنوات POST SPORT
        '11': { name: 'POST SPORT 1', source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', description: 'قناة بوست سبورت 1' },
        '12': { name: 'POST SPORT 2', source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', description: 'قناة بوست سبورت 2' },
        '13': { name: 'POST SPORT 3', source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', description: 'قناة بوست سبورت 3' },
        '14': { name: 'POST SPORT 4', source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', description: 'قناة بوست سبورت 4' },
        '15': { name: 'POST SPORT 5', source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', description: 'قناة بوست سبورت 5' },
        '16': { name: 'POST SPORT 6', source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', description: 'قناة بوست سبورت 6' }
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
        autostart: false,
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
