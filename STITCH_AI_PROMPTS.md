# Book Club — Stitch AI Prompts

Paste **STYLE** first in every prompt. If blurry, add: `pixel perfect, no smoothing, transparent background`.

## STYLE
```
16-bit retro pixel art mobile game. Crisp pixels, no anti-aliasing, no blur, no gradients. Colors: navy #1a1c2c, panel #333c57, pool #41a6f6, park #38b764, prison #5d275d, fire #ffcd75, danger #b13e53. Chunky 4px borders, hard 4px black shadow. SNES/GBA vibe. Portrait 390×844px. Pixel fonts. No rounded corners. Cute, readable.
```

## P0 — Generate first
**1. Club Main (full screen):** HUD header with pixel campfire, "Day 14", "Best: 30", countdown. POOL section: blue pool tiles, label POOL, 3 chibi chars (glasses+book, ninja hood, wizard). PARK section: green grass, trees, label PARK, cat+bookworm idle. PRISON section: stone bars, label PRISON, sad char + punishment bubble. Bottom gold button "ADD READING" with book icon.

**2–4. Scene strips (390×120px, tileable, no characters):** Pool=water,ladder,towels. Park=grass,trees,bench,clouds. Prison=stone bricks,bars,chain,torch.

**5–8. Characters Park pose (64×64, transparent):** Bookworm=glasses,messy hair,open book,green shirt. Ninja=dark hood,eyes only,scroll. Wizard=purple robe,hat,floating spell book. Cat=orange,sitting,tiny book in paws.

**9. Fire medium:** 32×32 sprite sheet, 6 frames horizontal, orange/gold campfire, transparent.

## P1
**Pool pose (64×64, all 4 chars):** relaxing in pool, head above water, splashes, happy.
**Prison pose (64×64, all 4 chars):** behind iron bars, sad, gripping bars.
**Fire tiers:** small 16×16×4f | large 32×32×8f blue core | mega 48×48×8f rainbow tips | dead=smoke+embers.
**Character Select screen:** title "CHOOSE YOUR READER", 2×2 character grid, gold border on selected, "CONFIRM" button, starry bg.

## P2 — Page mockups
**Landing:** bookshelf, campfire, "Read daily. Keep the streak alive.", gold "PRESS START".
**Dashboard:** "MY CLUBS", save-slot cards with flame+streak, "+ NEW CLUB".
**Check-in:** "ADD READING", dashed photo frame, camera icon, note field, gold "UPLOAD", "+1 READ" badge hint.
**Create Club:** inputs for name/book/timezone, punishment deck chips (Funny/Dare/Custom), "CREATE CLUB".
**Settings:** invite link, members, punishments, change character, red "LEAVE CLUB".
**Join:** parchment card "Invited to [Club]!", "JOIN CLUB" / "DECLINE".

## P3 — Icons (32×32, transparent)
Open book, retro camera, gold trophy, cute skull, chain, star, plus sign.
Button kit: gold CONFIRM, blue CANCEL, red LEAVE (200×48, chunky border).

## File names
`scene-pool/park/prison.png` · `char-1..4-park/pool/prison.png` · `fire-small/medium/large/mega/dead.png` · `icon-book/camera/trophy/skull.png`

## Tips
1. Club Main mockup = style reference for everything else.
2. Characters separate from scene backgrounds (we layer in code).
3. Minimal pack: main mockup + 3 scenes + 4 park chars + medium fire = 9 images.
