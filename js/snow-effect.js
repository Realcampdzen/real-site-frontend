// Простой снег на requestAnimationFrame (без CSS-анимаций)
class SnowEffect {
  constructor() {
    this.container = null;
    this.toggleButton = null;
    this.flakes = [];
    this.isActive = false;
    this.storageKey = 'snow-effect-enabled';

    this.isMobile = window.innerWidth < 768;
    this.flakeCount = this.isMobile ? 40 : 90;

    const saved = localStorage.getItem(this.storageKey);
    this.isActive = saved === null ? true : saved === 'true';

    this.animationFrame = null;
    
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
    
    this.init();
  }

  init() {
    this.container = document.getElementById('snow-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'snow-container';
      document.body.appendChild(this.container);
    }

    this.createToggleButton();
    this.createFlakes();

    if (this.isActive) {
      this.start();
    }

    window.addEventListener('resize', () => {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth < 768;
      if (wasMobile !== this.isMobile) {
        this.flakeCount = this.isMobile ? 40 : 90;
        this.createFlakes();
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else if (this.isActive) {
        this.start();
      }
    });

    // Mouse tracking for cursor interaction
    this.setupMouseTracking();
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
    
    // Устанавливаем изображение в зависимости от состояния
    this.updateButtonImage();
    
    this.toggleButton.appendChild(this.toggleImage);

    if (this.isActive) {
      this.toggleButton.classList.add('active');
    }

    // Сразу синхронизируем aria-pressed с текущим состоянием
    this.toggleButton.setAttribute('aria-pressed', this.isActive ? 'true' : 'false');

    this.toggleButton.addEventListener('click', () => this.toggle());

    // Добавляем кнопку в правый блок навигации, чтобы она выглядела как обычная иконка
    const navRight = document.querySelector('.nav-right');
    const navbar = document.querySelector('.navbar');

    if (navRight) {
      this.toggleButton.classList.add('nav-icon-btn', 'snow-toggle-btn');
      // Ставим снежинку перед бургером, если он есть
      const mobileMenuBtn = navRight.querySelector('.mobile-menu-btn');
      navRight.insertBefore(this.toggleButton, mobileMenuBtn || null);
    } else if (navbar) {
      // Фолбэк: добавляем в сам navbar как иконку
      this.toggleButton.classList.add('nav-icon-btn', 'snow-toggle-btn');
      navbar.appendChild(this.toggleButton);
    } else {
      // Если навбара нет, добавляем в body
      document.body.appendChild(this.toggleButton);
    }
  }
  
  /**
   * Обновляет изображение на кнопке в зависимости от состояния снега
   */
  updateButtonImage() {
    if (!this.toggleImage) return;
    
    // Когда снег включен - показываем "кнопка снежинки.png" (снег идет)
    // Когда снег выключен - показываем "кнопка снежинки 2.png" (снег не идет)
    if (this.isActive) {
      this.toggleImage.src = 'public/кнопка снежинки.png';
    } else {
      this.toggleImage.src = 'public/кнопка снежинки 2.png';
    }
  }

  createFlakes() {
    this.flakes.forEach(f => f.el.remove());
    this.flakes = [];

    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let i = 0; i < this.flakeCount; i++) {
      const el = document.createElement('div');
      el.className = 'snowflake';

      const sizes = ['small', 'medium', 'large'];
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      el.classList.add(`snowflake--${size}`);

      el.textContent = '❄';

      const x = Math.random() * width;
      const y = Math.random() * height;
      const speed = this.isMobile
        ? 0.4 + Math.random() * 0.6
        : 0.6 + Math.random() * 0.9;

      this.container.appendChild(el);

      // Enhanced properties for better interaction
      const mass = size === 'small' ? 0.5 : size === 'medium' ? 0.75 : 1;
      this.flakes.push({ 
        el, 
        x, 
        y, 
        speed, 
        size,
        mass,
        vx: 0, // velocity X for inertia
        vy: 0, // velocity Y for inertia
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        scale: 1,
        targetScale: 1
      });
    }
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
      // Base movement with velocity
      flake.vy += flake.speed * 0.1;
      flake.vx += Math.sin(flake.y / 50) * 0.03;

      // Cursor interaction
      if (this.enableCursorInteraction && this.isMouseVisible) {
        const distance = this.getDistance(flake, this.mouse);
        
        if (distance < this.interactionRadius) {
          const force = (this.interactionRadius - distance) / this.interactionRadius;
          const angle = Math.atan2(flake.y - this.mouse.y, flake.x - this.mouse.x);
          
          // Apply repulsion force with mass consideration
          const massMultiplier = 1 / flake.mass;
          const repulsionX = Math.cos(angle) * force * this.repulsionForce * massMultiplier;
          const repulsionY = Math.sin(angle) * force * this.repulsionForce * massMultiplier;
          
          flake.vx += repulsionX;
          flake.vy += repulsionY;
          
          // Add rotation when interacting
          flake.rotationSpeed += (Math.random() - 0.5) * force * 3;
          
          // Scale down when close to cursor
          flake.targetScale = 0.6 + force * 0.4;
        } else {
          // Return to normal scale
          flake.targetScale = 1;
        }
      } else {
        flake.targetScale = 1;
      }

      // Apply velocity with damping
      flake.x += flake.vx;
      flake.y += flake.vy;
      flake.vx *= 0.95; // Damping
      flake.vy *= 0.95; // Damping

      // Update rotation
      flake.rotation += flake.rotationSpeed;
      flake.rotationSpeed *= 0.98; // Damping

      // Smooth scale transition
      flake.scale = this.lerp(flake.scale, flake.targetScale, 0.1);

      // Reset position when out of screen
      if (flake.y > height + 20) {
        flake.y = -20;
        flake.x = Math.random() * width;
        flake.vx = 0;
        flake.vy = 0;
        flake.rotation = Math.random() * 360;
      }

      // Keep within horizontal bounds with wrapping
      if (flake.x < -20) flake.x = width + 20;
      if (flake.x > width + 20) flake.x = -20;

      // Apply transform with scale and rotation
      flake.el.style.transform = `translate3d(${flake.x}px, ${flake.y}px, 0) scale(${flake.scale}) rotate(${flake.rotation}deg)`;
    }
  }

  loop() {
    this.update();
    this.animationFrame = requestAnimationFrame(() => this.loop());
  }

  start() {
    if (this.animationFrame) return;
    this.container.style.opacity = '1';
    this.container.style.visibility = 'visible';
    this.container.style.display = 'block';
    this.animationFrame = requestAnimationFrame(() => this.loop());
  }

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.container.style.opacity = '0';
    this.container.style.visibility = 'hidden';
  }

  toggle() {
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
