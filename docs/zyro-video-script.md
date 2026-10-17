# Zyro Rebuild: Video Script & Before/After

17 October 2026

## The video at a glance

A 2-minute screen-recorded story, told in first person: you stumble on Zyro, open zyroindia.com, think "what if I built this my way", and reveal the rebuild. Cut a 60-second vertical version from the same footage for Reels and Shorts.

| | Main cut | Short cut |
| --- | --- | --- |
| Length | 1:50 to 2:10 | 55 to 60 s |
| Format | 16:9, 1920 × 1080 | 9:16, 1080 × 1920 |
| Where | YouTube, LinkedIn | Instagram Reels, YouTube Shorts |
| Scenes used | All 9 | 1, 2, 4, 6, 7, 9 |

Story arc, in four beats:

1. **The hook.** Everyone knows Karan Aujla, but not his drink. You landed on its site while scrolling.
2. **The itch.** The site is good and does its job, but it doesn't tell the brand's story.
3. **The rebuild.** "What if I built it my way?" Quick glimpses of the process: the 3D can, the labels.
4. **The reveal.** One continuous scroll through the new site, then a side-by-side.

Tone: casual, curious, a little cocky in the reveal. Respectful of the original. You're showing a different take, not mocking someone else's work.

## Script

Nine scenes, about 2:10 in total. Voiceover is written to be read at a relaxed pace; trim words, not pauses.

| # | Time | Voiceover | On screen (what to record) |
| --- | --- | --- | --- |
| 1 | 0:00–0:05 | "Everyone knows Karan Aujla. But do you guys know about his drink?" | Hook: a Karan Aujla concert clip or photo, then a quick flash of a Zyro can. |
| 2 | 0:05–0:15 | "It's called Zyro. Zero sugar, zero calories. I recently landed on their website while scrolling." | Browser: a search for "zyro", zyroindia.com loading. |
| 3 | 0:15–0:35 | "And honestly, the site is good. Banners, a product carousel, add to cart, it does the job. But on the about page Karan wrote: 'what you remove matters more than what you add.' And the site never really shows that." | Slow scroll of the old homepage: slider, product cards, footer. Cut to the about page and hold on that line. |
| 4 | 0:35–0:45 | "Four product lines, ten flavours, a founder who makes music. That's a story. So I thought: what if I built this my way?" | Freeze the old site, dim it, type the line on screen: "What if I built it my way?" |
| 5 | 0:45–1:05 | "I started with a 3D model of the can. Every flavour gets its own label, redrawn from the real packs. Hydrate+ comes in a bottle, so the can morphs into one." | Process: the can model turning, the label artwork, the can-to-bottle morph. |
| 6 | 1:05–1:35 | "Nothing. Unnecessary." Then let the music carry it. | One continuous scroll of the new site: hero, the bubbles getting popped, the founder letter, each range chapter as the flavours pour. |
| 7 | 1:35–1:50 | "Drag the can to spin it. Click to crack it open." | Close-ups: dragging the can, the hero flavour arrows, the footer can opening. Keep the opening sound in the mix. |
| 8 | 1:50–2:00 | "Same brand. Same products. Same words. Just told as a story." | Split screen, old left and new right: hero, then the product range. |
| 9 | 2:00–2:10 | "Would you drink it? Tell me which flavour you'd crack open first." | Footer "Crack one open", the can opening, your handle on screen. |

The short cut keeps scenes 1, 2, 4, 6, 7 and 9. Merge scenes 1 and 2 into one line ("Everyone knows Karan Aujla. But do you know his drink, Zyro? I landed on their site…") and land it by 0:04.

## Before vs after

The original is a solid Shopify store that sells well; the rebuild turns the same content into a story you scroll through. Every word, price and product in the rebuild comes from zyroindia.com.

| Area | zyroindia.com (original) | The rebuild | What it solves |
| --- | --- | --- | --- |
| First impression | Rotating campaign banners in a slider | The can rises into place in front of a huge "Nothing Unnecessary." | The brand idea lands in the first second, not after a click |
| Brand philosophy | "What you remove matters more…" lives on the About page and in small footer text | Its own section, second on the page; you pop the "extras" (sugar, noise, guilt) like bubbles | The core idea becomes something you do, not something you might find |
| Founder | Karan's letter sits on a separate page as plain text | The letter on the main scroll, lighting up word by word, beside his illustration | The founder story is part of the journey |
| Product range | 10 products in one carousel; the four lines are only menu labels | Each line gets a chapter: tagline, specs, flavour picker | You understand Energy Pop vs Hydrate+ vs Indie Pop vs Skinny Pop at a glance |
| Product visuals | Flat photos and banners | One 3D can wearing every flavour's label, front and back | The product is the hero, in your hands |
| Hydrate+ | Shown like the cans, in the same carousel | The can morphs into the 400 ml bottle | The format difference is shown, not explained |
| Interaction | Scroll and "Add to cart" | Drag to spin, click to open with sound and gas, flavours pour onto the can | Playful, and on-brand for a fizzy drink |
| Typography | The theme's default font (Assistant) | Barlow Condensed and Instrument Serif, matched to the cans and campaign art | The site looks like the packaging |
| Colour | A different colour per banner | Brand colours only: near-black, cream, Zyro red, wine | One consistent brand from top to bottom |
| "Zero" claims | A small "Zero sugar, zero calories" strip | A campaign-style section where the counters spin and land on 0 | The headline claim is the most memorable moment |
| Community | A photo grid | Tour cities in a moving marquee, concert photos, an Instagram call to action | Connects the drink to the music |
| Accessibility | Not audited | Contrast-checked reds, keyboard focus outlines, skip link, reduced-motion respected | Usable by more people |

**Where the original still wins:** it's a full store, with cart, checkout and UPI payments. The rebuild is a brand experience that sends you to zyroindia.com's product pages to buy. Say this in the video. It keeps the comparison fair and makes the rebuild look more credible, not less.

## Recording checklist

Record both sites at 1920 × 1080, 60 fps, browser full screen with the bookmarks bar hidden. Record the new site from a production build (`npm run build` then `npm start`) so the dev "N" badge in the corner doesn't show.

Original site (zyroindia.com):

- [ ] Homepage, slow continuous scroll top to bottom (scene 3)
- [ ] About page, holding on Karan's line "what you remove matters more than what you add" (scene 3)
- [ ] Homepage hero and product carousel, for the split screen (scene 8)

The rebuild (localhost):

- [ ] Hero intro: reload the page and catch the loader counting down and the can rising (scene 1)
- [ ] One continuous scroll, top to bottom, at an even pace (scene 6); do 3 takes and keep the smoothest
- [ ] Popping 2 or 3 bubbles in the philosophy section (scene 6)
- [ ] Energy Pop to Hydrate+ to Indie Pop, showing the can morph into the bottle and back (scenes 5 and 6)
- [ ] Dragging the can, and the hero flavour arrows (scene 7)
- [ ] The footer can opening, with system audio recorded for the sound (scenes 7 and 9)
- [ ] Hero and range sections, for the split screen (scene 8)
- [ ] A 390 px wide mobile scroll, if you want a phone shot in the short cut

Process shots (scene 5):

- [ ] The can model turning in a 3D viewer or Blender
- [ ] The label artwork, flat, for a quick reveal

Edit notes:

- Keep the old-site footage slightly desaturated and the new site at full colour; it reinforces before/after without saying it.
- Use the can-opening sound as the cut into the reveal (scene 5 to 6).
- Add captions throughout; most people watch without sound.

## Titles, captions and on-screen text

Pick one title and one caption; the on-screen lines map to scenes in the script.

Titles:

- I redesigned Karan Aujla's drink website
- Zyro's website, rebuilt my way
- What if this drink brand had a website like this?

Caption (Reels / Shorts):

> Everyone knows Karan Aujla, but do you know his drink? I landed on Zyro's site and thought: what if I built it my way? Same products, same words, told as a story. Which flavour are you cracking open first?

On-screen text:

| Scene | Text |
| --- | --- |
| 1 | Everyone knows Karan Aujla… but his drink? |
| 4 | What if I built it my way? |
| 6 | Nothing unnecessary. |
| 8 | Before / After |
| 9 | Which flavour first? |

Credit line for the description: "Unofficial concept. Zyro and all product names, artwork and copy belong to VRB Consumer Products Pvt. Ltd. Built for portfolio purposes."
