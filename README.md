# Wildy Dots

Cinematic wildlife photography site (Next.js App Router, Tailwind, Framer Motion, Lenis).

```
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Updating photos
All source material lives in `../Wildy Dots/`. After adding or changing photos there run:

```
node scripts/build-assets.js
```

This converts everything to optimised WebP in `public/img/` and regenerates `data/manifest.json`.
Category names/slugs/folder mapping are at the top of `scripts/build-assets.js`; prices, copy and navigation are in `lib/data.ts`.

## Notes
- The contact form hands the enquiry to WhatsApp (+94 77 7121446). Swap in an API route / email service when ready.
- The footer year is fixed (Cache Components disallows `new Date()` during prerender).

## Field map
The home page map (components/FieldMap.tsx) uses Leaflet with OpenStreetMap tiles (no API key). OSM's tile policy is for light use; for a high-traffic launch swap the tile URL for a hosted provider (MapTiler, Stadia Maps, Mapbox). Destinations and their notes are the SPOTS array at the top of that file.
