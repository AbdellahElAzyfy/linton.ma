# LINTON: brand and site-family brief

## The group and the four sites
LINTON is one company group with four separate websites. Each site covers one business line, and all four share one brand.

| Site | Role |
|---|---|
| **linton.ma** | The group hub and parent site. It presents LINTON as a whole and sends visitors to the three specialised sites. |
| **linton-id.com** | Industrial identification and traceability: barcode, RFID, labelling and marking, material flow, and production and warehouse traceability. It also covers integration with ERP, WMS and MES, identification hardware, reconditioning and repair, and support and maintenance contracts. |
| **linton-cloud.com** | Development, Odoo and MS365. |
| **linton-media.com** | Cybersecurity and media. |

### Notes for linton.ma
- It is a hub. Keep it light and brand-led, with a short pitch for each business line and clear links out to the other three sites. Don't duplicate their detailed content.
- linton-id.com is already built and is the reference implementation for style and structure. It's a bilingual (FR/EN) Next.js 16 site with Payload CMS and MongoDB. Its default locale is French.
- Each specialised site adds a suffix to the LINTON wordmark. linton-id.com uses a smaller mint "/ID" after "LINTON" in the header logo. The other sites probably need their own equivalents, such as "/Cloud" and "/Media". This is an assumption, so confirm it.
- linton.ma most likely uses the plain wordmark with no suffix (also an assumption).

## Brand identity
- **Tone:** industrial and technical, precise and trustworthy. It reads as enterprise B2B, not playful.
- **Visual motifs:**
  - barcode and RFID scan-line animations
  - subtle grid-line texture on dark bands
  - a signal-bar icon
  - reveal-on-scroll animation
  - light 3D tilt and orbit rings on the hero visual

## Colors
| Token | Value | Use |
|---|---|---|
| Ink navy | `#000038` | Primary dark. Header, footer and inverted bands. |
| Ink soft | `#101064` | Secondary dark and gradients. |
| Mint | `#00ff91` | Primary accent: CTAs, highlights and the "/ID" suffix. |
| Cyan | `#00c9ff` | Secondary accent. |
| Paper | `#f8f8f8` | Light background. |
| Accent readable | `#00915a` | A darker mint for small text on light backgrounds. Raw mint is unreadable on white. In dark mode it switches to full mint. |

- **Dark theme:** the page background is `#05051d`, cards are `#0c0c30`, and inverted bands are `#000018`.
- **Borders:** `rgba(0,0,56,.14)` in light mode and `rgba(255,255,255,.12)` in dark mode.
- **Theming:** a light/dark toggle built on CSS variables on `:root` and `[data-theme="dark"]`. An inline script prevents the flash of the wrong theme.

## Typography
- **Display:** Barlow Condensed, for headings.
- **Body:** Manrope.
- **Mono:** IBM Plex Mono, for codes and labels.
- **Logo wordmark:** Poppins, embedded in the SVG.
- All are loaded through `next/font/google`.

## Shape and layout
- Rounded corners: 0.65rem, 1.25rem and 2rem for small, default and large.
- Cards carry their own 1px border, radius and background.
- Buttons are pill-style, with mint as the primary.
- Header and footer are always dark.
- The mega menu is an inset panel with a mint-tinted 1px border.

## Logo
- Transparent SVGs in light and mint colors that sit directly on dark backgrounds. Don't wrap them in a white badge.
- The header uses a compact LINTON-only wordmark, and the footer uses the full logo with icon and tagline.

## Working rules worth carrying over
- Check every layout change at all viewports: 1920, 1536, 1366, 1152, 1100, 976, 900, 736, 600, 414 and 320. Include the widths between the breakpoints (72rem, 61rem and 46rem).
- Use a Playwright sweep, and scroll the page before screenshotting so the reveal animations fire.
- Any content-list route backed by the CMS needs `dynamic = "force-dynamic"`, or edits won't show on production until the next deploy.
- The Next 16 setup differs from older versions. `proxy.js` replaces `middleware.js`, and `<Link>` no longer scrolls to the top on navigation. Read `node_modules/next/dist/docs/` before writing code.
