"use client";

import React from "react";
import { Header, Footer } from "@/components/common";
import { AboutHero, OurStory, OurValues } from "@/components/pages/about-us";

const AboutUsPage = () => {
    return (
        <div
            className="bg-gray-950 text-white font-sans antialiased"
            style={{
                backgroundImage: `
                radial-gradient(circle at top left, rgba(29, 78, 216, 0.1), transparent 40%),
                radial-gradient(circle at top right, rgba(29, 78, 216, 0.1), transparent 40%),
                linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px) `,
                backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
            }}>
            <Header />
            <main className="container mx-auto px-6">
                <AboutHero />
                <OurStory />
                <OurValues />
            </main>
            <Footer />
        </div>
    );
}

export default AboutUsPage;