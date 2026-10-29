---
name: Academic Collegiate Standard
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
  on-surface-variant: '#44464f'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#757780'
  outline-variant: '#c5c6d0'
  surface-tint: '#495d8f'
  primary: '#001238'
  on-primary: '#ffffff'
  primary-container: '#0f2756'
  on-primary-container: '#7b8fc5'
  inverse-primary: '#b1c6fe'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fd'
  on-secondary-container: '#57657b'
  tertiary: '#000f42'
  on-tertiary: '#ffffff'
  tertiary-container: '#002071'
  on-tertiary-container: '#6989ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#b1c6fe'
  on-primary-fixed: '#001946'
  on-primary-fixed-variant: '#314576'
  secondary-fixed: '#d5e3fd'
  secondary-fixed-dim: '#b9c7e0'
  on-secondary-fixed: '#0d1c2f'
  on-secondary-fixed-variant: '#3a485c'
  tertiary-fixed: '#dce1ff'
  tertiary-fixed-dim: '#b7c4ff'
  on-tertiary-fixed: '#001551'
  on-tertiary-fixed-variant: '#0039b5'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: IBM Plex Serif
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: IBM Plex Serif
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: IBM Plex Serif
    fontSize: 1.375rem
    fontWeight: '600'
    lineHeight: 1.875rem
    letterSpacing: -0.01em
  headline-md:
    fontFamily: IBM Plex Serif
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.625rem
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
  code-tabular:
    fontFamily: IBM Plex Sans
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: 0.02em
  label-md:
    fontFamily: IBM Plex Sans
    fontSize: 0.8125rem
    fontWeight: '600'
    lineHeight: 1.125rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: IBM Plex Sans
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-compact: 0.75rem
  margin: 2rem
  margin-panel: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes an authoritative, distraction-free environment engineered specifically for university faculty, curriculum review committees, and heads of departments (HOD). The aesthetic balances archival institutional permanence with the density, precision, and agility of modern technical documentation tooling.

The interface prioritizes rigor over ornamentation. It blends the structural, typographic sobriety of editorial academic journals with high-density data controls typical of mission-critical enterprise systems. Visual noise is aggressively minimized: no ornamental gradients, no marketing imagery, and no decorative card elevations. The intended emotional response is institutional trust, meticulous administrative control, and intellectual focus during deep multi-hour specification workflows.

## Colors

The palette relies on high-contrast academic governance anchors paired with functional slate scales and unambiguous semantic validation states.

- **Primary Canvas & Surfaces:** The foundation relies on a cool, anti-glare institutional field (`#F8FAFC`), supported by section fills (`#F1F5F9`) and pure-white active work surfaces (`#FFFFFF`).
- **Primary Navy (`#0F2756`):** Reserved for institutional framing, persistent primary navigation items, authoritative actions, active stepper indicators, and high-level role controls.
- **Secondary & Tertiary Slates:** Slate Navy (`#334155`) handles secondary actions and group headings, while Interactive Cobalt (`#1D4ED8`) is leveraged for inline references, active table filters, and focused hyperlinks.
- **Neutral Boundaries & Typography:** Text uses deep charcoal slate (`#0F172A`) for primary legibility, muted slate (`#64748B`) for structural metadata, and border gray (`#E2E8F0`) for structural divisions.
- **Academic Status Signals:**
  - *Valid / Accredited:* `#15803D` text on `#DCFCE7` background.
  - *Pending / Committee Review:* `#B45309` text on `#FEF3C7` background.
  - *Violation / Non-Compliant:* `#B91C1C` text on `#FEE2E2` background.
  - *Informational / Guideline:* `#1D4ED8` text on `#DBEAFE` background.

## Typography

The typographic hierarchy pairs the institutional weight of `IBM Plex Serif` with the structured legibility of `IBM Plex Sans`.

- **IBM Plex Serif:** Used deliberately for document titles, major section divisions, course module titles, and official accreditation headings. It injects legal and institutional gravitas into official records.
- **IBM Plex Sans:** Deployed across interactive form controls, body prose, workflow instructions, syllabus matrices, and table bodies.
- **Tabular Numerics:** All course codes (e.g., `CS-401`), credit allocations (`L-T-P-C`), matrix coefficients, and academic term values must enforce tabular figures (`font-variant-numeric: tabular-nums`) to preserve absolute vertical column alignment across nested matrices.
- **Micro-Labels & Meta:** Micro-labels utilize uppercase rendering with expanded letter-spacing for accreditation badges, department indicators, and outcome flags (e.g., `CO-1`, `PO-4`).

## Layout & Spacing

The layout is built for complex, multi-pane academic drafting on desktop viewports (1366px and above).

- **Grid Architecture:** A structured multi-panel shell comprising:
  1. A persistent 240px utility sidebar containing the stage stepper and institutional context.
  2. A flexible main canvas pinned between 960px and 1200px for specification forms and matrix sheets.
  3. An optional 320px persistent review and compliance checklist drawer on the right.
- **Rhythm & Padding:** Form controls and data cells use a disciplined 8px base rhythm. Inputs and table cells maintain an 8px vertical padding (`space-sm`) and 12px horizontal padding to support dense data entry without visual collision.
- **Panels & Dividers:** Logical sections inside course specifications (e.g., Syllabus Outline, Assessment Weightage, Outcome Mapping) are separated by `space-xl` (2rem) and demarcated by 1px hairline borders (`#E2E8F0`).

## Elevation & Depth

This system avoids expressive layers, deep drops, or blurring. Depth is maintained through crisp hairline borders and minimal surface separation:

- **Base Layer (Level 0):** Background canvas (`#F8FAFC`). No shadow.
- **Card & Panel Layer (Level 1):** Main document container (`#FFFFFF`) with a 1px solid perimeter border (`#E2E8F0`) and an ambient, low-contrast floor shadow: `0 1px 2px 0 rgba(15, 23, 42, 0.04)`.
- **Floating Controls & Menus (Level 2):** Role switcher dropdowns, filter menus, and action drawers leverage a crisp outline (`#CBD5E1`) and a contained elevation: `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Sticky Table Headers:** Persist at a flat elevation with a bottom border of 2px solid `#CBD5E1` against a pure `#F8FAFC` background.

## Shapes

The design language uses conservative, structured geometries (Soft: `0.25rem` / `4px` base radius). 

- **Interactive Controls:** Form inputs, action buttons, table cells, and tabs enforce an exact `0.25rem` radius. Pill shapes and circular UI elements are strictly avoided to maintain an official documentation aesthetic.
- **Panels & Overlays:** Cards, document containers, and compliance banners use `0.5rem` (`rounded-lg`) to soften the overall viewport frame while keeping line discipline tight.
- **Badges & Micro-tags:** Accreditation chips and course classification labels use a subtle `0.25rem` radius to match input metrics.

## Components

### Buttons
- **Primary:** Deep navy background (`#0F2756`), crisp white text (`#FFFFFF`), `0.25rem` radius, 8px 16px padding. Active hover: `#1E3A8A`.
- **Secondary:** White background (`#FFFFFF`), 1px solid border (`#CBD5E1`), dark slate text (`#0F172A`). Hover: `#F1F5F9`.
- **Danger (Rejection / Deprecation):** Background `#FFFFFF`, 1px solid `#B91C1C`, text `#B91C1C`. Hover: `#FEE2E2`.

### Inputs & Selectors
- **Text Inputs & Dropdowns:** 1px solid `#CBD5E1`, background `#FFFFFF`, text `#0F172A`, placeholder `#94A3B8`. Focus state applies a 1px solid outline `#0F2756` with a zero-offset box-shadow ring: `0 0 0 1px #0F2756`.
- **Role Switcher (Author / Reviewer / HOD):** Segmented horizontal control encapsulated in a `#F1F5F9` tray. Active role container is pure white (`#FFFFFF`) with a `0.25rem` radius, subtle 1px border (`#E2E8F0`), and primary navy text with semibold weight.

### Data Tables & CO-PO-PSO Matrix Sheets
- **Layout:** Sticky header with `#F8FAFC` fill, uppercase micro-labels (`label-sm`), and a bottom division line (`#CBD5E1`).
- **Data Cells:** 8px vertical padding, strict tabular numerical figures (`code-tabular`), 1px bottom border (`#F1F5F9`). Alternating row striping is omitted; active row on hover transitions to `#F8FAFC`.
- **Matrix Inputs:** Miniaturized numeric selectors (values 0-3 for correlation levels) centered inside 36x36px cells with distinct grid dividers.

### Stepper Navigation Sidebar
- Vertical line guide (`#E2E8F0`) connecting step nodes.
- **Active Step:** Filled `#0F2756` circle indicator with white interior numeral, bold step title.
- **Completed Step:** `#15803D` filled node with checked glyph.
- **Pending Step:** White node with `#CBD5E1` border and muted slate text (`#64748B`).

### Status Banners & Chips
- **Chips:** `0.25rem` radius, 2px 8px padding, strict uppercase typography (`label-sm`). Rendered in matching semantic text/background tokens (e.g., `#DCFCE7` background with `#15803D` text).
- **Review Status Banners:** Full-width header panel across the course specification view with a 4px solid left accent border indicating approval stage (Draft, In-Review, HOD Approved, Board of Studies Locked).