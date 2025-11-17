/**
 * 3D Services Carousel - Revolver Drum Effect
 * AI Studio - Реальный Vайб
 */

class ServicesCarousel {
  constructor() {
    this.carousel = document.getElementById('servicesCarousel');
    this.cards = document.querySelectorAll('.service-carousel-card');
    this.prevBtn = document.getElementById('carouselPrev');
    this.nextBtn = document.getElementById('carouselNext');
    this.indicators = document.querySelectorAll('.indicator');
    
    this.currentIndex = 0;
    this.totalCards = this.cards.length;
    this.isAnimating = false;
    this.wasDrag = false; // Флаг для отслеживания drag операции
    
    // 3D carousel settings
    this.radius = 600; // Радиус окружности
    this.theta = (2 * Math.PI) / this.totalCards; // Угол между карточками
    
    this.init();
  }
  
  init() {
    if (!this.carousel || this.totalCards === 0) return;
    
    // Устанавливаем начальные позиции карточек
    this.updateCarousel(false);
    
    // Навигация
    this.prevBtn?.addEventListener('click', () => this.prev());
    this.nextBtn?.addEventListener('click', () => this.next());
    
    // Индикаторы
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goTo(index));
    });
    
    // Клик по карточкам для переключения
    this.setupCardClicks();
    
    // Поддержка свайпов и перетаскивания мышью
    this.setupTouchEvents();
    this.setupMouseDrag();
    
    // Отключаем контекстное меню на всей карусели
    this.carousel.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
    
    // Клавиатурная навигация
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
    
    console.log('🎠 3D Carousel initialized with', this.totalCards, 'cards');
  }
  
  updateCarousel(animate = true) {
    if (this.isAnimating && animate) return;
    
    console.log('🎠 Карусель вращается! Индекс:', this.currentIndex);
    
    if (animate) {
      this.isAnimating = true;
      setTimeout(() => {
        this.isAnimating = false;
      }, 850); // Чуть больше чем анимация
    }
    
    this.cards.forEach((card, index) => {
      const offset = index - this.currentIndex;
      const angle = this.theta * offset;
      
      const rotateY = angle * (180 / Math.PI);
      const translateZ = -Math.abs(offset) * 150;
      const translateX = Math.sin(angle) * this.radius;
      const scale = this.getScale(offset);
      const opacity = this.getOpacity(offset);
      const zIndex = this.getZIndex(offset);
      
      // ПРАВИЛЬНЫЙ СПОСОБ: Сначала удаляем transition, устанавливаем начальное состояние
      // Потом добавляем transition обратно и меняем transform
      
      if (animate) {
        // Шаг 1: Включаем transition
        card.classList.add('carousel-animating');
        card.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.8s ease-in-out, filter 0.6s ease-in-out, box-shadow 0.8s ease-in-out';
        
        // Шаг 2: В следующем фрейме применяем transform
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.applyCardTransform(card, translateX, translateZ, rotateY, scale, opacity, zIndex, offset);
          });
        });
      } else {
        // Без анимации - моментально
        card.style.transition = 'none';
        this.applyCardTransform(card, translateX, translateZ, rotateY, scale, opacity, zIndex, offset);
      }
    });
    
    // Обновляем индикаторы
    this.updateIndicators();
  }
  
  applyCardTransform(card, translateX, translateZ, rotateY, scale, opacity, zIndex, offset) {
    const transformValue = `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
    card.style.transform = transformValue;
    card.style.opacity = opacity;
    card.style.zIndex = zIndex;
    // Разрешаем клики на всех карточках для переключения
    card.style.pointerEvents = 'auto';
    
    const blur = Math.abs(offset) > 0 ? Math.min(Math.abs(offset) * 1.5, 4) : 0;
    card.style.filter = blur > 0 ? `blur(${blur}px)` : 'none';
    
    // Добавляем/убираем классы для стилизации
    card.classList.remove('center-card', 'left-card', 'right-card');
    if (offset === 0) {
      card.classList.add('center-card');
    } else if (offset < 0) {
      card.classList.add('left-card');
    } else if (offset > 0) {
      card.classList.add('right-card');
    }
    
    // Логирование для отладки
    const cardIndex = this.getCardIndex(card);
    const cardClass = offset === 0 ? 'center' : (offset < 0 ? 'left' : 'right');
    console.log(`  ✨ Card ${cardIndex}: offset=${offset}, class=${cardClass}, transform применен`);
  }
  
  getCardIndex(card) {
    return Array.from(this.cards).indexOf(card);
  }
  
  getScale(offset) {
    // Центральная карточка - полный размер, боковые - меньше
    const absOffset = Math.abs(offset);
    
    if (absOffset === 0) return 1;
    if (absOffset === 1) return 0.85;
    if (absOffset === 2) return 0.7;
    return 0.6;
  }
  
  getOpacity(offset) {
    // Центральная карточка - полная непрозрачность
    const absOffset = Math.abs(offset);
    
    if (absOffset === 0) return 1;
    if (absOffset === 1) return 0.7;
    if (absOffset === 2) return 0.4;
    return 0.2;
  }
  
  getZIndex(offset) {
    // Центральная карточка - наверху
    const absOffset = Math.abs(offset);
    return 50 - absOffset;
  }
  
  next() {
    if (this.isAnimating) return;
    this.currentIndex = (this.currentIndex + 1) % this.totalCards;
    this.updateCarousel();
    this.animateButton(this.nextBtn, 'right');
  }
  
  prev() {
    if (this.isAnimating) return;
    this.currentIndex = (this.currentIndex - 1 + this.totalCards) % this.totalCards;
    this.updateCarousel();
    this.animateButton(this.prevBtn, 'left');
  }
  
  animateButton(button, direction) {
    if (!button) return;
    
    // Анимация "отскока" кнопки
    const offset = direction === 'right' ? '5px' : '-5px';
    button.style.transform = `translateY(-50%) translateX(${offset})`;
    button.style.transition = 'transform 0.2s ease-out';
    
    setTimeout(() => {
      button.style.transform = 'translateY(-50%) translateX(0)';
    }, 150);
  }
  
  goTo(index) {
    if (this.isAnimating || index === this.currentIndex) return;
    this.currentIndex = index;
    this.updateCarousel();
  }
  
  updateIndicators() {
    this.indicators.forEach((indicator, index) => {
      if (index === this.currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }
  
  setupCardClicks() {
    // Добавляем обработчики клика на карточки
    this.cards.forEach((card, index) => {
      let mouseDownTime = 0;
      let mouseDownX = 0;
      let mouseDownY = 0;
      
      card.addEventListener('mousedown', (e) => {
        // Сохраняем время и координаты для определения, был ли это drag
        mouseDownTime = Date.now();
        mouseDownX = e.clientX;
        mouseDownY = e.clientY;
      });
      
      card.addEventListener('click', (e) => {
        // Игнорируем правую кнопку мыши
        if (e.button === 2 || e.which === 3) {
          return;
        }
        
        // Проверяем, был ли это drag (движение > 8px)
        const moveX = Math.abs(e.clientX - mouseDownX);
        const moveY = Math.abs(e.clientY - mouseDownY);
        
        // Если было значительное движение - это drag, не клик
        if (moveX > 8 || moveY > 8) {
          console.log(`🚫 Игнорируем клик: движение=${moveX},${moveY}px`);
          return;
        }
        
        console.log(`✅ Это клик: движение=${moveX},${moveY}px`);
        
        // Не переключаем, если клик был на кнопке "Заказать" или других интерактивных элементах
        if (e.target.closest('.service-btn') || 
            e.target.closest('a') || 
            e.target.closest('button') ||
            e.target.closest('.service-price')) {
          return;
        }
        
        // НЕ переключаем центральную карточку
        if (index === this.currentIndex) {
          console.log(`🚫 Центральная карточка ${index}, не переключаем`);
          return;
        }
        
        // Переключаемся на карточку, если она не центральная
        if (index !== this.currentIndex && !this.isAnimating) {
          console.log(`🖱️ Клик на карточку ${index}, переключаемся с ${this.currentIndex}`);
          e.stopPropagation(); // Останавливаем всплытие события
          this.goTo(index);
        }
      }, true); // Используем capture phase для более раннего перехвата
      
      // Отключаем контекстное меню на карточках
      card.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
      });
    });
  }
  
  setupTouchEvents() {
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    
    this.carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    this.carousel.addEventListener('touchmove', (e) => {
      // Предотвращаем скролл страницы при горизонтальном свайпе
      const currentX = e.changedTouches[0].screenX;
      const currentY = e.changedTouches[0].screenY;
      const diffX = Math.abs(currentX - touchStartX);
      const diffY = Math.abs(currentY - touchStartY);
      
      if (diffX > diffY && diffX > 10) {
        e.preventDefault();
      }
    }, { passive: false });
    
    this.carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      this.handleSwipe(touchStartX, touchEndX, touchStartY, touchEndY);
    }, { passive: true });
  }
  
  setupMouseDrag() {
    let mouseStartX = 0;
    let mouseEndX = 0;
    let mouseStartY = 0;
    let mouseEndY = 0;
    let isDragging = false;
    let dragThreshold = 15; // Минимальное расстояние для начала drag
    
    this.carousel.addEventListener('mousedown', (e) => {
      // Игнорируем правую кнопку мыши
      if (e.button === 2 || e.which === 3) {
        return;
      }
      
      // Не начинаем drag, если клик на кнопке или интерактивном элементе
      if (e.target.closest('.service-btn') || 
          e.target.closest('.carousel-nav') || 
          e.target.closest('a') || 
          e.target.closest('button')) {
        return;
      }
      
      // Не начинаем drag на самих карточках - они обрабатывают клики отдельно
      if (e.target.closest('.service-carousel-card')) {
        return;
      }
      
      isDragging = false;
      this.wasDrag = false;
      mouseStartX = e.clientX;
      mouseStartY = e.clientY;
      mouseEndX = e.clientX;
      mouseEndY = e.clientY;
    });
    
    this.carousel.addEventListener('mousemove', (e) => {
      if (mouseStartX === 0) return; // Если не было mousedown
      
      mouseEndX = e.clientX;
      mouseEndY = e.clientY;
      
      const diffX = Math.abs(mouseEndX - mouseStartX);
      const diffY = Math.abs(mouseEndY - mouseStartY);
      
      // Если движение достаточно большое и горизонтальное - начинаем drag
      if (!isDragging && diffX > dragThreshold && diffX > diffY) {
        isDragging = true;
        this.wasDrag = true;
        this.carousel.style.cursor = 'grabbing';
        e.preventDefault();
      }
    });
    
    this.carousel.addEventListener('mouseup', (e) => {
      if (isDragging) {
        isDragging = false;
        this.carousel.style.cursor = '';
        this.handleSwipe(mouseStartX, mouseEndX, mouseStartY, mouseEndY);
      }
      
      // Сбрасываем координаты
      mouseStartX = 0;
      mouseStartY = 0;
    });
    
    this.carousel.addEventListener('mouseleave', () => {
      if (isDragging) {
        isDragging = false;
        this.carousel.style.cursor = '';
        this.handleSwipe(mouseStartX, mouseEndX, mouseStartY, mouseEndY);
      }
      
      // Сбрасываем координаты
      mouseStartX = 0;
      mouseStartY = 0;
    });
  }
  
  handleSwipe(startX, endX, startY, endY) {
    if (startX === 0) return; // Если не было начала drag
    
    const swipeThreshold = 50;
    const diffX = startX - endX;
    const diffY = Math.abs(startY - endY);
    
    // Проверяем, что это горизонтальный свайп (не вертикальный скролл)
    if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > diffY) {
      if (diffX > 0) {
        this.next(); // Свайп влево - следующая
      } else {
        this.prev(); // Свайп вправо - предыдущая
      }
    }
  }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  const servicesCarousel = new ServicesCarousel();
  
  // Делаем доступным глобально для отладки
  window.servicesCarousel = servicesCarousel;
});

