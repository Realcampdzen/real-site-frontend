/**
 * Video Optimizer - Адаптивные видео источники и оптимизация загрузки
 * Оптимизирует загрузку видео для мобильных устройств
 */

class VideoOptimizer {
  constructor() {
    this.isMobile = window.innerWidth <= 768;
    this.init();
  }

  init() {
    // Оптимизация hero видео
    this.optimizeHeroVideo();
    
    // Lazy loading для видео в портфолио
    this.setupLazyLoading();
    
    // Предзагрузка стратегия
    this.setupPreloadStrategy();
    
    // Обработка ошибок загрузки
    this.setupErrorHandling();
  }

  /**
   * Оптимизация hero видео с адаптивными источниками
   */
  optimizeHeroVideo() {
    const heroVideo = document.getElementById('hero-reel-video');
    if (!heroVideo) return;

    // Проверяем, есть ли уже адаптивные источники
    if (heroVideo.querySelector('source[media]')) {
      return; // Уже настроено
    }

    // Получаем текущий источник видео
    const currentSrc = heroVideo.getAttribute('src') || 
                      heroVideo.querySelector('source')?.src || 
                      'public/works/шоурил.mp4';

    // Сначала добавляем desktop источник (fallback)
    const desktopSource = document.createElement('source');
    desktopSource.src = currentSrc;
    desktopSource.type = 'video/mp4';

    // Очищаем старый src и добавляем desktop источник
    heroVideo.removeAttribute('src');
    const existingSources = heroVideo.querySelectorAll('source');
    existingSources.forEach(s => s.remove());
    heroVideo.appendChild(desktopSource);

    // Проверяем существование мобильной версии перед добавлением
    // Если файл не существует, браузер будет использовать desktop версию
    const mobileSource = document.createElement('source');
    mobileSource.src = 'public/works/шоурил-mobile.mp4';
    mobileSource.type = 'video/mp4';
    mobileSource.media = '(max-width: 768px)';
    mobileSource.setAttribute('data-mobile', 'true');
    
    // Проверяем существование файла через fetch HEAD запрос
    fetch(mobileSource.src, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          // Файл существует, добавляем мобильный источник первым
          heroVideo.insertBefore(mobileSource, desktopSource);
          console.log('✅ Мобильная версия видео найдена и добавлена');
        } else {
          console.log('ℹ️ Мобильная версия видео не найдена, используется desktop версия');
        }
      })
      .catch(() => {
        // Ошибка сети или файл не найден - используем только desktop
        console.log('ℹ️ Мобильная версия видео недоступна, используется desktop версия');
      });

    // Добавляем poster изображение если его нет (с проверкой существования)
    if (!heroVideo.hasAttribute('poster')) {
      const posterUrl = 'public/works/шоурил-poster.jpg';
      // Проверяем существование poster через Image
      const posterImg = new Image();
      posterImg.onload = () => {
        heroVideo.setAttribute('poster', posterUrl);
      };
      posterImg.onerror = () => {
        console.log('Poster изображение не найдено, используется первый кадр видео');
        // Не устанавливаем poster, браузер покажет первый кадр
      };
      posterImg.src = posterUrl;
    }

    // Оптимизация preload стратегии
    if (this.isMobile) {
      heroVideo.setAttribute('preload', 'metadata'); // Только метаданные на мобильных
    } else {
      heroVideo.setAttribute('preload', 'auto'); // Полная загрузка на десктопе
    }

    // Перезагружаем видео для применения новых источников
    heroVideo.load();
  }

  /**
   * Lazy loading для видео в портфолио
   */
  setupLazyLoading() {
    const portfolioVideos = document.querySelectorAll('.projects-reel-video');
    
    if ('IntersectionObserver' in window) {
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const video = entry.target;
            this.loadVideo(video);
            videoObserver.unobserve(video);
          }
        });
      }, {
        rootMargin: '50px' // Начинаем загрузку за 50px до появления
      });

      portfolioVideos.forEach(video => {
        // Устанавливаем poster если его нет
        if (!video.hasAttribute('poster') && video.querySelector('source')) {
          const source = video.querySelector('source');
          const videoName = source.src.split('/').pop().replace('.mp4', '');
          video.setAttribute('poster', `public/works/${videoName}-poster.jpg`);
        }
        
        video.setAttribute('preload', 'none'); // Не загружаем до появления
        videoObserver.observe(video);
      });
    } else {
      // Fallback для старых браузеров
      portfolioVideos.forEach(video => {
        this.loadVideo(video);
      });
    }
  }

  /**
   * Загрузка видео
   */
  loadVideo(video) {
    if (video.readyState === 0) {
      video.load();
    }
  }

  /**
   * Стратегия предзагрузки
   */
  setupPreloadStrategy() {
    // Предзагружаем poster изображение для hero видео
    const heroVideo = document.getElementById('hero-reel-video');
    if (heroVideo && heroVideo.hasAttribute('poster')) {
      const posterUrl = heroVideo.getAttribute('poster');
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = posterUrl;
      document.head.appendChild(link);
    }

    // На мобильных предзагружаем только после загрузки страницы
    if (this.isMobile) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const heroVideo = document.getElementById('hero-reel-video');
          if (heroVideo) {
            // Начинаем загрузку видео после загрузки страницы
            heroVideo.setAttribute('preload', 'auto');
            heroVideo.load();
          }
        }, 1000); // Задержка 1 секунда
      });
    }
  }

  /**
   * Обработка ошибок загрузки видео
   */
  setupErrorHandling() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
      video.addEventListener('error', (e) => {
        console.warn('Ошибка загрузки видео:', video.src || video.currentSrc);
        
        // Показываем poster изображение при ошибке
        if (video.hasAttribute('poster')) {
          const poster = video.getAttribute('poster');
          const img = document.createElement('img');
          img.src = poster;
          img.alt = 'Видео недоступно';
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';
          
          video.parentNode.insertBefore(img, video);
          video.style.display = 'none';
        }
      });

      // Показываем индикатор загрузки
      video.addEventListener('loadstart', () => {
        this.showLoadingIndicator(video);
      });

      video.addEventListener('canplay', () => {
        this.hideLoadingIndicator(video);
      });
    });
  }

  /**
   * Показать индикатор загрузки
   */
  showLoadingIndicator(video) {
    if (video.parentNode.querySelector('.video-loading')) return;
    
    const indicator = document.createElement('div');
    indicator.className = 'video-loading';
    indicator.innerHTML = '<div class="video-loading-spinner"></div>';
    video.parentNode.appendChild(indicator);
  }

  /**
   * Скрыть индикатор загрузки
   */
  hideLoadingIndicator(video) {
    const indicator = video.parentNode.querySelector('.video-loading');
    if (indicator) {
      indicator.remove();
    }
  }

  /**
   * Оптимизация для медленных соединений
   */
  optimizeForSlowConnection() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      const effectiveType = connection.effectiveType;
      
      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        // Отключаем автоплей на медленных соединениях
        const videos = document.querySelectorAll('video[autoplay]');
        videos.forEach(video => {
          video.removeAttribute('autoplay');
          video.setAttribute('preload', 'none');
        });
      }
    }
  }
}

// Инициализация при загрузке DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.videoOptimizer = new VideoOptimizer();
  });
} else {
  window.videoOptimizer = new VideoOptimizer();
}

// Экспорт для использования в других модулях
window.VideoOptimizer = VideoOptimizer;

