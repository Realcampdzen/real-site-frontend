// AI Studio - Enhanced Interactive Features

const CONTACTS = {
    phone: { href: 'tel:+79650255750', display: '+7 965 025 57 50' },
    email: { href: 'mailto:hello@stepan-ai.studio', display: 'hello@stepan-ai.studio' },
    telegram: { href: 'https://t.me/Stivanovv', handle: '@Stivanovv' },
    whatsapp: { href: 'https://wa.me/79650255750' },
    vk: { href: 'https://vk.com' },
    youtube: { href: 'https://youtube.com' },
    tiktok: { href: 'https://www.tiktok.com' },
    primary: { href: 'https://t.me/Stivanovv' }
};

function applyContactConfig() {
    const linkMap = {
        primary: CONTACTS.primary,
        telegram: CONTACTS.telegram,
        whatsapp: CONTACTS.whatsapp,
        phone: CONTACTS.phone,
        email: CONTACTS.email,
        vk: CONTACTS.vk,
        youtube: CONTACTS.youtube,
        tiktok: CONTACTS.tiktok
    };

    document.querySelectorAll('[data-contact-link]').forEach((element) => {
        const key = element.getAttribute('data-contact-link');
        const config = linkMap[key];
        if (!config || !config.href) return;

        const tag = element.tagName.toLowerCase();
        if (tag === 'a') {
            element.setAttribute('href', config.href);
        } else {
            element.addEventListener('click', () => {
                window.location.href = config.href;
            });
            element.setAttribute('data-contact-href', config.href);
        }
    });

    const textMap = {
        phone: CONTACTS.phone.display,
        email: CONTACTS.email.display,
        telegram: CONTACTS.telegram.handle || CONTACTS.telegram.display,
        telegramHandle: CONTACTS.telegram.handle || CONTACTS.telegram.display
    };

    document.querySelectorAll('[data-contact-text]').forEach((element) => {
        const key = element.getAttribute('data-contact-text');
        const textValue = textMap[key];
        if (textValue) {
            element.textContent = textValue;
        }
    });
}

function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const storageKey = 'rv-cookie-consent';
    if (!banner || !acceptBtn) return;

    const hideBanner = () => {
        banner.classList.remove('visible');
        banner.setAttribute('aria-hidden', 'true');
    };

    const showBanner = () => {
        banner.classList.add('visible');
        banner.setAttribute('aria-hidden', 'false');
    };

    const persistConsent = () => {
        try {
            localStorage.setItem(storageKey, 'true');
        } catch (error) {
            console.warn('Не удалось сохранить согласие с cookie:', error);
        }
    };

    const shouldShow = () => {
        try {
            return localStorage.getItem(storageKey) !== 'true';
        } catch (error) {
            console.warn('Не удалось прочитать флаг cookie согласия:', error);
            return true;
        }
    };

    banner.setAttribute('aria-hidden', 'true');

    if (shouldShow()) {
        showBanner();
    }

    acceptBtn.addEventListener('click', () => {
        persistConsent();
        hideBanner();
    });
}

// Modern website functionality
function toggleSection(id) {
    const content = document.getElementById(id + '-content');
    const arrow = document.getElementById(id + '-arrow');
    const show = !content.classList.contains('show');
  
    ['content', 'tech', 'process', 'benefits'].forEach(key => {
      if (key !== id) {
        const otherContent = document.getElementById(key + '-content');
        const otherArrow = document.getElementById(key + '-arrow');
        if (otherContent && otherArrow) {
          otherContent.classList.remove('show');
          otherArrow.className = 'fas fa-chevron-down arrow';
        }
      }
    });
  
    content.classList.toggle('show');
    arrow.className = show ? 'fas fa-chevron-up arrow' : 'fas fa-chevron-down arrow';
  }
  
// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Animated Counter
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 16);
}

// Testimonials Slider
function initTestimonialsSlider() {
  const cards = document.querySelectorAll('.testimonial-card');
  const buttons = document.querySelectorAll('.testimonial-btn');
  let currentSlide = 0;
  
  function showSlide(index) {
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
    });
    
    buttons.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % cards.length;
    showSlide(currentSlide);
  }
  
  // Button click handlers
  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      currentSlide = index;
      showSlide(currentSlide);
    });
  });
  
  // Auto-rotate testimonials
  setInterval(nextSlide, 5000);
}

// Mobile Menu Toggle
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  
  if (!mobileMenuBtn || !mobileNav) return;
  
  const openMenu = () => {
    mobileMenuBtn.classList.add('active');
    mobileNav.classList.add('active');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  };

  const closeMenu = () => {
    mobileMenuBtn.classList.remove('active');
    mobileNav.classList.remove('active');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  };

  mobileMenuBtn.addEventListener('click', () => {
    if (mobileNav.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  
  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMenu);
  }

  // Close mobile menu when clicking on links
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileNav.classList.contains('active')) {
      closeMenu();
    }
  });
}

// Scroll Progress Bar
function updateScrollProgress() {
  const scrollProgress = document.getElementById('scroll-progress');
  if (!scrollProgress) return;
  
  const scrollTop = window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  
  scrollProgress.style.width = scrollPercent + '%';
}

// Back to Top Button
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Tilt Effect for Cards
function initTiltEffect() {
  const tiltElements = document.querySelectorAll('[data-tilt]');
  
  tiltElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      element.style.transition = 'transform 0.1s ease';
    });
    
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transition = 'transform 0.3s ease';
      element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// Preloader с реальным отслеживанием загрузки
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const progressBar = document.querySelector('.loading-progress');
  
  if (!preloader) {
    return;
  }
  
  let isComplete = false;
  let currentProgress = 0;
  const startTime = Date.now();
  const minDisplayTime = 800; // Минимум 0.8 секунды
  
  // Функция обновления прогресс-бара (только увеличивает, не уменьшает)
  function updateProgress(progress) {
    if (progressBar) {
      // Прогресс только увеличивается, не уменьшается
      currentProgress = Math.max(currentProgress, Math.min(progress, 100));
      progressBar.style.width = currentProgress + '%';
    }
  }
  
  // Функция скрытия прелоадера
  function hidePreloaderNow() {
    if (isComplete || !preloader) return;
    isComplete = true;
    
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minDisplayTime - elapsed);
    
    updateProgress(100);
    
    setTimeout(() => {
      if (preloader) {
        preloader.classList.add('hidden');
        setTimeout(() => {
          if (preloader && preloader.parentNode) {
            preloader.remove();
          }
        }, 500);
      }
    }, remaining);
  }
  
  // Принудительный таймаут - максимум 3 секунды
  const forceHideTimeout = setTimeout(() => {
    hidePreloaderNow();
  }, 3000);
  
  // Начальный прогресс
  updateProgress(10);
  
  // Отслеживание загрузки изображений (исключаем видео)
  try {
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    let totalImages = 0;
    
    // Подсчитываем только изображения, которые не внутри video
    images.forEach(img => {
      if (!img.closest('video')) {
        totalImages++;
      }
    });
    
    if (totalImages > 0) {
      images.forEach(img => {
        // Пропускаем изображения внутри video
        if (img.closest('video')) {
          return;
        }
        
        if (img.complete && img.naturalHeight !== 0) {
          loadedImages++;
        } else {
          const onLoad = () => {
            loadedImages++;
            // Прогресс от 10% до 60% за изображения
            const imageProgress = 10 + (loadedImages / totalImages) * 50;
            updateProgress(imageProgress);
          };
          img.addEventListener('load', onLoad, { once: true });
          img.addEventListener('error', onLoad, { once: true });
        }
      });
      
      // Устанавливаем начальный прогресс для уже загруженных изображений
      if (loadedImages > 0) {
        const imageProgress = 10 + (loadedImages / totalImages) * 50;
        updateProgress(imageProgress);
      }
    } else {
      // Если нет изображений, сразу переходим к следующему этапу
      updateProgress(30);
    }
  } catch (e) {
    // Игнорируем ошибки, но устанавливаем минимальный прогресс
    updateProgress(30);
  }
  
  // Отслеживание загрузки шрифтов (после изображений, 60-75%)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      updateProgress(75);
    }).catch(() => {
      updateProgress(75);
    });
  } else {
    // Если шрифты не поддерживаются, устанавливаем прогресс с небольшой задержкой
    setTimeout(() => {
      if (!isComplete) {
        updateProgress(75);
      }
    }, 200);
  }
  
  // Проверка готовности страницы
  function checkComplete() {
    clearTimeout(forceHideTimeout);
    updateProgress(90);
    hidePreloaderNow();
  }
  
  // Множественные проверки для надежности
  if (document.readyState === 'complete') {
    // Если страница уже загружена, даем время показать прогресс
    updateProgress(85);
    setTimeout(() => {
      checkComplete();
    }, 100);
  } else {
    // Слушаем событие load
    const onLoad = () => {
      updateProgress(85);
      checkComplete();
    };
    window.addEventListener('load', onLoad, { once: true });
    
    // Также слушаем DOMContentLoaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        updateProgress(65);
      }, { once: true });
    }
  }
  
  // Дополнительная проверка через 1.5 секунды
  setTimeout(() => {
    if (!isComplete) {
      updateProgress(90);
      checkComplete();
    }
  }, 1500);
}

// Старая функция для обратной совместимости
function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }, 2000);
  }
}

// Main DOMContentLoaded Event
document.addEventListener('DOMContentLoaded', () => {
  // Проверяем, что мы на главной странице, а не на новогодней
  const isNewYearPage = document.body && document.body.classList.contains('new-year-page');
  
  if (!isNewYearPage) {
    // Убеждаемся, что кнопка новогодних предложений всегда видна и правильно стилизована
    const newYearWrapper = document.querySelector('.new-year-banner-wrapper');
    if (newYearWrapper) {
      newYearWrapper.style.display = 'flex';
      newYearWrapper.style.visibility = 'visible';
      newYearWrapper.style.opacity = '1';
    }
    
    // Восстанавливаем правильные размеры кнопки новогодних предложений
    const newYearButton = document.querySelector('.hero-actions .new-year-button, .hero .new-year-button');
    if (newYearButton) {
      newYearButton.style.width = '478px';
      newYearButton.style.height = '96px';
      newYearButton.style.maxWidth = '478px';
      newYearButton.style.maxHeight = '96px';
      newYearButton.style.flexShrink = '0';
      // Убеждаемся, что анимация не перезаписана
      newYearButton.style.animation = 'newYearPulse 3s ease-in-out infinite';
    }
    
    // Восстанавливаем правильные размеры видео и принудительно загружаем
    const newYearVideo = document.querySelector('.hero-actions .new-year-video, .hero .new-year-video');
    if (newYearVideo) {
      newYearVideo.style.width = '100%';
      newYearVideo.style.height = '100%';
      newYearVideo.style.maxWidth = '478px';
      newYearVideo.style.maxHeight = '96px';
      newYearVideo.style.objectFit = 'cover';
      
      // Принудительная загрузка и воспроизведение видео
      newYearVideo.load();
      
      // Обработка ошибок загрузки
      newYearVideo.addEventListener('error', (e) => {
        console.error('Ошибка загрузки видео:', e);
        // Пробуем альтернативный путь с URL-кодированием
        const videoSource = newYearVideo.querySelector('source');
        if (videoSource) {
          const originalSrc = videoSource.getAttribute('src');
          const encodedSrc = encodeURI(originalSrc);
          videoSource.setAttribute('src', encodedSrc);
          newYearVideo.load();
        }
      });
      
      // Принудительное воспроизведение после загрузки
      newYearVideo.addEventListener('loadeddata', () => {
        newYearVideo.play().catch(err => {
          console.warn('Автозапуск видео заблокирован браузером:', err);
        });
      });
    }
    
    // Дополнительная защита: удаляем любые стили, которые могли быть применены с новогодней страницы
    if (newYearButton) {
      // Удаляем классы, которые могут быть с новогодней страницы
      newYearButton.classList.remove('new-year-hero-image');
      newYearButton.style.removeProperty('min-width');
      newYearButton.style.removeProperty('min-height');
    }
    
    // Удаляем старые стили с видео, если они есть
    if (newYearVideo) {
      newYearVideo.classList.remove('new-year-hero-image');
      newYearVideo.style.removeProperty('min-width');
      newYearVideo.style.removeProperty('min-height');
    }
  }
  
  // Инициализировать прелоадер с реальным отслеживанием загрузки
  initPreloader();

  applyContactConfig();
  
  // Initialize mobile menu
  initMobileMenu();
  
  // Initialize testimonials slider
  initTestimonialsSlider();
  
  // Initialize back to top button
  initBackToTop();
  
  // Initialize tilt effect
  initTiltEffect();
  
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', () => {
    updateScrollProgress();
    
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-solid');
    } else {
      navbar.classList.remove('navbar-solid');
    }
  });

  // Navigation links smooth scrolling
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      scrollToSection(targetId);
    });
  });

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        
        // Animate counters when they come into view
        const counters = entry.target.querySelectorAll('[data-target]');
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'));
          animateCounter(counter, target);
        });
      }
    });
  }, observerOptions);

  // Observe animated elements
  const animatedElements = document.querySelectorAll(
    '.service-card, .process-step, .stat-card, .contact-card, .stats-grid, ' +
    '.highlight-service-card, .benefit-card, .projects-banner-inner, .projects-reel-card, ' +
    '.portfolio-card, .assistant-card, .testimonial-card'
  );
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Add stagger effect to service cards
  document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
  });

  // Add stagger effect to process steps
  document.querySelectorAll('.process-step').forEach((step, index) => {
    step.style.transitionDelay = `${index * 0.1}s`;
  });
  
  // Add stagger effect to stat cards
  document.querySelectorAll('.stat-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
  });

  // Add hover effects to buttons
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-2px) scale(1.02)';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Add ripple effect to buttons
  document.querySelectorAll('button, .btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Add CSS for ripple effect
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    button, .btn-primary, .btn-secondary {
      position: relative;
      overflow: hidden;
    }
    
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
      pointer-events: none;
    }
    
    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(rippleStyle);

  // Page loading animation
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 100);
  });

  // Projects reel video play on click
  document.querySelectorAll('.projects-reel-card').forEach(card => {
    const video = card.querySelector('.projects-reel-video');
    const playBtn = card.querySelector('.projects-reel-play');

    if (!video || !playBtn) return;

    function togglePlay() {
      if (video.paused) {
        video.muted = false;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }

    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });

    card.addEventListener('click', togglePlay);
  });

  // Add smooth reveal animation for sections
  const sections = document.querySelectorAll('section');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
      }
    });
  }, {
    threshold: 0.1
  });

  sections.forEach(section => {
    section.classList.add('section-hidden');
    sectionObserver.observe(section);
  });

  // Add section animation styles
  const sectionStyle = document.createElement('style');
  sectionStyle.textContent = `
    .section-hidden {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .section-visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(sectionStyle);

  initCookieBanner();
  
  // Hero video sound toggle
  initHeroSoundToggle();
});

// Hero video sound toggle functionality
function initHeroSoundToggle() {
  const heroReel = document.getElementById('hero-reel-container');
  const heroVideo = document.getElementById('hero-reel-video');
  const heroContent = heroReel ? heroReel.querySelector('.hero-reel-content') : null;
  const heroOverlay = heroReel ? heroReel.querySelector('.hero-reel-overlay') : null;
  
  if (!heroReel || !heroVideo) {
    console.warn('Hero reel elements not found');
    return;
  }
  
  console.log('Initializing hero sound toggle...', {
    heroReel: !!heroReel,
    heroVideo: !!heroVideo,
    videoMuted: heroVideo.muted,
    videoReadyState: heroVideo.readyState
  });
  
  function toggleSound(e) {
    // Игнорируем клики по кнопкам - они должны работать как обычно
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    // Переключаем звук
    const wasMuted = heroVideo.muted;
    heroVideo.muted = !wasMuted;
    
    // Устанавливаем громкость и пытаемся воспроизвести при включении звука
    if (!heroVideo.muted) {
      heroVideo.volume = 1.0;
      // Вызываем play() чтобы обойти политики автоплея браузера
      const playPromise = heroVideo.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('🔊 Звук включен');
        }).catch(err => {
          console.error('❌ Не удалось воспроизвести видео со звуком:', err);
          // Если не получилось, возвращаем muted
          heroVideo.muted = true;
        });
      }
    } else {
      console.log('🔇 Звук выключен');
    }
  }
  
  // Обработчик клика на контейнер
  heroReel.addEventListener('click', toggleSound);
  console.log('Added click handler to heroReel');
  
  // Обработчик на само видео
  heroVideo.addEventListener('click', toggleSound);
  console.log('Added click handler to heroVideo');
  
  // Обработчик на overlay
  if (heroOverlay) {
    heroOverlay.style.pointerEvents = 'auto';
    heroOverlay.style.cursor = 'pointer';
    heroOverlay.addEventListener('click', toggleSound);
    console.log('Added click handler to heroOverlay');
  }
  
  // Курсор-указатель на контейнере
  heroReel.style.cursor = 'pointer';
  
  console.log('✅ Hero sound toggle initialized');
}
  
