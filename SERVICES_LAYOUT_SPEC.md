## Спецификация секции «Услуги AI Studio» (белые контейнеры)

Этот файл фиксирует **правильное состояние** верстки секции услуг, чтобы всегда можно было восстановить нужный вид, если что‑то собьётся при правках CSS.

### Целевой референс

Вид и размеры берутся с блока на сайте Neuro Twin (`neurotwin.studio`), раздел с карточками:

- Ширина окна браузера: **1920 px**, масштаб **100%**
- Левая большая карточка (salevideo): **925 × 582 px**
- Правая карточка (photos): **445 × 582 px**
- Общая ширина области карточек: **1400 px**
- Расстояние между карточками: **30 px**
- Скругление углов: **40 px**

### Обязательные значения в `css/style.css`

В корневых CSS‑переменных (`:root`):

```css
/* Service cards – Neuro Twin reference sizes (сняты с блока salevideo при ширине 1920px) */
--service-card-height-desktop: 582px;   /* фактическая высота большого блока ~582px */
--service-card-height-tablet: 460px;
--service-card-height-mobile: 380px;
```

Сетка услуг (десктоп, ≥ 1024px):

```css
.services-simple-grid {
  margin-top: 40px;
  width: min(100%, 1400px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 30px; /* вертикальный зазор между рядами */
}

.service-row {
  display: grid;
  grid-template-rows: var(--service-card-height-desktop);
  column-gap: 30px; /* расстояние между большим и малым контейнером в ряду */
}

/* Ряды с большим контейнером слева */
.service-row-big-left {
  grid-template-columns: 925px 445px;
}

/* Ряды с маленьким контейнером слева */
.service-row-small-left {
  grid-template-columns: 445px 925px;
}
```

Паттерн рядов на десктопе:

- Ряд 1 (`.service-row-big-left`): **большой слева, малый справа**  
- Ряд 2 (`.service-row-small-left`): **малый слева, большой справа**  
- Ряд 3 (`.service-row-big-left`): **большой слева, малый справа**  
- Ряд 4 (`.service-row-small-left`): **малый слева, большой справа**

Сетка в адаптиве:

```css
@media (max-width: 1024px) {
  .services-simple-grid {
    width: 100%;
    max-width: none;
    gap: 16px;
  }

  .service-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: var(--service-card-height-tablet);
    column-gap: 16px;
  }

  .service-simple-card {
    height: var(--service-card-height-tablet);
  }
}

@media (max-width: 768px) {
  .services {
    padding-top: 60px;
  }

  .services-simple-grid {
    width: 100%;
    gap: 14px;
  }

  .service-row {
    grid-template-columns: 1fr;
    grid-template-rows: var(--service-card-height-mobile);
    column-gap: 0;
  }

  .service-simple-card {
    height: var(--service-card-height-mobile);
  }
}
```

Карточка услуги:

```css
.service-simple-card {
  position: relative;
  border-radius: 40px;
  overflow: hidden;
  /* Фиксированная высота для десктопа (как на Neuro Twin);
     для tablet/mobile переопределяется медиазапросами */
  height: var(--service-card-height-desktop);
  background-color: #ffffff;
  border: var(--panel-border);
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.04);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  display: flex;
}
```

### Как проверить, что всё в порядке

1. Открыть локальный сайт в режиме десктопа.
2. Поставить ширину окна **1920 px**, масштаб **100%**.
3. В DevTools измерить первую (большую) карточку услуг:
   - ширина ≈ **925 px**
   - высота ≈ **582 px**
4. Измерить вторую карточку в ряду:
   - ширина ≈ **445 px**
   - высота ≈ **582 px**
5. Проверить, что расстояние между карточками по горизонтали ≈ **30 px**, а скругление углов визуально совпадает с референсом Neuro Twin.

Если что‑то «уплыло», нужно вернуть значения в `css/style.css` к тем, что перечислены выше.


