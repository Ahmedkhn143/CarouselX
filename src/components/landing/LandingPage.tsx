import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { HeroSection } from './HeroSection';
import { DemoCardsSection } from './DemoCardsSection';
import { InteractiveDemo } from './InteractiveDemo';
import { FeaturesSection } from './FeaturesSection';
import { TemplatesShowcase } from './TemplatesShowcase';
import { HowItWorks } from './HowItWorks';
import { TestimonialsSection } from './TestimonialsSection';
import { FaqSection } from './FaqSection';
import { CtaSection } from './CtaSection';
import { LandingFooter } from './LandingFooter';

export const LandingPage: React.FC = () => {
    return (
        <div className="landing-page-root">
            <LandingNavbar />
            <main>
                <HeroSection />
                <DemoCardsSection />
                <InteractiveDemo />
                <FeaturesSection />
                <TemplatesShowcase />
                <HowItWorks />
                <TestimonialsSection />
                <FaqSection />
                <CtaSection />
            </main>
            <LandingFooter />
        </div>
    );
};
