
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
  // Updated with EDGE User Guide Part 8 - Auditor Guidance Version 3.0 AND Part 4 - Water Measures Version 3
  const prompt = `
    Act as a strict **IFC EDGE Auditor (Version 3.0)**. Analyze this project against **EDGE Auditor Guidance Part 8** and **Water Measures Part 4**.

    **CORE AUDITOR PROTOCOLS (Strict Compliance):**

    1.  **Documentation Quality (Pg 19):**
        *   **Completeness:** Must cover >90% of the measure. 
        *   **Minor Information Gaps:** Acceptable ONLY if the gap affects savings by <0.5% and does not impact the 20% threshold.
        *   **Reliability:** Photos must be geo-referenced and timestamped.

    2.  **Sampling Rules (Table 10, Pg 50):**
        *   **Homes/Apartments/Hotels:** Sample Size = (√Total Units) + 1. (Round up).
        *   **Retail/Office:** Audit 40% of similar areas.
        *   **Mixed Use:** Apply respective rules per typology.

    3.  **Site Visit Requirements (Pg 33):**
        *   **Water Flow Tests:** Minimum duration of **20 seconds** (10s allowed for gravity systems). Must meet 90% of specifications.
        *   **Pressure:** Must test critical points (highest/lowest pressure).
        *   **Remote Audits (Pg 37):** Only allowed if >80% of project was audited onsite within 12 months, or specific health/safety risks exist.

    4.  **WATER MEASURES (Part 4 - v3.0 Specifics):**
        *   **WEM01 (Showers) & WEM02 (Faucets):** Design phase flow rates must be quoted at **3 bar (43.5 psi)** pressure.
        *   **WEM12 (Pool Covers):** From EDGE v3.1, **ONLY INDOOR** pool covers claim savings. Outdoor pools impact demand but claim no savings.
        *   **WEM14 (Rainwater):** Must demonstrate it replaces municipal water (e.g., dual piping photos required).
        *   **WEM17 (Smart Meters):** Meters must measure use, detect leaks (even offline), and display insights. Landlords must have access to data for Core & Shell.
        *   **No Savings Cases:** "Bucket baths" (WEM01) or "Bucket flush" (WEM04) result in 0% savings vs base case.

    5.  **Specific Measure Checks:**
        *   **EEM05 (Roof):** Overhangs excluded from "Aggregate Roof Area".
        *   **MEM01 (Floor):** Verify steel content and thickness.
        *   **Data Centers (Pg 40):** Verify PUE Category 2. Metering must be at PDU output (Point A). If UPS (Point B) is used, assume 3% loss.
        *   **Industrial:** Skylights >5% of roof area are MANDATORY for projects registered after Jan 1, 2026.

    6.  **Audit Trail (Pg 17):**
        *   All communication must happen in the "Audit Trail".
        *   Auditors cannot directly modify the subproject; they only comment.

    **Project Context:**
    ${JSON.stringify(dataContext)}

    **Task:**
    Provide a specific "EDGE v3 Auditor Report".

    **Required Output Format (Markdown):**
    
    ### 📋 Audit Strategy & Sampling
    *   **Recommended Sample Size:** [Calculate based on unit count using (√N)+1 rule].
    *   **Site Visit Focus:** [Identify specific checks, e.g., "Test 14 showerheads for 20s each"].

    ### 💧 Water Efficiency Analysis (Part 4)
    *   **Fixture Check:** [Comment on WEM01/02/04 specs. Ensure 3 bar pressure rating is documented].
    *   **Special Systems:** [Check eligibility of WEM12/14/17 if applicable].

    ### 🏗️ Technical Verification (Desktop)
    *   **Material Efficiency:** [Analyze MEM inputs. Note if "Minor Information Gaps" might apply].
    *   **Energy Claims:** [Check if "Virtual Energy" applies (if no HVAC). Verify WWR calculations].

    ### 🚩 Auditor Flags (Non-Conformity Risks)
    *   [List potential issues based on v3.0 rules, e.g., "Ensure Data Center PUE metering is at PDU level"].

    ### 📝 Required Evidence Checklist
    *   **Photos:** Geo-tagged photos of [Key Elements].
    *   **Docs:** Purchase orders/Mill certs for [Specific Materials].
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
    Generate a Design-Stage Waste Forecast and **EDGE Material Baseline** for the following project.

    **Project Details:**
    - Type: ${projectDetails.project_type}
    - Location: ${projectDetails.location}
    - GFA: ${projectDetails.gross_floor_area} m2
    - Phase: ${projectDetails.construction_phase}

    **Task:**
    1. Estimate the **Baseline Material Quantities** based on the "Standard construction practice prevalent in the region" (EDGE Definition).
    2. Propose **Improved/Target Quantities** assuming EDGE Best Practices (e.g., MEM01 Concrete >25% GGBS, MEM05 AAC Blocks).
    
    **Required Streams (Map to EDGE MEM Codes):**
    - Concrete (MEM01/02)
    - Steel (MEM01/02/04)
    - Timber (MEM03/07)
    - Brick/Block (MEM05/06)
    - Glass (MEM08)
    - Insulation (MEM09/10/11)

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
    Act as an expert **IFC EDGE Auditor**. Analyze this architectural construction plan/drawing against **Auditor Guidance Part 8**.
    
    1. **Design Verification (Pg 20):**
       - Identify the **Gross Internal Area (GIA)** boundaries. Check if balconies or exterior shafts are correctly excluded/included.
       - Verify **Window-to-Wall Ratio (WWR)** estimations visually.
    
    2. **Material Verification:**
       - **MEM05:** Identify wall materials.
       - **MEM04:** Identify roof construction (if visible).
    
    3. **Sampling Strategy:**
       - Based on the number of similar units visible, suggest a sampling count using the (√N)+1 rule.

    Format the response as a structured Markdown "Auditor Findings" report.
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
