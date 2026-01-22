
import { GoogleGenAI, Type } from "@google/genai";
import { Task, DiagnosisResult } from "../types";

const API_KEY = process.env.API_KEY || '';

export const analyzeAutomationPotential = async (tasks: Task[]): Promise<DiagnosisResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    다음은 사용자의 업무 목록입니다. 각 업무를 AI 자동화 가능성 측면에서 분석해 주세요.
    반드시 모든 응답(summary, benefitDescription, recommendedWorkflow, actionPriority)은 한국어로 작성해야 합니다.
    
    분석 기준:
    1. automationPotential (0-100): 해당 업무를 현재 AI 기술로 얼마나 자동화할 수 있는지 점수.
    2. complexity (0-100): 자동화 솔루션을 구축하는 데 드는 기술적 난이도.
    3. suggestedTools: ChatGPT, Claude, Zapier, Make.com, Python, RPA, Notion AI 등 구체적인 도구 제안.
    4. benefitDescription: 자동화 도입 시 얻게 되는 구체적인 이점 (한국어로 작성).
    5. actionPriority: '높음', '중간', '낮음' 중 하나로 표시.
    
    월간 예상 절약 시간(estimatedTimeSavedMonthly)을 시간 단위 숫자로 계산해 주세요.
    전체 요약(summary)과 권장 워크플로우(recommendedWorkflow)도 전문적인 비즈니스 한국어로 작성해 주세요.
    
    업무 데이터:
    ${JSON.stringify(tasks)}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          taskEvaluations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                taskId: { type: Type.STRING },
                automationPotential: { type: Type.NUMBER },
                complexity: { type: Type.NUMBER },
                suggestedTools: { type: Type.ARRAY, items: { type: Type.STRING } },
                benefitDescription: { type: Type.STRING },
                actionPriority: { type: Type.STRING }
              },
              required: ["taskId", "automationPotential", "complexity", "suggestedTools", "benefitDescription", "actionPriority"]
            }
          },
          summary: { type: Type.STRING },
          recommendedWorkflow: { type: Type.STRING },
          estimatedTimeSavedMonthly: { type: Type.NUMBER }
        },
        required: ["overallScore", "taskEvaluations", "summary", "recommendedWorkflow", "estimatedTimeSavedMonthly"]
      }
    }
  });

  if (!response.text) {
    throw new Error("AI로부터 응답을 받지 못했습니다.");
  }

  return JSON.parse(response.text.trim()) as DiagnosisResult;
};
