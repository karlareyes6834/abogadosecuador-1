import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY || ''; 
  // In a real app, we would handle the missing key more gracefully in the UI.
  // For this demo, we assume the environment injects it.
  return new GoogleGenAI({ apiKey });
};

export const getMarketAnalysis = async (pair: string): Promise<string> => {
  try {
    const ai = getClient();
    const model = "gemini-2.5-flash";
    const prompt = `
      Act as a senior financial analyst for a crypto exchange. 
      Provide a concise, 3-sentence technical analysis for ${pair} based on general market trends you know up to your knowledge cutoff. 
      Focus on volatility and resistance levels. Do not give financial advice.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Market analysis currently unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI Analysis offline. Please check network or API key.";
  }
};

export const getP2PDisputeAdvice = async (issueType: string): Promise<string> => {
  try {
    const ai = getClient();
    const model = "gemini-2.5-flash";
    const prompt = `
      Act as an impartial P2P crypto escrow mediator.
      A user is reporting a "${issueType}" issue.
      Provide a checklist of 3 steps the user should take immediately to secure evidence for the dispute.
      Keep it professional and brief.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Support services currently unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Support AI offline.";
  }
};
