/**
 * Haptic Feedback - Тактильная обратная связь для мобильных устройств
 */

class HapticFeedback {
  constructor() {
    this.supported = 'vibrate' in navigator;
    this.init();
  }

  init() {
    if (!this.supported) {
      console.log('Haptic Feedback не поддерживается на этом устройстве');
      return;
    }
    
    // Автоматическое добавление haptic feedback к кнопкам
    this.setupAutoHaptic();
  }

  /**
   * Легкая вибрация (10ms)
   */
  static light() {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }

  /**
   * Средняя вибрация (20ms)
   */
  static medium() {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  }

  /**
   * Сильная вибрация (паттерн)
   */
  static heavy() {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  }

  /**
   * Кастомная вибрация
   */
  static custom(pattern) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  /**
   * Вибрация для успешного действия
   */
  static success() {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 30, 10, 30, 10]);
    }
  }

  /**
   * Вибрация для ошибки
   */
  static error() {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50, 100, 50]);
    }
  }

  /**
   * Вибрация для предупреждения
   */
  static warning() {
    if ('vibrate' in navigator) {
      navigator.vibrate([20, 40, 20]);
    }
  }

  /**
   * Автоматическое добавление haptic feedback
   */
  setupAutoHaptic() {
    // Кнопки
    document.addEventListener('click', (e) => {
      const target = e.target.closest('button, .btn-primary, .btn-secondary, .mobile-nav-link, .try-assistant-btn');
      if (target && !target.hasAttribute('data-no-haptic')) {
        HapticFeedback.light();
      }
    }, true);

    // Свайпы - сохраняем начальные координаты в touchstart
    let touchStartTime = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      if (touch) {
        touchStartTime = Date.now();
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
      }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const touchDuration = Date.now() - touchStartTime;
      const touch = e.changedTouches[0];
      
      if (touch && touchStartX !== 0 && touchStartY !== 0) {
        const deltaX = Math.abs(touch.clientX - touchStartX);
        const deltaY = Math.abs(touch.clientY - touchStartY);
        
        // Свайп
        if (touchDuration < 300 && (deltaX > 50 || deltaY > 50)) {
          HapticFeedback.light();
        }
        
        // Сброс координат
        touchStartX = 0;
        touchStartY = 0;
      }
    }, { passive: true });

    // Долгое нажатие
    let longPressTimer = null;
    document.addEventListener('touchstart', (e) => {
      longPressTimer = setTimeout(() => {
        HapticFeedback.medium();
      }, 500);
    }, { passive: true });

    document.addEventListener('touchend', () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    }, { passive: true });

    document.addEventListener('touchmove', () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    }, { passive: true });
  }
}

// Инициализация
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.HapticFeedback = HapticFeedback;
    new HapticFeedback();
  });
} else {
  window.HapticFeedback = HapticFeedback;
  new HapticFeedback();
}

// Экспорт
window.HapticFeedback = HapticFeedback;

