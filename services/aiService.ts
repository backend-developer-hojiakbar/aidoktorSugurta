

import { GoogleGenAI } from "@google/genai";
// Part type is implicitly handled by usage or should be aliased from GoogleGenAI types if strictness needed
import { uzSystemInstruction, uzAnalysisSystemInstruction, uzDrugIdentificationSystemInstruction } from '@/services/aiPrompts';
import { uzTranslationData } from "@/translations/uz";


let ai = null;
let chatSession = null; 

try {
    if (process.env.API_KEY) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        console.log("GoogleGenAI initialized successfully.");
    } else {
        console.warn("API_KEY environment variable is not set. AI service will use mocked data for some features or provide limited responses.");
    }
} catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
}


const getTranslation = (key, params) => {
  let translation = uzTranslationData[key] || key;
  if (params) {
    Object.keys(params).forEach(paramKey => {
      const value = params[paramKey];
      if (value !== undefined) {
        translation = translation.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(value));
      }
    });
  }
  return translation;
};


const fileToGenerativePart = async (file) => {
  const base64EncodedDataPromise = new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else if (reader.result instanceof ArrayBuffer) {
        const blob = new Blob([reader.result], {type: file.type});
        const newReader = new FileReader();
        newReader.onloadend = () => {
            if (typeof newReader.result === 'string') {
                resolve(newReader.result.split(',')[1]);
            } else {
                 reject(new Error("FileReader result (from ArrayBuffer) is not a string."));
            }
        };
        newReader.onerror = () => reject(new Error("FileReader (from ArrayBuffer) encountered an error."));
        newReader.readAsDataURL(blob);
      }
      else {
        reject(new Error("FileReader result is not a string or ArrayBuffer."));
      }
    };
    reader.onerror = () => {
        reject(new Error("FileReader encountered an error."));
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type
    }
  };
};


export const getChatResponse = async (
    message,
    _chatHistory, 
    imageDetail
) => { 
  let responseText;

  if (ai) {
    try {
      if (!chatSession) {
        console.log(`Initializing new chat session (Uzbek) with Gemini API...`);
        chatSession = ai.chats.create({ 
          model: 'gemini-2.5-flash-preview-04-17',
          config: {
            systemInstruction: uzSystemInstruction
          }
        });
        console.log(`New chat session (Uzbek) initialized. System instruction length:`, uzSystemInstruction.length);
      }
      
      const partsForGenAI = [];
      if (message && message.trim() !== "") {
        partsForGenAI.push({ text: message });
      }

      if (imageDetail) {
        partsForGenAI.push({
          inlineData: { 
            mimeType: imageDetail.mimeType,
            data: imageDetail.data
          }
        }); 
        console.log("Sending message and image to Gemini API:", message, "MIME type:", imageDetail.mimeType);
      } else if (message && message.trim() !== "") {
        console.log("Sending message to Gemini API:", message);
      } else {
        console.log("Sending empty message (likely only an image or initial greeting) to Gemini API");
      }
      
      if (partsForGenAI.length === 0 && message === uzTranslationData['quickDiagnosisAiGreeting']) {
         partsForGenAI.push({ text: message }); 
      }


      if (partsForGenAI.length > 0) {
        let requestPayload;
        // Check if partsForGenAI contains exactly one part, that part has a 'text' property, 
        // and it doesn't have other properties (like inlineData), ensuring it's a simple text part.
        if (partsForGenAI.length === 1 && 'text' in partsForGenAI[0] && Object.keys(partsForGenAI[0]).length === 1) {
          // Single text part, send as { message: "string_content" }
          requestPayload = { message: partsForGenAI[0].text };
        } else {
          // Multiple parts (e.g. text and image) or single non-text part (e.g. image only)
          // Send as { message: { parts: Part[], role: 'user' } }
          requestPayload = { message: { parts: partsForGenAI, role: 'user' } };
        }
        
        console.log("Sending payload to Gemini chat API:", JSON.stringify(requestPayload, null, 2));
        const result = await chatSession.sendMessage(requestPayload); 
        responseText = result.text;
        console.log("Received response from Gemini API:", responseText);
      } else {
        console.warn("No parts to send to Gemini API. This might indicate an issue.");
        responseText = getTranslation('quickDiagnosisAiError', undefined); 
      }

    } catch (error) {
      console.error("AI chat error with Gemini API:", error);
      responseText = getTranslation('quickDiagnosisAiError', undefined);
      chatSession = null; // Reset chat session on error to allow re-initialization
    }
  } else {
    console.warn("AI (Gemini) service not available, providing a general message.");
    responseText = getTranslation('aiServiceNotInitializedChat', undefined);
     if (imageDetail) {
      responseText += " " + getTranslation('aiServiceImageNotAnalyzed', undefined);
    }
  }

  return {
    id: Date.now().toString() + '_ai',
    sender: 'ai',
    text: responseText,
    timestamp: new Date()
  };
};

export const analyzeDocumentsWithAI = async (
  uploadedFiles, 
  userAnswers
) => { 
  if (!ai) {
    console.warn("AI service not initialized. Falling back to mock document analysis.");
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockSummary = getTranslation('aiServiceNotInitializedDocAnalysisSummary', undefined);
    return {
      summary: mockSummary,
      riskFactors: [getTranslation('compAnalysisMockRiskFactor1', undefined), getTranslation('compAnalysisMockRiskFactor2', undefined)],
      recommendations: [
        getTranslation('compAnalysisMockRecommendation1', undefined),
        getTranslation('compAnalysisMockRecommendation2', undefined),
        getTranslation('compAnalysisMockRecommendation3', undefined)
      ],
      labResults: [
        { name: 'Glyukoza', yourValue: 5.8, normDisplayValue: "3.9-6.1", normComparableValue: 6.1, unit: "mmol/L" }
      ],
      keyFindings: [getTranslation('compAnalysisMockKeyFinding', undefined)],
      disclaimer: getTranslation('compAnalysisDisclaimerTitle', undefined) + "\n" + getTranslation('compAnalysisReportDisclaimerFull', undefined)
    };
  }

  console.log("Starting AI document analysis for files:", uploadedFiles.map(f=>f.file.name), "and answers:", userAnswers, "Language: UZ (Hardcoded)");
  
  try {
    const documentParts = []; 
    for (const uploadedFile of uploadedFiles) {
      const part = await fileToGenerativePart(uploadedFile.file);
      documentParts.push(part);
      const fileDescText = getTranslation('compAnalysisFileDescText', {fileName: uploadedFile.file.name, fileType: getTranslation(uploadedFile.type, undefined)});
      documentParts.push({text: fileDescText});
    }

    let userAnswersIntroText = getTranslation('compAnalysisUserAnswersIntro', undefined);
    let userAnswersText = userAnswersIntroText;
    for (const [key, value] of Object.entries(userAnswers)) {
        const noAnswerText = getTranslation('compAnalysisNoAnswer', undefined);
        userAnswersText += `- "${key}": "${value || noAnswerText}"\n`;
    }
    
    const userContentParts = [ 
        {text: getTranslation('compAnalysisAiJsonPrompt', undefined)},
        ...documentParts,
        {text: `\n${userAnswersText}`}
    ];

    const requestPayload = {
      model: "gemini-2.5-flash-preview-04-17",
      contents: [ 
        { role: "user", parts: userContentParts }
      ],
      config: {
        systemInstruction: uzAnalysisSystemInstruction,
        responseMimeType: "application/json"
      }
    };
    
    console.log("Sending request to Gemini API for document analysis...");
    const result = await ai.models.generateContent(requestPayload); 
    
    let jsonStr = result.text.trim();
    console.log("Raw JSON response from AI for document analysis:", jsonStr);

    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
        jsonStr = match[2].trim();
    }

    try {
        const parsedReport = JSON.parse(jsonStr); 
        if (parsedReport.labResults) {
            parsedReport.labResults = parsedReport.labResults.map((lr) => { 
                let comparableValue = lr.normComparableValue;
                if (typeof lr.normDisplayValue === 'string') {
                    const rangeMatch = lr.normDisplayValue.match(/([\d.]+)\s*-\s*([\d.]+)/);
                    const lessThanMatch = lr.normDisplayValue.match(/<\s*([\d.]+)/);
                    const greaterThanMatch = lr.normDisplayValue.match(/>\s*([\d.]+)/);
                    const exactMatch = lr.normDisplayValue.match(/^([\d.]+)$/);

                    if (rangeMatch && rangeMatch[2]) {
                        comparableValue = parseFloat(rangeMatch[2]);
                    } else if (lessThanMatch && lessThanMatch[1]) {
                        comparableValue = parseFloat(lessThanMatch[1]);
                    } else if (greaterThanMatch && greaterThanMatch[1]) {
                        comparableValue = parseFloat(greaterThanMatch[1]);
                    } else if (exactMatch && exactMatch[1]) {
                         comparableValue = parseFloat(exactMatch[1]);
                    }
                }
                
                return {
                    ...lr,
                    yourValue: typeof lr.yourValue === 'string' && !isNaN(parseFloat(lr.yourValue.replace(',', '.'))) ? parseFloat(lr.yourValue.replace(',', '.')) : lr.yourValue,
                    normComparableValue: comparableValue !== undefined ? comparableValue : null
                };
            });
        }
        parsedReport.disclaimer = getTranslation('compAnalysisReportDisclaimerFull', undefined);
        console.log("Successfully parsed AI analysis report:", parsedReport);
        return parsedReport;
    } catch (e) {
        console.error("Failed to parse JSON response from AI:", e, "Raw response was:", jsonStr);
        const errorMsgHtml = getTranslation('compAnalysisErrorHtmlResponse', undefined);
        const errorMsgJson = getTranslation('compAnalysisErrorJsonResponse', undefined);
        if (jsonStr.toLowerCase().includes("html") || jsonStr.startsWith("<")) {
            throw new Error(errorMsgHtml);
        }
        throw new Error(errorMsgJson);
    }

  } catch (error) {
    console.error("AI document analysis error:", error);
    let errorMsgPrefix = getTranslation('compAnalysisErrorPrefix', undefined);
    let specificErrorMsg = "";
    if (error instanceof Error) {
        if (error.message.includes("quota")) {
             specificErrorMsg = getTranslation('compAnalysisErrorQuota', undefined);
        } else if (error.message.includes("network") || error.message.includes("fetch")) {
            specificErrorMsg = getTranslation('compAnalysisErrorNetwork', undefined);
        } else {
            specificErrorMsg = error.message;
        }
        throw new Error(errorMsgPrefix + specificErrorMsg);
    }
    const unknownErrorMsg = getTranslation('compAnalysisErrorUnknown', undefined);
    throw new Error(errorMsgPrefix + unknownErrorMsg);
  }
};


export const generateImageWithAI = async (prompt) => { 
    if (!ai) {
        console.warn("AI service not initialized, cannot generate image.");
        return null;
    }
    try {
        console.log("Requesting image generation from AI with prompt:", prompt);
        const response = await ai.models.generateImages({ 
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: { numberOfImages: 1, outputMimeType: 'image/jpeg' }
        });
        if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image.imageBytes) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes; 
            console.log("Image generated successfully.");
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        console.warn("AI image generation did not return any images or image data was empty.");
        return null;
    } catch (error) {
        console.error("AI image generation error:", error);
        const safetyFilterError = getTranslation('aiServiceImageSafetyFilter', undefined);
        if (error instanceof Error && error.message.includes("filtered")) {
            throw new Error(safetyFilterError);
        }
        return null;
    }
};

export const identifyDrugFromImage = async (
  imageFile 
) => { 
  if (!ai) {
    console.warn("AI service not initialized. Cannot identify drug from image.");
    return {
      wasIdentified: false,
      responseText: getTranslation('aiServiceNotInitializedDrug', undefined)
    };
  }

  console.log("Starting AI drug identification for file:", imageFile.name);

  try {
    const imagePart = await fileToGenerativePart(imageFile); 
    const textPromptPart = { text: getTranslation('drugIdentifierAiPromptText', undefined) }; 

    const requestPayload = {
      model: "gemini-2.5-flash-preview-04-17",
      contents: [{ role: "user", parts: [textPromptPart, imagePart] }], 
      config: {
        systemInstruction: uzDrugIdentificationSystemInstruction
      }
    };

    console.log("Sending request to Gemini API for drug identification...");
    const result = await ai.models.generateContent(requestPayload); 
    const responseText = result.text.trim();
    console.log("Raw response from AI for drug identification:", responseText);
    
    const failurePhrases = [
        getTranslation('drugIdentifierFailurePhrase1', undefined),
        getTranslation('drugIdentifierFailurePhrase2', undefined),
        getTranslation('drugIdentifierFailurePhrase3', undefined),
        getTranslation('drugIdentifierFailurePhrase4', undefined)
    ];

    const wasIdentified = !failurePhrases.some(phrase => responseText.toLowerCase().includes(phrase.toLowerCase()));

    return { wasIdentified: wasIdentified, responseText: responseText };

  } catch (error) {
    console.error("AI drug identification error:", error);
    let errorMsgPrefix = getTranslation('drugIdentifierErrorPrefix', undefined);
    let specificErrorMsg = "";
    if (error instanceof Error) {
      if (error.message.includes("quota")) {
        specificErrorMsg = getTranslation('compAnalysisErrorQuota', undefined);
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        specificErrorMsg = getTranslation('compAnalysisErrorNetwork', undefined);
      } else {
        specificErrorMsg = error.message;
      }
    } else {
        specificErrorMsg = getTranslation('compAnalysisErrorUnknown', undefined);
    }
     return {
      wasIdentified: false,
      responseText: errorMsgPrefix + specificErrorMsg
    };
  }
};