import type { Context, Config } from "@netlify/functions";

interface BasicFinancialData {
  name: string;
  gender: string;
  profession: string;
  salaryPerMonth: number;
  foodExpenses: number;
  houseRent: number;
  utilitiesExpenses: number;
  lifeInsurance: boolean;
  healthInsurance: boolean;
  bike: boolean;
  car: boolean;
  dependents: number;
  education: string;
  housesOwned: number;
  country: string;
}

interface AdvancedFinancialData {
  liquidCashFD: number;
  landNetWorth: number;
  stocksNetWorth: number;
  mutualFundNetWorth: number;
  goldNetWorth: number;
  otherInvestment: number;
  city: string;
  state: string;
}

interface FinancialAssessmentRequest {
  basicData: BasicFinancialData;
  advancedData: AdvancedFinancialData;
}

interface AffordabilityItem {
  canAfford: boolean;
  description: string;
}

interface AffordabilityAnalysis {
  mobile: AffordabilityItem;
  bike: AffordabilityItem;
  car: AffordabilityItem;
  foreignTrip: AffordabilityItem;
  homeUpgrade: AffordabilityItem;
  gadgets: AffordabilityItem;
}

interface EnhancedFinancialAssessmentResponse {
  overallScore: number;
  advice: string;
  affordability: AffordabilityAnalysis;
  productRecommendations: {
    insuranceRecommendations: any[];
    mutualFundRecommendations: any[];
    totalRecommendations: number;
  };
  calculationId?: string;
  timestamp: string;
}

interface ApiError {
  error: string;
  message: string;
  details?: any;
}

export default async (req: Request, context: Context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }

  try {
    const { basicData, advancedData }: FinancialAssessmentRequest = await req.json();

    // Validate required fields
    if (!basicData.country) {
      const error: ApiError = {
        error: "VALIDATION_ERROR",
        message: "Country is a required field"
      };
      return new Response(JSON.stringify(error), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    // Validate salary is mandatory
    if (!basicData.salaryPerMonth || basicData.salaryPerMonth <= 0) {
      const error: ApiError = {
        error: "VALIDATION_ERROR",
        message: "Salary per month is required and must be greater than 0"
      };
      return new Response(JSON.stringify(error), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    // Validate salary is greater than total monthly expenses
    const totalMonthlyExpenses = (basicData.foodExpenses || 0) + (basicData.houseRent || 0) + (basicData.utilitiesExpenses || 0);
    if (basicData.salaryPerMonth <= totalMonthlyExpenses) {
      const error: ApiError = {
        error: "VALIDATION_ERROR",
        message: `Salary (₹${basicData.salaryPerMonth.toLocaleString()}) must be greater than total monthly expenses (₹${totalMonthlyExpenses.toLocaleString()})`
      };
      return new Response(JSON.stringify(error), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    // Generate a basic score based on financial data
    const income = basicData.salaryPerMonth || 0;
    const expenses = (basicData.foodExpenses || 0) + (basicData.houseRent || 0) + (basicData.utilitiesExpenses || 0);
    const savings = income - expenses;
    const savingsRatio = income > 0 ? savings / income : 0;

    let score = 5;
    if (savingsRatio > 0.3) score += 2;
    else if (savingsRatio > 0.2) score += 1;
    else if (savingsRatio < 0) score -= 2;

    if (basicData.lifeInsurance) score += 0.5;
    if (basicData.healthInsurance) score += 0.5;
    if (basicData.housesOwned > 0) score += 1;

    score = Math.max(1, Math.min(10, score));

    const monthlyDisposable = Math.max(0, savings);
    const totalAssets = (advancedData.liquidCashFD || 0) + (advancedData.stocksNetWorth || 0) + (advancedData.mutualFundNetWorth || 0);
    
    // Generate product recommendations
    let insuranceRecommendations = [];
    let mutualFundRecommendations = [];

    try {
      const currentAge = 30; // Default age estimation
      const monthlyIncome = basicData.salaryPerMonth;

      // Import the recommendation engine
      const { FinancialProductRecommendationEngine } = await import('../../financial-assessment-backend/src/data/financial-products.js');

      // Get insurance recommendations
      insuranceRecommendations = FinancialProductRecommendationEngine.getInsuranceRecommendations(
        score,
        monthlyIncome,
        currentAge,
        basicData.lifeInsurance,
        basicData.healthInsurance,
        basicData.dependents
      );

      // Determine risk tolerance based on financial score
      let riskTolerance: 'low' | 'moderate' | 'high' = 'moderate';
      if (score >= 8) riskTolerance = 'high';
      else if (score >= 6) riskTolerance = 'moderate';
      else riskTolerance = 'low';

      // Get mutual fund recommendations
      const totalInvestments = (advancedData.stocksNetWorth || 0) + (advancedData.mutualFundNetWorth || 0);
      mutualFundRecommendations = FinancialProductRecommendationEngine.getMutualFundRecommendations(
        score,
        monthlyIncome,
        currentAge,
        riskTolerance,
        'long', // Default to long-term investment horizon
        totalInvestments
      );
    } catch (error) {
      console.log("Product recommendations generation failed:", error);
      // Continue with empty recommendations
    }

    const result: EnhancedFinancialAssessmentResponse = {
      overallScore: Math.round(score * 10) / 10,
      advice: `Based on your financial profile, here's your comprehensive assessment:

1. **Emergency Fund**: ${savingsRatio > 0.2 ? 'Excellent savings rate! Consider building an emergency fund covering 6 months of expenses.' : 'Focus on building an emergency fund by saving at least 20% of your income monthly.'}

2. **Insurance Coverage**: ${basicData.lifeInsurance && basicData.healthInsurance ? 'Great job on having comprehensive insurance coverage!' : 'Consider getting life and health insurance for better financial security.'}

3. **Investment Strategy**: ${totalAssets > 100000 ? 'Good investment portfolio! Consider diversifying across different asset classes.' : 'Start investing in mutual funds and stocks for long-term wealth building.'}

4. **Debt Management**: Keep your expenses below 70% of income and prioritize paying off high-interest debts first.

5. **Property Investment**: ${basicData.housesOwned > 0 ? 'Owning property is excellent for long-term wealth building!' : 'Consider real estate investment when your savings and income grow.'}`,
      affordability: {
        mobile: {
          canAfford: monthlyDisposable >= 2000 || totalAssets >= 25000 || income >= 25000,
          description: (monthlyDisposable >= 2000 || income >= 25000) ? "You can comfortably afford a mobile phone within your budget! Consider investing in a quality device that meets your needs." : "You're building towards affording a quality mobile device. Focus on increasing your savings."
        },
        gadgets: {
          canAfford: monthlyDisposable >= 2000 || totalAssets >= 20000 || income >= 30000,
          description: (monthlyDisposable >= 2000 || income >= 30000) ? "You can afford new gadgets! Treat yourself to something that enhances your daily life." : "You're building financial strength for quality tech purchases."
        },
        foreignTrip: {
          canAfford: monthlyDisposable >= 8000 || totalAssets >= 100000 || income >= 150000,
          description: (monthlyDisposable >= 8000 || income >= 150000) ? "You can afford a foreign trip! With your current savings, you can plan a memorable experience." : "You're on track to afford a wonderful foreign trip soon."
        },
        bike: {
          canAfford: (monthlyDisposable >= 5000 && income >= 25000) || totalAssets >= 80000 || income >= 100000,
          description: (monthlyDisposable >= 5000 || income >= 100000) ? "You're building towards affording a bike! With your savings plan, you can achieve this goal in a few months." : "You're making good progress towards bike ownership."
        },
        car: {
          canAfford: (monthlyDisposable >= 10000 && income >= 40000) || totalAssets >= 300000 || income >= 200000 || (savingsRatio >= 0.1 && income >= 100000),
          description: (income >= 200000 || (monthlyDisposable >= 10000 && income >= 100000) || totalAssets >= 300000) ? "You're on track to achieve your goal of owning a car! With your income level, you can comfortably afford car ownership and maintenance." : "Keep building your finances - a car is an achievable goal."
        },
        homeUpgrade: {
          canAfford: (monthlyDisposable >= 15000 && income >= 100000) || totalAssets >= 200000 || basicData.housesOwned > 0 || income >= 300000,
          description: (monthlyDisposable >= 15000 || income >= 300000 || basicData.housesOwned > 0) ? "You're making great progress towards home upgrades! With your financial discipline, this goal is within reach." : "Your growing wealth suggests home upgrades are becoming possible."
        }
      },
      productRecommendations: {
        insuranceRecommendations,
        mutualFundRecommendations,
        totalRecommendations: insuranceRecommendations.length + mutualFundRecommendations.length
      },
      calculationId: `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error in financial assessment:", error);
    
    const errorResponse: ApiError = {
      error: "INTERNAL_ERROR",
      message: "An error occurred while calculating your financial score. Please try again.",
      details: error instanceof Error ? error.message : 'Unknown error'
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }
};

export const config: Config = {
  path: "/api/financial-assessment"
};
