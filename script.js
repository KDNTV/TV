function getParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function createBackButton() {
  const backButton = document.createElement('button');
  backButton.className = 'back-button';
  backButton.innerHTML = '← رجوع إلى القائمة';
  backButton.onclick = () => {
    window.location.href = window.location.pathname;
  };
  document.body.appendChild(backButton);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const content = document.getElementById('content');
    if (loadingScreen && content) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            content.classList.remove('hidden');
        }, 300); // يتأخر قليلاً للسماح لـ CSS Transition بالعمل
    }
}

const id = getParam("id");
const sourceId = getParam("source");
const content = document.getElementById('content');

const sources = {
  'source1': {
    url: 'https://raw.githubusercontent.com/alysjc7-dot/playlist/refs/heads/main/file/api.json',
    player: 'https://www.m3u8player.online/embed/m3u8?url='
  },
  'source3': {
    url: 'https://raw.githubusercontent.com/alysjc7-dot/playlist/refs/heads/main/file/api2.json',
    player: 'https://anym3u8player.com/tv/p.php?url='
  },
  'source2': {
    url: 'https://raw.githubusercontent.com/abusaeeidx/CricHd-playlists-Auto-Update-permanent/main/api.json',
    player: 'https://anym3u8player.com/tv/video-player.php?url='
  }
};

if (id && sourceId) {
  // إخفاء شاشة التحميل مباشرة إذا كنا في وضع المشغل
  hideLoadingScreen(); 
  
  // عرض المشغل إذا تم اختيار قناة
  const selectedSource = sources[sourceId];
  if (selectedSource) {
    fetch(selectedSource.url)
      .then(res => res.json())
      .then(data => {
        const channel = data.find(item => item.id === id);
        if (channel && channel.link) {
          const encoded = encodeURIComponent(channel.link);
          const playerURL = selectedSource.player + encoded; 
          content.innerHTML = `<iframe src="${playerURL}" allowfullscreen></iframe>`;
          createBackButton();
        } else {
          content.innerHTML = `<div class="error"><h2>القناة غير موجودة</h2></div>`;
        }
      })
      .catch(() => {
        content.innerHTML = `<div class="error"><h2>خطأ في تحميل البث</h2></div>`;
      });
  } else {
    content.innerHTML = `<div class="error"><h2>مصدر غير صالح</h2></div>`;
  }
} else {
  // عرض جميع القنوات مع الشعار (واجهة القائمة)
  const headerLogo = document.createElement('div');
  headerLogo.className = 'header-logo';
  headerLogo.innerHTML = `
    <div class="logo-text">كايدن TV</div>
    <a href="https://t.me/KIDNTV" target="_blank" class="telegram-btn">
      انضم إلى قناتنا على تليجرام <i class="fab fa-telegram-plane"></i>
    </a>
  `;
  content.appendChild(headerLogo);
  
  const grid = document.createElement('div');
  grid.className = 'grid';
  content.appendChild(grid);
  
  let pendingFetches = 3; // عدد المصادر التي يجب جلبها
  let channelsLoaded = 0; // عدد المصادر التي تم تحميلها بنجاح

  const checkCompletion = () => {
      pendingFetches--;
      if (pendingFetches === 0) {
          hideLoadingScreen();
          // في حالة فشل تحميل جميع القنوات
          if (channelsLoaded === 0) {
              content.innerHTML += `<div class="error"><h2>فشل تحميل القنوات</h2></div>`;
          }
      }
  };

  const fetchChannels = (sourceKey) => {
    const source = sources[sourceKey];
    fetch(source.url)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        if (data.length) {
          channelsLoaded++;
          data.forEach(channel => {
            const a = document.createElement('a');
            a.className = 'channel';
            a.href = `?id=${encodeURIComponent(channel.id)}&source=${sourceKey}`;
            a.innerHTML = `
              <img src="${channel.logo}" alt="${channel.name}" />
              <div>${channel.name}</div>
            `;
            grid.appendChild(a);
          });
        }
        checkCompletion();
      })
      .catch((error) => {
        console.error(`Failed to load channels from ${source.url}:`, error);
        checkCompletion();
      });
  };
  
  // التغيير هنا: ترتيب جلب القنوات
  // الترتيب الجديد: Source 1, Source 2, Source 3 (في الأخير)
  fetchChannels('source1');
  fetchChannels('source2'); 
  fetchChannels('source3'); // المصدر الثالث الآن في الأخير
}
