// Простой снег на requestAnimationFrame (без CSS-анимаций)

// --- Snow feature flags ------------------------------------------------------
// По умолчанию снег включен всегда (кроме prefers-reduced-motion / Save-Data / slow сети),
// а кнопка переключения скрыта.
//
// Как быстро вернуть кнопку:
// - URL: добавить `?snowToggle=1`
// - localStorage:
//   - snow-toggle-visible = "true"  (показывает кнопку, но без переключения)
//   - snow-toggle-enabled = "true"  (показывает кнопку и включает переключение on/off)
// - код: выставить SNOW_TOGGLE_CODE_ENABLED = true
const SNOW_TOGGLE_CODE_ENABLED = false;
const SNOW_TOGGLE_URL_PARAM = 'snowToggle';
const SNOW_TOGGLE_VISIBLE_STORAGE_KEY = 'snow-toggle-visible';
const SNOW_TOGGLE_ENABLED_STORAGE_KEY = 'snow-toggle-enabled';

function readBoolFromStorage(key) {
  try {
    return localStorage.getItem(key) === 'true';
  } catch (e) {
    return false;
  }
}

function readBoolFromQuery(param) {
  try {
    const value = new URLSearchParams(window.location.search).get(param);
    return value === '1' || value === 'true';
  } catch (e) {
    return false;
  }
}

function resolveSnowToggleMode() {
  const enabled = SNOW_TOGGLE_CODE_ENABLED || readBoolFromQuery(SNOW_TOGGLE_URL_PARAM) || readBoolFromStorage(SNOW_TOGGLE_ENABLED_STORAGE_KEY);
  const visible = enabled || readBoolFromStorage(SNOW_TOGGLE_VISIBLE_STORAGE_KEY);
  return { enabled, visible };
}
class SnowEffect {
  constructor() {
    this.container = null;
    this.navbarSnowContainer = null;
    this.heroSnowContainer = null;
    this.toggleButton = null;
    this.flakes = [];
    this.navbarFlakes = [];
    this.heroFlakes = [];
    this.isActive = false;
    this.storageKey = 'snow-effect-enabled';

    this.isMobile = window.innerWidth < 768;
    // Крупные снежинки выглядят лучше при меньшем количестве
    this.flakeCount = this.isMobile ? 30 : 70;

    this.toggleMode = resolveSnowToggleMode();
    this.toggleEnabled = this.toggleMode.enabled;
    this.toggleVisible = this.toggleMode.visible;

    if (this.toggleEnabled) {
      let saved = null;
      try {
        saved = localStorage.getItem(this.storageKey);
      } catch (e) {
        saved = null;
      }
      this.isActive = saved === null ? true : saved === 'true';
    } else {
      // Снег должен идти автоматически, без переключателя
      this.isActive = true;
    }

    this.animationFrame = null;
    this.connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    this.prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.saveData = !!(this.connection && this.connection.saveData);
    this.effectiveType = this.connection ? this.connection.effectiveType : null;

    // На реальных девайсах effectiveType часто возвращает "3g" даже при нормальной скорости.
    // Поэтому отключаем снег только на очень медленных сетях (slow-2g / 2g) и при Save-Data / reduced motion.
    this.slowNetwork = this.connection && ['slow-2g', '2g'].includes(this.effectiveType);
    this.limitedNetwork = this.connection && this.effectiveType === '3g';

    this.deferForPerformance = this.prefersReducedMotion || this.saveData || this.slowNetwork;

    // Если сеть ограниченная (3g), просто уменьшаем плотность/нагрузку, но снег оставляем.
    if (this.limitedNetwork) {
      this.flakeCount = this.isMobile ? 20 : 50;
    }

    if (this.deferForPerformance) {
      this.isActive = false; // Не запускаем анимацию автоматически на экономии трафика/замедленном устройстве
    }
    
    // Cursor interaction properties
    this.mouse = { x: -9999, y: -9999 }; // Initial position outside screen
    this.targetMouse = { x: -9999, y: -9999 }; // Target position for smoothing
    this.interactionRadius = 150;
    this.repulsionForce = 2.5; // Increased for better visibility with inertia
    this.mouseSmoothing = 0.2;
    this.enableCursorInteraction = true;
    this.isMouseVisible = false;
    this.lastMouseUpdate = 0;
    this.mouseUpdateThrottle = 16; // ~60fps max updates
    this.mouseTrackingAttached = false;
    
    this.init();
  }

  init() {
    this.container = document.getElementById('snow-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'snow-container';
      document.body.appendChild(this.container);
    }

    this.ensureNavbarSnowContainer();
    this.ensureHeroSnowContainer();
    if (!this.isActive) {
      this.container.style.display = 'none';
      this.container.style.visibility = 'hidden';
      this.container.style.opacity = '0';
      if (this.navbarSnowContainer) {
        this.navbarSnowContainer.style.display = 'none';
        this.navbarSnowContainer.style.visibility = 'hidden';
        this.navbarSnowContainer.style.opacity = '0';
      }
      if (this.heroSnowContainer) {
        this.heroSnowContainer.style.display = 'none';
        this.heroSnowContainer.style.visibility = 'hidden';
        this.heroSnowContainer.style.opacity = '0';
      }
    }

    if (this.toggleVisible && !this.deferForPerformance) {
      this.createToggleButton();
    }

    if (!this.deferForPerformance) {
      this.createFlakes();
      this.createNavbarFlakes();
      this.createHeroFlakes();
    }

    if (this.isActive && !this.deferForPerformance) {
      this.start();
    }

    window.addEventListener('resize', () => {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth < 768;
      if (wasMobile !== this.isMobile) {
        this.flakeCount = this.isMobile ? 30 : 70;
        this.navbarFlakeCount = this.isMobile ? 14 : 24;
        this.heroFlakeCount = this.isMobile ? 12 : 20;
        if (this.limitedNetwork) {
          this.flakeCount = this.isMobile ? 20 : 50;
          this.navbarFlakeCount = this.isMobile ? 10 : 18;
          this.heroFlakeCount = this.isMobile ? 10 : 16;
        }
        if (this.flakes.length) {
          this.createFlakes();
        }
        if (this.navbarFlakes.length) {
          this.createNavbarFlakes();
        }
        if (this.heroFlakes.length) {
          this.createHeroFlakes();
        }
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else if (this.isActive) {
        this.start();
      }
    });

    // Mouse tracking for cursor interaction подключается при первом запуске
    if (!this.deferForPerformance && this.isActive) {
      this.setupMouseTracking();
    }
  }

  createToggleButton() {
    this.toggleButton = document.createElement('button');
    this.toggleButton.className = 'snow-toggle';
    this.toggleButton.setAttribute('aria-label', 'Переключить снег');
    
    // Используем изображение вместо иконки FontAwesome
    this.toggleImage = document.createElement('img');
    this.toggleImage.alt = 'Переключить снег';
    this.toggleImage.className = 'snow-toggle-icon';
    this.toggleImage.style.mixBlendMode = 'screen';
    // Базовые размеры и отображение, чтобы иконка была видна даже без CSS
    this.toggleImage.style.width = '32px';
    this.toggleImage.style.height = '32px';
    this.toggleImage.style.display = 'block';
    this.toggleImage.style.objectFit = 'contain';
    
    // Устанавливаем изображение в зависимости от состояния
    this.updateButtonImage();
    
    this.toggleButton.appendChild(this.toggleImage);

    if (this.isActive) {
      this.toggleButton.classList.add('active');
    }

    // Сразу синхронизируем aria-pressed с текущим состоянием
    this.toggleButton.setAttribute('aria-pressed', this.isActive ? 'true' : 'false');
    if (this.deferForPerformance) {
      this.toggleButton.title = 'Снег выключен для экономии ресурсов. Нажмите, чтобы включить.';
    }

    if (this.toggleEnabled) {
      this.toggleButton.addEventListener('click', () => this.toggle());
    } else {
      this.toggleButton.disabled = true;
      this.toggleButton.setAttribute('aria-disabled', 'true');
      this.toggleButton.title = 'Снег включен автоматически';
    }

    // Убеждаемся, что кнопка видна сразу
    this.toggleButton.style.display = 'flex';
    this.toggleButton.style.alignItems = 'center';
    this.toggleButton.style.justifyContent = 'center';
    this.toggleButton.style.visibility = 'visible';
    this.toggleButton.style.opacity = '1';

    // Функция для добавления кнопки в навбар
    const addButtonToNavbar = () => {
      const navRight = document.querySelector('.nav-right');
      const navbar = document.querySelector('.navbar');

      if (navRight) {
        this.toggleButton.classList.add('nav-icon-btn', 'snow-toggle-btn');
        // Ставим снежинку перед бургером, если он есть
        const mobileMenuBtn = navRight.querySelector('.mobile-menu-btn');
        navRight.insertBefore(this.toggleButton, mobileMenuBtn || null);
        // Если навбар есть — гарантируем слой снега внутри него
        this.ensureNavbarSnowContainer();
        return true;
      } else if (navbar) {
        // Фолбэк: добавляем в сам navbar как иконку
        this.toggleButton.classList.add('nav-icon-btn', 'snow-toggle-btn');
        navbar.appendChild(this.toggleButton);
        this.ensureNavbarSnowContainer();
        return true;
      }
      return false;
    };

    // Пытаемся добавить кнопку сразу
    if (!addButtonToNavbar()) {
      // Если навбар ещё не готов, ждём и пробуем снова
      let attempts = 0;
      const maxAttempts = 10;
      const checkInterval = setInterval(() => {
        attempts++;
        if (addButtonToNavbar() || attempts >= maxAttempts) {
          clearInterval(checkInterval);
          // Если после всех попыток навбар не найден, добавляем в body
          if (!this.toggleButton.parentElement) {
            document.body.appendChild(this.toggleButton);
          }
        }
      }, 50);
    }
  }
  
  /**
   * Обновляет изображение на кнопке в зависимости от состояния снега
   */
  updateButtonImage() {
    if (!this.toggleImage) return;

    // Предзагружаем оба состояния, чтобы избежать мигания/пустой кнопки
    if (!this.preloadedIcons) {
      ['public/кнопка снежинки.png', 'public/кнопка снежинки 2.png'].forEach((src) => {
        const img = new Image();
        img.src = src;
      });
      this.preloadedIcons = true;
    }
    
    // Когда снег включен - показываем "кнопка снежинки.png" (снег идет)
    // Когда снег выключен - показываем "кнопка снежинки 2.png" (снег не идет)
    if (this.isActive) {
      this.toggleImage.src = 'public/кнопка снежинки.png';
    } else {
      this.toggleImage.src = 'public/кнопка снежинки 2.png';
    }
    
    // Обработка ошибок загрузки изображения
    this.toggleImage.onerror = () => {
      console.warn('Не удалось загрузить изображение кнопки снежинки:', this.toggleImage.src);
      // Fallback: используем текстовую снежинку, если изображение не загрузилось
      if (!this.toggleImage.textContent) {
        this.toggleImage.style.display = 'none';
        const fallback = document.createElement('span');
        fallback.textContent = '❄';
        fallback.style.fontSize = '20px';
        fallback.style.color = 'rgba(255, 255, 255, 0.9)';
        if (!this.toggleButton.querySelector('.snow-fallback')) {
          fallback.className = 'snow-fallback';
          this.toggleButton.appendChild(fallback);
        }
      }
    };
    
    // Убеждаемся, что изображение видимо при успешной загрузке
    this.toggleImage.onload = () => {
      this.toggleImage.style.display = 'block';
      const fallback = this.toggleButton.querySelector('.snow-fallback');
      if (fallback) {
        fallback.remove();
      }
    };
  }

  createFlakes() {
    this.flakes.forEach(f => f.el.remove());
    this.flakes = [];

    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let i = 0; i < this.flakeCount; i++) {
      const el = document.createElement('div');
      el.className = 'snowflake';

      // Взвешенное распределение размеров: маленьких больше, очень больших — мало
      const r = Math.random();
      const size = r < 0.42 ? 'small' : r < 0.74 ? 'medium' : r < 0.97 ? 'large' : 'xlarge';
      el.classList.add(`snowflake--${size}`);

      // Круглая "точка" рисуется через CSS (background + border-radius)
      el.setAttribute('aria-hidden', 'true');

      const x = Math.random() * width;
      const y = Math.random() * height;

      // Скорость падения — чуть выше для крупных снежинок, чтобы диагональ читалась
      let speedMin = this.isMobile ? 0.45 : 0.65;
      let speedMax = this.isMobile ? 0.95 : 1.25;
      if (size === 'medium') {
        speedMin = this.isMobile ? 0.55 : 0.8;
        speedMax = this.isMobile ? 1.05 : 1.4;
      } else if (size === 'large') {
        speedMin = this.isMobile ? 0.65 : 0.95;
        speedMax = this.isMobile ? 1.2 : 1.6;
      } else if (size === 'xlarge') {
        speedMin = this.isMobile ? 0.7 : 1.05;
        speedMax = this.isMobile ? 1.3 : 1.8;
      }
      const speed = speedMin + Math.random() * (speedMax - speedMin);

      // "Ветер" вправо (диагональ слева → направо) — усилили, чтобы заметнее уносило вправо
      const wind = (this.isMobile ? 0.12 : 0.18) + Math.random() * (this.isMobile ? 0.22 : 0.32);
      const windSeed = Math.random() * 1000;

      this.container.appendChild(el);

      // Enhanced properties for better interaction
      const mass = size === 'small' ? 0.6 : size === 'medium' ? 0.85 : size === 'large' ? 1.05 : 1.25;
      this.flakes.push({ 
        el, 
        x, 
        y, 
        speed, 
        size,
        mass,
        wind,
        windSeed,
        vx: 0, // velocity X for inertia
        vy: 0, // velocity Y for inertia
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.4,
        scale: 1,
        targetScale: 1
      });
    }
  }

  ensureNavbarSnowContainer() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let el = document.getElementById('snow-navbar-container');
    if (!el) {
      el = document.createElement('div');
      el.id = 'snow-navbar-container';
      el.setAttribute('aria-hidden', 'true');
      // Вставляем до .nav-container, чтобы кнопки гарантированно были выше по слою
      navbar.insertBefore(el, navbar.firstChild || null);
    }

    this.navbarSnowContainer = el;
    // Отдельное количество для шапки
    this.navbarFlakeCount = this.isMobile ? 14 : 24;
    if (this.limitedNetwork) {
      this.navbarFlakeCount = this.isMobile ? 10 : 18;
    }
  }

  ensureHeroSnowContainer() {
    const heroReel = document.querySelector('.hero-reel');
    if (!heroReel) return;

    let el = document.getElementById('snow-hero-container');
    if (!el) {
      el = document.createElement('div');
      el.id = 'snow-hero-container';
      el.setAttribute('aria-hidden', 'true');

      // Вставляем между видео и overlay, чтобы снег был виден на первом экране, но не мешал кликам
      const overlay = heroReel.querySelector('.hero-reel-overlay');
      if (overlay) {
        heroReel.insertBefore(el, overlay);
      } else {
        heroReel.appendChild(el);
      }
    }

    this.heroSnowContainer = el;
    this.heroFlakeCount = this.isMobile ? 12 : 20;
    if (this.limitedNetwork) {
      this.heroFlakeCount = this.isMobile ? 10 : 16;
    }
  }

  createNavbarFlakes() {
    if (!this.navbarSnowContainer) return;

    this.navbarFlakes.forEach(f => f.el.remove());
    this.navbarFlakes = [];

    const width = window.innerWidth;
    const height = this.navbarSnowContainer.getBoundingClientRect().height || 72;

    for (let i = 0; i < this.navbarFlakeCount; i++) {
      const el = document.createElement('div');
      el.className = 'snowflake';

      const r = Math.random();
      const size = r < 0.42 ? 'small' : r < 0.74 ? 'medium' : r < 0.97 ? 'large' : 'xlarge';
      el.classList.add(`snowflake--${size}`);
      el.setAttribute('aria-hidden', 'true');

      const x = Math.random() * width;
      const y = Math.random() * height;

      // Чуть медленнее, чтобы в шапке смотрелось спокойнее
      let speedMin = this.isMobile ? 0.4 : 0.55;
      let speedMax = this.isMobile ? 0.85 : 1.05;
      if (size === 'large' || size === 'xlarge') {
        speedMin += 0.1;
        speedMax += 0.15;
      }
      const speed = speedMin + Math.random() * (speedMax - speedMin);

      const wind = (this.isMobile ? 0.12 : 0.18) + Math.random() * (this.isMobile ? 0.20 : 0.30);
      const windSeed = Math.random() * 1000;

      this.navbarSnowContainer.appendChild(el);

      const mass = size === 'small' ? 0.6 : size === 'medium' ? 0.85 : size === 'large' ? 1.05 : 1.25;
      this.navbarFlakes.push({
        el,
        x,
        y,
        speed,
        size,
        mass,
        wind,
        windSeed,
        vx: 0,
        vy: 0,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.1,
        scale: 1,
        targetScale: 1
      });
    }
  }

  createHeroFlakes() {
    if (!this.heroSnowContainer) return;

    this.heroFlakes.forEach((f) => f.el.remove());
    this.heroFlakes = [];

    const rect = this.heroSnowContainer.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || 520;
    const count = this.heroFlakeCount || (this.isMobile ? 12 : 20);

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'snowflake';

      const r = Math.random();
      const size = r < 0.42 ? 'small' : r < 0.74 ? 'medium' : r < 0.97 ? 'large' : 'xlarge';
      el.classList.add(`snowflake--${size}`);
      el.setAttribute('aria-hidden', 'true');

      const x = Math.random() * width;
      const y = Math.random() * height;

      // Между "общим" и "шапкой": видимо на первом экране, но без перегруза
      let speedMin = this.isMobile ? 0.5 : 0.75;
      let speedMax = this.isMobile ? 1.05 : 1.35;
      if (size === 'large' || size === 'xlarge') {
        speedMin += 0.1;
        speedMax += 0.2;
      }
      const speed = speedMin + Math.random() * (speedMax - speedMin);

      const wind = (this.isMobile ? 0.12 : 0.18) + Math.random() * (this.isMobile ? 0.22 : 0.32);
      const windSeed = Math.random() * 1000;

      this.heroSnowContainer.appendChild(el);

      const mass = size === 'small' ? 0.6 : size === 'medium' ? 0.85 : size === 'large' ? 1.05 : 1.25;
      this.heroFlakes.push({
        el,
        x,
        y,
        speed,
        size,
        mass,
        wind,
        windSeed,
        vx: 0,
        vy: 0,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.1,
        scale: 1,
        targetScale: 1,
      });
    }
  }

  updateFlake(flake, width, height, allowInteraction, offsetX = 0, offsetY = 0) {
    const margin = 60;

    // Base movement with velocity
    // Немного быстрее падение (было 0.12)
    flake.vy += flake.speed * 0.14;
    // Диагональное падение (ветер вправо) + лёгкая волна
    flake.vx += flake.wind * 0.18 + Math.sin((flake.y + flake.windSeed) / 90) * 0.02;

    // Cursor interaction (включается флагом allowInteraction)
    if (allowInteraction && this.enableCursorInteraction && this.isMouseVisible) {
      const localMouse = { x: this.mouse.x - offsetX, y: this.mouse.y - offsetY };
      const distance = this.getDistance(flake, localMouse);

      if (distance < this.interactionRadius) {
        const force = (this.interactionRadius - distance) / this.interactionRadius;
        const angle = Math.atan2(flake.y - localMouse.y, flake.x - localMouse.x);

        const massMultiplier = 1 / flake.mass;
        const repulsionX = Math.cos(angle) * force * this.repulsionForce * massMultiplier;
        const repulsionY = Math.sin(angle) * force * this.repulsionForce * massMultiplier;

        flake.vx += repulsionX;
        flake.vy += repulsionY;

        flake.rotationSpeed += (Math.random() - 0.5) * force * 3;
        flake.targetScale = 0.6 + force * 0.4;
      } else {
        flake.targetScale = 1;
      }
    } else {
      flake.targetScale = 1;
    }

    // Apply velocity with damping
    flake.x += flake.vx;
    flake.y += flake.vy;
    // Чуть меньше трения по X, чтобы ветер чувствовался сильнее
    flake.vx *= 0.96;
    flake.vy *= 0.95;

    // Update rotation
    flake.rotation += flake.rotationSpeed;
    flake.rotationSpeed *= 0.98;

    // Smooth scale transition
    flake.scale = this.lerp(flake.scale, flake.targetScale, 0.1);

    // Reset position when out of screen
    if (flake.y > height + margin) {
      flake.y = -margin;
      flake.x = Math.random() * width;
      flake.vx = 0;
      flake.vy = 0;
      flake.rotation = Math.random() * 360;
    }

    // Keep within horizontal bounds with wrapping
    if (flake.x < -margin) flake.x = width + margin;
    if (flake.x > width + margin) flake.x = -margin;

    flake.el.style.transform = `translate3d(${flake.x}px, ${flake.y}px, 0) scale(${flake.scale}) rotate(${flake.rotation}deg)`;
  }

  update() {
    const height = window.innerHeight;
    const width = window.innerWidth;

    // Smooth mouse position update
    if (this.enableCursorInteraction) {
      this.mouse.x = this.lerp(this.mouse.x, this.targetMouse.x, this.mouseSmoothing);
      this.mouse.y = this.lerp(this.mouse.y, this.targetMouse.y, this.mouseSmoothing);
    }

    for (const flake of this.flakes) {
      this.updateFlake(flake, width, height, true, 0, 0);
    }

    if (this.navbarSnowContainer && this.navbarFlakes.length) {
      const navRect = this.navbarSnowContainer.getBoundingClientRect();
      const navWidth = navRect.width || width;
      const navHeight = navRect.height || 72;
      for (const flake of this.navbarFlakes) {
        this.updateFlake(flake, navWidth, navHeight, true, navRect.left, navRect.top);
      }
    }

    if (this.heroSnowContainer && this.heroFlakes.length) {
      const heroRect = this.heroSnowContainer.getBoundingClientRect();
      const heroWidth = heroRect.width || width;
      const heroHeight = heroRect.height || height;
      for (const flake of this.heroFlakes) {
        this.updateFlake(flake, heroWidth, heroHeight, true, heroRect.left, heroRect.top);
      }
    }
  }

  loop() {
    this.update();
    this.animationFrame = requestAnimationFrame(() => this.loop());
  }

  start() {
    if (this.animationFrame) return;
    this.ensureHeroSnowContainer();
    if (!this.flakes.length) {
      this.createFlakes();
    }
    if (!this.navbarFlakes.length) {
      this.createNavbarFlakes();
    }
    if (this.heroSnowContainer && !this.heroFlakes.length) {
      this.createHeroFlakes();
    }
    this.setupMouseTracking();
    this.container.style.opacity = '1';
    this.container.style.visibility = 'visible';
    this.container.style.display = 'block';
    if (this.navbarSnowContainer) {
      this.navbarSnowContainer.style.opacity = '1';
      this.navbarSnowContainer.style.visibility = 'visible';
      this.navbarSnowContainer.style.display = 'block';
    }
    if (this.heroSnowContainer) {
      this.heroSnowContainer.style.opacity = '1';
      this.heroSnowContainer.style.visibility = 'visible';
      this.heroSnowContainer.style.display = 'block';
    }
    this.animationFrame = requestAnimationFrame(() => this.loop());
  }

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.container.style.opacity = '0';
    this.container.style.visibility = 'hidden';
    this.container.style.display = 'none';
    if (this.navbarSnowContainer) {
      this.navbarSnowContainer.style.opacity = '0';
      this.navbarSnowContainer.style.visibility = 'hidden';
      this.navbarSnowContainer.style.display = 'none';
    }
    if (this.heroSnowContainer) {
      this.heroSnowContainer.style.opacity = '0';
      this.heroSnowContainer.style.visibility = 'hidden';
      this.heroSnowContainer.style.display = 'none';
    }
  }

  toggle() {
    if (!this.toggleEnabled) return;
    this.isActive = !this.isActive;
    localStorage.setItem(this.storageKey, this.isActive ? 'true' : 'false');

    // Обновляем изображение на кнопке
    this.updateButtonImage();

    // Обновляем aria-состояния для доступности
    if (this.toggleButton) {
      this.toggleButton.classList.toggle('active', this.isActive);
      this.toggleButton.setAttribute('aria-pressed', this.isActive ? 'true' : 'false');
      this.toggleButton.setAttribute(
        'aria-label',
        this.isActive ? 'Выключить снег' : 'Включить снег'
      );
    }

    if (this.isActive) {
      this.start();
    } else {
      this.stop();
    }
  }

  /**
   * Calculate distance between two points
   */
  getDistance(point1, point2) {
    return Math.hypot(point1.x - point2.x, point1.y - point2.y);
  }

  /**
   * Linear interpolation for smooth transitions
   */
  lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  /**
   * Setup mouse tracking event handlers
   */
  setupMouseTracking() {
    if (this.mouseTrackingAttached) return;
    this.mouseTrackingAttached = true;

    const handleMouseMove = (e) => {
      const now = performance.now();
      // Throttle mouse updates to ~60fps
      if (now - this.lastMouseUpdate < this.mouseUpdateThrottle) {
        return;
      }
      this.lastMouseUpdate = now;

      this.targetMouse.x = e.clientX;
      this.targetMouse.y = e.clientY;
      this.isMouseVisible = true;
    };

    const handleMouseLeave = () => {
      this.isMouseVisible = false;
      // Reset mouse position outside screen
      this.targetMouse.x = -9999;
      this.targetMouse.y = -9999;
    };

    // Desktop mouse events
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Touch events for mobile devices (optional)
    if ('ontouchstart' in window) {
      const handleTouchMove = (e) => {
        if (e.touches.length > 0) {
          const touch = e.touches[0];
          const now = performance.now();
          if (now - this.lastMouseUpdate < this.mouseUpdateThrottle) {
            return;
          }
          this.lastMouseUpdate = now;

          this.targetMouse.x = touch.clientX;
          this.targetMouse.y = touch.clientY;
          this.isMouseVisible = true;
        }
      };

      const handleTouchEnd = () => {
        this.isMouseVisible = false;
        this.targetMouse.x = -9999;
        this.targetMouse.y = -9999;
      };

      document.addEventListener('touchmove', handleTouchMove, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
      document.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    }
  }
}

(function () {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.snowEffect = new SnowEffect();
    });
  } else {
    window.snowEffect = new SnowEffect();
  }
})();
