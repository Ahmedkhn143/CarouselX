import type { Slide } from '../types/carousel';

export const SAMPLE_SLIDES: Slide[] = [
    {
        slide_number: 1,
        type: 'title',
        title: 'You will read this first',
        subtitle: 'Then you will read this.\nAnd you will read this last.',
        badge: 'TURN AN IDEA INTO A SUCCESS'
    },
    {
        slide_number: 2,
        type: 'content',
        title: 'Define Your Idea',
        body: 'A solid foundation starts with a well-defined idea. Spend time to research and make sure it is unique and viable.',
        badge: 'STEP 1'
    },
    {
        slide_number: 3,
        type: 'content',
        title: 'Create a Plan',
        body: 'Set goals, create a budget and research potential funding sources. Make sure that your plan is realistic and achievable.',
        badge: 'STEP 2'
    },
    {
        slide_number: 4,
        type: 'content',
        title: 'Build Your Team',
        body: 'Hire talented people from local universities and tech communities. Pakistan has amazing untapped talent.',
        badge: 'STEP 3'
    },
    {
        slide_number: 5,
        type: 'content',
        title: 'Launch & Iterate',
        body: 'Start with an MVP, get feedback from early users, and iterate quickly. Speed is your competitive advantage.',
        badge: 'STEP 4'
    },
    {
        slide_number: 6,
        type: 'cta',
        title: 'Ready to Begin\nYour Journey?',
        body: 'Turn your idea into reality.\nLaunch your business today!',
        badge: 'YOUR NEXT STEP AWAITS'
    }
];
