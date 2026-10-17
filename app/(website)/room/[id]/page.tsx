"use client";
import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Room, AmenityCat } from "../../../components/types";
import Loading from "../../components/Loading";
import { 
  FaWifi, FaBolt, FaSnowflake, FaConciergeBell, FaShower, FaTv, FaBed, FaUserFriends, 
  FaRulerCombined, FaChevronLeft, FaChevronRight, FaHotTub, FaDumbbell, FaSwimmingPool, 
  FaCoffee, FaSpa, FaUtensils, FaCar, FaCheck, FaShieldAlt, FaPhoneAlt, FaImages, 
  FaTimes, FaRegClock, FaStar, FaWineGlassAlt, FaPrint, FaExpand, FaKey, FaDoorOpen,
  FaChevronDown, FaChevronUp, FaSearchPlus
} from "react-icons/fa";
import { 
  MdElevator, MdCleaningServices, MdOutput, MdRestaurant, MdRoomService, 
  MdOutlinePolicy, MdOutlineCoffeeMaker, MdCheckCircle, MdLuggage, MdSecurity
} from "react-icons/md";
import { BiFridge } from "react-icons/bi";
import { IoShieldCheckmarkOutline, IoWaterOutline, IoSparklesOutline } from "react-icons/io5";

// Master dictionary of all amenities for reliable icon and category resolution
const MASTER_FACILITIES: Record<string, { name: string; category: string; icon: React.ReactNode; desc?: string }> = {
  fb1: { name: "24/7 Room Service", category: "Dining & Service", icon: <MdRoomService />, desc: "Gourmet dining delivered straight to your door" },
  fb2: { name: "In-Room Refrigerator", category: "Comfort & Living", icon: <BiFridge />, desc: "Keep beverages and personal snacks chilled" },
  fb3: { name: "100% Power Backup", category: "Essentials", icon: <FaBolt />, desc: "Uninterrupted power supply 24 hours a day" },
  fb4: { name: "Elevator / Lift Access", category: "Accessibility", icon: <MdElevator />, desc: "Smooth high-speed elevator access to all floors" },
  fb5: { name: "Daily Housekeeping", category: "Services", icon: <MdCleaningServices />, desc: "Daily turndown and room sanitation" },
  fb6: { name: "Air Conditioning", category: "Comfort & Living", icon: <FaSnowflake />, desc: "Individual precision climate control" },
  fb7: { name: "High-Speed Wi-Fi", category: "Connectivity", icon: <FaWifi />, desc: "Seamless ultra-fast Wi-Fi throughout your stay" },
  fb8: { name: "Express Check-Out", category: "Services", icon: <MdOutput />, desc: "Quick and hassle-free departure process" },
  fb9: { name: "Hot Water Geyser", category: "Bathroom & Wellness", icon: <FaHotTub />, desc: "Continuous instant hot water supply" },
  fb10: { name: "24-Hour Front Desk", category: "Services", icon: <FaConciergeBell />, desc: "Dedicated concierge team at your service day & night" },
  
  fr1: { name: "Professional Hairdryer", category: "Bathroom & Wellness", icon: <FaShower />, desc: "High-power salon dryer in bathroom" },
  fr2: { name: "Private Jacuzzi Tub", category: "Bathroom & Wellness", icon: <FaHotTub />, desc: "Hydrotherapy jet experience" },
  fr3: { name: "Deep Soak Bathtub", category: "Bathroom & Wellness", icon: <FaShower />, desc: "Spacious soaking tub for relaxation" },
  fr4: { name: "Plush Lounge Seating", category: "Comfort & Living", icon: <FaBed />, desc: "Comfortable seating sofa for reading & leisure" },
  fr5: { name: "Premium Minibar", category: "Dining & Service", icon: <BiFridge />, desc: "Curated selection of snacks and beverages" },
  fr6: { name: "Executive Work Desk", category: "Connectivity", icon: <FaTv />, desc: "Ergonomic chair and desk with universal sockets" },
  fr7: { name: "Tea & Coffee Maker", category: "Dining & Service", icon: <MdOutlineCoffeeMaker />, desc: "Electric kettle with fine teas and artisanal coffee" },
  fr8: { name: "Iron & Ironing Board", category: "Comfort & Living", icon: <FaBolt />, desc: "Pressing board & steam iron available on request" },
  fr9: { name: "Complimentary Mineral Water", category: "Comfort & Living", icon: <IoWaterOutline />, desc: "Sealed mineral water bottles replenished daily" },
  fr10: { name: "Luxury Toiletries Kit", category: "Bathroom & Wellness", icon: <IoSparklesOutline />, desc: "Premium personal care shampoo, soap & moisturizer" },

  ff1: { name: "On-Site Restaurant", category: "Dining & Service", icon: <MdRestaurant />, desc: "Multi-cuisine gourmet dining on premises" },
  ff2: { name: "Beverage Lounge", category: "Dining & Service", icon: <FaWineGlassAlt />, desc: "Refreshing beverages and crafted drinks" },
  ff3: { name: "24h In-Room Dining", category: "Dining & Service", icon: <FaUtensils />, desc: "Fresh hot meals prepared round the clock" },
  ff4: { name: "Rooftop Dining Experience", category: "Dining & Service", icon: <MdRestaurant />, desc: "Al fresco dining with scenic city views" },
  ff5: { name: "Daily Morning Breakfast", category: "Dining & Service", icon: <FaUtensils />, desc: "Nutritious and delicious breakfast offerings" },

  fw1: { name: "Modern Fitness Center", category: "Health & Wellness", icon: <FaDumbbell />, desc: "Equipped with cardio machines and weights" },
  fw2: { name: "Swimming Pool", category: "Health & Wellness", icon: <FaSwimmingPool />, desc: "Clean and refreshing swimming pool access" },
  fw3: { name: "Spa & Rejuvenation", category: "Health & Wellness", icon: <FaSpa />, desc: "Holistic wellness therapies and restorative treatments" },
  fw4: { name: "Steam & Sauna Rooms", category: "Health & Wellness", icon: <FaHotTub />, desc: "Relaxing steam facilities" },
  fw5: { name: "Yoga & Meditation Space", category: "Health & Wellness", icon: <FaSpa />, desc: "Peaceful atmosphere for morning mindfulness" },

  fs1: { name: "24/7 CCTV Monitoring", category: "Safety & Security", icon: <IoShieldCheckmarkOutline />, desc: "Round-the-clock security monitoring across common areas" },
  fs2: { name: "On-Duty Security Guards", category: "Safety & Security", icon: <FaShieldAlt />, desc: "Trained security personnel stationed 24/7" },
  fs3: { name: "Fire & Safety Equipment", category: "Safety & Security", icon: <FaShieldAlt />, desc: "Advanced smoke detectors and emergency response equipment" },
  fs4: { name: "Safe Deposit Box", category: "Safety & Security", icon: <IoShieldCheckmarkOutline />, desc: "Secure electronic safe for laptops and valuables" },

  ft1: { name: "Airport Chauffeur Transfer", category: "Transport & Parking", icon: <FaCar />, desc: "Comfortable pickup and drop service upon request" },
  ft2: { name: "Complimentary Valet Parking", category: "Transport & Parking", icon: <FaCar />, desc: "Stress-free secure parking for guest vehicles" },
  ft3: { name: "EV Charging Station", category: "Transport & Parking", icon: <FaBolt />, desc: "High-speed charging station for electric cars" },
  ft4: { name: "City Travel Desk", category: "Transport & Parking", icon: <FaCar />, desc: "Local sightseeing and cab assistance" },

  fbz1: { name: "Executive Business Center", category: "Business", icon: <FaPrint />, desc: "Workstations with high-speed internet and printing" },
  fbz2: { name: "Meeting & Conference Room", category: "Business", icon: <FaUserFriends />, desc: "Fully equipped audiovisual meeting facilities" },
  fbz3: { name: "Document Printing / Scanning", category: "Business", icon: <FaPrint />, desc: "High-resolution color and monochrome printing" },
  fbz4: { name: "Banquet & Event Space", category: "Business", icon: <FaUserFriends />, desc: "Magnificent venue for gatherings and corporate events" },
};

function RoomDetailContent() {
    const params = useParams();
    const router = useRouter();
    const roomId = (params?.id as string) || "rm1";

    const [room, setRoom] = useState<Room | null>(null);
    const [amenities, setAmenities] = useState<AmenityCat[]>([]);
    const [loading, setLoading] = useState(true);

    const [activeImg, setActiveImg] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [galleryExpanded, setGalleryExpanded] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    // Booking sidebar dates
    const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
    const tomorrowStr = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split("T")[0];
    }, []);

    const [checkIn, setCheckIn] = useState(todayStr);
    const [checkOut, setCheckOut] = useState(tomorrowStr);
    const [guests, setGuests] = useState(2);

    useEffect(() => {
        Promise.all([
            fetch("/api/room-types").then(r => r.ok ? r.json() : []),
            fetch("/api/amenities").then(r => r.ok ? r.json() : [])
        ])
        .then(([rData, aData]) => {
            if (Array.isArray(rData)) {
                const found = rData.find(r => r.id === roomId || r.slug === roomId) || rData[0] || null;
                setRoom(found);
            }
            if (Array.isArray(aData)) {
                setAmenities(aData);
            }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, [roomId]);

    // Calculate nights
    const nights = useMemo(() => {
        try {
            const inDate = new Date(checkIn);
            const outDate = new Date(checkOut);
            const diffTime = outDate.getTime() - inDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays > 0 ? diffDays : 1;
        } catch {
            return 1;
        }
    }, [checkIn, checkOut]);

    const handleCheckInChange = (newIn: string) => {
        setCheckIn(newIn);
        const inDate = new Date(newIn);
        const outDate = new Date(checkOut);
        if (inDate >= outDate) {
            const nextDay = new Date(inDate);
            nextDay.setDate(nextDay.getDate() + 1);
            setCheckOut(nextDay.toISOString().split("T")[0]);
        }
    };

    // Calculate total price preview
    const totalPrice = (room?.basePrice || 1500) * nights;

    // Resolve amenities for this room
    const resolvedAmenities = useMemo(() => {
        if (!room) return [];
        const ids = room.amenityIds || [];

        const items = ids.map(id => {
            if (MASTER_FACILITIES[id]) {
                return { id, ...MASTER_FACILITIES[id] };
            }

            for (const cat of amenities) {
                const fac = cat.facilities?.find(f => f.id === id);
                if (fac) {
                    return {
                        id,
                        name: fac.name,
                        category: cat.name || "In-Room Comfort",
                        icon: <IoShieldCheckmarkOutline />,
                        desc: "Standard luxury room inclusion"
                    };
                }
            }

            return {
                id,
                name: "Complimentary Hotel Service",
                category: "Services",
                icon: <IoShieldCheckmarkOutline />,
                desc: "Included with your reservation"
            };
        });

        return items;
    }, [room, amenities]);

    const categories = useMemo(() => {
        const set = new Set<string>();
        resolvedAmenities.forEach(a => set.add(a.category));
        return ["All", ...Array.from(set)];
    }, [resolvedAmenities]);

    const filteredAmenities = useMemo(() => {
        if (selectedCategory === "All") return resolvedAmenities;
        return resolvedAmenities.filter(a => a.category === selectedCategory);
    }, [resolvedAmenities, selectedCategory]);

    useEffect(() => {
        if (loading) return;
        const fadeEls = document.querySelectorAll('.fade-in-up');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    (entry.target as HTMLElement).style.transitionDelay = (i * 0.04) + 's';
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.05 });
        fadeEls.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [loading, room, selectedCategory, galleryExpanded]);

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (!lightboxOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightboxOpen(false);
            if (e.key === "ArrowRight") setActiveImg(i => (i + 1) % (room?.images?.length || 1));
            if (e.key === "ArrowLeft") setActiveImg(i => (i - 1 + (room?.images?.length || 1)) % (room?.images?.length || 1));
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxOpen, room?.images?.length]);

    if (loading) return <Loading />;
    if (!room) {
        return (
            <div style={{ background: "var(--midnight)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--ivory)", padding: 40, textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(212,168,87,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", fontSize: 24, marginBottom: 20 }}>
                    <FaKey />
                </div>
                <h1 className="font-display" style={{ fontSize: 44, marginBottom: 16 }}>Room Not Found</h1>
                <p style={{ color: "var(--ivory-dim)", maxWidth: 440, marginBottom: 32, lineHeight: 1.7 }}>
                    The room you are looking for is currently being prepared or updated.
                </p>
                <Link href="/" className="btn-primary" style={{ textDecoration: "none" }}>
                    Return to Homepage
                </Link>
            </div>
        );
    }

    const images = room.images && room.images.length > 0 
        ? room.images 
        : [
            "/hotel-img/9b80559ce359f116 (1).jpg",
            "/hotel-img/9b80559ce359f116.jpg",
            "/hotel-img/ceef6ebf560e411d.jpg",
            "/hotel-img/IMG_0890 (1).JPG"
        ];

    const nextImg = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setActiveImg(i => (i + 1) % images.length);
    };

    const prevImg = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setActiveImg(i => (i - 1 + images.length) % images.length);
    };

    const openLightboxAt = (idx: number) => {
        setActiveImg(idx);
        setLightboxOpen(true);
    };

    const words = room.roomName.split(" ");
    const titleLead = words.slice(0, -1).join(" ") || words[0];
    const titleAccent = words.length > 1 ? words[words.length - 1] : "";

    const initialGalleryCount = 8;
    const displayedGalleryImages = galleryExpanded ? images : images.slice(0, initialGalleryCount);

    return (
        <div className="room-detail-wrapper">
            <div className="max-w">
                
                {/* Back Link */}
                <div style={{ marginBottom: 28 }}>
                    <Link href="/#rooms" style={{ display: "inline-flex", alignItems: "center", gap: 10, color: "var(--gold)", fontSize: 13, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500 }}>
                        <FaChevronLeft size={10} /> Back to Accommodations
                    </Link>
                </div>

                {/* ========================================================
                    1. HERO SECTION: 2-COLUMN GRID (LEFT SLIDER+INFO, RIGHT STICKY BOOKING)
                    ======================================================== */}
                <div className="room-hero-grid">
                    
                    {/* Left Column: Images, Title, Specs, Narrative, Highlights */}
                    <div className="hero-left-content">
                        
                        {/* Main 16:9 Image Slider */}
                        <div className="hero-slider-box">
                            {images && images.length > 0 ? (
                                <>
                                    <img 
                                        src={images[activeImg]} 
                                        alt={room.roomName} 
                                        className="hero-slider-img"
                                        onClick={() => openLightboxAt(activeImg)}
                                    />
                                    
                                    {/* Prev / Next Arrows */}
                                    {images.length > 1 && (
                                        <>
                                            <button 
                                                onClick={prevImg} 
                                                className="slider-arrow left"
                                                aria-label="Previous Photo"
                                            >
                                                <FaChevronLeft size={14} />
                                            </button>
                                            <button 
                                                onClick={nextImg} 
                                                className="slider-arrow right"
                                                aria-label="Next Photo"
                                            >
                                                <FaChevronRight size={14} />
                                            </button>
                                            
                                            {/* Photo Indicator Dots Strip */}
                                            <div className="slider-dots-strip">
                                                {images.slice(0, 10).map((_: string, idx: number) => (
                                                    <div 
                                                        key={idx} 
                                                        onClick={() => setActiveImg(idx)}
                                                        className={`slider-dot ${activeImg === idx ? 'active' : ''}`}
                                                    />
                                                ))}
                                                {images.length > 10 && (
                                                    <span style={{ fontSize: 10, color: "var(--gold)", paddingLeft: 4 }}>
                                                        +{images.length - 10}
                                                    </span>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* Price Floating Tag on Top-Right */}
                                    <div className="slider-price-tag font-display">
                                        ₹{room.basePrice?.toLocaleString()} <span>/night</span>
                                    </div>

                                    {/* Fullscreen click hint */}
                                    <button 
                                        className="slider-expand-btn"
                                        onClick={() => openLightboxAt(activeImg)}
                                        title="View Fullscreen"
                                    >
                                        <FaExpand size={12} />
                                    </button>
                                </>
                            ) : (
                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ivory-dim)" }}>
                                    No image available
                                </div>
                            )}
                        </div>

                        {/* Room Title & Key Specs */}
                        <div className="room-title-section">
                            <div className="section-eyebrow" style={{ marginBottom: 12 }}>
                                <span className="line"></span>
                                <span>{room.roomCategory ? `${room.roomCategory.toUpperCase()} COLLECTION` : "DELUXE ACCOMMODATION"}</span>
                            </div>

                            <h1 className="font-display room-main-title">
                                {titleLead} {titleAccent && <em>{titleAccent}</em>}
                            </h1>

                            <div className="room-rating-row" style={{ marginBottom: 20 }}>
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} color="var(--gold)" size={13} />
                                    ))}
                                </div>
                                <span className="rating-text">4.9 Star Guest Rating</span>
                                <span className="bullet-sep">•</span>
                                <span className="location-tag">Hotel Grand Eagle, Sitapura, Jaipur</span>
                            </div>
                            
                            {/* Key Specs Bar */}
                            <div className="room-specs-bar">
                                <div className="spec-item">
                                    <FaBed color="var(--gold)" size={18} />
                                    <div>
                                        <div className="spec-item-label">Bed Type</div>
                                        <div className="spec-item-value">{room.bedType || "King Bed"}</div>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <FaUserFriends color="var(--gold)" size={18} />
                                    <div>
                                        <div className="spec-item-label">Capacity</div>
                                        <div className="spec-item-value">Up to {room.maxOccupancy || 2} Adults</div>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <FaRulerCombined color="var(--gold)" size={18} />
                                    <div>
                                        <div className="spec-item-label">Room Area</div>
                                        <div className="spec-item-value">{room.roomSize || 42} m² (452 sq ft)</div>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <FaDoorOpen color="var(--gold)" size={18} />
                                    <div>
                                        <div className="spec-item-label">Window View</div>
                                        <div className="spec-item-value">{room.view || "City & Garden View"}</div>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <FaShower color="var(--gold)" size={18} />
                                    <div>
                                        <div className="spec-item-label">Bathroom</div>
                                        <div className="spec-item-value">{room.bathroomType || "Rain Shower & Geyser"}</div>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <FaWifi color="var(--gold)" size={18} />
                                    <div>
                                        <div className="spec-item-label">Connectivity</div>
                                        <div className="spec-item-value">High-Speed Wi-Fi</div>
                                    </div>
                                </div>
                            </div>

                            {/* Narrative Paragraph */}
                            <p className="room-narrative-text">
                                Welcome to the {room.roomName} at Hotel Grand Eagle — an oasis of tranquility and modern comfort in Sitapura, Jaipur. Thoughtfully crafted with ambient lighting, plush orthopedic King bedding, and bespoke finishes, every detail is tailored for an effortless and relaxing stay.
                            </p>

                            {/* Signature Highlights */}
                            <div className="signature-highlights-grid">
                                <div className="sig-item">
                                    <div className="sig-check"><FaCheck /></div>
                                    <div>
                                        <div className="sig-title">Plush King Bedding</div>
                                        <div className="sig-desc">Custom comfort mattress with hypo-allergenic pillows</div>
                                    </div>
                                </div>
                                <div className="sig-item">
                                    <div className="sig-check"><FaCheck /></div>
                                    <div>
                                        <div className="sig-title">Spa Rain Shower & Geyser</div>
                                        <div className="sig-desc">24/7 instant hot water with luxury personal care</div>
                                    </div>
                                </div>
                                <div className="sig-item">
                                    <div className="sig-check"><FaCheck /></div>
                                    <div>
                                        <div className="sig-title">Quiet Ambient Atmosphere</div>
                                        <div className="sig-desc">Sound-insulated room layout for uninterrupted deep rest</div>
                                    </div>
                                </div>
                                <div className="sig-item">
                                    <div className="sig-check"><FaCheck /></div>
                                    <div>
                                        <div className="sig-title">Dedicated 24/7 Service</div>
                                        <div className="sig-desc">Round-the-clock room service and friendly front desk support</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Sticky Booking Sidebar */}
                    <aside className="hero-sidebar-col">
                        <div className="sticky-booking-sidebar">
                            
                            <div style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
                                Direct Reservation
                            </div>
                            <h3 className="font-display" style={{ fontSize: 30, color: "var(--ivory)", margin: "0 0 16px 0" }}>
                                Plan Your <em>Stay</em>
                            </h3>
                            
                            <p style={{ fontSize: 13, color: "var(--ivory-dim)", lineHeight: 1.6, margin: "0 0 24px 0" }}>
                                Select your dates to experience genuine hospitality at Hotel Grand Eagle, Jaipur.
                            </p>

                            {/* Date & Guests Selection */}
                            <div className="sidebar-date-inputs">
                                <div className="date-field">
                                    <label htmlFor="sb-in">Check-In</label>
                                    <input 
                                        id="sb-in"
                                        type="date" 
                                        min={todayStr} 
                                        value={checkIn}
                                        onChange={(e) => handleCheckInChange(e.target.value)}
                                        className="sb-input"
                                    />
                                </div>
                                <div className="date-field">
                                    <label htmlFor="sb-out">Check-Out</label>
                                    <input 
                                        id="sb-out"
                                        type="date" 
                                        min={checkIn} 
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                        className="sb-input"
                                    />
                                </div>
                                <div className="date-field">
                                    <label htmlFor="sb-guest">Guests</label>
                                    <select 
                                        id="sb-guest"
                                        value={guests} 
                                        onChange={(e) => setGuests(Number(e.target.value))}
                                        className="sb-input"
                                    >
                                        <option value={1}>1 Guest (Single Occupancy)</option>
                                        <option value={2}>2 Guests (Standard)</option>
                                        <option value={3}>3 Guests (With Extra Bed)</option>
                                        <option value={4}>4 Guests</option>
                                    </select>
                                </div>
                            </div>

                            {/* Total preview */}
                            <div className="sidebar-price-row">
                                <span style={{ fontSize: 13, color: "var(--ivory-dim)" }}>
                                    ₹{room.basePrice?.toLocaleString()} × {nights} {nights === 1 ? 'Night' : 'Nights'}
                                </span>
                                <span className="font-display" style={{ fontSize: 24, color: "var(--gold)", fontWeight: 700 }}>
                                    ₹{totalPrice.toLocaleString()}
                                </span>
                            </div>

                            {/* Booking CTA Button */}
                            <Link 
                                href={`/book?room=${room.slug || room.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`} 
                                className="btn-book-now-gold"
                            >
                                <span>Reserve This Room</span>
                                <FaChevronRight size={12} />
                            </Link>
                            
                            {/* Key Highlights in Sidebar */}
                            <div className="sidebar-perks-list">
                                <div className="sidebar-perk-row">
                                    <MdOutlinePolicy color="var(--gold)" size={18} />
                                    <div>
                                        <div style={{ fontSize: 12, color: "var(--ivory)", fontWeight: 600 }}>Policy</div>
                                        <div style={{ fontSize: 11, color: "var(--ivory-dim)" }}>{room.refundable ? "Free Cancellation Available" : "Flexible Rescheduling"}</div>
                                    </div>
                                </div>
                                <div className="sidebar-perk-row">
                                    <FaRegClock color="var(--gold)" size={15} />
                                    <div>
                                        <div style={{ fontSize: 12, color: "var(--ivory)", fontWeight: 600 }}>Check-in / Check-out</div>
                                        <div style={{ fontSize: 11, color: "var(--ivory-dim)" }}>12:00 PM / 11:00 AM</div>
                                    </div>
                                </div>
                                <div className="sidebar-perk-row">
                                    <FaWifi color="var(--gold)" size={15} />
                                    <div>
                                        <div style={{ fontSize: 12, color: "var(--ivory)", fontWeight: 600 }}>Wi-Fi & Services</div>
                                        <div style={{ fontSize: 11, color: "var(--ivory-dim)" }}>Free High-Speed • 24/7 Support</div>
                                    </div>
                                </div>
                            </div>

                            {/* Direct Call Concierge */}
                            <div className="sidebar-concierge-call">
                                <FaPhoneAlt color="var(--gold)" size={14} />
                                <div style={{ fontSize: 11, color: "var(--ivory-dim)" }}>
                                    Need help? Call <a href="tel:06367850548" style={{ color: "var(--gold)", fontWeight: 700, textDecoration: "none" }}>063678 50548</a>
                                </div>
                            </div>

                        </div>
                    </aside>

                </div>

                {/* ========================================================
                    2. SECTIONS BELOW HERO: FULL WIDTH ACROSS THE ENTIRE CONTAINER!
                    ======================================================== */}

                {/* 2A. FULL-WIDTH ROOM AMENITIES */}
                <section className="fullwidth-amenities-section" id="amenities-section">
                    <div className="amenities-header-row">
                        <div>
                            <div className="section-eyebrow" style={{ marginBottom: 8 }}>
                                <span className="line"></span>
                                <span>Curated Inclusions</span>
                            </div>
                            <h2 className="font-display" style={{ fontSize: 34, color: "var(--ivory)", margin: 0 }}>
                                Room <em>Amenities</em>
                            </h2>
                        </div>
                        <div className="amenity-total-badge">
                            {resolvedAmenities.length} Luxury Amenities Included
                        </div>
                    </div>

                    <p style={{ fontSize: 14, color: "var(--ivory-dim)", marginBottom: 28, maxWidth: 620, lineHeight: 1.6 }}>
                        Every amenity at Hotel Grand Eagle is curated to elevate your comfort, productivity, and convenience throughout your stay.
                    </p>

                    {/* Filter Pills */}
                    {categories.length > 2 && (
                        <div className="amenity-filter-pills">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 3-Column Grid */}
                    <div className="fullwidth-amenities-grid">
                        {filteredAmenities.map((item, idx) => (
                            <div key={item.id + idx} className="fullwidth-amenity-card">
                                <div className="amenity-card-icon">
                                    {item.icon}
                                </div>
                                <div className="amenity-card-info">
                                    <div className="amenity-card-title">{item.name}</div>
                                    <div className="amenity-card-category">{item.category}</div>
                                    {item.desc && (
                                        <div className="amenity-card-desc">{item.desc}</div>
                                    )}
                                </div>
                                <div className="amenity-status-tag">
                                    <span className="status-dot"></span>
                                    <span>Included</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 2B. FULL-WIDTH ROOM GALLERY SECTION */}
                {images.length > 0 && (
                    <section className="fullwidth-gallery-section" id="room-gallery">
                        <div className="gallery-header-row">
                            <div>
                                <div className="section-eyebrow" style={{ marginBottom: 8 }}>
                                    <span className="line"></span>
                                    <span>Visual Tour</span>
                                </div>
                                <h3 className="font-display" style={{ fontSize: 30, color: "var(--ivory)", margin: 0 }}>
                                    Room <em>Gallery</em>
                                </h3>
                            </div>
                            <button 
                                className="btn-open-fullscreen"
                                onClick={() => openLightboxAt(0)}
                            >
                                <FaExpand size={12} />
                                <span>Full-Screen Viewer</span>
                            </button>
                        </div>

                        <div className="fullwidth-gallery-grid">
                            {displayedGalleryImages.map((img: string, idx: number) => (
                                <div 
                                    key={idx} 
                                    className="fullwidth-gallery-item"
                                    onClick={() => openLightboxAt(idx)}
                                >
                                    <img 
                                        src={img} 
                                        alt={`${room.roomName} view ${idx + 1}`} 
                                        loading="lazy"
                                        className="fullwidth-gallery-img"
                                    />
                                    <div className="gallery-item-overlay">
                                        <FaSearchPlus size={20} color="var(--gold)" />
                                        <span style={{ fontSize: 12, color: "var(--ivory)", marginTop: 6, fontWeight: 500 }}>
                                            Photo #{idx + 1}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {images.length > initialGalleryCount && (
                            <div style={{ marginTop: 28, textAlign: "center" }}>
                                <button 
                                    className="btn-toggle-gallery"
                                    onClick={() => setGalleryExpanded(!galleryExpanded)}
                                >
                                    <span>{galleryExpanded ? "Show Less Photos" : `View All ${images.length} Room Photos`}</span>
                                    {galleryExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                                </button>
                            </div>
                        )}
                    </section>
                )}

                {/* 2C. FULL-WIDTH STAY POLICIES */}
                <section className="fullwidth-policies-section">
                    <div className="section-eyebrow" style={{ marginBottom: 8 }}>
                        <span className="line"></span>
                        <span>Hotel Guidelines</span>
                    </div>
                    <h3 className="font-display" style={{ fontSize: 30, color: "var(--ivory)", margin: "0 0 24px 0" }}>
                        Stay <em>Policies</em>
                    </h3>

                    <div className="fullwidth-policies-grid">
                        <div className="policy-card">
                            <FaRegClock color="var(--gold)" size={20} />
                            <div>
                                <div className="policy-card-title">Check-in / Check-out</div>
                                <div className="policy-card-text">Check-in: 12:00 PM | Check-out: 11:00 AM. Early check-in upon availability.</div>
                            </div>
                        </div>

                        <div className="policy-card">
                            <MdOutlinePolicy color="var(--gold)" size={22} />
                            <div>
                                <div className="policy-card-title">Cancellation Policy</div>
                                <div className="policy-card-text">{room.refundable ? "100% Free Cancellation up to 24 hours prior to check-in." : "Flexible cancellation policy."}</div>
                            </div>
                        </div>

                        <div className="policy-card">
                            <FaShieldAlt color="var(--gold)" size={20} />
                            <div>
                                <div className="policy-card-title">Guest Identification</div>
                                <div className="policy-card-text">Valid Government Photo ID (Aadhar, Driving License, Passport) required at check-in.</div>
                            </div>
                        </div>

                        <div className="policy-card">
                            <FaConciergeBell color="var(--gold)" size={20} />
                            <div>
                                <div className="policy-card-title">Children & Extra Bed</div>
                                <div className="policy-card-text">Children below 6 stay free. Extra bed available at ₹{room.extraBedPrice || 700}/night.</div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>

            {/* FULLSCREEN LIGHTBOX MODAL */}
            {lightboxOpen && (
                <div className="lightbox-backdrop" onClick={() => setLightboxOpen(false)}>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        
                        <button className="lightbox-close-btn" onClick={() => setLightboxOpen(false)}>
                            <FaTimes size={22} />
                        </button>

                        <div className="lightbox-image-stage">
                            <img 
                                src={images[activeImg]} 
                                alt={`${room.roomName} fullscreen view ${activeImg + 1}`} 
                                className="lightbox-full-img"
                            />
                            
                            {images.length > 1 && (
                                <>
                                    <button className="lightbox-arrow left" onClick={prevImg}>
                                        <FaChevronLeft size={22} />
                                    </button>
                                    <button className="lightbox-arrow right" onClick={nextImg}>
                                        <FaChevronRight size={22} />
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="lightbox-footer">
                            <div className="lightbox-caption">
                                <strong>{room.roomName}</strong> • Photo {activeImg + 1} of {images.length}
                            </div>
                            <div className="lightbox-thumb-strip">
                                {images.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImg(idx)}
                                        className={`lightbox-mini-thumb ${activeImg === idx ? 'active' : ''}`}
                                    >
                                        <img src={img} alt={`mini ${idx}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* Scoped CSS Styles */}
            <style jsx>{`
                .room-detail-wrapper {
                    background: var(--midnight);
                    min-height: 100vh;
                    padding-top: 120px;
                    padding-bottom: 120px;
                    overflow-x: hidden;
                    width: 100%;
                    box-sizing: border-box;
                    color: var(--ivory);
                }

                .max-w {
                    max-width: 1360px;
                    margin: 0 auto;
                    padding: 0 32px;
                    box-sizing: border-box;
                }

                /* 1. HERO SECTION GRID (LEFT SLIDER, RIGHT BOOKING CARD) */
                .room-hero-grid {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) 380px;
                    gap: 56px;
                    align-items: start;
                    width: 100%;
                    margin-bottom: 72px;
                }

                .hero-left-content {
                    display: flex;
                    flex-direction: column;
                    gap: 36px;
                    min-width: 0;
                    width: 100%;
                }

                .hero-slider-box {
                    position: relative;
                    border-radius: 4px;
                    overflow: hidden;
                    aspect-ratio: 16/9;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(212, 168, 87, 0.2);
                    width: 100%;
                }

                .hero-slider-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    cursor: pointer;
                    transition: transform 0.4s ease;
                }

                .hero-slider-img:hover {
                    transform: scale(1.02);
                }

                .slider-arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(0, 0, 0, 0.65);
                    border: 1px solid rgba(212, 168, 87, 0.4);
                    color: var(--gold);
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 10;
                    transition: all 0.3s ease;
                }

                .slider-arrow:hover {
                    background: var(--gold);
                    color: var(--midnight);
                }

                .slider-arrow.left { left: 20px; }
                .slider-arrow.right { right: 20px; }

                .slider-dots-strip {
                    position: absolute;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(0, 0, 0, 0.5);
                    padding: 6px 14px;
                    border-radius: 99px;
                    backdrop-filter: blur(4px);
                    z-index: 10;
                }

                .slider-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.35);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .slider-dot.active {
                    background: var(--gold);
                    transform: scale(1.3);
                }

                .slider-price-tag {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: var(--gold);
                    color: var(--midnight);
                    padding: 10px 20px;
                    font-size: 19px;
                    font-weight: 700;
                    z-index: 10;
                    border-radius: 2px;
                    box-shadow: 0 6px 16px rgba(0,0,0,0.4);
                }

                .slider-price-tag span {
                    font-size: 11px;
                    font-weight: 400;
                    opacity: 0.85;
                    font-family: 'DM Sans', sans-serif;
                }

                .slider-expand-btn {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: rgba(0, 0, 0, 0.65);
                    border: 1px solid rgba(212, 168, 87, 0.4);
                    color: var(--gold);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 10;
                    transition: all 0.25s;
                }

                .slider-expand-btn:hover {
                    background: var(--gold);
                    color: var(--midnight);
                }

                /* Room Title Section */
                .room-title-section {
                    width: 100%;
                }

                .section-eyebrow {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: var(--gold);
                    font-size: 11px;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                }

                .section-eyebrow .line {
                    width: 24px;
                    height: 1px;
                    background: var(--gold);
                }

                .room-main-title {
                    font-size: clamp(32px, 4.5vw, 52px);
                    color: var(--ivory);
                    margin: 0 0 16px 0;
                    font-weight: 400;
                    line-height: 1.15;
                }

                .room-main-title em {
                    font-style: italic;
                    color: var(--gold);
                }

                .room-rating-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 13px;
                    color: var(--ivory-dim);
                    flex-wrap: wrap;
                }

                .stars {
                    display: flex;
                    gap: 4px;
                }

                .rating-text {
                    color: var(--ivory);
                    font-weight: 500;
                }

                .bullet-sep {
                    opacity: 0.4;
                }

                .location-tag {
                    color: var(--ivory-dim);
                }

                .room-specs-bar {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
                    gap: 20px;
                    margin-bottom: 24px;
                    border-top: 1px solid rgba(212, 168, 87, 0.12);
                    border-bottom: 1px solid rgba(212, 168, 87, 0.12);
                    padding: 18px 0;
                    width: 100%;
                }

                .spec-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .spec-item-label {
                    font-size: 10px;
                    color: var(--gold);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                .spec-item-value {
                    font-size: 13px;
                    color: var(--ivory);
                    font-weight: 500;
                }

                .room-narrative-text {
                    font-size: 15px;
                    color: var(--ivory-dim);
                    line-height: 1.8;
                    margin: 0 0 24px 0;
                }

                .signature-highlights-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 18px;
                    padding-top: 24px;
                    border-top: 1px solid rgba(212, 168, 87, 0.1);
                }

                .sig-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                }

                .sig-check {
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: rgba(212, 168, 87, 0.12);
                    color: var(--gold);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .sig-title {
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--ivory);
                    margin-bottom: 2px;
                }

                .sig-desc {
                    font-size: 11px;
                    color: var(--ivory-dim);
                    line-height: 1.5;
                }

                /* Right Column: Sticky Sidebar */
                .hero-sidebar-col {
                    position: sticky;
                    top: 120px;
                    width: 100%;
                }

                .sticky-booking-sidebar {
                    background: #111;
                    border: 1px solid rgba(212, 168, 87, 0.2);
                    padding: 32px 28px;
                    text-align: center;
                    border-radius: 4px;
                    box-shadow: 0 16px 36px rgba(0,0,0,0.4);
                    box-sizing: border-box;
                    width: 100%;
                }

                .sidebar-date-inputs {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 20px;
                    text-align: left;
                }

                .date-field {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .date-field label {
                    font-size: 10px;
                    color: var(--gold);
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                }

                .sb-input {
                    background: rgba(10, 10, 10, 0.9);
                    border: 1px solid rgba(212, 168, 87, 0.25);
                    color: var(--ivory);
                    padding: 10px 12px;
                    font-size: 12px;
                    font-family: inherit;
                    border-radius: 2px;
                    width: 100%;
                    box-sizing: border-box;
                    outline: none;
                }

                .sb-input:focus {
                    border-color: var(--gold);
                }

                .sidebar-price-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 14px 0;
                    margin-bottom: 20px;
                    border-top: 1px solid rgba(212, 168, 87, 0.12);
                    border-bottom: 1px solid rgba(212, 168, 87, 0.12);
                }

                .btn-book-now-gold {
                    width: 100%;
                    background: linear-gradient(135deg, #E4C581 0%, #C9A96E 100%);
                    color: #0b0b0b;
                    padding: 15px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    font-size: 13px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    text-decoration: none;
                    border-radius: 2px;
                    transition: all 0.3s ease;
                    box-sizing: border-box;
                    box-shadow: 0 6px 20px rgba(212,168,87,0.25);
                }

                .btn-book-now-gold:hover {
                    background: #f1d79c;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 24px rgba(212,168,87,0.35);
                }

                .sidebar-perks-list {
                    margin-top: 24px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(212, 168, 87, 0.1);
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                    text-align: left;
                }

                .sidebar-perk-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .sidebar-concierge-call {
                    margin-top: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }

                /* ========================================================
                   2A. FULL-WIDTH ROOM AMENITIES (HERO KE NICHE POORA FULL WIDTH)
                   ======================================================== */
                .fullwidth-amenities-section {
                    background: #111;
                    border: 1px solid rgba(212, 168, 87, 0.18);
                    border-radius: 6px;
                    padding: 44px;
                    width: 100%;
                    box-sizing: border-box;
                    margin-bottom: 64px;
                    box-shadow: 0 16px 40px rgba(0,0,0,0.3);
                }

                .amenities-header-row {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 20px;
                    margin-bottom: 16px;
                    flex-wrap: wrap;
                }

                .amenity-total-badge {
                    padding: 8px 18px;
                    background: rgba(212, 168, 87, 0.1);
                    border: 1px solid rgba(212, 168, 87, 0.3);
                    border-radius: 99px;
                    font-size: 12px;
                    color: var(--gold);
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    font-weight: 600;
                }

                .amenity-filter-pills {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 32px;
                    overflow-x: auto;
                    padding-bottom: 8px;
                }

                .filter-pill {
                    padding: 8px 18px;
                    border-radius: 99px;
                    font-size: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    background: transparent;
                    color: var(--ivory-dim);
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.25s ease;
                }

                .filter-pill:hover {
                    border-color: var(--gold);
                    color: var(--ivory);
                }

                .filter-pill.active {
                    background: var(--gold);
                    color: var(--midnight);
                    border-color: var(--gold);
                    font-weight: 600;
                }

                /* 3 Columns Across Desktop */
                .fullwidth-amenities-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 18px;
                    width: 100%;
                }

                .fullwidth-amenity-card {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(212, 168, 87, 0.12);
                    border-radius: 4px;
                    position: relative;
                    transition: all 0.3s ease;
                }

                .fullwidth-amenity-card:hover {
                    border-color: rgba(212, 168, 87, 0.4);
                    background: rgba(212, 168, 87, 0.035);
                    transform: translateY(-2px);
                    box-shadow: 0 10px 24px rgba(0,0,0,0.3);
                }

                .amenity-card-icon {
                    width: 42px;
                    height: 42px;
                    border-radius: 4px;
                    background: rgba(212, 168, 87, 0.09);
                    border: 1px solid rgba(212, 168, 87, 0.25);
                    color: var(--gold);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    flex-shrink: 0;
                    transition: all 0.25s ease;
                }

                .fullwidth-amenity-card:hover .amenity-card-icon {
                    background: var(--gold);
                    color: var(--midnight);
                }

                .amenity-card-info {
                    flex: 1;
                    min-width: 0;
                }

                .amenity-card-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--ivory);
                    margin-bottom: 3px;
                }

                .amenity-card-category {
                    font-size: 10px;
                    color: var(--gold);
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    margin-bottom: 6px;
                    opacity: 0.9;
                }

                .amenity-card-desc {
                    font-size: 11px;
                    color: var(--ivory-dim);
                    line-height: 1.5;
                    opacity: 0.85;
                }

                .amenity-status-tag {
                    position: absolute;
                    top: 14px;
                    right: 14px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 10px;
                    color: #4ade80;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    font-weight: 500;
                }

                .status-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #4ade80;
                }

                /* ========================================================
                   2B. FULL-WIDTH ROOM GALLERY
                   ======================================================== */
                .fullwidth-gallery-section {
                    margin-bottom: 64px;
                    width: 100%;
                }

                .gallery-header-row {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    margin-bottom: 24px;
                    flex-wrap: wrap;
                    gap: 16px;
                }

                .btn-open-fullscreen {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(212, 168, 87, 0.1);
                    border: 1px solid rgba(212, 168, 87, 0.3);
                    color: var(--gold);
                    padding: 8px 18px;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    border-radius: 99px;
                    cursor: pointer;
                    transition: all 0.25s ease;
                }

                .btn-open-fullscreen:hover {
                    background: var(--gold);
                    color: var(--midnight);
                }

                .fullwidth-gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 18px;
                    width: 100%;
                }

                .fullwidth-gallery-item {
                    position: relative;
                    border-radius: 4px;
                    overflow: hidden;
                    aspect-ratio: 4/3;
                    border: 1px solid rgba(212, 168, 87, 0.15);
                    cursor: pointer;
                    background: #000;
                }

                .fullwidth-gallery-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    transition: transform 0.4s ease;
                }

                .fullwidth-gallery-item:hover .fullwidth-gallery-img {
                    transform: scale(1.05);
                }

                .gallery-item-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(10, 10, 10, 0.8);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .fullwidth-gallery-item:hover .gallery-item-overlay {
                    opacity: 1;
                }

                .btn-toggle-gallery {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: transparent;
                    border: 1px solid rgba(212, 168, 87, 0.35);
                    color: var(--gold);
                    padding: 12px 28px;
                    font-size: 12px;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    border-radius: 2px;
                    cursor: pointer;
                    transition: all 0.25s ease;
                }

                .btn-toggle-gallery:hover {
                    background: rgba(212, 168, 87, 0.12);
                    border-color: var(--gold);
                }

                /* ========================================================
                   2C. FULL-WIDTH STAY POLICIES (4 CARDS)
                   ======================================================== */
                .fullwidth-policies-section {
                    background: rgba(255, 255, 255, 0.015);
                    border: 1px solid rgba(212, 168, 87, 0.12);
                    border-radius: 6px;
                    padding: 40px;
                    width: 100%;
                    box-sizing: border-box;
                    margin-bottom: 64px;
                }

                .fullwidth-policies-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                    width: 100%;
                }

                .policy-card {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(212, 168, 87, 0.08);
                    border-radius: 4px;
                }

                .policy-card-title {
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--ivory);
                    margin-bottom: 4px;
                }

                .policy-card-text {
                    font-size: 12px;
                    color: var(--ivory-dim);
                    line-height: 1.6;
                }

                /* Lightbox Modal */
                .lightbox-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.94);
                    backdrop-filter: blur(12px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                }

                .lightbox-content {
                    position: relative;
                    width: 100%;
                    max-width: 1200px;
                    max-height: 90vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .lightbox-close-btn {
                    position: absolute;
                    top: -48px;
                    right: 0;
                    background: none;
                    border: none;
                    color: var(--ivory);
                    cursor: pointer;
                    transition: color 0.2s;
                }

                .lightbox-close-btn:hover {
                    color: var(--gold);
                }

                .lightbox-image-stage {
                    position: relative;
                    width: 100%;
                    height: 65vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .lightbox-full-img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    border-radius: 4px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.8);
                }

                .lightbox-arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 52px;
                    height: 52px;
                    border-radius: 50%;
                    background: rgba(10,10,10,0.85);
                    border: 1px solid rgba(212,168,87,0.3);
                    color: var(--gold);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.25s;
                }

                .lightbox-arrow:hover {
                    background: var(--gold);
                    color: var(--midnight);
                }

                .lightbox-arrow.left { left: 16px; }
                .lightbox-arrow.right { right: 16px; }

                .lightbox-footer {
                    margin-top: 20px;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                }

                .lightbox-caption {
                    font-size: 13px;
                    color: var(--ivory-dim);
                }

                .lightbox-thumb-strip {
                    display: flex;
                    gap: 8px;
                    max-width: 100%;
                    overflow-x: auto;
                    padding: 6px;
                }

                .lightbox-mini-thumb {
                    width: 60px;
                    height: 40px;
                    border-radius: 2px;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.2);
                    padding: 0;
                    cursor: pointer;
                    opacity: 0.5;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }

                .lightbox-mini-thumb.active {
                    opacity: 1;
                    border-color: var(--gold);
                }

                .lightbox-mini-thumb img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                /* Responsive */
                @media (max-width: 1100px) {
                    .room-hero-grid {
                        grid-template-columns: 1fr;
                        gap: 48px;
                    }

                    .hero-sidebar-col {
                        position: static;
                    }

                    .fullwidth-amenities-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .fullwidth-gallery-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .fullwidth-policies-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 768px) {
                    .room-detail-wrapper {
                        padding-top: 100px;
                        padding-bottom: 80px;
                    }

                    .fullwidth-amenities-section {
                        padding: 24px;
                    }

                    .fullwidth-amenities-grid {
                        grid-template-columns: 1fr;
                    }

                    .fullwidth-gallery-grid {
                        grid-template-columns: 1fr;
                    }

                    .fullwidth-policies-grid {
                        grid-template-columns: 1fr;
                    }

                    .signature-highlights-grid {
                        grid-template-columns: 1fr;
                    }

                    .room-specs-bar {
                        grid-template-columns: 1fr 1fr;
                    }
                }
            `}</style>
        </div>
    );
}

export default function RoomDetailPage() {
    return (
        <Suspense fallback={<Loading />}>
            <RoomDetailContent />
        </Suspense>
    );
}
