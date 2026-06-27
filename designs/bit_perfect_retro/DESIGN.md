---
name: Bit-Perfect Retro
colors:
  surface: '#08122b'
  surface-dim: '#08122b'
  surface-bright: '#2f3853'
  surface-container-lowest: '#040d26'
  surface-container-low: '#111b34'
  surface-container: '#151f38'
  surface-container-high: '#202943'
  surface-container-highest: '#2b344e'
  on-surface: '#dae1ff'
  on-surface-variant: '#bfc7d3'
  inverse-surface: '#dae1ff'
  inverse-on-surface: '#26304a'
  outline: '#89919c'
  outline-variant: '#3f4751'
  surface-tint: '#99cbff'
  primary: '#99cbff'
  on-primary: '#003354'
  primary-container: '#41a6f6'
  on-primary-container: '#00395e'
  inverse-primary: '#00629d'
  secondary: '#63de86'
  on-secondary: '#003918'
  secondary-container: '#1fa655'
  on-secondary-container: '#003113'
  tertiary: '#f0bf69'
  on-tertiary: '#422c00'
  tertiary-container: '#c59947'
  on-tertiary-container: '#4a3300'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#cfe5ff'
  primary-fixed-dim: '#99cbff'
  on-primary-fixed: '#001d33'
  on-primary-fixed-variant: '#004a78'
  secondary-fixed: '#80fba0'
  secondary-fixed-dim: '#63de86'
  on-secondary-fixed: '#00210b'
  on-secondary-fixed-variant: '#005225'
  tertiary-fixed: '#ffdea9'
  tertiary-fixed-dim: '#f0bf69'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5e4100'
  background: '#08122b'
  on-background: '#dae1ff'
  surface-variant: '#2b344e'
typography:
  headline-lg:
    fontFamily: Space Mono
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: 1px
  headline-lg-mobile:
    fontFamily: Space Mono
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  headline-md:
    fontFamily: Space Mono
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  body-lg:
    fontFamily: Courier Prime
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Courier Prime
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
  label-sm:
    fontFamily: Space Mono
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin: 16px
---

## Brand & Style
The brand personality is nostalgic, energetic, and highly structural, drawing direct inspiration from the 16-bit era of home consoles (SNES/GBA). The design system employs a **Retro/Brutalist** hybrid style characterized by crisp, non-aliased edges and a strict adherence to a 4px "logical pixel" grid. 

The emotional response should be one of "playable" delight—every element should feel like a tactile button or a physical sprite within a game world. There are no gradients, no blurs, and no soft transitions. Every visual change is binary and immediate.

## Colors
The palette is limited and high-contrast to ensure readability against dark backgrounds. 
- **Navy (#1a1c2c):** The primary canvas and background.
- **Panel (#333c57):** Used for containers and secondary surfaces.
- **Pool (#41a6f6):** The primary action color for links and active states.
- **Park (#38b764):** Success states and positive progress indicators.
- **Fire (#ffcd75):** Highlights and cautionary warnings.
- **Danger (#b13e53):** Errors and critical HP/health indicators.
- **Prison (#5d275d):** Decorative accents or disabled states.

All colors must be applied as solid fills. Do not use opacity or alpha-blending for color mixing.

## Typography
Typography utilizes monospaced fonts to simulate the fixed-width character maps of 16-bit hardware. **Space Mono** provides a technical, chunky feel for headers, while **Courier Prime** offers high legibility for longer descriptions.

**Implementation Rules:**
- Disable font-smoothing (`-webkit-font-smoothing: none;`).
- Always use integer font sizes to prevent sub-pixel rendering.
- All headers should be in uppercase to maximize the "blocky" aesthetic.
- Avoid tracking/letter-spacing for body text; only use it for decorative labels.

## Layout & Spacing
This design system uses a strict 4px grid (the "Logical Pixel"). Every margin, padding, and alignment must be a multiple of 4px. 

- **Layout Model:** A fluid grid for mobile that relies on safe margins and rigid panels.
- **Breakpoints:** 
    - Mobile: Up to 480px.
    - Tablet: 481px to 768px.
- **Reflow:** Elements do not stretch smoothly; they jump in 4px increments or remain centered within panels. 
- Panels should have a consistent internal padding of `md` (16px).

## Elevation & Depth
Depth is created through **Hard Shadows** and **Bold Outlines** rather than lighting or blurs.

- **Outlines:** Every interactive element and container must have a solid 4px border. Use `#000000` for primary borders or a darker shade of the background for subtle separation.
- **Shadows:** Use a "Drop Shadow" offset by exactly 4px down and 4px right. This shadow must be a solid block of color (usually `#000000`) with 100% opacity.
- **Stacking:** Higher elevation is represented by increasing the border thickness or adding an "inner highlight" (a 4px line of a lighter color on the top and left internal edges of a box).

## Shapes
The shape language is strictly **Sharp**. There are no exceptions for rounded corners. Every corner must be a 90-degree angle. 

To create a "pixel-rounded" effect, you may manually step the corners using 4px squares, but standard CSS `border-radius` is prohibited. Buttons and panels are blocks, reinforcing the rigid, grid-based nature of the game world.

## Components

### Buttons
- **Base:** 4px black border, solid background color (Pool or Park).
- **Shadow:** 4px solid black shadow offset bottom-right.
- **Interaction:** On hover, the shadow disappears and the button moves 4px down and 4px right (the "pressed" look).

### Chips & Tags
- Smaller versions of buttons but with 2px borders and no shadows.
- Text must be `label-sm` and uppercase.

### Cards & Panels
- Background: `#333c57` (Panel).
- Border: 4px solid `#000000`.
- Outer Shadow: 8px solid `#000000` (for heavy emphasis) or 4px for standard.

### Input Fields
- Background: `#1a1c2c` (Navy).
- Border: 4px solid `#333c57`.
- Cursor: A solid, non-blinking 4px x 16px block of `#ffcd75`.

### Progress Bars
- Container: 4px black border, navy background.
- Fill: Solid block of `#38b764` (Park). The fill must increase in 4px steps to avoid partial pixel rendering.

### Lists
- Items separated by a 4px solid line of `#1a1c2c`.
- Selection indicated by a 4px "arrow" icon (a 3x3 pixel sprite) to the left of the text.