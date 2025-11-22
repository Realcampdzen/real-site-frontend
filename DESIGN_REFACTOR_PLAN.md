# Neuro Twin Style Integration – Detailed Plan

This document describes the tasks and concrete steps required to bring the “Реальный Vайб AI Studio” landing page as close as possible to the Neuro Twin Studio layout and feel, while preserving our own brand colors, content and functionality.

---

## 0. Progress Overview

- [x] 1. Global principles baseline applied (dark panels, shared radii, shadows)
- [x] 2. Header and hero structure aligned with Neuro Twin
- [x] 3. “About” + highlight services collage integrated
- [x] 4. Services flat grid implemented and styled
- [x] 5. Process section containers unified
- [x] 6. Portfolio cards restyled as unified panels
- [x] 7. Assistants section integrated into new visual system
- [x] 8. Contacts section panels unified with other blocks
- [x] 9. Testimonials section panels unified with contacts
- [x] 10. Neon footer block implemented in Neuro Twin style
- [x] 11. Global CTA & button system – final unification
- [x] 12. Animations & micro‑interactions – fine tuning
- [ ] 13. Responsive QA & side‑by‑side comparison with Neuro Twin (in progress)
- [x] 14. Accessibility & cookie banner: skip‑link, landmarks, fixed consent bar

---

## 1. Global Principles

- **Unified container language**
  - All major content blocks (hero, about, services, process, portfolio, assistants, contacts, testimonials, footer) must use one visual system:
    - Dark container background (near-black), large corner radius (24–32px)
    - Thin light border with subtle glow
    - Soft but confident drop shadow
    - Light glass/blur only where it genuinely helps readability
  - Reuse existing patterns as reference:
    - `benefit-card`
    - `service-simple-card`
    - `projects-reel-card`
    - `assistant-card`

- **Section rhythm**
  - Standardize vertical padding on all sections: ~80–100px top/bottom on desktop, reduced on mobile.
  - Avoid large “air gaps” between sections. Sections should visually “flow” into each other with only a gentle change in background gradient.

- **Typography**
  - `section-title` is the main section heading style:
    - Single consistent font size & line-height
    - Centered
    - Reasonable spacing above/below
  - Internal headings (`h3` etc.) share the same typographic system:
    - 18–20px, bold, consistent margin-bottom
  - Body text: limited line width for readability and consistent font sizes.

- **Layout & grid (per Neuro Twin spec)**
  - Single central container for all sections:
    - `max-width: 1200–1360px; margin: 0 auto; padding-inline: 16–24px;` (see `NEUROTWIN_DESIGN_SPEC.md` §3.1).
  - Standard vertical paddings:
    - Hero ≈ `min(100vh - headerHeight, content height)`.
    - Other sections: `padding-block: 60–100px` with at least `48–64px` of visual air between blocks.
  - Breakpoints and grid behavior:
    - Desktop (≥1200px): multi‑column grids (services 4‑колоночная, преимущества 3–4 в ряд).
    - Tablet (768–1199px): 2‑column grids for services and advantages, footer in a single column.
    - Mobile (<768px): everything collapses в одну колонку, карточки тянутся на всю ширину.

- **Information architecture & accessibility**
  - DOM‑структура:
    - `header` (banner), `main` (основной контент) с якорями, `footer` (contentinfo), плюс фиксированный cookie‑баннер.
  - Навигация:
    - Верхние ссылки и CTA повторяют паттерны из `NEUROTWIN_DESIGN_SPEC.md` (§2 и §6): якорь `/#advantages`, CTA `#popup:zayavka` (или эквивалентный наш якорь формы).
  - Доступность:
    - Скип‑линк `К основному контенту` → `href="#t-main-content"` с видимостью при фокусе.
    - Чёткая иерархия заголовков `h1 / h2 / h3` и корректные `tel:` / `mailto:` ссылки.

---

## 2. Header and Hero

### Tasks
- Finalize header proportions and alignment to visually match Neuro Twin.
- Fine‑tune hero “showreel” block (height, text block and CTAs).
 - Align navigation items, phone, messengers and EN toggle with spec (§2.2.3, §4.1).
 - Ensure header + mobile menu mirror Neuro Twin behavior on all breakpoints.

### Actions
- Header (`.navbar`, `.nav-container`, `.nav-left`, `.nav-center`, `.nav-right`):
  - Adjust container height and vertical padding for a flatter, “pill on glass” look.
  - Slightly reduce logo size and spacing on the left.
  - Ensure `.nav-center-title` is perfectly centered in viewport, with symmetrical top/bottom breathing space.
  - Verify behavior on scroll (transparency/blur) matches desired effect.
  - Navigation content:
    - Left: круглая/капсульная кнопка `О студии`/`О нас` → наша страница `/about` или секция.
    - Left: кнопка `Преимущества` → якорь `/#advantages` (наш блок преимуществ).
    - Center: текстовый логотип `REAL VIBE AI STUDIO` → `/`.
    - Right: телефон `tel:+7...`, иконки Telegram/WhatsApp, переключатель `EN` (пока может вести на ту же страницу).
  - Interaction:
    - Навигационные элементы и соц‑иконки меняют цвет/подчеркивание при hover (см. `NEUROTWIN_DESIGN_SPEC.md` §4.1).

- Hero (`.hero`, `.hero-reel`, `.hero-reel-overlay`, `.hero-reel-content`):
  - Set `.hero-reel` height to ~60–70% viewport height on desktop.
  - Tighten spacing between `.hero-tagline`, `.hero-title-reel`, `.hero-subtitle` and `.hero-cta-row`.
  - Tune overlay gradients so the video remains visible but text is fully readable.
  - Verify mobile and tablet layouts keep the text block central and not overly tall.
  - Text mapping:
    - Маленький lead‑текст из 2 строк вверху (аналог `Мы креативная студия AI контента...` из спека §4.3).
    - `h1` (наш крупный тайтл шоу‑рила) — самый большой шрифт на странице.
  - CTA:
    - Основная кнопка/ссылка на форму заявки (аналог `Оставить заявку` → `#popup:zayavka`, см. §4.5) — ведёт к нашему блоку контактов/формы.
    - Поддерживающие CTA: телефон и мессенджеры в правой части шапки.

 - Mobile menu:
   - Реализовать оверлей по паттерну из спека (§4.2):
     - `position: fixed; top: 0; left: 0; width: 100%; height: 100%;` затемнённый фон.
     - Внутри: вертикальный флекс‑контейнер с логотипом, кнопкой закрытия, ссылками `О нас` и `Преимущества`, блоком соцсетей и телефоном + `EN`.
   - Скрывать/показывать меню по клику на бургер‑иконку, блокируя скролл страницы при открытии.

---

## 3. “About” + Highlighted Services

### Tasks
- Align the “about + 4 highlight cards” block with Neuro Twin’s hero‑adjacent collage.
 - Map our 4 highlight services to Neuro Twin’s core service directions (`/photos`, `/salevideo`, `/animations`, `/aiavatars`) conceptually.

### Actions
- `section.about.about-intro`:
  - Refine `grid-template-columns` so text vs. image area proportions mimic Neuro Twin (slightly more width for the image grid).
  - Limit text width so the description reads as a compact block (2–3 short paragraphs).

- `.highlight-services-grid` & `.highlight-service-card`:
  - Adjust `min-height`, padding and row/column spans so the 4 cards form a visually balanced collage (2×2 with selective spanning).
  - Ensure all cards share consistent radius, border and shadow.
  - Confirm hover states are subtle (minor scale/brightness), not distracting.
  - Продумать логические ссылки:
    - Каждая из 4 карточек ведёт либо на нашу якорную секцию сервиса, либо на отдельную страницу, аналогичную `/photos`, `/salevideo`, `/animations`, `/aiavatars` (см. §2.2 и §4.4 спецификации).

---

## 4. Services – Flat Grid (`#services`)

### Tasks
- Replace the old 3D carousel experience with a flat, responsive grid that matches Neuro Twin layout.
 - Ensure services grid behavior matches Neuro Twin’s 4‑card layout (desktop 4→tablet 2→mobile 1).

### Actions
- Layout:
  - Keep `section-title` + description compact.
  - Ensure `.services-simple-grid` spacing lines up visually with `benefits` above and `portfolio` below.
  - Desktop: 2 columns; Tablet: 1–2 columns; Mobile: 1 column.

- Cards (`.service-simple-card`):
  - Standardize card height on desktop (~280–300px) with `min-height`.
  - Unify typography:
    - Title 18–20px
    - Description 14px
    - Bullet list 13px
  - Footer layout:
    - Price label (`.service-simple-price`) left
    - CTA (`.service-simple-btn`) right
    - Align CTAs along a single baseline across the row using flexbox and `margin-top: auto`.
  - Link behavior:
    - При необходимости каждая карточка может дублировать ссылки на подробные страницы (по аналогии с `/photos`, `/salevideo`, `/animations`, `/aiavatars` из `NEUROTWIN_DESIGN_SPEC.md` §2.2.5 и §4.4).

---

## 5. Process Section (`#process`)

### Tasks
- Make the “How AI Studio works” section use the same panel style as other containers and match Neuro Twin’s step cards.

### Actions
- Grid:
  - Reduce `gap` and `margin-top` so the block sits tighter under Services.
  - Keep steps in a responsive grid using `auto-fit` with min 280px columns.

- Step cards (`.process-step`):
  - Use dark background, 26px radius, thin light border, strong soft shadow (same style as portfolio/assistant cards).
  - Check padding so icon, heading, text and bottom of card match other panels.
  - Soften connecting line (`.process-grid::before`) – reduce height and opacity to a low, decorative accent.

---

## 6. Portfolio (`#portfolio`)

### Tasks
- Make “Наши работы” feel like an extension of the showreel section.

### Actions
- Section:
  - Match vertical spacing with Process above and Assistants below.
  - No separate grey/opaque backgrounds – rely on section gradient and dark panels only.

- Cards (`.portfolio-card`):
  - Match `background`, `border-radius`, `border` and `box-shadow` with `projects-reel-card`.
  - Optionally hide default video `controls` by default and show a custom “play” affordance on hover (if UX allows).
  - Simplify text content:
    - Single line title
    - Short one‑sentence description (max 2 lines).

---

## 7. Assistants (`#assistants`)

### Tasks
- Make assistant cards part of the unified panel system and match Neuro Twin’s mid‑page blocks.

### Actions
- Section:
  - Ensure background gradient matches benefits/contacts/testimonials.
  - Tune top/bottom padding for smooth flow from Portfolio.

- Cards (`.assistant-card`):
  - Confirm radius, border and shadows match service/portfolio cards.
  - Normalize inner padding and spacing between avatar, heading, text, tags and CTA.
  - Use flexbox inside cards to push CTA buttons to the same baseline (`margin-top: auto` for CTA wrapper).

---

## 8. Contacts (`#contact`)

### Tasks
- Convert contact cards into three equal promo‑style banners similar to Neuro Twin’s mid‑page CTAs.
 - Align content and links with footer/contact spec: телефоны, соцсети, mail, юр.страницы.

### Actions
- Section:
  - Apply the same gradient background as Assistants/Testimonials.
  - Enforce 3 columns on large desktop, 2 on tablet, 1 on mobile.

- Cards (`.contact-card`):
  - Reuse panel styling: dark bg, 26px radius, unified shadow.
  - Re‑layout:
    - Icon top, heading, description, CTA link
    - Centered but with even vertical spacing.
  - Transform `.contact-link` into chip‑style buttons:
    - Full‑pill radius (999px) or 26px
    - Solid black or dark background
    - Light border and inner shadow matching footer chip buttons.
  - Ссылки и контент:
     - Телефон `tel:`, почта `mailto:` и соцсети берутся из единого конфигурационного места, синхронизированного с футером (см. `NEUROTWIN_DESIGN_SPEC.md` §2.2.9 и §4.8).

---

## 9. Testimonials (`#testimonials`)

### Tasks
- Turn testimonials into a single, bold central panel mirroring Neuro Twin’s testimonial block.

### Actions
- Section:
  - Use same gradient as Contacts for pairing.
  - Adjust vertical spacing to sit comfortably between Contacts and top of the neon footer.

- Slider & cards:
  - `testimonials-slider` with 26px radius and panel styling identical to other blocks.
  - One active `.testimonial-card` visible at a time, with quote typography refined (bigger, minimal italics).
  - Navigation dots (`.testimonial-btn`) look like pill/rounded chips when active, simple circles by default.

---

## 10. Footer Neon Block

### Tasks
- Finalize bottom neon section to match Neuro Twin’s footer layout.
 - Ensure all соцсети, контакты и юр.ссылки совпадают со структурой из `NEUROTWIN_DESIGN_SPEC.md` (§2.2.9, §4.8).

### Actions
- Section:
  - Slightly “pull up” the neon block so it appears to cut into the previous section like in Neuro Twin.

- Left column:
  - Keep big studio title in 2–3 lines, align baseline and spacing with reference.
  - Ensure social chips align in 2 rows max with consistent spacing.

- Right column:
  - Refine meta text (ИНН/ОГРНИП etc.) spacing.
  - Legal links (`Согласие / Политика`) kept in 1–2 short lines with consistent margins.

- Mark/Logo:
  - Adjust `RV` square radius, shadow and size to mirror Neuro Twin’s logo block as closely as possible.

 - Data source:
   - Вынести список соцсетей, email и юр.ссылок в отдельный конфиг/объект, чтобы:
     - использовать его и в футере, и в контактах, и (при необходимости) в мобильном меню,
     - упростить обновление ссылок и потенциальную локализацию.

---

## 11. Global CTA & Button System

### Tasks
- Unify button design and hover behavior across the entire site.
 - Match Neuro Twin’s CTA hierarchy: основной CTA «Оставить заявку» + поддерживающие CTA (телефон, соцсети, почта).

### Actions
- Identify all CTA/button classes:
  - `.btn-primary`, `.btn-secondary`
  - `.service-simple-btn`
  - `.contact-link` (when used as button)
  - Assistant CTAs and portfolio CTAs
- Define a single button design token set:
  - Height, padding, font size, radius
  - Base background colors (primary/secondary)
  - Hover and active states (lift, shadow, color tweaks)
- Apply these tokens to all buttons for full consistency.
 - Маппинг с `NEUROTWIN_DESIGN_SPEC.md`:
   - Основной CTA: кнопка заявки (форма/контакты) в hero и дублирующие точки ниже по странице.
   - Поддерживающие CTA: кликабельный телефон, ссылки на мессенджеры и почту в шапке/футере/контактах (§6.1–6.3).

---

## 12. Animations & Micro‑interactions

### Tasks
- Make scroll‑reveals and hover states feel coherent and subtle.
 - Keep UX behavior aligned with Neuro Twin: простой, предсказуемый скролл и минимально навязчивые эффекты.

### Actions
- Scroll reveals:
  - Ensure all major panels are registered in the IntersectionObserver initialization.
  - Apply `.section-hidden` -> `.section-visible` animation with consistent timing and distances.
  - Add small stagger delays per card index (0.05–0.1s) within a section.

- Hover:
  - Cards: small upward move (4–8px), modest glow increase, slight scale if needed.
  - Buttons: subtle elevation and background shift; no overly strong scaling.
 - Поведение:
   - Хедер остаётся видимым (static или sticky) в верхней части, как описано в `NEUROTWIN_DESIGN_SPEC.md` §6.
   - Бургер‑меню на мобильных устройствах открывает полноэкранный оверлей и не конфликтует с скроллом/IntersectionObserver.

---

## 13. Responsive QA & Visual Comparison

### Tasks
- Verify final layout across breakpoints and visually compare against Neuro Twin.

### Actions
- Breakpoints:
  - Desktop (~≥1200px), Tablet (768–1199px), Mobile (<768px).
  - Confirm columns collapse correctly and text remains readable without awkward wrapping.
- Visual comparison:
  - Create “scroll screenshots” of both the current site and Neuro Twin.
  - Compare:
    - Section heights and relative proportions
    - Spacing between titles and content
    - Density of content vs. empty space
    - Animation timing and motion feel
  - Log remaining discrepancies and address them iteratively until the experience feels almost identical while preserving our brand identity.

---

## 14. Accessibility & Cookie Banner

### Tasks
- Implement and проверить ключевые элементы доступности и cookie‑политики по `NEUROTWIN_DESIGN_SPEC.md` (§2, §4.9, §6).

### Actions
- Skip‑link:
  - Добавить ссылку наверху `<body>`: `К основному контенту` → `href="#t-main-content"`.
  - По умолчанию скрыта визуально, появляется при фокусе (для клавиатурной навигации).
- Лэндмарки:
  - Явно использовать `header`, `main`, `footer` и, при необходимости, `nav`, чтобы облегчить навигацию скринридерам.
  - Прописать корректную иерархию заголовков `h1` (только один на страницу), далее `h2` для секций и `h3` для карточек/подзаголовков.
- Cookie‑баннер:
  - Реализовать `position: fixed; bottom: 0; left: 0; width: 100%;` как в спецификации (§4.9).
  - Контент:
    - Текст о cookie + ссылка на `/privacy` (нашу страницу политики конфиденциальности).
    - Кнопка `ОК`, которая:
      - по клику скрывает баннер,
      - сохраняет согласие в `localStorage`/cookie, чтобы баннер не показывался повторно.
  - Адаптив:
    - На desktop: текст и кнопка могут стоять в один ряд.
    - На mobile: текст переносится на 2–3 строки, кнопка уходит под текст или вправо с переносом.


