import type { Slide } from '../types/carousel';
import { StorageService } from './storageService';

declare global {
    interface Window {
        puter?: {
            ai: {
                chat: (prompt: string | any[], options?: any) => Promise<any>;
            };
        };
    }
}

/**
 * System prompt tailored for viral LinkedIn and Instagram carousels
 */
function buildViralPrompt(topic: string, tone: string, slideCount: number): string {
    const toneInstruction =
        tone === 'hinglish'
            ? 'Language: Casual Hinglish / Roman Urdu (e.g. "Ye 5 tareeqay aapka waqt aur paisa dono bachayeinge", "Daily consistency se real momentum banta hai"). Friendly, engaging, practical.'
            : tone === 'bilingual'
            ? 'Language: English headings with elegant Urdu script subtitles (e.g. "کامیابی کا راز • Secret of Success").'
            : 'Language: English. Professional, high-status, punchy, like top LinkedIn creators (Justin Welsh, Sahil Bloom).';

    return `You are a world-class social media viral carousel copywriter specializing in high-retention LinkedIn and Instagram carousels.
Topic: "${topic}"
Slide Count: Exactly ${slideCount} slides.
${toneInstruction}

CRITICAL CAROUSEL STRUCTURE RULES:
1. Slide 1 (Title / Hook): Must be an irresistible, scroll-stopping hook. Bold headline, compelling subtitle explaining the transformation/value, and a crisp badge (e.g. "FREE BLUEPRINT", "MUST-READ", "2026 GUIDE", "ACTIONABLE FRAMEWORK").
2. Slides 2 to ${slideCount - 1} (Content / Value): Each slide must give ONE specific, non-obvious, actionable insight or step.
   - Title: Short, punchy (3 to 6 words).
   - Body: 1-2 powerful sentences or 2 concise bullet points (MAXIMUM 150 characters total). Avoid fluff.
   - Badge: Step indicator or thematic tag (e.g. "STEP 01", "THE SHIFT", "CRITICAL MISTAKE", "SECRET HACK", "ROI MULTIPLIER").
3. Slide ${slideCount} (Outro / CTA): High-conversion closing slide. Strong call to action encouraging the reader to save, repost, comment, or follow.

OUTPUT REQUIREMENT:
Output ONLY a valid JSON array of exactly ${slideCount} objects. No markdown backticks, no introduction, no outro.
JSON Schema:
[
  {
    "slide_number": 1,
    "type": "title",
    "title": "...",
    "subtitle": "...",
    "badge": "..."
  },
  {
    "slide_number": 2,
    "type": "content",
    "title": "...",
    "body": "...",
    "badge": "..."
  },
  ...
  {
    "slide_number": ${slideCount},
    "type": "cta",
    "title": "...",
    "body": "...",
    "badge": "..."
  }
]`;
}

/**
 * Clean & Parse raw LLM output into Slide[]
 */
function parseSlidesJson(rawText: string, expectedCount: number): Slide[] {
    let clean = rawText.trim();
    if (clean.startsWith('```')) {
        clean = clean.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    }
    const startIdx = clean.indexOf('[');
    const endIdx = clean.lastIndexOf(']');
    if (startIdx !== -1 && endIdx !== -1) {
        clean = clean.substring(startIdx, endIdx + 1);
    }
    const parsed: Slide[] = JSON.parse(clean);
    if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('Invalid JSON format returned by AI');
    }
    return parsed.slice(0, expectedCount);
}

/**
 * Google Gemini API (100% Free tier from Google AI Studio)
 * Supports gemini-2.0-flash / gemini-1.5-flash with direct browser fetch & structured JSON
 */
async function callGeminiApi(
    topic: string,
    tone: string,
    slideCount: number,
    apiKey: string
): Promise<Slide[]> {
    const prompt = buildViralPrompt(topic, tone, slideCount);
    const models = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.0-flash'];
    let lastError: any = null;

    for (const model of models) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: prompt }]
                        }
                    ],
                    generationConfig: {
                        responseMimeType: 'application/json',
                        temperature: 0.7
                    }
                })
            });

            if (res.ok) {
                const data = await res.json();
                const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                if (text) {
                    return parseSlidesJson(text, slideCount);
                }
            } else {
                const errJson = await res.json().catch(() => ({}));
                lastError = new Error(errJson?.error?.message || `Gemini ${model} Error ${res.status}`);
            }
        } catch (err: any) {
            lastError = err;
        }
    }

    throw lastError || new Error('Google Gemini generation failed with all available models.');
}

/**
 * Groq API (100% Free tier from console.groq.com - Llama 3.3 70B Versatile)
 */
async function callGroqApi(
    topic: string,
    tone: string,
    slideCount: number,
    apiKey: string
): Promise<Slide[]> {
    const prompt = buildViralPrompt(topic, tone, slideCount);
    const url = 'https://api.groq.com/openai/v1/chat/completions';
    const models = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b', 'groq/compound'];
    let lastError: any = null;

    for (const model of models) {
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey.trim()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a world-class social media carousel copywriter. You must output ONLY a valid JSON array of objects. No markdown backticks, no intro, no outro.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7
                })
            });

            if (res.ok) {
                const data = await res.json();
                const text = data?.choices?.[0]?.message?.content || '';
                if (text) {
                    return parseSlidesJson(text, slideCount);
                }
            } else {
                const errJson = await res.json().catch(() => ({}));
                lastError = new Error(errJson?.error?.message || `Groq ${model} Error ${res.status}`);
            }
        } catch (err: any) {
            lastError = err;
        }
    }

    throw lastError || new Error('Groq generation failed with all available models.');
}

/**
 * Anthropic Claude API (Direct client call)
 */
async function callClaudeApi(
    topic: string,
    tone: string,
    slideCount: number,
    apiKey: string
): Promise<Slide[]> {
    const prompt = buildViralPrompt(topic, tone, slideCount);
    const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'x-api-key': apiKey.trim(),
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
            'dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 2000,
            messages: [{ role: 'user', content: prompt }]
        })
    });

    if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const msg = errJson?.error?.message || `Claude HTTP Error ${res.status}`;
        throw new Error(`Claude Error: ${msg}`);
    }

    const data = await res.json();
    const text = data?.content?.[0]?.text || '';
    return parseSlidesJson(text, slideCount);
}

/**
 * Intelligent Dynamic Niche-Aware Generator
 * High-converting, topic-customized slides even without an API key or offline!
 */
function generateDynamicNicheSlides(topic: string, tone: string, slideCount: number): Slide[] {
    const cleanTopic = topic.trim().replace(/^["']|["']$/g, '');
    const lower = cleanTopic.toLowerCase();
    const isUrdu = tone === 'bilingual';
    const isHinglish = tone === 'hinglish';

    // Identify topic niche
    let nicheTips: Array<{ enTitle: string; enBody: string; hnTitle: string; hnBody: string; badge: string }> = [];
    let defaultHook = `Mastering ${cleanTopic}`;
    let defaultSub = `A proven blueprint to achieve 10x better results in less time.`;
    let hookBadge = 'GROWTH BLUEPRINT';

    if (lower.includes('ai') || lower.includes('gpt') || lower.includes('prompt') || lower.includes('tool') || lower.includes('bot')) {
        hookBadge = 'AI MASTERCLASS';
        defaultHook = `Unlocking ${cleanTopic}`;
        defaultSub = `Stop wasting hours on manual tasks. Here is the modern AI workflow.`;
        nicheTips = [
            {
                enTitle: 'Automate High-Repetition Tasks',
                enBody: 'Identify workflows you do daily. Delegate data sorting, summarizing, and drafts to AI models.',
                hnTitle: 'Bar Bar Hone Wale Kaam Automate Karein',
                hnBody: 'Jo kaam roz ghanton letay hain unko AI tools se 5 minute mein niptayein.',
                badge: 'PROVEN SYSTEM'
            },
            {
                enTitle: 'Master Context-Rich Prompting',
                enBody: 'Generic prompts yield generic answers. Give the AI clear roles, constraints, examples, and target audience.',
                hnTitle: 'Sahi Prompting Ka Tariqa Seekhein',
                hnBody: 'AI ko exact instructions aur examples dein taake quality professional level ki aye.',
                badge: 'PRO HACK'
            },
            {
                enTitle: 'Build Custom AI Workflows',
                enBody: 'Do not rely on a single chatbot. Chain specialized tools together to build an unfair competitive advantage.',
                hnTitle: 'Apna AI Workflow Banayein',
                hnBody: 'Sirf ek tool par depend na karein. Best tools ko combine kar ke fast results lein.',
                badge: 'LEVERAGE'
            },
            {
                enTitle: 'Verify & Polish With Human Taste',
                enBody: 'AI provides the 80% baseline; your discernment and domain expertise provide the 20% magic that sells.',
                hnTitle: 'Apna Personal Touch Shamil Karein',
                hnBody: 'AI se base tayar karein aur apna tajruba daal kar content ko premium banayein.',
                badge: 'QUALITY CONTROL'
            },
            {
                enTitle: 'Stay Updated With Weekly Shifts',
                enBody: 'The AI landscape evolves every 7 days. Dedicate 20 minutes on weekends to test fresh capabilities.',
                hnTitle: 'Market Trends Par Nazar Rakhein',
                hnBody: 'AI tezi se badal raha hai. Har hafte 20 minute naye updates ko explore karein.',
                badge: 'FUTURE PROOF'
            }
        ];
    } else if (lower.includes('freelanc') || lower.includes('client') || lower.includes('upwork') || lower.includes('fiverr') || lower.includes('agency')) {
        hookBadge = 'HIGH TICKET GUIDE';
        defaultHook = `${cleanTopic}: The High-Income Blueprint`;
        defaultSub = `How top freelancers charge premium rates without bidding wars.`;
        nicheTips = [
            {
                enTitle: 'Position as a Partner, Not a Worker',
                enBody: 'Clients do not buy hours; they buy business outcomes. Speak to their revenue, growth, and headaches.',
                hnTitle: 'Worker Nahi, Solution Provider Banein',
                hnBody: 'Clients ko ghantay nahi, balkay business ka solution aur profit chahiye hota hai.',
                badge: 'POSITIONING'
            },
            {
                enTitle: 'Build a Proof-Driven Portfolio',
                enBody: 'Replace generic case studies with quantifiable before-and-after transformations and client metrics.',
                hnTitle: 'Results-Oriented Portfolio Banayein',
                hnBody: 'Sirf design ya code na dikhayein, batayein ke aapke kaam se client ko kya faida hua.',
                badge: 'PORTFOLIO'
            },
            {
                enTitle: 'Refine Your Cold Outreach Engine',
                enBody: 'Send hyper-personalized video audits or teardowns. 10 tailored pitches crush 100 generic copy-pastes.',
                hnTitle: 'Personalized Outreach Karein',
                hnBody: 'Copy-paste messages se clients nahi miltay. Custom audit ya video bhej kar attention lein.',
                badge: 'CLIENT ACQUISITION'
            },
            {
                enTitle: 'Transition to Value-Based Retainers',
                enBody: 'Avoid feast-and-famine cycles. Package monthly maintenance and growth advisory into sticky retainers.',
                hnTitle: 'Monthly Retainers Par Shuru Karein',
                hnBody: 'Har mahinay naye client dhoondne ki bajaye purane clients ko ongoing support offer karein.',
                badge: 'RETAINERS'
            },
            {
                enTitle: 'Over-Deliver On First Milestones',
                enBody: 'Early impressions forge lifelong trust. Finish 24 hours early and include an unrequested bonus asset.',
                hnTitle: 'Pehli Delivery Mein Dil Jeet Lein',
                hnBody: 'Time se pehle kaam deliver karein aur chota sa extra bonus add karein taake repeat work milay.',
                badge: 'REPEAT SALES'
            }
        ];
    } else if (lower.includes('linkedin') || lower.includes('brand') || lower.includes('growth') || lower.includes('content') || lower.includes('follower')) {
        hookBadge = 'VIRAL FORMULA';
        defaultHook = `${cleanTopic}: Zero To 100k Reach`;
        defaultSub = `The exact content playbook used by the top 1% of creators.`;
        nicheTips = [
            {
                enTitle: 'The 3-Second Hook Rule',
                enBody: '80% of readers bounce on the headline. Use curiosity gaps, bold numbers, and contrarian perspectives.',
                hnTitle: '3-Second Hook Ka Kamal',
                hnBody: 'Pehli line aisi ho jo scroll rokay. Numbers aur curiosity se log pura swipe karte hain.',
                badge: 'RETENTION'
            },
            {
                enTitle: 'Give Away Your Best Secrets Free',
                enBody: 'Hoarding insights kills reach. Share actionable breakdowns so readers immediately think: "Imagine their paid work!"',
                hnTitle: 'Best Secrets Khul Kar Share Karein',
                hnBody: 'Valuable insights free dein taake log aapki authority aur expertise ko foran pehchaan sakein.',
                badge: 'AUTHORITY'
            },
            {
                enTitle: 'Optimize Visual Formatting',
                enBody: 'People scan before they read. Use short punchy lines, white space, and bold lead-ins for mobile screens.',
                hnTitle: 'Mobile-Friendly Formatting',
                hnBody: 'Barray paragraphs mat likhein. Choti lines aur bullets mobile users ke liye behtareen hain.',
                badge: 'READABILITY'
            },
            {
                enTitle: 'Engage 15 Mins Before & After Posting',
                enBody: 'Algorithms reward active community members. Leave insightful comments on 10 top creators in your niche daily.',
                hnTitle: 'Posting Ke Sath Engagement Zaroori Hai',
                hnBody: 'Post karne ke sath sath doosre creators ki posts par thoughtful comments zaroor karein.',
                badge: 'ALGORITHM'
            },
            {
                enTitle: 'Double Down On Winning Formats',
                enBody: 'Study your top 10% performing posts. Repurpose winning hooks and frameworks into fresh carousel designs.',
                hnTitle: 'Top Posts Ko Repurpose Karein',
                hnBody: 'Jo content pehle viral hua, usko naye andaz aur carousels mein dobara present karein.',
                badge: 'SCALING'
            }
        ];
    } else {
        // General High-Impact Framework
        hookBadge = 'ACTIONABLE BLUEPRINT';
        defaultHook = `Cracking ${cleanTopic}`;
        defaultSub = `5 Core frameworks to accelerate your trajectory and avoid painful roadblocks.`;
        nicheTips = [
            {
                enTitle: 'Focus On High-Leverage Activities',
                enBody: '80% of breakthrough results stem from 20% of core actions. Relentlessly eliminate busywork.',
                hnTitle: 'Sirf High-Impact Kaam Karein',
                hnBody: 'Har kaam zaroori nahi hota. Pehle un cheezon par focus karein jo sab se bara result deti hain.',
                badge: 'LEVERAGE'
            },
            {
                enTitle: 'Build Frictionless Daily Rituals',
                enBody: 'Motivation is fleeting; systems are permanent. Design routines that make consistency automatic.',
                hnTitle: 'Daily Habits Ka Mazboot System',
                hnBody: 'Jazba khatam ho sakta hai lekin daily routine hamesha sath deti hai. Consistency hi key hai.',
                badge: 'SYSTEMS'
            },
            {
                enTitle: 'Iterate Faster Than The Competition',
                enBody: 'Perfectionism is disguised fear. Launch the imperfect draft, gather real data, and polish dynamically.',
                hnTitle: 'Ghaltiyon Se Seekh Kar Fast Agay Barhein',
                hnBody: 'Perfect time ka intezar mat karein. Shuru karein aur har hafte apne kaam ko behtar banayein.',
                badge: 'SPEED'
            },
            {
                enTitle: 'Leverage Compounding Growth',
                enBody: 'Tiny 1% improvements everyday yield massive exponential leaps over a 12-month horizon.',
                hnTitle: 'Rozana 1% Behtar Banein',
                hnBody: 'Choti choti daily progress saal ke aakhir mein aik bohat bara transformational result banti hai.',
                badge: 'COMPOUNDING'
            },
            {
                enTitle: 'Protect Your Energy & Focus',
                enBody: 'Burnout destroys momentum. Protect 2 hours of uninterrupted deep work before checking notifications.',
                hnTitle: 'Deep Work Aur Focus Ko Protect Karein',
                hnBody: 'Distractions se bachein aur din ke pehle 2 ghantay sirf sab se zaroori kaam ko dein.',
                badge: 'PEAK FOCUS'
            }
        ];
    }

    const slides: Slide[] = [];

    // Title Slide
    let finalTitle = defaultHook;
    let finalSub = defaultSub;
    if (isHinglish) {
        finalTitle = `${cleanTopic}: Kamyabi Ka Secret`;
        finalSub = `Ye actionable baatein aapko 10x aage le jayengi. Swipe karein!`;
    } else if (isUrdu) {
        finalTitle = `${cleanTopic} • کامیابی کا طریقہ`;
        finalSub = `Proven principles used by top industry leaders to achieve extraordinary results.`;
    }

    slides.push({
        slide_number: 1,
        type: 'title',
        title: finalTitle,
        subtitle: finalSub,
        badge: hookBadge
    });

    // Middle Content Slides
    const neededContent = Math.max(slideCount - 2, 2);
    for (let i = 0; i < neededContent; i++) {
        const item = nicheTips[i % nicheTips.length];
        slides.push({
            slide_number: slides.length + 1,
            type: 'content',
            title: isHinglish ? item.hnTitle : item.enTitle,
            body: isHinglish ? item.hnBody : item.enBody,
            badge: item.badge
        });
    }

    // CTA Slide
    let ctaTitle = 'Found This Valuable?';
    let ctaBody = 'Repost to help someone in your network.\nSave for later and follow for daily actionable guides!';
    let ctaBadge = 'SAVE & SHARE';

    if (isHinglish) {
        ctaTitle = 'Faida Hua? Post Save Karain!';
        ctaBody = 'Apne doston ke sath share karein aur aisi mazeed actionable posts ke liye follow zaroor karein!';
        ctaBadge = 'SHARE WITH DOST';
    } else if (isUrdu) {
        ctaTitle = 'Save This Post • محفوظ کریں';
        ctaBody = 'Turn your vision into reality today. Follow for more high-impact carousels!';
        ctaBadge = 'TAKE ACTION';
    }

    slides.push({
        slide_number: slides.length + 1,
        type: 'cta',
        title: ctaTitle,
        body: ctaBody,
        badge: ctaBadge
    });

    return slides;
}

export const AIService = {
    /**
     * Main Entrypoint for Carousel Generation
     * Priority: Selected Provider Key -> Gemini Free Key -> Groq Free Key -> Claude Key -> Dynamic Niche Engine
     */
    async generateCarouselContent(
        topic: string,
        tone: string,
        slideCount: number = 6,
        overrideApiKey?: string
    ): Promise<Slide[]> {
        if (!topic.trim()) {
            throw new Error('Please enter a carousel topic or title.');
        }

        const geminiKey = StorageService.getGeminiApiKey();
        const groqKey = StorageService.getGroqApiKey();
        const claudeKey = StorageService.getApiKey();
        const providerChoice = StorageService.getAiProvider();

        console.log(`[AIService] Generating carousel with provider choice: ${providerChoice}`);

        // 1. If overrideApiKey or explicit choice is Google Gemini
        if ((providerChoice === 'gemini' && geminiKey) || (overrideApiKey && overrideApiKey.startsWith('AIzaSy'))) {
            const key = overrideApiKey?.startsWith('AIzaSy') ? overrideApiKey : geminiKey;
            try {
                console.log('[AIService] Calling Google Gemini 2.0 Flash (Free API)...');
                const slides = await callGeminiApi(topic, tone, slideCount, key);
                if (slides && slides.length >= 3) return slides;
            } catch (err: any) {
                console.error('[AIService] Gemini API error:', err.message);
                throw new Error(`Google Gemini Error: ${err.message}`);
            }
        }

        // 2. If choice is Groq
        if ((providerChoice === 'groq' && groqKey) || (overrideApiKey && overrideApiKey.startsWith('gsk_'))) {
            const key = overrideApiKey?.startsWith('gsk_') ? overrideApiKey : groqKey;
            try {
                console.log('[AIService] Calling Groq Cloud (Free Llama 3.3 70B)...');
                const slides = await callGroqApi(topic, tone, slideCount, key);
                if (slides && slides.length >= 3) return slides;
            } catch (err: any) {
                console.error('[AIService] Groq API error:', err.message);
                throw new Error(`Groq Error: ${err.message}`);
            }
        }

        // 3. If choice is Claude
        if ((providerChoice === 'claude' && claudeKey) || (overrideApiKey && overrideApiKey.startsWith('sk-ant-'))) {
            const key = overrideApiKey?.startsWith('sk-ant-') ? overrideApiKey : claudeKey;
            try {
                console.log('[AIService] Calling Claude 3.5 Sonnet...');
                const slides = await callClaudeApi(topic, tone, slideCount, key);
                if (slides && slides.length >= 3) return slides;
            } catch (err: any) {
                console.error('[AIService] Claude API error:', err.message);
                throw new Error(`Claude Error: ${err.message}`);
            }
        }

        // 4. Auto-detect any configured free key if provider was not explicitly locked
        if (geminiKey) {
            try {
                console.log('[AIService] Auto-detect: using stored Gemini Key...');
                return await callGeminiApi(topic, tone, slideCount, geminiKey);
            } catch (e) {
                console.warn('Auto Gemini attempt failed:', e);
            }
        }

        if (groqKey) {
            try {
                console.log('[AIService] Auto-detect: using stored Groq Key...');
                return await callGroqApi(topic, tone, slideCount, groqKey);
            } catch (e) {
                console.warn('Auto Groq attempt failed:', e);
            }
        }

        // 5. Dynamic Smart Niche Engine (Instant, high-quality, topic-relevant trending content)
        console.log('[AIService] Generating trending slides via Dynamic Niche Engine...');
        return generateDynamicNicheSlides(topic, tone, slideCount);
    },

    /**
     * Test an API Key connection directly
     */
    async testConnection(provider: 'gemini' | 'groq' | 'claude', key: string): Promise<boolean> {
        if (!key.trim()) return false;
        try {
            if (provider === 'gemini') {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key.trim()}`;
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ role: 'user', parts: [{ text: 'OK' }] }]
                    })
                });
                return res.ok;
            }
            if (provider === 'groq') {
                const url = 'https://api.groq.com/openai/v1/chat/completions';
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${key.trim()}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'openai/gpt-oss-120b',
                        messages: [{ role: 'user', content: 'Say OK' }],
                        max_tokens: 5
                    })
                });
                return res.ok;
            }
            if (provider === 'claude') {
                const res = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                        'x-api-key': key.trim(),
                        'anthropic-version': '2023-06-01',
                        'content-type': 'application/json',
                        'dangerously-allow-browser': 'true'
                    },
                    body: JSON.stringify({
                        model: 'claude-3-5-sonnet-20241022',
                        max_tokens: 10,
                        messages: [{ role: 'user', content: 'Say OK' }]
                    })
                });
                return res.ok;
            }
            return false;
        } catch (e) {
            return false;
        }
    }
};
