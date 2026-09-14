/**
 * claude.js
 * Claude API Integration module for generating carousel slide content
 */

const ClaudeAPI = {
    apiKey: localStorage.getItem('claude_api_key') || '',
    
    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('claude_api_key', key);
    },

    getApiKey() {
        return this.apiKey;
    },

    /**
     * Generates carousel content using Claude API
     * @param {string} topic Topic of the carousel
     * @param {string} tone Language and tone preference ('english', 'hinglish', 'bilingual')
     * @returns {Promise<Array>} List of 6 slide objects
     */
    async generateCarouselContent(topic, tone) {
        if (!this.apiKey) {
            throw new Error("Please configure your Claude API Key first by clicking the 'Key' button.");
        }

        const systemPrompt = `You are a premium social media manager and growth strategist specializing in the Pakistani market (LinkedIn and Instagram). 
Your task is to generate highly engaging, copywritten carousel content of exactly 6 slides.
The carousel flow must be:
- Slide 1: High-impact Title Slide (Catchy headline, hook, subtitle).
- Slide 2 to 5: Content Slides (Educational value, actionable tips, facts, step-by-step guidance).
- Slide 6: Strong CTA (Call To Action) Slide (e.g. Follow, share, save, leave a comment).

Tone & Language Guidelines based on user choice:
1. "english": Professional, fluent, tailored to the Pakistani corporate/freelancer/tech ecosystem on LinkedIn.
2. "hinglish": Roman Urdu/Hindi mixed with English. Friendly, conversational, using words like 'dost', 'kamyaabi', 'faida', 'karain', 'sochain'.
3. "bilingual": English main heading, but with Urdu script translations/subtitles (Nastaliq style target).

Format your output ONLY as a raw JSON array of 6 objects. Do not include markdown code block formatting or any intro/outro text. Just output the clean JSON.
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
    "slide_number": 6,
    "type": "cta",
    "title": "Call To Action Heading",
    "body": "Actionable closing sentence (e.g., Save this post or follow for more tips)",
    "badge": "Share / Save"
  }
]`;

        const userPrompt = `Generate a 6-slide carousel about the topic: "${topic}" in style: "${tone}".`;

        try {
            // Note: Since Anthropic API requires CORS and doesn't allow direct client-side origin headers from browser,
            // we will make the call to a CORS-friendly proxy or directly with custom headers. 
            // For developers running this locally/privately, we provide a direct fetch call.
            // If CORS fails, we guide them or fallback gracefully.
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'x-api-key': this.apiKey,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json',
                    'dangerously-allow-browser': 'true' // In case Anthropic library/headers are evaluated
                },
                body: JSON.stringify({
                    model: 'claude-3-5-sonnet-20241022',
                    max_tokens: 1500,
                    system: systemPrompt,
                    messages: [
                        { role: 'user', content: userPrompt }
                    ]
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                const errMsg = errData?.error?.message || `HTTP error! status: ${response.status}`;
                
                // If it's a CORS issue, let's warn the user and show options
                if (response.status === 0 || errMsg.includes('CORS')) {
                    throw new Error("CORS validation failed. Since you're running client-side, please use a local proxy or run Chrome with web security disabled for development, or deploy a simple Vercel serverless function.");
                }
                throw new Error(errMsg);
            }

            const data = await response.json();
            const textContent = data.content[0].text;
            
            // Clean up the JSON if Claude wrapped it in markdown code blocks
            let jsonString = textContent.trim();
            if (jsonString.startsWith('```')) {
                jsonString = jsonString.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
            }

            const parsedSlides = JSON.parse(jsonString);
            if (!Array.isArray(parsedSlides) || parsedSlides.length !== 6) {
                throw new Error("Invalid structure returned from AI. Generating mock template fallback.");
            }

            return parsedSlides;
        } catch (error) {
            console.error("Claude Generation Error:", error);
            throw error;
        }
    }
};
