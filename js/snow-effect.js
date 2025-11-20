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
  }

  createToggleButton() {
    this.toggleButton = document.createElement('button');
    this.toggleButton.className = 'snow-toggle';
    this.toggleButton.setAttribute('aria-label', 'Переключить снег');
    
    // Используем изображение вместо иконки FontAwesome
    const img = document.createElement('img');
    img.src = 'public/кнопка снежинки.png';
    img.alt = 'Переключить снег';
    img.className = 'snow-toggle-icon';
    img.style.mixBlendMode = 'screen';
    this.toggleButton.appendChild(img);

    if (this.isActive) {
      this.toggleButton.classList.add('active');
    }

    this.toggleButton.addEventListener('click', () => this.toggle());
    
    // Добавляем кнопку в навбар, по центру
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.appendChild(this.toggleButton);
    } else {
      // Если навбара нет, добавляем в body
      document.body.appendChild(this.toggleButton);
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

      this.flakes.push({ el, x, y, speed });
    }
  }

  update() {
    const height = window.innerHeight;
    const width = window.innerWidth;

    for (const flake of this.flakes) {
      flake.y += flake.speed;
      flake.x += Math.sin(flake.y / 50) * 0.3;

      if (flake.y > height + 20) {
        flake.y = -20;
        flake.x = Math.random() * width;
      }

      flake.el.style.transform = `translate3d(${flake.x}px, ${flake.y}px, 0)`;
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

    if (this.isActive) {
      this.toggleButton.classList.add('active');
      this.start();
    } else {
      this.toggleButton.classList.remove('active');
      this.stop();
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
