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
    
    // Поддержка свайпов на мобильных
    this.setupTouchEvents();
    
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
    card.style.pointerEvents = offset === 0 ? 'auto' : 'none';
    
    const blur = Math.abs(offset) > 0 ? Math.min(Math.abs(offset) * 1.5, 4) : 0;
    card.style.filter = blur > 0 ? `blur(${blur}px)` : 'none';
    
    // Добавляем/убираем класс центральной карточки для свечения
    if (offset === 0) {
      card.classList.add('center-card');
    } else {
      card.classList.remove('center-card');
    }
    
    console.log(`  ✨ Card ${this.getCardIndex(card)}: offset=${offset}, transform применен`);
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
  
  setupTouchEvents() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    this.carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    this.carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });
    
    const handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          this.next(); // Свайп влево - следующая
        } else {
          this.prev(); // Свайп вправо - предыдущая
        }
      }
    };
    
    this.handleSwipe = handleSwipe;
  }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  const servicesCarousel = new ServicesCarousel();
  
  // Делаем доступным глобально для отладки
  window.servicesCarousel = servicesCarousel;
});

