
import { GoogleGenAI, Type, Schema, FunctionDeclaration } from "@google/genai";
import { GeminiModel } from "../types";

// Helper to get client. Creates new instance to ensure key is fresh.
const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateText = async (prompt: string, model: string = GeminiModel.FLASH_LITE) => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });
  return response.text;
};

export const generateThinking = async (prompt: string) => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: GeminiModel.PRO_3,
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return response.text;
};

export const getEdgeAdvisory = async (dataContext: any) => {
  const ai = getClient();
  // Part 3: EDGE Advisory Rule Logic (The "Digital Consultant")
  const prompt = `
    Act as a senior IFC EDGE Green Building Consultant. Analyze this project's waste data against EDGE Material Efficiency standards.

    Project Context:
    ${JSON.stringify(dataContext)}

    **Advisory Rules to Apply:**
    1.  **Certification Risk:** IF Material Efficiency < 20% THEN Status = "EDGE Risk". Warn clearly.
    2.  **Concrete Logic:** IF Concrete Recovery < 40% THEN Suggest on-site crushing/reuse to meet best practice.
    3.  **Steel Logic:** IF Steel Recycling > 80% THEN Highlight revenue potential and cost optimization.
    4.  **Local Context:** IF Location is known, suggest specific local recycling infrastructure or informal sector integration opportunities.

    **Required Output Format (Markdown):**
    
    ### 🚦 EDGE Readiness Status: [Calculated Status]
    
    ### 🧠 Strategic Recommendations
    *   [Recommendation 1 based on rules]
    *   [Recommendation 2 based on rules]
    *   [Recommendation 3 based on rules]

    ### 📉 Carbon & Cost Impact
    *   **Embodied Carbon:** [Estimate savings]
    *   **Economic Opportunity:** [Estimate value recovery]

    ### 📝 Audit Evidence Checklist
    *   [List specific documents needed based on the streams, e.g., Weighbridge tickets for Concrete]
  `;

  const response = await ai.models.generateContent({
    model: GeminiModel.PRO_3,
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 16384 }
    }
  });
  return response.text;
};

export const predictProjectWaste = async (projectDetails: any) => {
  const ai = getClient();
  const prompt = `
    Act as an expert Construction Quantity Surveyor and Waste Strategist. 
    Predict construction waste volumes (in tonnes) for this project.

    **Project Context:**
    ${JSON.stringify(projectDetails, null, 2)}
    
    **Reasoning Logic:**
    1. **Building Age:** 
       - If Year < 1980: Assume heavier materials (dense concrete, cast iron) and HIGH risk of HazMat (Asbestos/Lead).
       - If Year > 2000: Assume lighter composites, more insulation/gypsum.
    2. **Historical Site Data:**
       - "similar_industrial": Increase Metal and HazMat estimates (heavy machinery, piping).
       - "similar_urban": Expect higher constraints, potentially higher packaging/mixed waste ratio.
    3. **Construction Phase:**
       - "Demolition": High volume intensity (~1.5t/m²). Dominant: Concrete, Metal.
       - "Fit-out": Lower intensity. Dominant: Wood, Packaging, Gypsum, Off-cuts.
       - "Structural": Dominant: Concrete, Rebar off-cuts.

    Return a JSON object with:
    - concrete, metal, wood (tonnes)
    - hazmat (boolean)
    - reasoning (array of strings explaining the specific factors used)
  `;

  const response = await ai.models.generateContent({
    model: GeminiModel.FLASH_3,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          concrete: { type: Type.NUMBER, description: "Estimated concrete waste in tonnes" },
          metal: { type: Type.NUMBER, description: "Estimated metal waste in tonnes" },
          wood: { type: Type.NUMBER, description: "Estimated wood waste in tonnes" },
          hazmat: { type: Type.BOOLEAN, description: "True if high risk of asbestos/lead/hazmat" },
          reasoning: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of 3-4 key factors influencing this prediction"
          }
        }
      }
    }
  });
  
  return JSON.parse(response.text || "{}");
};

export const predictEdgeBaselines = async (projectDetails: any) => {
  const ai = getClient();
  const prompt = `
    Act as an expert Quantity Surveyor and IFC EDGE Consultant. 
    Generate a Design-Stage Waste Forecast for the following project to estimate Material Efficiency.

    **Project Details:**
    - Type: ${projectDetails.project_type}
    - Location: ${projectDetails.location}
    - GFA: ${projectDetails.gross_floor_area} m2
    - Phase: ${projectDetails.construction_phase}

    **Task:**
    1. Estimate the **Baseline Waste Generation (tonnes)** for standard construction practices in this region.
    2. Propose **Improved/Target Quantities (tonnes)** assuming EDGE Best Practices (e.g. pre-fab, recycling, waste-efficient design).
    
    **Required Streams:**
    - Concrete
    - Steel
    - Timber
    - Brick
    - Glass
    - Plastics
    - Excavation

    **Output Format:**
    Return strictly a JSON object with this structure:
    {
      "streams": [
        { 
          "material_type": "Concrete", 
          "category": "Structure", 
          "baseline_quantity_tons": number, 
          "improved_quantity_tons": number,
          "recovery_percentage": number (estimated achievable %),
          "disposal_method": "Recycle" | "Reuse" | "Landfill"
        },
        ...
      ]
    }
  `;

  const response = await ai.models.generateContent({
    model: GeminiModel.FLASH_3,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
         type: Type.OBJECT,
         properties: {
            streams: {
               type: Type.ARRAY,
               items: {
                  type: Type.OBJECT,
                  properties: {
                     material_type: { type: Type.STRING },
                     category: { type: Type.STRING },
                     baseline_quantity_tons: { type: Type.NUMBER },
                     improved_quantity_tons: { type: Type.NUMBER },
                     recovery_percentage: { type: Type.NUMBER },
                     disposal_method: { type: Type.STRING }
                  }
               }
            }
         }
      }
    }
  });
  
  return JSON.parse(response.text || "{\"streams\": []}");
};

export const analyzeConstructionPlan = async (base64Image: string, mimeType: string) => {
  const ai = getClient();
  const prompt = `
    Act as an expert IFC EDGE Green Building Consultant & Architect. Analyze this architectural construction plan/drawing.
    
    Based on the layout, typology, and visible elements, provide a **Net Zero Readiness Report** with specific technical interventions to meet EDGE Advanced standards (>40% savings) or Zero Carbon.

    1. **💧 Water Efficiency (>30% Reduction Required)**:
       - **Low-Flow Fixtures:** Recommend precise flow rates (e.g., Showerheads < 6 L/min, Taps < 4 L/min, WCs < 3 L/flush dual flush).
       - **Recycling Systems:** Assess roof area for Rainwater Harvesting potential. Suggest Greywater Recycling for irrigation/flushing if the layout allows for separate plumbing stacks.
       - **Landscaping:** If exterior is visible, recommend xeriscaping or native drought-resistant plants to reduce irrigation demand by 50%.

    2. **⚡ Energy Efficiency (>30% Reduction Required)**:
       - **Window Positioning & Daylighting:** Analyze the current window placement. Suggest optimized positioning (e.g., increased glazing on North/South for light without heat gain, reduced East/West glazing).
       - **Passive Cooling:** Suggest cross-ventilation strategies based on the floor plan layout.
       - **Flood Prevention:** If the site context suggests, recommend raising window sill heights or using water-resistant materials on ground floors.
       - **Active Systems:** Recommend efficient HVAC (e.g., VRF COP > 3.5) and LED lighting (LPD < 6 W/m²).

    3. **🧱 Zero Carbon Materials**:
       - **Material Substitution:** Identify conventional materials (e.g., concrete slab). Suggest specific **Zero Carbon alternatives**:
         - *Floor:* Polished Concrete with 50% GGBS or Recycled Timber.
         - *Walls:* Hempcrete blocks, Compressed Stabilized Earth Blocks (CSEB), or Cross Laminated Timber (CLT).
       - **HERO MATERIAL:** Identify the **single most impactful substitution** for this specific design that would drastically reduce embodied carbon (e.g., "Replacing the RCC frame with a Timber Hybrid structure").

    Format the response as a structured Markdown technical report with bold headings and bullet points for readability.
  `;

  const response = await ai.models.generateContent({
    model: GeminiModel.PRO_3,
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType } },
        { text: prompt }
      ]
    }
  });
  return response.text;
};

export const searchGrounding = async (prompt: string) => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: GeminiModel.FLASH_3,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  return {
    text: response.text,
    chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const mapsGrounding = async (prompt: string, lat: number, lng: number) => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash', // Required for Maps
    contents: prompt,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng
          }
        }
      }
    }
  });
  return {
    text: response.text,
    chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const analyzeImage = async (prompt: string, base64Image: string, mimeType: string) => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: GeminiModel.PRO_3,
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType } },
        { text: prompt }
      ]
    }
  });
  return response.text;
};

export const editImage = async (prompt: string, base64Image: string, mimeType: string) => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: GeminiModel.FLASH_IMG_2_5,
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType } },
        { text: prompt }
      ]
    }
  });
  // Extract image
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const generateHighQualityImage = async (prompt: string, aspectRatio: string = "1:1", size: "1K"|"2K"|"4K" = "1K") => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: GeminiModel.PRO_IMG_3,
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
        imageSize: size
      }
    }
  });
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const generateVideo = async (prompt: string, imageBase64?: string, mimeType?: string, aspectRatio: '16:9'|'9:16' = '16:9') => {
  const ai = getClient();
  let operation;
  
  if (imageBase64 && mimeType) {
    operation = await ai.models.generateVideos({
      model: GeminiModel.VEO_FAST,
      prompt: prompt,
      image: {
        imageBytes: imageBase64,
        mimeType: mimeType
      },
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: aspectRatio
      }
    });
  } else {
    operation = await ai.models.generateVideos({
      model: GeminiModel.VEO_FAST,
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: aspectRatio
      }
    });
  }

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!uri) return null;

  // Fetch the actual video bytes
  // Use correct query separator for the API key
  const separator = uri.includes('?') ? '&' : '?';
  const response = await fetch(`${uri}${separator}key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
