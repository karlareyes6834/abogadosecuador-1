import { GoogleGenAI, Type } from "@google/genai";
import { WebAppComponent } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this environment, we assume it's always present.
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

// Centralized error parser for consistent error messages.
const parseGeminiError = (error: any): { title: string, message: string } => {
    console.error("Gemini API Error:", error);
    
    let title = 'Error de IA';
    let message = 'Un error inesperado ocurrió al contactar la IA. Por favor, inténtalo de nuevo más tarde.';

    // Check for the nested 'error' object structure from the Gemini API
    if (error && typeof error === 'object' && 'error' in error) {
        const errorDetails = error.error as { code?: number; status?: string; message?: string };
        if (errorDetails) {
            if (errorDetails.code === 429 || errorDetails.status === 'RESOURCE_EXHAUSTED') {
                title = 'Límite de Cuota Excedido';
                message = 'Has excedido tu cuota de uso de la API. Por favor, revisa tu plan y facturación, o inténtalo de nuevo más tarde.';
            } else if (errorDetails.code === 500 || errorDetails.status === 'UNKNOWN' || (errorDetails.message && errorDetails.message.toLowerCase().includes('rpc failed'))) {
                title = 'Error del Servidor de IA';
                message = 'El servicio de IA está experimentando problemas temporales. Por favor, inténtalo de nuevo en unos minutos.';
            } else if (errorDetails.message) {
                // Use the API's message for other client-side errors, but keep a user-friendly title.
                message = `No se pudo completar la solicitud. ${errorDetails.message}`;
            }
        }
    } else if (error instanceof Error) {
        // Fallback for generic JavaScript errors
        message = error.message;
    }
    
    return { title, message };
};


const generateContent = async (prompt: string, systemInstruction?: string): Promise<string> => {
    if (!API_KEY) return "API Key no configurada. Por favor, configura la variable de entorno API_KEY.";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction,
                thinkingConfig: { thinkingBudget: 0 } // For faster responses
            }
        });
        return response.text.trim();
    } catch (error) {
        const { title, message } = parseGeminiError(error);
        return `${title}: ${message}`;
    }
};

export const getMotivationalQuote = async (): Promise<string> => {
  const prompt = `Genera una frase motivacional corta, poderosa e inspiradora en español. Debe ser concisa, memorable y adecuada para un profesional que busca el éxito. Estilo estoico o de líder de negocios.`;
  const systemInstruction = "Responde únicamente con la frase motivacional. No incluyas 'Claro, aquí tienes:' ni ninguna otra introducción. Solo el texto de la frase.";
  return generateContent(prompt, systemInstruction);
};

export const getSalesTip = async (): Promise<string> => {
  const prompt = `Genera un único consejo de ventas, accionable y moderno para un usuario de CRM. El consejo debe estar en español y no tener más de dos frases. Enfócate en la construcción de relaciones o en la eficiencia.`;
  const systemInstruction = "Responde únicamente con el consejo de ventas. No incluyas ninguna introducción o texto adicional. Solo el consejo.";
  return generateContent(prompt, systemInstruction);
};

interface LeadData {
  name: string;
  company: string;
  value: number;
  interactions?: any[];
}

export const analyzeLead = async (leadData: LeadData): Promise<{ summary: string; score: 'Hot' | 'Warm' | 'Cold'; nextAction: string; } | null> => {
    if (!API_KEY) {
        console.error("AI analysis requires an API Key.");
        return null;
    }

    const schema = {
        type: Type.OBJECT,
        properties: {
            summary: {
                type: Type.STRING,
                description: "A brief, insightful summary of the lead and their potential. Mention key positive or negative signals.",
            },
            score: {
                type: Type.STRING,
                description: 'The lead score. Must be one of: "Hot", "Warm", or "Cold".',
                enum: ["Hot", "Warm", "Cold"],
            },
            nextAction: {
                type: Type.STRING,
                description: "The single best, most actionable next step to take with this lead. Be specific (e.g., 'Send proposal template X', 'Call to clarify budget', 'Add to nurturing sequence Y').",
            },
        },
        required: ["summary", "score", "nextAction"],
    };
    
    const enrichedLeadData = {
        ...leadData,
        interactions: [
            { type: 'website_visit', page: '/pricing', duration_seconds: 120 },
            { type: 'form_fill', form_name: 'Contact Us' },
            { type: 'email_open', subject: 'Welcome to NexusPro!' },
        ]
    };

    const fullPrompt = `You are an expert sales assistant AI for "NexusPro.io", a SaaS platform providing CRM, marketing automation, and more. Your task is to analyze a lead's data and provide a concise, actionable summary. Based on the data, determine a lead score ('Hot', 'Warm', or 'Cold') and suggest the single most effective next action to move the deal forward.
    
    - **Hot**: High engagement, clear need, budget likely available. Ready for a sales call or proposal.
    - **Warm**: Showing interest, but may need more nurturing or qualification.
    - **Cold**: Low engagement, unclear need. Should be added to an automated sequence.

    The response must be a valid JSON object.

    Lead Data: ${JSON.stringify(enrichedLeadData, null, 2)}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.3,
            }
        });
        
        let jsonStr = response.text.trim();
        
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.slice(7, -3).trim();
        }

        return JSON.parse(jsonStr);

    } catch (error) {
        const { title, message } = parseGeminiError(error);
        console.error(`${title}: ${message}`);
        return null;
    }
};


export const extractLeadFromConversation = async (conversationHistory: string): Promise<{
    name: string;
    company?: string;
    email?: string;
    phone?: string;
    interest: string;
    value: number;
    score: 'Hot' | 'Warm' | 'Cold';
} | null> => {
    if (!API_KEY) {
        console.error("API Key no configurada.");
        return null;
    }

    const schema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "The full name of the potential lead mentioned in the conversation." },
            company: { type: Type.STRING, description: "The company name of the lead, if mentioned." },
            email: { type: Type.STRING, description: "The email address of the lead, if mentioned." },
            phone: { type: Type.STRING, description: "The phone number of the lead, if mentioned." },
            interest: { type: Type.STRING, description: "A brief summary of what the lead is interested in." },
            value: { type: Type.NUMBER, description: "An estimated deal value in USD based on the conversation. If not mentioned, estimate based on interest (e.g., standard plan is $39). Default to 0 if not estimable." },
            score: { type: Type.STRING, description: 'The lead score based on urgency and interest. Must be one of: "Hot", "Warm", or "Cold".', enum: ["Hot", "Warm", "Cold"] }
        },
        required: ["name", "interest", "score", "value"],
    };
    
    const fullPrompt = `You are an expert CRM assistant. Your task is to analyze a conversation and extract key information to create a new lead. Identify the person's name, company (if available), and their primary interest. Based on their language (urgency, specific questions), assign a lead score. The response must be a valid JSON object.

Conversation History:
---
${conversationHistory}
---
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.3,
            }
        });
        
        let jsonStr = response.text.trim();
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.slice(7, -3).trim();
        }
        return JSON.parse(jsonStr);
    } catch (error) {
        const { title, message } = parseGeminiError(error);
        console.error(`${title}: ${message}`);
        return null;
    }
};


export const generateWebApp = async (prompt: string): Promise<any> => {
    if (!API_KEY) return { error: { title: 'API Key no configurada', message: 'La clave API para los servicios de IA no está configurada.' } };

    const componentProperties = {
        type: Type.OBJECT,
        properties: {
            // Re-using simplified props for components
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            text: { type: Type.STRING },
            cta: { type: Type.STRING },
            imageUrl: { type: Type.STRING, description: 'A valid URL from unsplash.com.' },
            features: {
                type: Type.ARRAY,
                items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING } } }
            }
        }
    };
    
    const pageSchema = {
      type: Type.OBJECT,
      properties: {
        isProtected: { type: Type.BOOLEAN },
        path: { type: Type.STRING, description: "URL path, e.g., '/login'." },
        components: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ["Header", "Hero", "FeatureGrid", "Card", "Text", "Button", "ContactForm", "LoginForm", "RegisterForm", "DashboardLayout", "Footer"] },
              props: componentProperties
            }
          }
        }
      }
    };

    const dataModelSchema = {
        type: Type.OBJECT,
        properties: {
           fields: {
               type: Type.ARRAY,
               items: {
                   type: Type.OBJECT,
                   properties: { name: { type: Type.STRING }, type: { type: Type.STRING, enum: ["id", "string", "number", "boolean", "date"] } }
               }
           },
           initialData: { type: Type.ARRAY, items: { type: Type.OBJECT, additionalProperties: true } }
        }
    };

    const schema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "A short, catchy name for the web application." },
            theme: {
                type: Type.OBJECT,
                properties: {
                    primaryColor: { type: Type.STRING, description: "A hex color code for the primary brand color, e.g., '#6D28D9'." },
                    font: { type: Type.STRING, description: "A Google Font name, e.g., 'Inter' or 'Poppins'." },
                }
            },
            dataModels: {
                type: Type.OBJECT,
                description: "Data models. MUST include a 'users' model with name, email, password fields.",
                properties: {
                    users: dataModelSchema
                },
                additionalProperties: dataModelSchema
            },
            pages: {
                type: Type.OBJECT,
                description: "All pages. MUST include 'home', 'login', 'register', and a protected 'dashboard' page.",
                properties: {
                    home: pageSchema,
                    login: pageSchema,
                    register: pageSchema,
                    dashboard: pageSchema
                }
            }
        },
        required: ["name", "theme", "dataModels", "pages"]
    };

    const fullPrompt = `You are a world-class full-stack software architect. Your task is to design a complete web application based on a user's prompt. You must generate a JSON object that defines the entire application structure, including data models, pages (both public and protected), and a visual theme.

The application must be fully functional for a demo, including login, registration, and a dashboard.

**Requirements:**
1.  **Data Models:** You MUST define a 'users' data model with at least 'id', 'name', 'email', and 'password' fields. You can define other models relevant to the prompt (e.g., 'tasks', 'products'), including sensible 'initialData'.
2.  **Pages:** You MUST define the following pages:
    *   'home': A public landing page.
    *   'login': A public login form using the 'LoginForm' component.
    *   'register': A public registration form using the 'RegisterForm' component.
    *   'dashboard': A protected page that serves as the main application interface, using the 'DashboardLayout' component.
3.  **Page Components:** Each page must be composed of an array of components. Use the component library provided in the schema. The components must be logically ordered and styled professionally.
4.  **Content:** All copy (titles, text, etc.) must be professional, engaging, and tailored to the user's prompt.
5.  **Images:** For ALL images, use real, valid placeholder URLs from Unsplash (e.g., "https://images.unsplash.com/photo-...").

User Prompt: "${prompt}"

Return only the valid JSON object conforming to the schema. Do not include markdown backticks or any other text.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.4
            }
        });
        
        let jsonStr = response.text.trim();
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.slice(7);
            if(jsonStr.endsWith('```')) {
                jsonStr = jsonStr.slice(0, -3);
            }
        }
        jsonStr = jsonStr.trim();
        const parsedJson = JSON.parse(jsonStr);

        // Add IDs to all components for easier management in the editor
        Object.values(parsedJson.pages).forEach((page: any) => {
            if (page.components && Array.isArray(page.components)) {
                page.components.forEach((comp, index) => {
                    comp.id = `${page.path.replace('/', '')}-${index}-${Date.now()}`;
                });
            }
        });

        return parsedJson;

    } catch (error) {
        const { title, message } = parseGeminiError(error);
        return { error: { title, message } };
    }
};

export const modifyWebAppPage = async (prompt: string, components: WebAppComponent[]): Promise<{ components: WebAppComponent[], reply: string } | { error: { title: string, message: string } }> => {
    if (!API_KEY) return { error: { title: 'API Key no configurada', message: 'La clave API para los servicios de IA no está configurada.' } };

    // Define a flexible schema for component properties
    const componentPropertiesSchema = {
        type: Type.OBJECT,
        additionalProperties: true // Allow any properties
    };
    
    const componentSchema = {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        type: { type: Type.STRING },
        props: componentPropertiesSchema
      },
      required: ["id", "type", "props"]
    };

    const schema = {
        type: Type.OBJECT,
        properties: {
            reply: {
                type: Type.STRING,
                description: "A short, conversational response confirming the action taken (e.g., 'Ok, I've updated the title.')."
            },
            components: {
                type: Type.ARRAY,
                description: "The complete, updated array of all components for the page.",
                items: componentSchema
            }
        },
        required: ["reply", "components"]
    };

    const fullPrompt = `You are an expert web developer AI integrated into a real-time website editor. You will receive a user's instruction and a JSON array representing the current components on a webpage.
    Your task is to modify this JSON array according to the user's instruction and return the COMPLETE, UPDATED array of all components.

    **CRITICAL RULES:**
    1.  **Return the Full Structure:** You MUST return the entire array of components, including any components that were not changed. The order should be preserved unless specified by the user.
    2.  **Preserve IDs:** You MUST NOT change the 'id' of existing components. For new components, generate a new string-based ID.
    3.  **Valid Components:** Only use component types already present in the input array or from this list: ["Header", "Hero", "FeatureGrid", "Card", "Text", "Button", "ContactForm", "LoginForm", "RegisterForm", "DashboardLayout", "Footer", "Image", "Video", "Testimonials"].
    4.  **Images:** If asked for an image, use a real, valid placeholder URL from unsplash.com.
    5.  **Concise Reply:** Provide a brief, friendly, conversational reply confirming the action you took in Spanish.

    User Instruction: "${prompt}"

    Current Page Components JSON:
    ${JSON.stringify(components, null, 2)}

    Return only the valid JSON object conforming to the schema. Do not include markdown backticks or any other text.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.2
            }
        });
        
        let jsonStr = response.text.trim();
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.slice(7);
            if(jsonStr.endsWith('```')) {
                jsonStr = jsonStr.slice(0, -3);
            }
        }
        jsonStr = jsonStr.trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        const { title, message } = parseGeminiError(error);
        return { error: { title, message } };
    }
};

export const generateComponentText = async (prompt: string, originalText?: string): Promise<string> => {
    const fullPrompt = `Based on the following user instruction, generate or rewrite text for a website component.
    The response should be ONLY the text itself, without any introductory phrases like "Here is the text:" or markdown formatting.

    Instruction: "${prompt}"

    ${originalText ? `Original Text (for context or improvement): "${originalText}"` : ''}
    `;
    const systemInstruction = "You are an expert copywriter specializing in concise, engaging website content.";
    return generateContent(fullPrompt, systemInstruction);
};

export const generateCreativeText = async (prompt: string, type: 'blog' | 'email' | 'ad'): Promise<string> => {
    let systemInstruction = '';
    switch(type) {
        case 'blog': systemInstruction = 'You are a professional blog writer. Generate a short, engaging blog post based on the user prompt.'; break;
        case 'email': systemInstruction = 'You are a marketing expert. Write a concise and persuasive email based on the user prompt.'; break;
        case 'ad': systemInstruction = 'You are a creative advertiser. Generate a catchy and short ad copy based on the user prompt.'; break;
    }
    const fullPrompt = `Using the following instruction, generate content based on the user's prompt.\n\nUser Prompt: "${prompt}"`;
    if (!API_KEY) return "API Key no configurada.";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                systemInstruction,
                temperature: 0.7,
            }
        });
        return response.text.trim();
    } catch (error) {
        const { title, message } = parseGeminiError(error);
        return `${title}: ${message}`;
    }
};

export const generateBlogPost = async (prompt: string): Promise<string> => {
    const systemInstruction = 'You are a professional content writer specializing in creating engaging, well-structured, and SEO-friendly blog posts. The output should be in Markdown format.';
    const fullPrompt = `Generate a blog post based on the following topic: "${prompt}". The post should have a clear title, introduction, several body paragraphs with headings, and a conclusion.`;
    if (!API_KEY) return "API Key no configurada.";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                systemInstruction,
                temperature: 0.7,
            }
        });
        return response.text.trim();
    } catch (error) {
        const { title, message } = parseGeminiError(error);
        return `${title}: ${message}`;
    }
};

export const generateBulkBlogPosts = async (topic: string, count: number): Promise<{ title: string; content: string; seoTitle: string; metaDescription: string; }[] | null> => {
    if (!API_KEY) {
        console.error("AI bulk post generation requires an API Key.");
        return null;
    }

    const postSchema = {
        type: Type.OBJECT,
        properties: {
            title: {
                type: Type.STRING,
                description: "An engaging, SEO-friendly title for the blog post.",
            },
            content: {
                type: Type.STRING,
                description: 'The full blog post content in well-structured Markdown format. It should include headings, paragraphs, and lists where appropriate. Minimum 600 words.',
            },
            seoTitle: {
                type: Type.STRING,
                description: "A concise, SEO-optimized title for search engines, under 60 characters.",
            },
            metaDescription: {
                type: Type.STRING,
                description: 'An engaging meta description for search engine results, under 160 characters.',
            },
        },
        required: ["title", "content", "seoTitle", "metaDescription"],
    };
    
    const schema = {
        type: Type.OBJECT,
        properties: {
            posts: {
                type: Type.ARRAY,
                description: `An array of ${count} blog post objects.`,
                items: postSchema,
            },
        },
        required: ["posts"],
    };

    const fullPrompt = `You are a professional content creation engine. Generate ${count} unique, high-quality, SEO-friendly blog posts based on the following topic: "${topic}".
    
    Each post must be at least 600 words long and formatted in Markdown.
    Ensure each post has a unique title, SEO title, meta description, and well-structured content.
    
    The response MUST be a valid JSON object following the specified schema.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.8,
            }
        });
        
        let jsonStr = response.text.trim();
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.slice(7, -3).trim();
        }

        const parsedJson = JSON.parse(jsonStr);
        return parsedJson.posts || [];

    } catch (error) {
        const { title, message } = parseGeminiError(error);
        console.error(`${title}: ${message}`);
        return null;
    }
};

export const generateSeoMetadata = async (content: string): Promise<{ seoTitle: string; metaDescription: string; } | null> => {
    if (!API_KEY) {
        console.error("AI SEO generation requires an API Key.");
        return null;
    }

    const schema = {
        type: Type.OBJECT,
        properties: {
            seoTitle: {
                type: Type.STRING,
                description: "A concise, SEO-optimized title for the blog post, under 60 characters.",
            },
            metaDescription: {
                type: Type.STRING,
                description: 'An engaging meta description for search engine results, under 160 characters.',
            },
        },
        required: ["seoTitle", "metaDescription"],
    };

    const fullPrompt = `Based on the following blog post content, generate an optimized SEO title and meta description.

    Content:
    ---
    ${content.substring(0, 2000)}...
    ---

    The response MUST be a valid JSON object following the specified schema.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.5,
            }
        });
        
        let jsonStr = response.text.trim();
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.slice(7, -3).trim();
        }

        return JSON.parse(jsonStr);

    } catch (error) {
        const { title, message } = parseGeminiError(error);
        console.error(`${title}: ${message}`);
        return null;
    }
};

export const generateEmail = async (
    prompt: string, 
    audience: string, 
    tone: string
): Promise<{ subject: string; body: string; } | null> => {
    if (!API_KEY) {
        console.error("AI email generation requires an API Key.");
        return null;
    }

    const schema = {
        type: Type.OBJECT,
        properties: {
            subject: {
                type: Type.STRING,
                description: "A short, compelling, and relevant subject line for the email in Spanish.",
            },
            body: {
                type: Type.STRING,
                description: 'The full body of the email in Spanish. It should be well-structured, professional, and ready to send. Use \\n for newlines.',
            },
        },
        required: ["subject", "body"],
    };

    const fullPrompt = `You are a world-class email marketing expert. Your task is to write a complete and effective email in Spanish based on the user's request.

    - **Goal of the email:** ${prompt}
    - **Target Audience:** ${audience}
    - **Desired Tone:** ${tone}

    The response MUST be a valid JSON object following the specified schema. Generate a compelling subject and a full email body. The body should be ready to be sent, including greetings and sign-off. Use newline characters (\\n) for paragraph breaks.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.6,
            }
        });
        
        let jsonStr = response.text.trim();
        
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.slice(7, -3).trim();
        }

        return JSON.parse(jsonStr);

    } catch (error) {
        const { title, message } = parseGeminiError(error);
        console.error(`${title}: ${message}`);
        return null;
    }
};

export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
    if (!API_KEY) return "API Key no configurada.";
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });
        return response.generatedImages[0].image.imageBytes;
    } catch (error) {
        const { title, message } = parseGeminiError(error);
        // Return an error string that can be checked by the calling component.
        // This prevents attempting to render a broken base64 image.
        return `${title}: ${message}`;
    }
};

export const generateChatReply = async (conversationHistory: string, trainingContext?: string): Promise<string> => {
    const baseInstruction = `Eres un asistente de ventas y soporte para "NexusPro.io", una plataforma SaaS todo-en-uno. Eres amigable, profesional y muy eficiente. Tu objetivo es ayudar al usuario y, si es apropiado, guiarlo hacia una venta o una demostración. Responde en español.`;
    
    const contextualInstruction = trainingContext 
        ? `${baseInstruction}\n\nUtiliza la siguiente base de conocimiento para responder. Si la respuesta no está aquí, usa tu conocimiento general:\n---BASE DE CONOCIMIENTO---\n${trainingContext}\n--------------------------`
        : baseInstruction;

    const prompt = `Basado en el siguiente historial de conversación, genera una respuesta útil y concisa. No repitas la pregunta del usuario. Ve directo al grano.
    
    Historial de la Conversación:
    ${conversationHistory}
    
    Tu respuesta:`;
    return generateContent(prompt, contextualInstruction);
};

export const generateAutomationFlow = async (prompt: string): Promise<{ nodes: any[], edges: any[] } | null> => {
    if (!API_KEY) {
        console.error("AI automation generation requires an API Key.");
        return null;
    }

    const schema = {
        type: Type.OBJECT,
        properties: {
            nodes: {
                type: Type.ARRAY,
                description: 'An array of node objects for React Flow.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        type: { type: Type.STRING, enum: ['input', 'output', 'default'] },
                        data: { type: Type.OBJECT, properties: { label: { type: Type.STRING }}},
                        position: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER }}},
                        className: { type: Type.STRING, description: 'Optional CSS classes for styling.' }
                    }
                }
            },
            edges: {
                type: Type.ARRAY,
                description: 'An array of edge objects connecting the nodes.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        source: { type: Type.STRING },
                        target: { type: Type.STRING },
                        animated: { type: Type.BOOLEAN },
                    }
                }
            }
        },
        required: ["nodes", "edges"]
    };

    const fullPrompt = `You are a marketing automation expert. Based on the user's goal, design a logical automation flow for React Flow.
    The flow must be a JSON object conforming to the provided schema.
    - Create a logical sequence of nodes.
    - Start with an 'input' node.
    - Space nodes out logically on the canvas (e.g., x increments of 250).
    - Create edges to connect all nodes sequentially.
    - Node labels must be in Spanish.

    User Goal: "${prompt}"

    Return only the valid JSON object.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.3
            }
        });
        
        let jsonStr = response.text.trim();
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.slice(7, -3).trim();
        }
        return JSON.parse(jsonStr);
    } catch (error) {
        const { title, message } = parseGeminiError(error);
        console.error(`${title}: ${message}`);
        return null;
    }
};

export const generateSocialPost = async (prompt: string): Promise<string> => {
    const systemInstruction = 'You are a social media expert. Generate a short, engaging post for platforms like Instagram or Facebook. Include relevant hashtags.';
    const fullPrompt = `Generate a social media post based on this topic: "${prompt}"`;
    return generateContent(fullPrompt, systemInstruction);
};

export const analyzeLegalDocument = async (documentContent: string): Promise<{ summary: string; risks: string[]; suggestions: string[] } | null> => {
    if (!API_KEY) {
        console.error("API Key no configurada.");
        return null;
    }

    const schema = {
        type: Type.OBJECT,
        properties: {
            summary: {
                type: Type.STRING,
                description: "Un resumen conciso y claro del propósito principal del documento legal.",
            },
            risks: {
                type: Type.ARRAY,
                description: "Una lista de posibles riesgos, ambigüedades o cláusulas desfavorables encontradas en el documento. Cada riesgo debe ser un string.",
                items: { type: Type.STRING },
            },
            suggestions: {
                type: Type.ARRAY,
                description: "Una lista de sugerencias accionables para mejorar el documento o mitigar los riesgos. Cada sugerencia debe ser un string.",
                items: { type: Type.STRING },
            },
        },
        required: ["summary", "risks", "suggestions"],
    };

    const fullPrompt = `Eres un asistente legal experto de IA. Tu tarea es analizar el siguiente contenido de un documento legal. Proporciona un resumen claro, identifica posibles riesgos o puntos débiles, y ofrece sugerencias concretas para mejorarlo. Responde en español y en formato JSON válido.

Contenido del Documento:
---
${documentContent}
---
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.4,
            }
        });

        let jsonStr = response.text.trim();
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.slice(7, -3).trim();
        }
        return JSON.parse(jsonStr);
    } catch (error) {
        const { title, message } = parseGeminiError(error);
        console.error(`${title}: ${message}`);
        return null;
    }
};