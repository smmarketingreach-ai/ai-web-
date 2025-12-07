import { GoogleGenAI, Type } from "@google/genai";
import { AudienceResult, CopyResult, CreativeAnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Using 'gemini-2.5-flash' which supports thinkingConfig
const MODEL_NAME = 'gemini-2.5-flash';

export const generateAudienceData = async (
  productName: string,
  productDescription: string,
  baseDemographic: string
): Promise<AudienceResult[]> => {
  // Enhanced prompt with "Chain of Thought" instructions
  const prompt = `
    Role: World-Class Facebook Ads Media Buyer (ex-Meta algorithm engineer).
    Task: Architect 3 separate, high-performance targeting avatars for a campaign.
    
    Product: ${productName}
    Deep Analysis: ${productDescription}
    Base Geo/Demo: ${baseDemographic}

    Objective:
    - Dig deeper than surface-level interests. Find the "hidden" pockets of buyers.
    - Use lateral thinking to find interests that correlate with the buyer persona, even if not directly related to the product.
    
    Required Output Structure (Array of 3 Objects):
    1. Segment Name: Catchy internal name for this ad set.
    2. Interests: 7-10 specific, targetable interest keywords. Mix of broad and niche.
    3. Behaviors: 2-3 purchasing behaviors or digital activities (e.g. "Facebook Payments Users").
    4. Exclusions: 2-3 specific audiences to exclude to save money (e.g. "Dropshipping" interests if selling to consumers, or "Unemployed" signals).
    5. Demographics: Specific age range, gender, and location nuances.
    6. Reasoning: A "ChatGPT-style" explanation of *why* this specific combination triggers the algorithm to find buyers.
    7. Match Score: A number between 75-99 indicating potential conversion rate.
    8. Estimated Reach: A realistic reach range string (e.g. "1.2M - 1.5M").
    9. Persona Emoji: A single emoji that best represents this audience avatar.

    Strategy for the 3 Segments:
    - Segment 1: The "Direct Intent" Layer (People actively looking).
    - Segment 2: The "Competitor/Brand" Layer (People following adjacent brands).
    - Segment 3: The "Psychographic/Lifestyle" Layer (People whose identity matches the product utility).
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2048 }, // Enable thinking for better reasoning
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              segmentName: { type: Type.STRING },
              interests: { type: Type.ARRAY, items: { type: Type.STRING } },
              demographics: { type: Type.STRING },
              behaviors: { type: Type.ARRAY, items: { type: Type.STRING } },
              exclusions: { type: Type.ARRAY, items: { type: Type.STRING } },
              reasoning: { type: Type.STRING },
              matchScore: { type: Type.NUMBER },
              estimatedReach: { type: Type.STRING },
              personaEmoji: { type: Type.STRING }
            },
            required: ["segmentName", "interests", "demographics", "behaviors", "exclusions", "reasoning", "matchScore", "estimatedReach", "personaEmoji"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AudienceResult[];
    }
    throw new Error("No data returned from Gemini");
  } catch (error) {
    console.error("Audience Generation Error:", error);
    throw error;
  }
};

export const generateAdCopyData = async (
  productName: string,
  sellingPoints: string,
  tone: string
): Promise<CopyResult[]> => {
  const prompt = `
    Role: Legendary Direct Response Copywriter (Style of Ogilvy meets modern viral marketing).
    Task: Write 3 extremely distinct ad variations.
    
    Product: ${productName}
    USP/Benefits: ${sellingPoints}
    Tone: ${tone}

    Guidelines:
    - Use "Pattern Interrupts" in the first sentence.
    - Use psychological triggers: Scarcity, Urgency, Curiosity, Social Proof.
    - Format with line breaks for readability (mobile-first).
    - Use emojis strategically but not excessively.
    
    Variations:
    1. The "Story/Testimonial" Angle: Written from a user's perspective (UGC style).
    2. The "Us vs Them" Angle: Why this product kills the competition.
    3. The "Direct Benefit/Offer" Angle: Straight to the point, heavy on value proposition.

    Output Fields:
    - Headline: Max 7 words. Punchy.
    - Primary Text: The main caption. 3-5 short paragraphs.
    - Description: The CTA line next to the button.
    - Angle: Name of the strategy used.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2048 }, // Enable thinking
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              angle: { type: Type.STRING },
              headline: { type: Type.STRING },
              primaryText: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["angle", "headline", "primaryText", "description"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as CopyResult[];
    }
    throw new Error("No data returned from Gemini");
  } catch (error) {
    console.error("Ad Copy Generation Error:", error);
    throw error;
  }
};

export const analyzeCreative = async (
  base64Data: string,
  mimeType: string,
  context?: string
): Promise<CreativeAnalysisResult> => {
  const isVideo = mimeType.startsWith('video/');
  
  const prompt = `
    Act as a Facebook Ads Creative Strategist.
    Analyze the attached ad creative (${isVideo ? 'Video' : 'Image'}).
    Context provided by user: ${context || "None provided"}.

    Evaluate based on:
    1. Stopping Power (Does the hook/visual grab attention immediately?)
    2. Clarity (Is the message/product clear?)
    3. Call to Action (Is it obvious what to do?)
    ${isVideo ? '4. Pacing & Engagement (Is the video fast-paced? Does it hold retention?)' : ''}

    Provide a score from 1-100, list strengths, weaknesses, suggested improvements, and an overall verdict.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          { text: prompt }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 1024 }, // Enable thinking for vision analysis
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            stopScrollPotential: { type: Type.STRING, description: "High, Medium, or Low" },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            overallFeedback: { type: Type.STRING }
          },
          required: ["score", "stopScrollPotential", "strengths", "weaknesses", "improvements", "overallFeedback"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as CreativeAnalysisResult;
    }
    throw new Error("No data returned from Gemini");
  } catch (error) {
    console.error("Creative Analysis Error:", error);
    throw error;
  }
};

export const sendChatMessage = async (message: string, history: {role: 'user' | 'model', text: string}[]): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: MODEL_NAME,
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
      config: {
        systemInstruction: `You are AdsBoot AI, a world-class Marketing Strategist & Media Buyer.
        
        Your Capabilities:
        - Analyze marketing problems with depth and nuance.
        - Provide specific, actionable advice for Facebook/Instagram/TikTok ads.
        - Write direct-response copy if asked.
        - Suggest detailed audience targeting stacks.
        
        Personality:
        - Professional but accessible.
        - Results-oriented (ROAS focused).
        - Use formatting (bullet points, bold text) to make long answers readable.
        
        When asked about targeting or copy, do not give generic advice. Give specific interests, headlines, and frameworks.`
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};