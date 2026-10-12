import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf-8');
const mongoUriMatch = envFile.match(/MONGODB_URI=(.*)/);
const mongoDbMatch = envFile.match(/MONGODB_DB=(.*)/);
const MONGODB_URI = mongoUriMatch ? mongoUriMatch[1].trim().replace(/^"|"$/g, '') : null;
const MONGODB_DB = mongoDbMatch ? mongoDbMatch[1].trim().replace(/^"|"$/g, '') : null;

import { MongoClient } from 'mongodb';

const GALLERY_IMAGES = [
    { id: "gal_1", url: "/hotel-img/hero-grand-exterior.jpg", label: "Grand Entrance", order: 0 },
    { id: "gal_2", url: "/hotel-img/lobby-grand-chandelier.jpg", label: "Grand Lobby", order: 1 },
    { id: "gal_3", url: "/hotel-img/royal-suite-master.jpg", label: "Royal Suite", order: 2 },
    { id: "gal_4", url: "/hotel-img/deluxe-king-room.jpg", label: "Deluxe King Room", order: 3 },
    { id: "gal_5", url: "/hotel-img/twin-standard-room.jpg", label: "Twin Standard Room", order: 4 },
    { id: "gal_6", url: "/hotel-img/rooftop-infinity-pool.jpg", label: "Infinity Pool", order: 5 },
    { id: "gal_7", url: "/hotel-img/poolside-deck-sunbeds.jpg", label: "Poolside Deck", order: 6 },
    { id: "gal_8", url: "/hotel-img/restaurant-fine-dining.jpg", label: "Fine Dining Restaurant", order: 7 },
    { id: "gal_9", url: "/hotel-img/restaurant-ambience.jpg", label: "Gourmet Buffet", order: 8 },
    { id: "gal_10", url: "/hotel-img/bar-cocktail-lounge.jpg", label: "Cocktail Lounge", order: 9 },
    { id: "gal_11", url: "/hotel-img/breakfast-buffet-spread.jpg", label: "Breakfast Spread", order: 10 },
    { id: "gal_12", url: "/hotel-img/spa-wellness-sanctuary.jpg", label: "Luxury Spa", order: 11 },
    { id: "gal_13", url: "/hotel-img/spa-ayurvedic-massage.jpg", label: "Spa Therapies", order: 12 },
    { id: "gal_14", url: "/hotel-img/hotel-facade-palace.jpg", label: "Palace Architecture", order: 13 },
    { id: "gal_15", url: "/hotel-img/hotel-exterior-night.jpg", label: "Night Illumination", order: 14 },
    { id: "gal_16", url: "/hotel-img/banquet-wedding-hall.jpg", label: "Banquet & Events", order: 15 },
    { id: "gal_17", url: "/hotel-img/conference-meeting-room.jpg", label: "Conference Room", order: 16 },
    { id: "gal_18", url: "/hotel-img/fitness-gym-center.jpg", label: "Fitness Center", order: 17 },
    { id: "gal_19", url: "/hotel-img/rooftop-sky-terrace.jpg", label: "Sky Terrace", order: 18 },
    { id: "gal_20", url: "/hotel-img/garden-courtyard-outdoor.jpg", label: "Garden Courtyard", order: 19 },
];

(async () => {
    if (!MONGODB_URI) { console.log("No MONGODB_URI"); return; }
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(MONGODB_DB);

    // Seed gallery
    const existingGallery = await db.collection("gallery").countDocuments();
    if (existingGallery === 0) {
        const now = new Date().toISOString();
        const docs = GALLERY_IMAGES.map(img => ({ ...img, createdAt: now }));
        await db.collection("gallery").insertMany(docs);
        console.log(`✅ Seeded ${docs.length} gallery images`);
    } else {
        console.log(`Gallery already has ${existingGallery} images, skipping seed.`);
    }

    await client.close();
    console.log("Done!");
})();
