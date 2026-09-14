import type { Slide } from '../types/carousel';

export const ClaudeService = {
    async generateCarouselContent(
        topic: string,
        tone: string,
        slideCount: number = 6,
        apiKey: string
    ): Promise<Slide[]> {
        if (!apiKey) {
            throw new Error("Please configure your Claude API Key first by clicking the 'API Key' button in the header.");
        }

        const systemPrompt = `You are a premium social media manager and growth strategist specializing in the Pakistani market (LinkedIn and Instagram). 
Your task is to generate highly engaging, copywritten carousel content of exactly ${slideCount} slides.
The carousel flow must be:
- Slide 1: High-impact Title Slide (Catchy headline, hook, subtitle).
- Slide 2 to ${slideCount - 1}: Content Slides (Educational value, actionable tips, facts, step-by-step guidance).
- Slide ${slideCount}: Strong CTA (Call To Action) Slide (e.g. Follow, share, save, leave a comment).

Tone & Language Guidelines based on user choice:
1. "english": Professional, fluent, tailored to the Pakistani corporate/freelancer/tech ecosystem on LinkedIn.
2. "hinglish": Roman Urdu/Hindi mixed with English. Friendly, conversational, using words like 'dost', 'kamyaabi', 'faida', 'karain', 'sochain'.
3. "bilingual": English main heading, but with Urdu script translations/subtitles (Noto Nastaliq Urdu style target).

Format your output ONLY as a raw JSON array of ${slideCount} objects. Do not include markdown code block formatting or any intro/outro text. Just output the clean JSON.
JSON Structure:
[
  {
    "slide_number": 1,
    "type": "title",
    "title": "Title Text",
    "subtitle": "Subtitle or Hook Text",
    "badge": "Topic Category or Hook tag"
  },
  {
    "slide_number": 2,
    "type": "content",
    "title": "Content Heading 1",
    "body": "Body text or bullet points (keep it concise, maximum 150 characters)",
    "badge": "Step 1 or Tip 1"
  },
  ...
  {
    "slide_number": ${slideCount},
    "type": "cta",
    "title": "Call To Action Heading",
    "body": "Actionable closing sentence (e.g., Save this post or follow for more tips)",
    "badge": "Share / Save"
  }
]`;

        const userPrompt = `Generate a ${slideCount}-slide carousel about the topic: "${topic}" in style: "${tone}".`;

        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json',
                    'dangerously-allow-browser': 'true'
                },
                body: JSON.stringify({
                    model: 'claude-3-5-sonnet-20241022',
                    max_tokens: 2000,
                    system: systemPrompt,
                    messages: [
                        { role: 'user', content: userPrompt }
                    ]
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                const errMsg = errData?.error?.message || `HTTP error! status: ${response.status}`;
                
                if (response.status === 0 || errMsg.includes('CORS')) {
                    throw new Error("CORS restriction: Direct client-side calls to Anthropic API are blocked by the browser. You can use a local reverse proxy, browser extension for dev, or deploy a lightweight backend API route.");
                }
                throw new Error(errMsg);
            }

            const data = await response.json();
            const textContent = data.content?.[0]?.text || '';
            
            let jsonString = textContent.trim();
            if (jsonString.startsWith('```')) {
                jsonString = jsonString.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
            }

            const parsedSlides: Slide[] = JSON.parse(jsonString);
            if (!Array.isArray(parsedSlides) || parsedSlides.length === 0) {
                throw new Error("Invalid structure returned from Claude AI. Please check your topic and try again.");
            }

            return parsedSlides;
        } catch (error) {
            console.error("Claude Generation Error:", error);
            throw error;
        }
    }
};
