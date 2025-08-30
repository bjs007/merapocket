/**
 * API Types for Financial Assessment Backend
 */

/**
 * Financial Assessment API Types
 */
export interface BasicFinancialData {
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

export interface AdvancedFinancialData {
  liquidCashFD: number;
  landNetWorth: number;
  stocksNetWorth: number;
  mutualFundNetWorth: number;
  goldNetWorth: number;
  otherInvestment: number;
  city: string;
  state: string;
}

export interface FinancialAssessmentRequest {
  basicData: BasicFinancialData;
  advancedData: AdvancedFinancialData;
}

export interface FinancialAssessmentResponse {
  overallScore: number;
  advice: string;
  calculationId?: string;
  timestamp: string;
}

export interface ApiError {
  error: string;
  message: string;
  details?: any;
}
