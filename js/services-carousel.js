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
    this.animationTimeout = null; // Таймер для анимации
    this.animationStartTime = null; // Время начала анимации
    this.animationDuration = 850; // Длительность анимации в мс (синхронно с CSS)
    
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
    // Правая кнопка (→) - крутится вправо (вызываем prev для визуального поворота вправо)
    // Левая кнопка (←) - крутится влево (вызываем next для визуального поворота влево)
    this.prevBtn?.addEventListener('click', () => this.next());
    this.nextBtn?.addEventListener('click', () => this.prev());
    
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
    
    console.log('🎠 Карусель вращается! Индекс:', this.currentIndex, 'animate:', animate);
    
    if (animate) {
      this.isAnimating = true;
      clearTimeout(this.animationTimeout);
      this.animationTimeout = setTimeout(() => {
        this.isAnimating = false;
      }, this.animationDuration);
    }
    
    // ПРОСТАЯ РАБОЧАЯ ВЕРСИЯ: для каждой карточки отдельно
    this.cards.forEach((card, index) => {
      let offset = index - this.currentIndex;
      const halfCards = this.totalCards / 2;
      if (offset > halfCards) {
        offset = offset - this.totalCards;
      } else if (offset <= -halfCards) {
        offset = offset + this.totalCards;
      }
      
      const angle = this.theta * offset;
      const rotateY = angle * (180 / Math.PI);
      const translateZ = -Math.abs(offset) * 150;
      const translateX = Math.sin(angle) * this.radius;
      const scale = this.getScale(offset);
      const opacity = this.getOpacity(offset);
      const zIndex = this.getZIndex(offset);
      
      if (animate) {
        // Добавляем класс с !important правилами, чтобы анимация не глушилась power/data-save режимами
        card.classList.add('carousel-animating');
        if (card._animCleanup) {
          clearTimeout(card._animCleanup);
        }
        card._animCleanup = setTimeout(() => {
          card.classList.remove('carousel-animating');
          card._animCleanup = null;
        }, this.animationDuration + 100);

        // Устанавливаем transition через inline стиль (дополнительная гарантия)
        card.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.8s ease-in-out, filter 0.6s ease-in-out';
        card.style.willChange = 'transform, opacity, filter';
        
        // Force reflow (критически важно!)
        const _ = card.offsetHeight;
        
        // Применяем transform СРАЗУ
        this.applyCardTransform(card, translateX, translateZ, rotateY, scale, opacity, zIndex, offset);
      } else {
        // Без анимации - моментально
        card.classList.remove('carousel-animating');
        if (card._animCleanup) {
          clearTimeout(card._animCleanup);
          card._animCleanup = null;
        }
        card.style.transition = 'none';
        card.style.willChange = 'auto';
        this.applyCardTransform(card, translateX, translateZ, rotateY, scale, opacity, zIndex, offset);
      }
    });
    
    this.updateIndicators();
  }
  
  applyCardTransform(card, translateX, translateZ, rotateY, scale, opacity, zIndex, offset) {
    const absOffset = Math.abs(offset);
    const transformValue = `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
    
    // Применяем все стили
    card.style.transform = transformValue;
    card.style.opacity = opacity;
    card.style.zIndex = zIndex;
    
    // Логирование для отладки (только для центральной и ближайших карточек)
    if (absOffset <= 1) {
      console.log(`🎴 Card offset=${offset}: transform=${transformValue.substring(0, 50)}...`);
    }
    
    // Для карточек дальше 3-й позиции - полностью скрываем и отключаем взаимодействие
    if (absOffset > 3) {
      card.style.visibility = 'hidden';
      card.style.pointerEvents = 'none';
    } else {
      card.style.visibility = 'visible';
      // Разрешаем клики на видимых карточках для переключения
      card.style.pointerEvents = 'auto';
    }
    
    const blur = absOffset > 0 ? Math.min(absOffset * 1.5, 4) : 0;
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
    
    // Логирование для отладки (только для первых 3 карточек)
    const cardIndex = this.getCardIndex(card);
    if (cardIndex < 3 || Math.abs(offset) <= 1) {
      const cardClass = offset === 0 ? 'center' : (offset < 0 ? 'left' : 'right');
      console.log(`  ✨ Card ${cardIndex}: offset=${offset}, class=${cardClass}, translateX=${translateX.toFixed(1)}px`);
    }
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
    if (absOffset === 3) return 0.1;
    // Для карточек дальше 3-й позиции - полностью скрываем
    return 0;
  }
  
  getZIndex(offset) {
    // Центральная карточка - наверху
    const absOffset = Math.abs(offset);
    // Убеждаемся, что задние карточки имеют низкий z-index
    return Math.max(10, 50 - absOffset * 10);
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
    // Храним состояние drag для каждой карточки
    const cardStates = new Map();
    
    // Добавляем обработчики клика и drag на карточки
    this.cards.forEach((card, index) => {
      // Инициализируем состояние для карточки
      cardStates.set(card, {
        mouseDownX: 0,
        mouseDownY: 0,
        isDragging: false,
        dragStartX: 0,
        lastSwitchTime: 0 // Время последнего переключения для дебаунса
      });
      
      const state = cardStates.get(card);
      
      card.addEventListener('mousedown', (e) => {
        // Игнорируем правую кнопку мыши
        if (e.button === 2 || e.which === 3) {
          return;
        }
        
        // Не начинаем drag, если клик на кнопке или интерактивном элементе
        if (e.target.closest('.service-btn') || 
            e.target.closest('a') || 
            e.target.closest('button') ||
            e.target.closest('.service-price')) {
          return;
        }
        
        // Сохраняем координаты для определения, был ли это drag
        state.mouseDownX = e.clientX;
        state.mouseDownY = e.clientY;
        state.dragStartX = e.clientX;
        state.isDragging = false;
        
        // Меняем курсор на "grabbing"
        card.style.cursor = 'grabbing';
        e.preventDefault();
      });
      
      // Обработка движения мыши при зажатой кнопке на карточке
      const handleMouseMove = (e) => {
        if (state.mouseDownX === 0) return; // Если не было mousedown на этой карточке
        
        const moveX = Math.abs(e.clientX - state.mouseDownX);
        const moveY = Math.abs(e.clientY - state.mouseDownY);
        
        // Если движение достаточно большое и горизонтальное - начинаем drag
        if (!state.isDragging && moveX > 5 && moveX > moveY) {
          state.isDragging = true;
          card.style.cursor = 'grabbing';
        }
        
        // Если drag активен - поворачиваем карусель
        if (state.isDragging) {
          const diffX = e.clientX - state.dragStartX;
          const threshold = 50; // Увеличен порог для переключения карточки (было 30)
          
          if (Math.abs(diffX) > threshold) {
            // Проверяем, не идет ли уже анимация
            if (!this.isAnimating) {
              // Сохраняем время последнего переключения для дебаунса
              const now = Date.now();
              // Увеличиваем дебаунс до 400ms для более плавной анимации
              if (!state.lastSwitchTime || (now - state.lastSwitchTime) > 400) {
                state.lastSwitchTime = now;
                
                if (diffX > 0) {
                  // Движение вправо - предыдущая карточка
                  this.prev();
                  state.dragStartX = e.clientX; // Сбрасываем точку отсчета
                } else {
                  // Движение влево - следующая карточка
                  this.next();
                  state.dragStartX = e.clientX; // Сбрасываем точку отсчета
                }
              }
            }
          }
        }
      };
      
      // Обработка отпускания кнопки мыши
      const handleMouseUp = (e) => {
        if (state.mouseDownX === 0) return; // Если не было mousedown на этой карточке
        
        const moveX = Math.abs(e.clientX - state.mouseDownX);
        const moveY = Math.abs(e.clientY - state.mouseDownY);
        
        // Если был drag - не обрабатываем как клик
        if (state.isDragging) {
          state.isDragging = false;
          card.style.cursor = 'pointer';
          state.mouseDownX = 0;
          state.mouseDownY = 0;
          return;
        }
        
        // Если движение небольшое - это клик
        if (moveX < 8 && moveY < 8) {
          // Не переключаем, если клик был на кнопке "Заказать" или других интерактивных элементах
          if (e.target.closest('.service-btn') || 
              e.target.closest('a') || 
              e.target.closest('button') ||
              e.target.closest('.service-price')) {
            card.style.cursor = 'pointer';
            state.mouseDownX = 0;
            state.mouseDownY = 0;
            return;
          }
          
          // TEMP: страницы услуг ещё не готовы — отключаем переходы по карточкам
          if (index === this.currentIndex) {
            return;
          }
          
          // Переключаемся на карточку, если она не центральная
          if (index !== this.currentIndex && !this.isAnimating) {
            console.log(`🖱️ Клик на карточку ${index}, переключаемся с ${this.currentIndex}`);
            this.goTo(index);
          }
        }
        
        card.style.cursor = 'pointer';
        state.mouseDownX = 0;
        state.mouseDownY = 0;
      };
      
      // Добавляем обработчики на document для отслеживания движения мыши вне карточки
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      // Сохраняем обработчики для последующего удаления
      card._mouseMoveHandler = handleMouseMove;
      card._mouseUpHandler = handleMouseUp;
      
      // Отключаем контекстное меню на карточках
      card.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
      });
      
      // Обработка touch событий для мобильных устройств
      let touchStartTime = 0;
      let touchStartX = 0;
      let touchStartY = 0;
      
      card.addEventListener('touchstart', (e) => {
        // Игнорируем, если клик на кнопке или интерактивном элементе
        if (e.target.closest('.service-btn') || 
            e.target.closest('a') || 
            e.target.closest('button') ||
            e.target.closest('.service-price')) {
          return;
        }
        
        touchStartTime = Date.now();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });
      
      card.addEventListener('touchend', (e) => {
        if (touchStartTime === 0) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const moveX = Math.abs(touchEndX - touchStartX);
        const moveY = Math.abs(touchEndY - touchStartY);
        const touchDuration = Date.now() - touchStartTime;
        
        // Если движение небольшое и время касания короткое - это tap (клик)
        if (moveX < 10 && moveY < 10 && touchDuration < 300) {
          // Не обрабатываем, если клик был на кнопке или интерактивном элементе
          if (e.target.closest('.service-btn') || 
              e.target.closest('a') || 
              e.target.closest('button') ||
              e.target.closest('.service-price')) {
            touchStartTime = 0;
            return;
          }
          
          // TEMP: страницы услуг ещё не готовы — отключаем переходы по карточкам
          if (index === this.currentIndex) {
            return;
          }
          
          // Переключаемся на карточку, если она не центральная
          if (index !== this.currentIndex && !this.isAnimating) {
            console.log(`📱 Tap на карточку ${index}, переключаемся с ${this.currentIndex}`);
            this.goTo(index);
          }
        }
        
        touchStartTime = 0;
      }, { passive: true });
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

