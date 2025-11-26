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
  const progressContainer = document.querySelector('.loading-bar');
  const statusText = document.querySelector('.preloader-hint');
  const criticalLogos = document.querySelectorAll('.nav-logo .logo-image');
  
  if (!preloader) {
    return;
  }

  criticalLogos.forEach((logo) => {
    logo.setAttribute('loading', 'eager');
    logo.setAttribute('decoding', 'async');
    logo.setAttribute('fetchpriority', 'high');
  });

  if (progressContainer) {
    progressContainer.setAttribute('role', 'progressbar');
    progressContainer.setAttribute('aria-valuemin', '0');
    progressContainer.setAttribute('aria-valuemax', '100');
    progressContainer.setAttribute('aria-valuenow', '0');
    progressContainer.setAttribute('aria-label', 'Загрузка страницы');
  }
  if (statusText && !statusText.textContent.trim()) {
    statusText.textContent = 'Подгружаем медиа...';
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
    if (progressContainer) {
      progressContainer.setAttribute('aria-valuenow', String(Math.round(currentProgress)));
    }
    if (statusText) {
      if (currentProgress < 30) {
        statusText.textContent = 'Подгружаем медиа...';
      } else if (currentProgress < 60) {
        statusText.textContent = 'Настраиваем интерфейс...';
      } else if (currentProgress < 90) {
        statusText.textContent = 'Оптимизируем анимации...';
      } else {
        statusText.textContent = 'Почти готово!';
      }
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
    threshold: 0.01,
    rootMargin: '15% 0px -6% 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-show');

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
    '.service-card, .service-simple-card, .process-step, .stat-card, .contact-card, .stats-grid, ' +
    '.highlight-service-card, .benefit-card, .projects-banner-inner, .projects-reel-card, ' +
    '.portfolio-card, .assistant-card, .testimonial-card, .value-card'
  );
  animatedElements.forEach((el, index) => {
    el.classList.add('reveal-base');
    // Легкая задержка, чтобы элементы появлялись каскадом
    el.style.setProperty('--reveal-delay', `${(index % 8) * 80}ms`);
    observer.observe(el);
  });

  // Add stagger effect to service cards
  document.querySelectorAll('.service-card, .service-simple-card').forEach((card, index) => {
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
        sectionObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '12% 0px -6% 0px'
  });

  sections.forEach(section => {
    section.classList.add('section-hidden');
    sectionObserver.observe(section);
  });

  // Подстраховка: сразу показываем блоки, уже попавшие в вьюпорт (важно для мобильных под героем)
  const isElementMostlyVisible = (el, visiblePart = 0.1) => {
    const rect = el.getBoundingClientRect();
    const viewHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewWidth = window.innerWidth || document.documentElement.clientWidth;
    const visibleWidth = Math.min(rect.right, viewWidth) - Math.max(rect.left, 0);
    const visibleHeight = Math.min(rect.bottom, viewHeight) - Math.max(rect.top, 0);
    if (visibleWidth <= 0 || visibleHeight <= 0) return false;

    const visibleArea = visibleWidth * visibleHeight;
    const totalArea = (rect.width || 1) * (rect.height || 1);
    return visibleArea / totalArea >= visiblePart;
  };

  const revealInViewport = () => {
    animatedElements.forEach(el => {
      if (!el.classList.contains('reveal-show') && isElementMostlyVisible(el, 0.08)) {
        el.classList.add('reveal-show');
        el.style.transitionDelay = '0s';
        el.style.setProperty('--reveal-delay', '0ms');
        try {
          observer.unobserve(el);
        } catch (e) {
          // element might not have been observed yet
        }
      }
    });

    sections.forEach(section => {
      if (!section.classList.contains('section-visible') && isElementMostlyVisible(section, 0.1)) {
        section.classList.add('section-visible');
        section.classList.remove('section-hidden');
        try {
          sectionObserver.unobserve(section);
        } catch (e) {
          // safe fallback
        }
      }
    });
  };

  revealInViewport();
  window.addEventListener('load', () => {
    revealInViewport();
    setTimeout(revealInViewport, 180);
  });
  window.addEventListener('resize', () => {
    revealInViewport();
  });

  // Add section animation styles
  const sectionStyle = document.createElement('style');
  sectionStyle.textContent = `
    .reveal-base {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.55s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
      will-change: transform, opacity;
    }

    .reveal-show {
      opacity: 1;
      transform: translateY(0);
      animation: reveal-pop 0.6s cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay, 0ms);
    }

    @keyframes reveal-pop {
      0% { opacity: 0; transform: translateY(24px); }
      55% { opacity: 1; transform: translateY(-4px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    .section-hidden {
      opacity: 0;
      transform: translateY(28px);
      filter: none;
      transition: opacity 0.55s ease, transform 0.6s ease;
      will-change: transform, opacity;
    }
    
    .section-visible {
      opacity: 1;
      transform: translateY(0);
      animation: section-pop 0.65s cubic-bezier(0.22, 1, 0.36, 1);
    }

    @keyframes section-pop {
      0% { opacity: 0; transform: translateY(28px); }
      55% { opacity: 1; transform: translateY(-6px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    @media (prefers-reduced-motion: reduce) {
      .section-hidden {
        opacity: 1;
        transform: none;
        filter: none;
      }
      .section-visible {
        animation: none;
        transform: none;
      }
      .reveal-base {
        opacity: 1;
        transform: none;
      }
      .reveal-show {
        animation: none;
      }
    }
  `;
  document.head.appendChild(sectionStyle);

  initCookieBanner();
  
  // Hero video sound toggle
  initHeroSoundToggle();
});

document.addEventListener('DOMContentLoaded', () => initScrollRevealV2());
window.addEventListener('load', () => initScrollRevealV2(true));

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

// Scroll reveal animations (covers new sections even if legacy observer missed them)
let scrollRevealInitialized = false;

function initScrollRevealV2(force = false) {
  if (scrollRevealInitialized && !force) return;
  scrollRevealInitialized = true;

  try {
    ensureScrollRevealStyles();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const selectors = [
      '[data-animate]',
      '.animate-on-scroll',
      '.value-highlight',
      '.projects-banner-section',
      '.cta-section',
      '.process-section',
      '.assistants-section',
      '.testimonials',
      '.benefits-section',
      '.services',
      '.about',
      'section'
    ];

    const candidates = Array.from(new Set(Array.from(document.querySelectorAll(selectors.join(',')))));
    const prepared = [];

    const prepareElement = (el, index = 0) => {
      if (!el || el.dataset.scrollRevealReady === '1') return;
      if (el.classList.contains('hero') || el.dataset.animate === 'off') return;
      el.dataset.scrollRevealReady = '1';
      el.classList.add('scroll-animate');
      const customDelay = el.getAttribute('data-animate-delay') || el.dataset.animateDelay;
      const delayValue = customDelay ? parseInt(customDelay, 10) : (index % 7) * 70;
      el.style.setProperty('--scroll-animate-delay', `${Math.max(0, delayValue || 0)}ms`);
      prepared.push(el);
    };

    candidates.forEach((el, index) => prepareElement(el, index));
    if (prepared.length === 0) return;

    const revealElement = (el) => {
      el.classList.add('scroll-animate--visible');
      el.classList.remove('section-hidden', 'reveal-base');
    };

    const showVisibleImmediately = () => {
      prepared.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * -0.1) {
          revealElement(el);
        }
      });
    };

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      prepared.forEach(revealElement);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '18% 0px -8% 0px'
    });

    prepared.forEach((el) => observer.observe(el));
    showVisibleImmediately();
    // Реакция на динамически добавленные блоки
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach(({ addedNodes }) => {
        addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          const matchedSelf = selectors.some((selector) => node.matches?.(selector));
          const targets = matchedSelf ? [node] : Array.from(node.querySelectorAll?.(selectors.join(',')) || []);
          targets.forEach((target, idx) => {
            prepareElement(target, idx);
            if (target.dataset.scrollRevealReady === '1' && !prefersReducedMotion) {
              observer.observe(target);
            } else if (target.dataset.scrollRevealReady === '1') {
              revealElement(target);
            }
          });
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });
  } catch (error) {
    console.error('Ошибка инициализации scroll reveal анимаций:', error);
  }
}

function ensureScrollRevealStyles() {
  if (document.getElementById('scroll-reveal-styles')) return;
  const style = document.createElement('style');
  style.id = 'scroll-reveal-styles';
  style.textContent = `
    .scroll-animate {
      opacity: 0;
      transform: translateY(30px) scale(0.88);
      filter: blur(0.4px);
      transition: opacity 0.7s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), filter 0.75s ease;
      transition-delay: var(--scroll-animate-delay, 0ms);
      will-change: opacity, transform, filter;
    }

    .scroll-animate--visible {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: none;
      animation-delay: var(--scroll-animate-delay, 0ms);
      animation: scroll-pop 0.8s cubic-bezier(0.22, 1, 0.36, 1);
    }

    @keyframes scroll-pop {
      0% { opacity: 0; transform: translateY(30px) scale(0.86); }
      48% { opacity: 1; transform: translateY(-6px) scale(1.04); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    @media (prefers-reduced-motion: reduce) {
      .scroll-animate {
        opacity: 1;
        transform: none;
        filter: none;
        transition: none;
      }
      .scroll-animate--visible {
        animation: none;
      }
    }
  `;
  document.head.appendChild(style);
}

// Фолбек: запустить сразу, если DOM уже готов (дефер-сценарий)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initScrollRevealV2(true);
}
