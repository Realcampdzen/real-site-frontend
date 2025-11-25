/**
 * Video Optimizer - Адаптивные видео источники и оптимизация загрузки
 * Оптимизирует загрузку видео для мобильных устройств
 */

class VideoOptimizer {
  constructor() {
    this.isMobile = window.matchMedia
      ? window.matchMedia('(max-width: 900px)').matches
      : window.innerWidth <= 768;
    this.connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    this.saveData = !!(this.connection && this.connection.saveData);
    this.slowNetwork =
    this.connection &&
    ['slow-2g', '2g', '3g'].includes(this.connection.effectiveType);
  this.prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  this.heroVideo = document.getElementById('hero-reel-video');
    this.autoPlayDesktop = this.heroVideo
      ? this.heroVideo.dataset.autoplayDesktop !== 'false'
      : true;
    this.init();
  }

  init() {
    // Оптимизация hero видео
    this.optimizeHeroVideo();
    this.initHeroControls();
    
    // Lazy loading для видео в портфолио
    this.setupLazyLoading();
    
    // Предзагрузка стратегия
    this.setupPreloadStrategy();
    
    // Обработка ошибок загрузки
    this.setupErrorHandling();

    // Сетевые ограничения
    this.optimizeForSlowConnection();
  }

  /**
   * Оптимизация hero видео с адаптивными источниками
   */
  optimizeHeroVideo() {
    const heroVideo =
      this.heroVideo || document.getElementById('hero-reel-video');
    if (!heroVideo) return;
    this.heroVideo = heroVideo;

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

    // Не переопределяем preload, если он задан вручную в разметке
    if (!heroVideo.hasAttribute('preload')) {
      heroVideo.setAttribute('preload', this.isMobile ? 'metadata' : 'auto');
    }

    // Гарантируем автозапуск
    heroVideo.autoplay = true;
    heroVideo.muted = true;
    heroVideo.load();
    const playPromise = heroVideo.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(() =>
        console.warn('Автовоспроизведение ограничено браузером')
      );
    }
  }

  initHeroControls() {
    const video = this.heroVideo || document.getElementById('hero-reel-video');
    const controls = document.getElementById('hero-controls');
    if (!video || !controls) return;

    this.heroVideo = video;

    const playBtn = document.getElementById('hero-control-play');
    const restartBtn = document.getElementById('hero-control-restart');
    const volumeBtn = document.getElementById('hero-control-volume');
    const qualityBtn = document.getElementById('hero-control-quality');
    const speedBtn = document.getElementById('hero-control-speed');
    const speedLabel = document.getElementById('hero-speed-label');
    const fullscreenBtn = document.getElementById('hero-control-fullscreen');
    const progressTrack = document.getElementById('hero-progress-track');
    const progressFill = document.getElementById('hero-progress-fill');
    const progressTime = document.getElementById('hero-progress-time');
    const heroContainer = document.getElementById('hero-reel-container');
    const isTouch =
      'ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0;
    let hideControlsTimeout = null;
    const speedMenu = document.getElementById('hero-speed-menu');
    const qualityMenu = document.getElementById('hero-quality-menu');

    const speedSteps = [1, 1.25, 1.5, 0.75];
    let speedIndex = 0;
    let qualityIndex = 0;
    const qualityStates = ['AUTO', 'HD', 'SD'];

    const formatTime = (time) => {
      if (!isFinite(time)) return '00:00';
      const m = Math.floor(time / 60)
        .toString()
        .padStart(2, '0');
      const s = Math.floor(time % 60)
        .toString()
        .padStart(2, '0');
      return `${m}:${s}`;
    };

    const syncPlayState = () => {
      if (!playBtn) return;
      const icon = playBtn.querySelector('i');
      if (video.paused) {
        icon.className = 'fas fa-play';
        playBtn.setAttribute('aria-label', 'Воспроизвести');
      } else {
        icon.className = 'fas fa-pause';
        playBtn.setAttribute('aria-label', 'Пауза');
      }
    };

    const updateProgress = () => {
      if (!progressFill || !progressTrack || !progressTime) return;
      const duration = video.duration || 0;
      const current = video.currentTime || 0;
      const percent = duration ? Math.min(100, (current / duration) * 100) : 0;
      progressFill.style.width = `${percent}%`;
      progressTrack.setAttribute('aria-valuenow', percent.toFixed(1));
      progressTime.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
    };

    const updateVolumeIcon = () => {
      if (!volumeBtn) return;
      const icon = volumeBtn.querySelector('i');
      if (!icon) return;
      icon.className = video.muted || video.volume === 0 ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    };

    const updateSpeedLabel = () => {
      if (speedLabel) speedLabel.textContent = `${video.playbackRate.toFixed(2).replace(/\.00$/, '')}x`.replace('.50', '.5');
    };

    const updateFullscreenIcon = () => {
      if (!fullscreenBtn) return;
      const icon = fullscreenBtn.querySelector('i');
      if (!icon) return;
      const inFs = !!document.fullscreenElement;
      icon.className = inFs ? 'fas fa-compress' : 'fas fa-expand';
    };

    const updateQualityLabel = () => {
      if (!qualityBtn) return;
      const icon = qualityBtn.querySelector('i');
      if (!icon) return;
      icon.className = 'fas fa-cog';
      qualityBtn.title = `Качество: ${qualityStates[qualityIndex]}`;
    };

    const scheduleHideControls = () => {
      if (isTouch || !controls) return;
      clearTimeout(hideControlsTimeout);
      hideControlsTimeout = setTimeout(() => {
        const hovering =
          controls.matches(':hover') || heroContainer?.matches(':hover');
        if (hovering) {
          scheduleHideControls();
          return;
        }
        controls.classList.remove('is-active');
      }, 2400);
    };

    const bumpControls = () => {
      if (!controls) return;
      controls.classList.add('is-active');
      scheduleHideControls();
    };

    const hideMenus = () => {
      speedMenu?.classList.remove('visible');
      qualityMenu?.classList.remove('visible');
    };

    const toggleMenu = (menuEl) => {
      if (!menuEl) return;
      const willShow = !menuEl.classList.contains('visible');
      hideMenus();
      if (willShow) {
        menuEl.classList.add('visible');
      }
    };

    const seekTo = (clientX) => {
      const rect = progressTrack.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const duration = video.duration || 0;
      video.currentTime = ratio * duration;
    };

    playBtn?.addEventListener('click', () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
      bumpControls();
    });

    restartBtn?.addEventListener('click', () => {
      video.currentTime = 0;
      video.play();
      bumpControls();
    });

    volumeBtn?.addEventListener('click', () => {
      video.muted = !video.muted;
      updateVolumeIcon();
      bumpControls();
    });

    speedBtn?.addEventListener('click', () => {
      toggleMenu(speedMenu);
      bumpControls();
    });

    qualityBtn?.addEventListener('click', () => {
      toggleMenu(qualityMenu);
      bumpControls();
    });

    speedMenu?.addEventListener('click', (e) => {
      const target = e.target.closest('[data-speed]');
      if (!target) return;
      const value = parseFloat(target.dataset.speed || '1');
      video.playbackRate = value;
      speedIndex = Math.max(0, speedSteps.indexOf(value));
      updateSpeedLabel();
      hideMenus();
      bumpControls();
    });

    qualityMenu?.addEventListener('click', (e) => {
      const target = e.target.closest('[data-quality]');
      if (!target) return;
      const quality = target.dataset.quality || 'auto';
      qualityIndex = Math.max(0, qualityStates.indexOf(quality.toUpperCase()));
      updateQualityLabel();
      hideMenus();
      bumpControls();
    });

    fullscreenBtn?.addEventListener('click', () => {
      const target = heroContainer || video;
      const inFs = !!document.fullscreenElement;
      if (!inFs && target?.requestFullscreen) {
        target.requestFullscreen();
      } else if (inFs && document.exitFullscreen) {
        document.exitFullscreen();
      }
      bumpControls();
    });

    document.addEventListener('fullscreenchange', updateFullscreenIcon);

    progressTrack?.addEventListener('click', (e) => {
      seekTo(e.clientX);
      bumpControls();
    });

    progressTrack?.addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      const step = video.duration ? video.duration * 0.02 : 1;
      if (e.key === 'ArrowLeft') video.currentTime = Math.max(0, video.currentTime - step);
      if (e.key === 'ArrowRight') video.currentTime = Math.min(video.duration, video.currentTime + step);
      if (e.key === 'Home') video.currentTime = 0;
      if (e.key === 'End') video.currentTime = video.duration || video.currentTime;
      bumpControls();
    });

    video.addEventListener('loadedmetadata', updateProgress);
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('play', syncPlayState);
    video.addEventListener('pause', syncPlayState);
    video.addEventListener('ended', syncPlayState);
    video.addEventListener('volumechange', updateVolumeIcon);

    // Начальная синхронизация
    syncPlayState();
    updateProgress();
    updateVolumeIcon();
    updateSpeedLabel();
    updateFullscreenIcon();
    updateQualityLabel();

    if (!isTouch) {
      const moveHandler = () => bumpControls();
      heroContainer?.addEventListener('mousemove', moveHandler);
      controls?.addEventListener('mousemove', moveHandler);
      controls?.addEventListener('focusin', bumpControls);
      controls?.addEventListener('mouseleave', scheduleHideControls);
      heroContainer?.addEventListener('mouseleave', scheduleHideControls);
      bumpControls();
    } else if (controls) {
      controls.classList.add('is-active');
    }

    document.addEventListener('click', (e) => {
      if (
        e.target.closest('#hero-control-speed') ||
        e.target.closest('#hero-control-quality') ||
        e.target.closest('#hero-speed-menu') ||
        e.target.closest('#hero-quality-menu')
      ) {
        return;
      }
      hideMenus();
    });
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
    const heroVideo =
      this.heroVideo || document.getElementById('hero-reel-video');
    if (heroVideo) this.heroVideo = heroVideo;
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
          const heroVideo =
            this.heroVideo || document.getElementById('hero-reel-video');
          if (!heroVideo) return;
          heroVideo.setAttribute('preload', 'auto');
          heroVideo.load();
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
    // Сохраняем автозапуск даже на медленных сетях по требованию заказчика.
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

