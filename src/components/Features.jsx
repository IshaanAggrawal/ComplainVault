    "use client";
    import React from "react";
    import { Swiper, SwiperSlide } from "swiper/react";
    import { Navigation, Pagination, Autoplay } from "swiper/modules";
    import "swiper/css";
    import "swiper/css/navigation";
    import "swiper/css/pagination";

    function Features() {
    const features = [
        {
        title: "Secure Blockchain",
        desc: "Complaints are encrypted and stored immutably on blockchain, ensuring tamper-proof and verifiable records. Every entry is permanently logged to prevent manipulation.",
        },
        {
        title: "AI-Powered Insights",
        desc: "Advanced AI models analyze complaint data, detect patterns, and provide actionable insights to help authorities resolve cases faster and smarter.",
        },
        {
        title: "User Transparency",
        desc: "Track the entire lifecycle of your complaint in real-time—from filing to resolution—through a transparent dashboard with status updates.",
        },
        {
        title: "Multi-Channel Access",
        desc: "Seamlessly file complaints through multiple channels: responsive web app, mobile app, or AI-powered chatbot. Accessibility is always prioritized.",
        },
        {
        title: "Automated Escalation",
        desc: "If a complaint is not addressed in time, the system auto-escalates it to higher authorities, ensuring accountability and timely actions.",
        },
        {
        title: "Analytics Dashboard",
        desc: "Authorities gain deep insights with a rich dashboard showing trends, bottlenecks, and performance metrics for smarter governance.",
        },
    ];

    return (
        <section className="py-16 text-center relative">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Features
        </h2>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-400">
            Our platform combines <span className="text-white font-semibold">blockchain, AI, and smart automation </span> 
            to ensure complaint resolution is secure, fast, and transparent.  
        </p>

        <div className="mt-12 max-w-6xl mx-auto">
            <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            }}
            className="pb-12"
            >
            {features.map((feature, i) => (
                <SwiperSlide key={i}>
                <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 
                                p-6 rounded-2xl shadow-lg h-64 flex flex-col justify-center 
                                transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                    <h3 className="text-2xl font-bold bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 text-transparent">
                    {feature.title}
                    </h3> 
                    <p className="text-gray-300 mt-3 text-sm leading-relaxed">{feature.desc}</p>
                </div>
                </SwiperSlide>
            ))}
            </Swiper>
        </div>
        </section>
    );
    }

    export default Features;
