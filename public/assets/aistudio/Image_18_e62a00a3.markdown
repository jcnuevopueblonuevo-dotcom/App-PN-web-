---
name: Junta Comunal de Pueblo Nuevo
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#444651'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4059aa'
  primary: '#00236f'
  on-primary: '#ffffff'
  primary-container: '#1e3a8a'
  on-primary-container: '#90a8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#1d4ed8'
  on-secondary: '#ffffff'
  secondary-container: '#4069f2'
  on-secondary-container: '#fffbff'
  tertiary: '#372800'
  on-tertiary: '#ffffff'
  tertiary-container: '#523d00'
  on-tertiary-container: '#d7a400'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#264191'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#b7c4ff'
  on-secondary-fixed: '#001551'
  on-secondary-fixed-variant: '#0039b5'
  tertiary-fixed: '#ffdf9a'
  tertiary-fixed-dim: '#f7be1d'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#5a4300'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-bold:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

The design system establishes a modern, accessible, and institutional civic interface tailored for the residents and administrators of Pueblo Nuevo, Panamá. The design movement blends **Corporate/Modern Civic Design** with approachable humanist accessibility: clean structured white cards, high-contrast slate ink typography, and dependable geometric framing that conveys municipal credibility while remaining instantly legible across age groups and digital literacy levels.

The emotional signature is open, reliable, and proactive. Rather than feeling bureaucratic or archaic, the visual tone conveys responsive local governance, clear community status tracking, and straightforward civic participation. Whitespace is generous, tactile touch targets are spacious, and color cues are unambiguous.

## Colors

The palette is engineered around civic trust, legibility, and high-visibility status states. 

- **Primary (`#1e3a8a` - Institutional Navy)**: The core institutional tone, applied to global headers, key navigation anchors, and primary municipal commitments.
- **Secondary (`#1d4ed8` - Vibrant Royal Blue)**: Interactive states, primary action hovers, links, focus rings, and active navigation indicators.
- **Tertiary (`#eab308` - Sunny Civic Gold)**: A vibrant civic accent used for prominent citizen action triggers (e.g., *Reportar Incidencia*), highlight badges, and community announcements.
- **Neutral (`#0f172a` - Deep Slate Ink)**: The primary typographic anchor, providing WCAG AAA level contrast against pure white and light slate canvases.

### Functional Status Roles (Municipal Incident Workflow)
- **Pendiente (Pending Review)**: Background `#fef3c7`, text `#92400e`, indicator dot `#f59e0b`. Warm amber signal denoting intake awaiting triage.
- **En Proceso (In Progress / Dispatched)**: Background `#dbeafe`, text `#1e40af`, indicator dot `#2563eb`. Clear civic azure signifying municipal crew engagement.
- **Resuelto (Resolved)**: Background `#dcfce7`, text `#166534`, indicator dot `#16a34a`. Crisp civic emerald confirming completed community action.
- **Alerta / Urgente (Error & Alerts)**: Background `#fee2e2`, text `#991b1b`, indicator dot `#dc2626`.

## Typography

The typographic hierarchy couples **Plus Jakarta Sans** for headlines and structural titling with **Inter** for running copy, form inputs, and status labels.

- **Plus Jakarta Sans** gives page titles, portal hero banners, and incident categories an approachable, geometric presence that remains dignified and authoritative.
- **Inter** handles data tables, incident descriptions, form labels, and timestamps with maximum legibility across lower-resolution mobile screens and varying ambient daylight conditions.
- **Status badging** uses uppercase micro-tracking (`label-caps`, `0.05em`) to ensure instant differentiation between "PENDIENTE", "EN PROCESO", and "RESUELTO" at a glance.

## Layout & Spacing

The layout model is based on an adaptive fluid grid centered within a maximum width of `1200px` for desktop portals:

- **Desktop (1024px and wider)**: 12-column grid with `1.5rem` (24px) gutters and `2rem` (32px) outer margins.
- **Tablet (768px – 1023px)**: 8-column grid with `1rem` (16px) gutters and `1.5rem` (24px) margins.
- **Mobile (< 768px)**: 4-column single-column stack with `1rem` (16px) gutters and `1rem` (16px) margins.

All spacing follows an 8-point base module (with 4px for fine-grained alignment). Component interior padding enforces generous separation: cards utilize `space-lg` (24px) on desktop and `space-md` (16px) on mobile. Section gaps use `space-2xl` (48px) to visually delineate administrative notices, service links, and incident dashboards.

## Elevation & Depth

Visual hierarchy uses **tonal layer elevation** supported by **subtle ambient shadows** and **crisp 1px hairline borders**:

- **Ground Canvas (`#f8fafc`)**: Neutral slate wash creating contrast behind elevated pure white cards.
- **Surface Level 1 (`#ffffff`)**: Default card and modal background, paired with a 1px border (`#e2e8f0`) and an ambient shadow (`box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)`).
- **Surface Level 2 (Hover / Active Cards)**: Elevated state (`box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.04)`) with smooth `150ms ease` transition.
- **Top Municipal Navigation Bar**: Grounded solid Institutional Navy (`#1e3a8a`) surface with no drop shadow, maintaining a clean architectural break against the light viewport.
- **Overlays & Modals**: Pure white surface layered over a deep slate scrim (`rgba(15, 23, 42, 0.5)` with `backdrop-filter: blur(4px)`).

## Shapes

The design system adopts a balanced **Rounded (`2`)** shape language:

- **Standard Elements (inputs, buttons, cards)**: `0.5rem` (8px) radius, conveying modern structure without feeling toy-like.
- **Larger Modular Containers & Modals (`rounded-lg`)**: `1rem` (16px) radius for soft, contained boundaries.
- **Status Pills, Search Chips, and Floating Action Buttons (`rounded-full`)**: Maximum pill geometry (`9999px`) to create an immediate visual contrast against rectangular cards.

## Components

### Buttons
- **Primary Civic Action**: Institutional Navy (`#1e3a8a`) background, pure white text, `0.5rem` radius, minimum `44px` height (`12px 24px` padding). Transitions to `#1d4ed8` on hover.
- **Highlight Action ("Reportar Incidencia")**: Sunny Civic Gold (`#eab308`) background with Deep Slate text (`#0f172a`), font-weight `700`. Designed for high visibility in headers and hero sections.
- **Secondary / Outline**: 1.5px border in `#cbd5e1`, background `#ffffff`, text `#1e3a8a`. Hovers to `#dbeafe` with `#1d4ed8` text.
- **Destructive**: Error red `#dc2626` background with white text, reserved for report cancellations or administrative dismissals.

### Incident Status Badges (Pills)
- Rendered as full pills (`9999px` radius) with `4px 12px` padding, uppercase `12px` bold text (`label-caps`), and a `6px` solid status circle preceding the text:
  - **Pendiente**: Background `#fef3c7`, text `#92400e`, dot `#f59e0b`.
  - **En Proceso**: Background `#dbeafe`, text `#1e40af`, dot `#2563eb`.
  - **Resuelto**: Background `#dcfce7`, text `#166534`, dot `#16a34a`.

### Cards & Incident Feed Items
- Constructed with `#ffffff` fill, `1px solid #e2e8f0`, `0.75rem` radius, and `16px`–`24px` padding.
- **Layout pattern**: Header row includes category icon + location tag on the left, status badge on the right. Content area displays title (`title-sm`), submission timestamp (`body-sm` `#64748b`), and truncated description. An optional bottom bar shows municipal update notes.

### Form Inputs & Selects
- Pure white background, `1.5px solid #cbd5e1`, `0.5rem` radius, minimum `44px` touch height.
- **Labels**: Always top-aligned in `body-bold` (`14px` or `16px`), `#0f172a`.
- **Focus State**: `2px solid #1d4ed8` border accompanied by an accessible `3px` focus ring (`rgba(29, 78, 216, 0.2)`).
- **Error State**: `2px solid #dc2626` with red helper text and an error indicator icon.

### Filter Chips
- Selectable pill chips for filtering incident lists (e.g., *Todos*, *Calles*, *Luminarias*, *Aseo Urbano*).
- Default: `#f1f5f9` fill, `#475569` text.
- Selected: `#1e3a8a` fill, `#ffffff` text, font-weight `600`.

### Municipal Header & Bottom Bar
- **Desktop Header**: Institutional Navy (`#1e3a8a`) bar containing the Junta Comunal crest/text on the left, navigation links with gold hover highlights in the center, and the gold "Reportar Incidencia" CTA button on the right.
- **Mobile Bottom Navigation**: Fixed bottom navigation bar with `48px` tap targets for `Inicio`, `Mis Reportes`, `Servicios`, and `Perfil`.