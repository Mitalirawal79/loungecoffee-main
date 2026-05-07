
## Coffee Brand — Animated Landing Site

A premium, single-page experience built around scroll + click-driven motion. Cinematic, warm coffee tones, smooth storytelling.

### Visual Direction
- **Mood**: Premium, warm, cinematic — think modern coffee brand ad
- **Palette**: Deep espresso `#1a0f0a`, cream `#f5e6d3`, caramel accent `#c89968`, gold highlight `#d4a574`
- **Typography**: Display serif (Playfair) for headlines + clean sans (Inter) for body
- **Motion language**: Smooth eases, parallax depth, fade+scale entrances, no jarring cuts

### Sections (in order)

**1. Cinematic Intro — Coffee Bean Crack**
- Full-screen dark backdrop, single coffee bean centered
- Bean cracks open on load (CSS clip-path + transform animation)
- Warm glow bursts from inside → wipes into hero
- Subtle "crack" sound (with mute toggle, autoplay-safe)
- Auto-transitions after ~2.5s

**2. Hero — Product Reveal**
- Coffee cups fade + scale in with staggered timing
- Large brand name with letter-by-letter reveal
- Tagline + steam particle effect
- Subtle parallax on scroll

**3. Product Carousel (auto-scrolling)**
- Coffee cups slide right→left in infinite loop
- Hover pauses animation
- Parallax background layers (beans drifting at different speeds)
- Click any product → opens detail view

**4. Interactive Product Detail (modal/overlay)**
- Clicked product zooms to center, background blurs
- Details slide in from right: Name, Flavor, Ingredients, Price, "Buy Now" CTA
- Close button returns to carousel

**5. Animated Stats**
- Count-up numbers on scroll-into-view: 150,000+ customers, 20+ flavors, 5★ rating
- Caramel accent dividers

**6. Story Section (per product)**
- Alternating layout: text slides from left, image from right (scroll-triggered)
- Bean origin 🌍, roast level 🔥, taste notes 🍫
- 2–3 product stories

**7. Footer**
- Brand mark, simple links, social icons

### Tech Approach
- React + Tailwind + Framer Motion for all entrances, scroll reveals, and the bean-crack sequence
- IntersectionObserver-based count-up for stats
- CSS keyframes for the looping carousel
- Mock product data (4–6 coffee SKUs) with placeholder coffee imagery — can swap in real assets later
- Fully responsive (mobile: stack carousel as swipeable, simplified bean intro)

### Out of scope (for v1)
- Real backend / cart / checkout (CTA is visual only)
- Three.js 3D bean (using high-quality 2D + CSS for performance and reliability)
- Real audio file (will use a short generated/silent-safe approach with mute control)

After approval, I'll build all sections with placeholder coffee imagery you can later replace.
