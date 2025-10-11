"use client";

import React from "react";

function Herosection() {

  return (
    <div className="relative min-h-screen overflow-hidden">
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-22">
        <video className="absolute background-video" style={{top:0, width:'100%', filter:'blur(4px) brightness(0.7)', zIndex:'-1',}} autoPlay loop muted playsInline>
          <source src="/videos/bg1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="max-w-3xl z-2 mt-30" style={{filter:'brightness(1.3) hue(7)'}}>
        <h1 className="text-4xl md:text-6xl font-bold tracking-wide bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(70,70,70,0.6)]">
          Blockchain Based
          <br />
          <span className="text-4xl md:text-6xl font-bold tracking-wide bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-transparent  bg-clip-text">
            Smart Complaint System
          </span>
        </h1>

        <p className="mt-6 text-xl text-grey-500" style={{filter:'brightness(1.1) hue(7)'}}>
          "A secure blockchain-powered system where your complaints are encrypted, verified, and resolved — with complete privacy guaranteed."
        </p>


        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#"
            className="px-7 py-3 rounded-full  bg-gray-200/90 text-black font-semibold shadow-md hover:scale-105 transition-transform"
          >
            File a Complaint
          </a>
          <a
            href="#"
            className="px-7 py-3 rounded-full border border-gray-500 text-gray-200 hover:border-white hover:text-white transition"
          >
            Track Progress
          </a>
          <a
            href="#"
            className="px-7 py-3 rounded-full bg-white/10 border border-gray-600 text-gray-200 hover:bg-white/20 transition"
          >
            Contact Support
          </a>
        </div>
      </div>
      </section>
    </div>
  )
}

export default Herosection
