import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";

const DEFAULT_SETTINGS = {
    name: "Hotel Grand Eagle",
    shortDescription: "Comfortable value-for-money hotel in Sitapura, Jaipur.",
    address: "Commercial Complex, C-50, near JECC, Sanganer, Sitapura Industrial Area, Sitapura, Jaipur, Rajasthan 302022",
    city: "Jaipur",
    country: "India",
    contactNumber: "063678 50548",
    phone: "063678 50548",
    email: "reservations@hotelgrandeagle.com",
    checkInTime: "15:00",
    checkOutTime: "12:00",
    starRating: 3,
    logoUrl: "/logo.png",
    gstNumber: "",
    website: "https://hotelgrandeagle.in",
    bankDetails: "",
};

export async function GET() {
    try {
        const db = await getDatabase();
        const doc = await db.collection("hotel_settings").findOne({});
        if (!doc) return NextResponse.json(DEFAULT_SETTINGS);
        const { _id, ...rest } = doc;
        return NextResponse.json(rest);
    } catch {
        return NextResponse.json(DEFAULT_SETTINGS);
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const db = await getDatabase();
        await db.collection("hotel_settings").updateOne(
            {},
            { $set: { ...body, updatedAt: new Date().toISOString() } },
            { upsert: true }
        );
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
