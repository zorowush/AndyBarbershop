# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** AndyBarbershop
**Generated:** 2026-10-07 05:05:51
**Category:** General

---

## Global Rules

### Color Palette (Amber Hearth by @serafimcloud via 21st.dev)

| Role | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Primary (Hearth Amber) | `#e78a53` | `--primary` | Main CTA button, active icons, highlights |
| On Primary | `#121113` | `--primary-foreground` | High-contrast dark text on primary button |
| Primary Hover | `#f09a67` | `--primary-hover` | Luminous amber glow (no brown/muddy tone) |
| Secondary (Sage Steel) | `#5f8787` | `--secondary` | Secondary buttons, outline badges |
| On Secondary | `#ffffff` | `--secondary-foreground` | White text on secondary elements |
| Background | `#121113` | `--background` | Root canvas / dark background |
| Foreground | `#c1c1c1` | `--foreground` | Body text, readable muted light gray |
| Card | `#121212` | `--card` | Surfaces, haircut cards, schedule table |
| Card Foreground | `#c1c1c1` | `--card-foreground` | Text on card containers |
| Muted | `#222222` | `--muted` | Subdued surface, dividers, input background |
| Muted Foreground | `#888888` | `--muted-foreground` | Caption, metadata, copyright text |
| Border | `#222222` | `--border` | Subtle contrast border on cards & inputs |
| Ring / Focus | `#e78a53` | `--ring` | Accessibility focus ring |
| Radius | `0.75rem` (12px) | `--radius` | Modern rounded shape for cards & buttons |

**Theme Origin:** 21st.dev (`@serafimcloud/themes/amber-hearth`). Warm hearth embers on deep obsidian charcoal.

### Typography

- **Heading Font:** Outfit
- **Body Font:** Outfit (with Plus Jakarta Sans fallback)
- **Mood:** Contemporary, sleek, warm, precise, premium barbershop
- **Google Fonts:** [Outfit](https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap)

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
```

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | Subtle lift |
| `--shadow-md` | `0 4px 15px rgba(231,138,83,0.3)` | Primary Amber button glow |
| `--shadow-lg` | `0 10px 30px rgba(0,0,0,0.5)` | Cards, schedule table |
| `--shadow-xl` | `0 20px 50px rgba(0,0,0,0.8)` | Booking modal |

---

## Component Specs

### Buttons

```css
/* Primary Button (Amber Hearth CTA: "Booking Antrean") */
.btn-primary, .header-btn-wa, .btn-open-booking {
  background: #e78a53;
  color: #121113;
  font-family: 'Outfit', sans-serif;
  padding: 12px 24px;
  border-radius: 0.75rem;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(231, 138, 83, 0.35);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.btn-primary:hover, .header-btn-wa:hover, .btn-open-booking:hover {
  background: #f09a67;
  color: #121113;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(231, 138, 83, 0.45);
}

/* Secondary Button (Sage Steel) */
.btn-secondary {
  background: rgba(95, 135, 135, 0.12);
  color: #ffffff;
  border: 1.5px solid #5f8787;
  padding: 12px 24px;
  border-radius: 0.75rem;
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.btn-secondary:hover {
  background: #5f8787;
  color: #ffffff;
  box-shadow: 0 6px 20px rgba(95, 135, 135, 0.35);
  transform: translateY(-2px);
}
```

### Cards

```css
.card {
  background: #121212;
  border: 1px solid #222222;
  border-radius: 0.75rem;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  border-color: #e78a53;
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(231, 138, 83, 0.2);
}
```

### Inputs

```css
.input {
  background: #121212;
  border: 1px solid #222222;
  border-radius: 0.5rem;
  color: #ffffff;
  font-family: 'Outfit', sans-serif;
  padding: 10px 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input:focus {
  border-color: #e78a53;
  outline: none;
  box-shadow: 0 0 0 3px rgba(231, 138, 83, 0.25);
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
}

.modal {
  background: #121113;
  border: 1px solid #222222;
  border-radius: 0.75rem;
  padding: 32px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Minimalism & Swiss Style

**Keywords:** Clean, simple, spacious, functional, white space, high contrast, geometric, sans-serif, grid-based, essential

**Best For:** Enterprise apps, dashboards, documentation sites, SaaS platforms, professional tools

**Key Effects:** Subtle hover (200-250ms), smooth transitions, sharp shadows if any, clear type hierarchy, fast loading

### Page Pattern

**Pattern Name:** Hero + Features + CTA

- **Conversion Strategy:** Deep CTA placement. For CTA label text, verify at least 4.5:1 against the button fill; use 7:1 only when the product explicitly targets AAA normal-text contrast. Keep focus and component boundaries independently visible. Disable hero parallax under reduced motion and render its static final state.
- **CTA Placement:** Hero (sticky) + Bottom
- **Section Order:** Hero with headline/image > Value prop > Key features (3-5) > CTA section > Footer

---

## Anti-Patterns (Do NOT Use)


### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
