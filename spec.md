# Color Suit Me

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Home/landing screen with hero section, CTA button, "How It Works" steps, palette preview section
- Full-screen color checker: entire viewport filled with one solid color; swipe up = like, swipe down = dislike; tap Yes/No buttons as fallback
- Color database: 50+ curated soft/muted/pastel tones across warm, cool, neutral, and fashion categories, each with a name and hex code
- Color voting logic: track user votes per color and per color family (warm/cool/neutral/fashion)
- Smart color suggestion: after enough votes, bias toward color families the user has liked more
- Results screen: shown after 10+ color votes; displays 4-8 top liked colors with name, hex, season type guess (Spring/Summer/Autumn/Winter), color combo suggestions ("Wear it together")
- "Try more colors" button to continue swiping after results
- "Save my palette" button (exports color swatches as a shareable image / clipboard)
- Progress indicator (counter showing X colors checked so far)
- Season type detection: analyze liked colors to guess Autumn/Winter/Spring/Summer season
- "Wear it together" combos: show 2-3 color pairs from the user's liked colors
- Mobile-first portrait layout; no landscape support
- Smooth instant color transitions on swipe
- Touch swipe gesture support + button fallback

### Modify
N/A (new project)

### Remove
N/A (new project)

## Implementation Plan

### Backend (Motoko)
- Store color votes per anonymous session (using session key)
- Track which color families are liked/disliked
- Return smart next-color suggestions biased toward liked families
- Return results: top liked colors, season type, combo suggestions
- Persist user palette across sessions

### Frontend (React + TypeScript)
- **Landing page**: editorial layout, serif headline, CTA button, 3-step "How It Works", color swatch preview grid
- **Color checker page**: full-screen solid color background, color name + instruction overlay, swipe gesture handling (touch start/end), Yes/No pill buttons, progress counter
- **Results page**: color recommendation cards grid, season type badge, "Wear it together" combos, "Save palette" button, "Try more colors" CTA
- Color database: JS object with 50+ colors in category groups
- Local state: track votes in session, compute liked families, drive smart ordering
- Animations: smooth color transitions using CSS transitions
- Mobile-only: block landscape with overlay message
