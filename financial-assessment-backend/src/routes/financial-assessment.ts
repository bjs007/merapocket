import { Router, RequestHandler } from "express";
import { FinancialAssessmentRequest, FinancialAssessmentResponse, EnhancedFinancialAssessmentResponse, ApiError } from "../types/api.js";
import { FinancialProductRecommendationEngine } from "../data/financial-products.js";
import OpenAI from "openai";

const router = Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const handleFinancialAssessment: RequestHandler = async (req, res) => {
  try {
    const { basicData, advancedData }: FinancialAssessmentRequest = req.body;

    // Validate required fields
    if (!basicData.country) {
      const error: ApiError = {
        error: "VALIDATION_ERROR",
        message: "Country is a required field"
      };
      return res.status(400).json(error);
    }

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      const error: ApiError = {
        error: "CONFIGURATION_ERROR",
        message: "OpenAI API key is not configured"
      };
      return res.status(500).json(error);
    }

    // Create prompt with financial data (excluding name as requested)
    const prompt = createFinancialAssessmentPrompt(basicData, advancedData);

    let llmResult;

    try {
      console.log("📡 Making OpenAI API call (gpt-4o-mini)...");

      // Call GPT-4o-mini for financial assessment
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
          role: "system",
          content: `You are a professional financial advisor. Analyze the provided financial information and return a JSON response with exactly this format:
{
  "overallScore": <number between 1-10>,
  "advice": "<detailed financial advice string>",
  "affordability": {
    "mobile": {"canAfford": <boolean>, "description": "<encouraging description>"},
    "bike": {"canAfford": <boolean>, "description": "<encouraging description>"},
    "car": {"canAfford": <boolean>, "description": "<encouraging description>"},
    "foreignTrip": {"canAfford": <boolean>, "description": "<encouraging description>"},
    "homeUpgrade": {"canAfford": <boolean>, "description": "<encouraging description>"},
    "gadgets": {"canAfford": <boolean>, "description": "<encouraging description>"}
  }
}

The score should be a decimal number between 1.0 and 10.0 representing the person's financial health (1 = very poor, 10 = excellent).

For the advice, structure it as follows:
- Start with a brief overview of their financial situation
- Then provide numbered actionable recommendations (1. **Category**: Description)
- Use clear, bold headings for each recommendation category
- Keep each point focused and actionable
- Include specific steps they can take

For the affordability section, be encouraging and positive. Even if they can't afford something now, phrase it as "on track to achieve" or "building towards". Focus on what they CAN afford and make them feel proud of their financial progress.

Affordability guidelines:
- Mobile (₹15,000-50,000): Consider if they have 1-2 months surplus savings
- Bike (₹80,000-150,000): Consider if they have 6+ months of savings or stable income with low expenses
- Car (₹500,000-1,500,000): Consider if they have substantial savings, investments, or very stable high income
- Foreign Trip (₹100,000-300,000): Consider disposable income and existing savings
- Home Upgrade (₹200,000-500,000): Consider total assets and stable income
- Gadgets (₹20,000-100,000): Consider surplus income and current financial stability

Always be encouraging in descriptions, focusing on achievements and progress.

Format example for advice:
"Based on your financial profile, here are key areas for improvement:

1. **Emergency Fund**: Build an emergency fund covering 3-6 months of expenses. Start by saving ₹5,000 monthly until you reach your target.

2. **Insurance Coverage**: Consider health insurance immediately to protect against medical expenses. Life insurance can wait until your income increases.

3. **Investment Strategy**: Begin with SIP in diversified mutual funds. Start small with ₹2,000 monthly and increase gradually."

Make the advice specific to their income, expenses, and life situation.`
        },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      });

      console.log("🔍 DEBUG: OpenAI API call successful!");

      // Parse the LLM response
      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error("No response from OpenAI");
      }

      try {
        llmResult = JSON.parse(responseContent);
      } catch (parseError) {
        throw new Error("Invalid JSON response from OpenAI");
      }
    } catch (openaiError: any) {
      // If OpenAI API fails due to quota/billing/authentication, provide a fallback response
      if (openaiError?.status === 429 || openaiError?.code === 'insufficient_quota' || openaiError?.status === 401) {
        console.log("🔄 OpenAI API error, using fallback mock response:", openaiError?.status, openaiError?.error?.message || openaiError?.message);

        // Generate a basic score based on financial data
        const income = basicData.salaryPerMonth || 0;
        const expenses = (basicData.foodExpenses || 0) + (basicData.houseRent || 0) + (basicData.utilitiesExpenses || 0);
        const savings = income - expenses;
        const savingsRatio = income > 0 ? savings / income : 0;

        let score = 5; // Base score
        if (savingsRatio > 0.3) score += 2;
        else if (savingsRatio > 0.2) score += 1;
        else if (savingsRatio < 0) score -= 2;

        if (basicData.lifeInsurance) score += 0.5;
        if (basicData.healthInsurance) score += 0.5;
        if (basicData.housesOwned > 0) score += 1;

        score = Math.max(1, Math.min(10, score));

        // Generate affordability analysis based on financial data
        const monthlyDisposable = Math.max(0, savings);
        const totalAssets = (advancedData.liquidCashFD || 0) + (advancedData.stocksNetWorth || 0) + (advancedData.mutualFundNetWorth || 0);

        llmResult = {
          overallScore: Math.round(score * 10) / 10,
          advice: `Based on your financial profile, here's your comprehensive assessment:

1. **Income & Savings**: Your monthly income is ₹${income.toLocaleString()}, with expenses of ₹${expenses.toLocaleString()}. ${savingsRatio > 0 ? `You're saving ${(savingsRatio * 100).toFixed(1)}% of your income, which is ${savingsRatio > 0.2 ? 'excellent' : 'good'}.` : 'You need to focus on reducing expenses to start saving.'}

2. **Insurance Protection**: ${basicData.lifeInsurance && basicData.healthInsurance ? 'Great job on having comprehensive insurance coverage!' : 'Consider getting life and health insurance for better financial security.'}

3. **Investment Strategy**: ${totalAssets > 100000 ? 'Good investment portfolio! Consider diversifying across different asset classes.' : 'Start investing in mutual funds and stocks for long-term wealth building.'}

4. **Asset Building**: ${basicData.housesOwned > 0 ? 'Owning property is excellent for long-term wealth building!' : 'Consider real estate investment when your savings and income grow.'}`,
          affordability: {
            mobile: {
              canAfford: monthlyDisposable >= 2000 || totalAssets >= 25000 || income >= 25000,
              description: (monthlyDisposable >= 2000 || income >= 25000) ? "Great! You can comfortably afford a new smartphone." : "You're building towards affording a quality mobile device."
            },
            bike: {
              canAfford: (monthlyDisposable >= 5000 && income >= 25000) || totalAssets >= 80000 || income >= 100000,
              description: (monthlyDisposable >= 5000 || income >= 100000) ? "Excellent! A bike is well within your budget." : "You're making good progress towards bike ownership."
            },
            car: {
              canAfford: (monthlyDisposable >= 10000 && income >= 40000) || totalAssets >= 300000 || income >= 200000 || (savingsRatio >= 0.1 && income >= 100000),
              description: (income >= 200000 || (monthlyDisposable >= 10000 && income >= 100000) || totalAssets >= 300000) ? "Impressive! You have the financial capacity for a car. With your income level, you can comfortably afford car ownership and maintenance." : "Keep building your finances - a car is an achievable goal."
            },
            foreignTrip: {
              canAfford: monthlyDisposable >= 8000 || totalAssets >= 100000 || income >= 150000,
              description: (monthlyDisposable >= 8000 || income >= 150000) ? "Amazing! You can plan that dream international vacation." : "You're on track to afford a wonderful foreign trip soon."
            },
            homeUpgrade: {
              canAfford: (monthlyDisposable >= 15000 && income >= 100000) || totalAssets >= 200000 || basicData.housesOwned > 0 || income >= 300000,
              description: (monthlyDisposable >= 15000 || income >= 300000 || basicData.housesOwned > 0) ? "Outstanding! Home improvements are within reach." : "Your growing wealth suggests home upgrades are becoming possible."
            },
            gadgets: {
              canAfford: monthlyDisposable >= 2000 || totalAssets >= 20000 || income >= 30000,
              description: (monthlyDisposable >= 2000 || income >= 30000) ? "Perfect! You can enjoy the latest gadgets and tech." : "You're building financial strength for quality tech purchases."
            }
          }
        };
      } else {
        // Re-throw other OpenAI errors
        throw openaiError;
      }
    }

    // Validate the response format
    if (typeof llmResult.overallScore !== 'number' || typeof llmResult.advice !== 'string' || !llmResult.affordability) {
      throw new Error("Invalid response format from OpenAI");
    }

    // Ensure score is within valid range
    const score = Math.max(1, Math.min(10, llmResult.overallScore));

    // Generate product recommendations
    const currentAge = calculateAge(basicData.gender, basicData.profession) || 30; // Default age estimation
    const monthlyIncome = basicData.salaryPerMonth;

    // Get insurance recommendations
    const insuranceRecommendations = FinancialProductRecommendationEngine.getInsuranceRecommendations(
      score,
      monthlyIncome,
      currentAge,
      basicData.lifeInsurance,
      basicData.healthInsurance,
      basicData.dependents
    );

    // Determine risk tolerance based on age and financial score
    let riskTolerance: 'low' | 'moderate' | 'high' = 'moderate';
    if (currentAge < 30 && score >= 7) riskTolerance = 'high';
    else if (currentAge < 40 && score >= 6) riskTolerance = 'moderate';
    else riskTolerance = 'low';

    // Get mutual fund recommendations
    const totalInvestments = (advancedData.stocksNetWorth || 0) + (advancedData.mutualFundNetWorth || 0);
    const mutualFundRecommendations = FinancialProductRecommendationEngine.getMutualFundRecommendations(
      score,
      monthlyIncome,
      currentAge,
      riskTolerance,
      currentAge < 35 ? 'long' : currentAge < 50 ? 'medium' : 'short',
      totalInvestments
    );

    const response: EnhancedFinancialAssessmentResponse = {
      overallScore: Math.round(score * 10) / 10,
      advice: llmResult.advice,
      affordability: llmResult.affordability,
      productRecommendations: {
        insuranceRecommendations,
        mutualFundRecommendations,
        totalRecommendations: insuranceRecommendations.length + mutualFundRecommendations.length
      },
      calculationId: `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error("Error in financial assessment:", error);
    
    // Handle OpenAI API errors specifically
    let errorMessage = "An error occurred while calculating your financial score. Please try again.";
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        errorMessage = "OpenAI API configuration error. Please contact support.";
      } else if (error.message.includes("exceeded your current quota") || error.message.includes("insufficient_quota") || error.message.includes("billing details")) {
        errorMessage = "AI service quota exceeded. Please check your OpenAI account billing and usage limits. You may need to add payment details or upgrade your plan.";
      } else if (error.message.includes("rate limit")) {
        errorMessage = "Service temporarily unavailable due to high demand. Please try again later.";
      } else if (error.message.includes("Invalid JSON") || error.message.includes("Invalid response format")) {
        errorMessage = "Received invalid response from AI service. Please try again.";
      }
    }

    const errorResponse: ApiError = {
      error: "INTERNAL_ERROR",
      message: errorMessage,
      details: process.env.NODE_ENV === "development" ? error : undefined
    };
    res.status(500).json(errorResponse);
  }
};

function calculateAge(gender: string, profession: string): number | null {
  // Age estimation based on profession and other factors
  // This is a simplified estimation - in a real app you'd ask for age directly
  const professionAgeMap: Record<string, number> = {
    "Student": 22,
    "Private job": 28,
    "Govt job": 32,
    "House wife": 30,
    "Business owner": 35
  };

  return professionAgeMap[profession] || 30;
}

function createFinancialAssessmentPrompt(basicData: any, advancedData: any): string {
  // Create parameter mapping for descriptive names
  const parameterMap = {
    // Basic Data (excluding name)
    gender: "gender",
    profession: "profession",
    salaryPerMonth: "monthly salary",
    foodExpenses: "food expenses",
    houseRent: "house rent",
    utilitiesExpenses: "utilities expenses",
    lifeInsurance: "life insurance",
    healthInsurance: "health insurance",
    bike: "owns bike",
    car: "owns car",
    dependents: "dependents",
    education: "education",
    housesOwned: "houses owned",
    country: "country",

    // Advanced Data
    liquidCashFD: "liquid cash and fixed deposits",
    landNetWorth: "land net worth",
    stocksNetWorth: "stocks net worth",
    mutualFundNetWorth: "mutual funds net worth",
    goldNetWorth: "gold net worth",
    otherInvestment: "other investments",
    city: "city",
    state: "state"
  };

  // Function to check if a value should be included
  const hasValue = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    if (typeof value === 'number' && value === 0) return false;
    return true;
  };

  // Build parameters object with only meaningful values
  const parameters: Record<string, any> = {};

  // Process basic data (excluding name)
  Object.entries(basicData).forEach(([key, value]) => {
    if (key !== 'name' && hasValue(value) && parameterMap[key as keyof typeof parameterMap]) {
      const descriptiveName = parameterMap[key as keyof typeof parameterMap];
      parameters[descriptiveName] = value;
    }
  });

  // Process advanced data
  Object.entries(advancedData).forEach(([key, value]) => {
    if (hasValue(value) && parameterMap[key as keyof typeof parameterMap]) {
      const descriptiveName = parameterMap[key as keyof typeof parameterMap];
      parameters[descriptiveName] = value;
    }
  });

  // Convert parameters to formatted string
  const parameterLines = Object.entries(parameters)
    .map(([key, value]) => `"${key}": ${JSON.stringify(value)}`)
    .join(',\n');

  return `Please analyze this person's financial situation and provide a financial health score (1-10) with detailed advice:

${parameterLines}

Provide a comprehensive financial health score (1.0 to 10.0) and actionable advice for improvement.`;
}

// Register routes
router.post("/financial-assessment", handleFinancialAssessment);

export { router as financialAssessmentRouter };
