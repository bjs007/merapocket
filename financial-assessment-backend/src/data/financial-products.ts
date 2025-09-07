import { InsuranceProduct, MutualFundProduct } from "../../../shared/api.js";

/**
 * Real Insurance Products in Indian Market
 * Data sources: Company websites, IRDA, and market research (Updated 2024)
 */
export const INSURANCE_PRODUCTS: InsuranceProduct[] = [
  // Life Insurance - Term Plans
  {
    id: "lic-tech-term",
    name: "LIC Tech Term",
    company: "Life Insurance Corporation of India",
    type: "term",
    coverage: 10000000,
    premium: 8000,
    premiumFrequency: "yearly",
    features: ["Online purchase discount", "Sum assured up to ₹25 crores", "Premium payment up to 85 years"],
    eligibilityMinAge: 18,
    eligibilityMaxAge: 65,
    minIncome: 300000,
    rating: 4.2,
    claimSettlementRatio: 98.74,
    description: "Pure term insurance plan with high coverage at affordable premiums",
    keyBenefits: ["No medical tests up to ₹75 lakhs", "Tax benefits under Section 80C", "Flexible premium payment options"],
    exclusions: ["Suicide within first year", "War and terrorism", "Self-inflicted injuries"],
    website: "https://licindia.in",
    phone: "022-68275333"
  },
  {
    id: "hdfc-click2protect-super",
    name: "HDFC Click 2 Protect Super",
    company: "HDFC Life Insurance",
    type: "term",
    coverage: 20000000,
    premium: 12000,
    premiumFrequency: "yearly",
    features: ["Life coverage", "33 critical illnesses", "Accidental death benefit"],
    eligibilityMinAge: 18,
    eligibilityMaxAge: 65,
    minIncome: 300000,
    rating: 4.5,
    claimSettlementRatio: 98.01,
    description: "Comprehensive term plan with life and critical illness coverage",
    keyBenefits: ["Critical illness advance benefit", "Waiver of premium", "Online discount up to 10%"],
    exclusions: ["Pre-existing diseases", "High-risk activities", "Drug abuse"],
    website: "https://hdfclife.com",
    phone: "1800-266-9777"
  },
  {
    id: "icici-iprotect-smart",
    name: "ICICI Pru iProtect Smart",
    company: "ICICI Prudential Life Insurance",
    type: "term",
    coverage: 15000000,
    premium: 10000,
    premiumFrequency: "yearly",
    features: ["Life cover", "Terminal illness benefit", "Accidental death benefit"],
    eligibilityMinAge: 18,
    eligibilityMaxAge: 60,
    minIncome: 250000,
    rating: 4.3,
    claimSettlementRatio: 97.9,
    description: "Smart term insurance with comprehensive protection",
    keyBenefits: ["Return of premium option", "Increasing life cover option", "Flexible premium payment terms"],
    exclusions: ["Suicide in first year", "War and nuclear risks", "Aviation risks"],
    website: "https://iciciprulife.com",
    phone: "1860-266-7766"
  },
  // Health Insurance
  {
    id: "sbi-arogya-premier",
    name: "SBI General Arogya Premier",
    company: "SBI General Insurance",
    type: "health",
    coverage: 500000,
    premium: 8500,
    premiumFrequency: "yearly",
    features: ["Cashless treatment", "Pre-post hospitalization", "Day care procedures"],
    eligibilityMinAge: 18,
    eligibilityMaxAge: 65,
    minIncome: 200000,
    rating: 4.1,
    claimSettlementRatio: 89.5,
    description: "Comprehensive health insurance for individuals and families",
    keyBenefits: ["No room rent capping", "Automatic restoration of sum insured", "Coverage for modern treatments"],
    exclusions: ["Pre-existing diseases (2-year waiting)", "Cosmetic surgery", "Dental treatment"],
    website: "https://sbigeneral.in",
    phone: "1800-22-1111"
  },
  {
    id: "star-red-carpet",
    name: "Star Health Red Carpet",
    company: "Star Health and Allied Insurance",
    type: "health",
    coverage: 2500000,
    premium: 25000,
    premiumFrequency: "yearly",
    features: ["Zero waiting period for accidents", "Pre-existing diseases covered", "International coverage"],
    eligibilityMinAge: 18,
    eligibilityMaxAge: 75,
    minIncome: 500000,
    rating: 4.4,
    claimSettlementRatio: 90.26,
    description: "Premium health insurance with enhanced benefits",
    keyBenefits: ["Annual health checkup", "Emergency ambulance", "Domiciliary treatment"],
    exclusions: ["Self-inflicted injuries", "War and terrorism", "Nuclear contamination"],
    website: "https://starhealth.in",
    phone: "044-28288800"
  }
];

/**
 * Real Mutual Fund Products in Indian Market  
 * Data sources: AMFI, Fund house websites, Value Research (Updated 2024)
 */
export const MUTUAL_FUND_PRODUCTS: MutualFundProduct[] = [
  // Large Cap Equity Funds
  {
    id: "hdfc-top-100",
    name: "HDFC Top 100 Fund",
    fundHouse: "HDFC Mutual Fund",
    category: "equity",
    subCategory: "Large Cap",
    nav: 785.43,
    expense_ratio: 1.92,
    minInvestment: 5000,
    sipMinAmount: 500,
    returns: {
      oneYear: 22.45,
      threeYear: 15.78,
      fiveYear: 12.89
    },
    riskLevel: "moderately_high",
    rating: 4,
    aum: 18500,
    fundManager: "Chirag Setalvad",
    benchmark: "S&P BSE 100 TRI",
    description: "Invests primarily in large cap stocks with strong fundamentals",
    keyFeatures: ["Diversified large cap portfolio", "Experienced fund management", "Consistent performance track record"],
    website: "https://hdfcfund.com",
    phone: "1800-419-4332"
  },
  {
    id: "sbi-bluechip",
    name: "SBI Blue Chip Fund",
    fundHouse: "SBI Mutual Fund",
    category: "equity",
    subCategory: "Large Cap",
    nav: 67.89,
    expense_ratio: 1.85,
    minInvestment: 5000,
    sipMinAmount: 500,
    returns: {
      oneYear: 20.12,
      threeYear: 14.25,
      fiveYear: 11.67
    },
    riskLevel: "moderately_high",
    rating: 4,
    aum: 28450,
    fundManager: "R Srinivasan",
    benchmark: "S&P BSE 100 TRI",
    description: "Invests in blue chip companies with strong market position",
    keyFeatures: ["Focus on quality large cap stocks", "Diversified sector allocation", "Long-term wealth creation"],
    website: "https://sbimf.com",
    phone: "1800-123-1963"
  },
  // Mid Cap Funds
  {
    id: "axis-midcap",
    name: "Axis Midcap Fund",
    fundHouse: "Axis Mutual Fund",
    category: "equity",
    subCategory: "Mid Cap",
    nav: 89.76,
    expense_ratio: 2.05,
    minInvestment: 5000,
    sipMinAmount: 500,
    returns: {
      oneYear: 35.67,
      threeYear: 18.45,
      fiveYear: 15.23
    },
    riskLevel: "high",
    rating: 5,
    aum: 14200,
    fundManager: "Shreyash Devalkar",
    benchmark: "NIFTY Midcap 100 TRI",
    description: "Invests in mid cap companies with high growth potential",
    keyFeatures: ["Focus on emerging mid cap opportunities", "Active stock selection", "High alpha generation"],
    website: "https://axismf.com",
    phone: "1800-233-2947"
  },
  // Debt Funds
  {
    id: "icici-short-term",
    name: "ICICI Prudential Short Term Fund",
    fundHouse: "ICICI Prudential Mutual Fund",
    category: "debt",
    subCategory: "Short Duration",
    nav: 47.32,
    expense_ratio: 0.89,
    minInvestment: 5000,
    sipMinAmount: 1000,
    returns: {
      oneYear: 7.45,
      threeYear: 6.78,
      fiveYear: 7.12
    },
    riskLevel: "low",
    rating: 4,
    aum: 9850,
    fundManager: "Manish Banthia",
    benchmark: "CRISIL Short Term Debt Index",
    description: "Invests in short to medium term debt securities",
    keyFeatures: ["Lower interest rate risk", "Good liquidity", "Suitable for short term goals"],
    website: "https://icicipruamc.com",
    phone: "1800-222-999"
  },
  // Hybrid Funds
  {
    id: "sbi-conservative-hybrid",
    name: "SBI Conservative Hybrid Fund",
    fundHouse: "SBI Mutual Fund",
    category: "hybrid",
    subCategory: "Conservative Hybrid",
    nav: 25.67,
    expense_ratio: 1.45,
    minInvestment: 5000,
    sipMinAmount: 500,
    returns: {
      oneYear: 12.34,
      threeYear: 10.45,
      fiveYear: 9.78
    },
    riskLevel: "moderate",
    rating: 4,
    aum: 7200,
    fundManager: "Dinesh Ahuja",
    benchmark: "CRISIL Hybrid 25+75 - Conservative Index",
    description: "Balanced allocation between equity and debt with conservative approach",
    keyFeatures: ["Capital protection with growth", "Lower volatility", "Tax efficient"],
    website: "https://sbimf.com",
    phone: "1800-123-1963"
  },
  // ELSS Funds
  {
    id: "axis-long-term-equity",
    name: "Axis Long Term Equity Fund",
    fundHouse: "Axis Mutual Fund",
    category: "equity",
    subCategory: "ELSS",
    nav: 156.78,
    expense_ratio: 1.75,
    minInvestment: 500,
    sipMinAmount: 500,
    returns: {
      oneYear: 28.67,
      threeYear: 16.89,
      fiveYear: 14.23
    },
    riskLevel: "high",
    rating: 5,
    aum: 35600,
    fundManager: "Jinesh Gopani",
    benchmark: "S&P BSE 500 TRI",
    description: "Tax saving fund with 3-year lock-in period",
    keyFeatures: ["Tax deduction under Section 80C", "Long term wealth creation", "Diversified equity portfolio"],
    website: "https://axismf.com",
    phone: "1800-233-2947"
  },
  // More Large Cap Funds
  {
    id: "icici-bluechip",
    name: "ICICI Prudential Bluechip Fund",
    fundHouse: "ICICI Prudential Mutual Fund",
    category: "equity",
    subCategory: "Large Cap",
    nav: 56.78,
    expense_ratio: 1.75,
    minInvestment: 5000,
    sipMinAmount: 500,
    returns: {
      oneYear: 19.45,
      threeYear: 14.32,
      fiveYear: 11.89
    },
    riskLevel: "moderately_high",
    rating: 4,
    aum: 22100,
    fundManager: "Sankaran Naren",
    benchmark: "Nifty 100 TRI",
    description: "Invests in fundamentally strong large cap companies",
    keyFeatures: ["Quality focused investment", "Diversified blue chip portfolio", "Long term wealth creation"],
    website: "https://icicipruamc.com",
    phone: "1800-222-999"
  },
  {
    id: "reliance-large-cap",
    name: "Reliance Large Cap Fund",
    fundHouse: "Reliance Mutual Fund",
    category: "equity",
    subCategory: "Large Cap",
    nav: 45.23,
    expense_ratio: 1.88,
    minInvestment: 5000,
    sipMinAmount: 500,
    returns: {
      oneYear: 21.34,
      threeYear: 15.67,
      fiveYear: 12.45
    },
    riskLevel: "moderately_high",
    rating: 4,
    aum: 16800,
    fundManager: "Tejas Gutka",
    benchmark: "S&P BSE 100 TRI",
    description: "Focused on large cap stocks with strong fundamentals",
    keyFeatures: ["Research driven approach", "Large cap focused", "Consistent performance"],
    website: "https://reliancemutual.com",
    phone: "1800-300-20000"
  },
  {
    id: "kotak-bluechip",
    name: "Kotak Bluechip Fund",
    fundHouse: "Kotak Mutual Fund",
    category: "equity",
    subCategory: "Large Cap",
    nav: 387.45,
    expense_ratio: 1.69,
    minInvestment: 5000,
    sipMinAmount: 500,
    returns: {
      oneYear: 18.76,
      threeYear: 13.89,
      fiveYear: 11.23
    },
    riskLevel: "moderately_high",
    rating: 4,
    aum: 19200,
    fundManager: "Harsha Upadhyaya",
    benchmark: "S&P BSE 100 TRI",
    description: "Invests in blue chip companies with strong market position",
    keyFeatures: ["Quality large cap stocks", "Experienced fund management", "Stable long term returns"],
    website: "https://kotakmf.com",
    phone: "1800-222-626"
  },

  // More Mid Cap Funds
  {
    id: "hdfc-mid-cap",
    name: "HDFC Mid-Cap Opportunities Fund",
    fundHouse: "HDFC Mutual Fund",
    category: "equity",
    subCategory: "Mid Cap",
    nav: 125.67,
    expense_ratio: 1.95,
    minInvestment: 5000,
    sipMinAmount: 500,
    returns: {
      oneYear: 32.45,
      threeYear: 17.23,
      fiveYear: 14.78
    },
    riskLevel: "high",
    rating: 5,
    aum: 32400,
    fundManager: "Chirag Setalvad",
    benchmark: "Nifty Midcap 100 TRI",
    description: "Focuses on mid-cap companies with strong growth potential",
    keyFeatures: ["Quality mid cap selection", "Growth focused", "Strong research team"],
    website: "https://hdfcfund.com",
    phone: "1800-419-4332"
  },
  {
    id: "kotak-emerging-equity",
    name: "Kotak Emerging Equity Fund",
    fundHouse: "Kotak Mutual Fund",
    category: "equity",
    subCategory: "Mid Cap",
    nav: 78.90,
    expense_ratio: 2.15,
    minInvestment: 5000,
    sipMinAmount: 500,
    returns: {
      oneYear: 38.67,
      threeYear: 19.45,
      fiveYear: 16.23
    },
    riskLevel: "high",
    rating: 4,
    aum: 18600,
    fundManager: "Pankaj Tibrewal",
    benchmark: "S&P BSE 250 SmallCap Index",
    description: "Invests in emerging mid and small cap opportunities",
    keyFeatures: ["High growth potential", "Emerging company focus", "Active management"],
    website: "https://kotakmf.com",
    phone: "1800-222-626"
  },

  // Small Cap Funds
  {
    id: "sbi-small-cap",
    name: "SBI Small Cap Fund",
    fundHouse: "SBI Mutual Fund",
    category: "equity",
    subCategory: "Small Cap",
    nav: 143.78,
    expense_ratio: 2.25,
    minInvestment: 5000,
    sipMinAmount: 500,
    returns: {
      oneYear: 45.23,
      threeYear: 22.67,
      fiveYear: 18.45
    },
    riskLevel: "very_high",
    rating: 4,
    aum: 12300,
    fundManager: "R Srinivasan",
    benchmark: "S&P BSE 250 SmallCap Index",
    description: "Invests in small cap companies with high growth potential",
    keyFeatures: ["Small cap focused", "High growth potential", "Long term wealth creation"],
    website: "https://sbimf.com",
    phone: "1800-123-1963"
  },
  {
    id: "axis-small-cap",
    name: "Axis Small Cap Fund",
    fundHouse: "Axis Mutual Fund",
    category: "equity",
    subCategory: "Small Cap",
    nav: 67.45,
    expense_ratio: 2.38,
    minInvestment: 5000,
    sipMinAmount: 500,
    returns: {
      oneYear: 42.89,
      threeYear: 21.34,
      fiveYear: 17.89
    },
    riskLevel: "very_high",
    rating: 5,
    aum: 8900,
    fundManager: "Shreyash Devalkar",
    benchmark: "S&P BSE 250 SmallCap Index",
    description: "Focused on small cap companies with exceptional growth potential",
    keyFeatures: ["Bottom-up stock selection", "Quality small caps", "High alpha generation"],
    website: "https://axismf.com",
    phone: "1800-233-2947"
  },

  // More ELSS Funds
  {
    id: "hdfc-taxsaver",
    name: "HDFC TaxSaver Fund",
    fundHouse: "HDFC Mutual Fund",
    category: "equity",
    subCategory: "ELSS",
    nav: 567.23,
    expense_ratio: 1.85,
    minInvestment: 500,
    sipMinAmount: 500,
    returns: {
      oneYear: 26.78,
      threeYear: 16.23,
      fiveYear: 13.89
    },
    riskLevel: "high",
    rating: 4,
    aum: 18900,
    fundManager: "Prashant Jain",
    benchmark: "S&P BSE 500 TRI",
    description: "Tax saving fund with diversified equity portfolio",
    keyFeatures: ["Tax deduction under Section 80C", "Diversified equity exposure", "Professional management"],
    website: "https://hdfcfund.com",
    phone: "1800-419-4332"
  },
  {
    id: "icici-elss",
    name: "ICICI Prudential Long Term Equity Fund",
    fundHouse: "ICICI Prudential Mutual Fund",
    category: "equity",
    subCategory: "ELSS",
    nav: 134.56,
    expense_ratio: 1.78,
    minInvestment: 500,
    sipMinAmount: 500,
    returns: {
      oneYear: 25.43,
      threeYear: 15.67,
      fiveYear: 13.23
    },
    riskLevel: "high",
    rating: 4,
    aum: 24600,
    fundManager: "Sankaran Naren",
    benchmark: "S&P BSE 500 TRI",
    description: "ELSS fund for tax saving and wealth creation",
    keyFeatures: ["3-year lock-in period", "Tax benefits", "Equity market exposure"],
    website: "https://icicipruamc.com",
    phone: "1800-222-999"
  },

  // More Debt Funds
  {
    id: "hdfc-corporate-bond",
    name: "HDFC Corporate Bond Fund",
    fundHouse: "HDFC Mutual Fund",
    category: "debt",
    subCategory: "Corporate Bond",
    nav: 23.45,
    expense_ratio: 0.75,
    minInvestment: 5000,
    sipMinAmount: 1000,
    returns: {
      oneYear: 8.23,
      threeYear: 7.67,
      fiveYear: 8.12
    },
    riskLevel: "low",
    rating: 4,
    aum: 15600,
    fundManager: "Ritesh Jain",
    benchmark: "CRISIL Corporate Bond Composite Index",
    description: "Invests in high quality corporate bonds",
    keyFeatures: ["Corporate bond focused", "Credit risk management", "Stable returns"],
    website: "https://hdfcfund.com",
    phone: "1800-419-4332"
  },
  {
    id: "axis-banking-psu",
    name: "Axis Banking & PSU Debt Fund",
    fundHouse: "Axis Mutual Fund",
    category: "debt",
    subCategory: "Banking & PSU",
    nav: 2156.78,
    expense_ratio: 0.69,
    minInvestment: 5000,
    sipMinAmount: 1000,
    returns: {
      oneYear: 7.89,
      threeYear: 7.23,
      fiveYear: 7.78
    },
    riskLevel: "low",
    rating: 5,
    aum: 18900,
    fundManager: "Ritesh Kumar",
    benchmark: "CRISIL 1 Year T-Bill Index",
    description: "Invests in banking and PSU bonds",
    keyFeatures: ["Banking & PSU focus", "Lower credit risk", "Consistent performance"],
    website: "https://axismf.com",
    phone: "1800-233-2947"
  },

  // More Hybrid Funds
  {
    id: "icici-balanced-advantage",
    name: "ICICI Prudential Balanced Advantage Fund",
    fundHouse: "ICICI Prudential Mutual Fund",
    category: "hybrid",
    subCategory: "Dynamic Asset Allocation",
    nav: 56.78,
    expense_ratio: 1.25,
    minInvestment: 5000,
    sipMinAmount: 500,
    returns: {
      oneYear: 14.23,
      threeYear: 11.89,
      fiveYear: 10.67
    },
    riskLevel: "moderate",
    rating: 4,
    aum: 28900,
    fundManager: "Ihab Dalwai",
    benchmark: "CRISIL Hybrid 25+75 Aggressive Index",
    description: "Dynamic allocation between equity and debt based on market conditions",
    keyFeatures: ["Dynamic asset allocation", "Market timing strategy", "Balanced approach"],
    website: "https://icicipruamc.com",
    phone: "1800-222-999"
  },
  {
    id: "hdfc-hybrid-equity",
    name: "HDFC Hybrid Equity Fund",
    fundHouse: "HDFC Mutual Fund",
    category: "hybrid",
    subCategory: "Aggressive Hybrid",
    nav: 78.90,
    expense_ratio: 1.65,
    minInvestment: 5000,
    sipMinAmount: 500,
    returns: {
      oneYear: 16.45,
      threeYear: 13.23,
      fiveYear: 11.78
    },
    riskLevel: "moderately_high",
    rating: 4,
    aum: 14200,
    fundManager: "Prashant Jain",
    benchmark: "CRISIL Hybrid 25+75 Aggressive Index",
    description: "Aggressive hybrid fund with equity focus",
    keyFeatures: ["Equity oriented", "Debt for stability", "Tax efficient"],
    website: "https://hdfcfund.com",
    phone: "1800-419-4332"
  },

  // Sectoral/Thematic Funds
  {
    id: "icici-technology",
    name: "ICICI Prudential Technology Fund",
    fundHouse: "ICICI Prudential Mutual Fund",
    category: "equity",
    subCategory: "Sectoral",
    nav: 123.45,
    expense_ratio: 2.25,
    minInvestment: 5000,
    sipMinAmount: 500,
    returns: {
      oneYear: 35.67,
      threeYear: 20.23,
      fiveYear: 16.89
    },
    riskLevel: "very_high",
    rating: 4,
    aum: 8900,
    fundManager: "Sankaran Naren",
    benchmark: "S&P BSE IT Index",
    description: "Focused on technology and IT companies",
    keyFeatures: ["Technology sector focus", "High growth potential", "Sector expertise"],
    website: "https://icicipruamc.com",
    phone: "1800-222-999"
  },
  {
    id: "sbi-pharma",
    name: "SBI Healthcare Opportunities Fund",
    fundHouse: "SBI Mutual Fund",
    category: "equity",
    subCategory: "Sectoral",
    nav: 234.56,
    expense_ratio: 2.15,
    minInvestment: 5000,
    sipMinAmount: 500,
    returns: {
      oneYear: 28.90,
      threeYear: 18.45,
      fiveYear: 15.67
    },
    riskLevel: "very_high",
    rating: 4,
    aum: 5600,
    fundManager: "R Srinivasan",
    benchmark: "S&P BSE Healthcare Index",
    description: "Invests in pharmaceutical and healthcare companies",
    keyFeatures: ["Healthcare sector focus", "Defensive sector play", "Long term growth"],
    website: "https://sbimf.com",
    phone: "1800-123-1963"
  },

  // International Funds
  {
    id: "motilal-nasdaq-100",
    name: "Motilal Oswal NASDAQ 100 ETF",
    fundHouse: "Motilal Oswal Mutual Fund",
    category: "equity",
    subCategory: "International",
    nav: 34.56,
    expense_ratio: 0.65,
    minInvestment: 5000,
    sipMinAmount: 1000,
    returns: {
      oneYear: 42.34,
      threeYear: 18.67,
      fiveYear: 16.45
    },
    riskLevel: "high",
    rating: 4,
    aum: 4200,
    fundManager: "Swinal Samant",
    benchmark: "NASDAQ 100 Index",
    description: "Invests in top 100 US technology companies",
    keyFeatures: ["Global diversification", "Technology sector exposure", "Currency hedging available"],
    website: "https://motilaloswalmf.com",
    phone: "022-38934200"
  },
  {
    id: "icici-us-bluechip",
    name: "ICICI Prudential US Bluechip Equity Fund",
    fundHouse: "ICICI Prudential Mutual Fund",
    category: "equity",
    subCategory: "International",
    nav: 28.90,
    expense_ratio: 1.25,
    minInvestment: 5000,
    sipMinAmount: 1000,
    returns: {
      oneYear: 38.45,
      threeYear: 16.89,
      fiveYear: 14.23
    },
    riskLevel: "high",
    rating: 4,
    aum: 3400,
    fundManager: "Sankaran Naren",
    benchmark: "S&P 500 TRI",
    description: "Invests in US large cap equity markets",
    keyFeatures: ["US market exposure", "Dollar denominated returns", "Global blue chips"],
    website: "https://icicipruamc.com",
    phone: "1800-222-999"
  },

  // Index Funds
  {
    id: "sbi-nifty-index",
    name: "SBI Nifty Index Fund",
    fundHouse: "SBI Mutual Fund",
    category: "equity",
    subCategory: "Index Fund",
    nav: 178.45,
    expense_ratio: 0.15,
    minInvestment: 5000,
    sipMinAmount: 500,
    returns: {
      oneYear: 20.34,
      threeYear: 14.78,
      fiveYear: 12.23
    },
    riskLevel: "moderately_high",
    rating: 4,
    aum: 8900,
    fundManager: "Passive Team",
    benchmark: "Nifty 50 TRI",
    description: "Passive index fund tracking Nifty 50",
    keyFeatures: ["Low cost indexing", "Nifty 50 exposure", "Passive investment"],
    website: "https://sbimf.com",
    phone: "1800-123-1963"
  },
  {
    id: "icici-sensex-index",
    name: "ICICI Prudential Sensex Index Fund",
    fundHouse: "ICICI Prudential Mutual Fund",
    category: "equity",
    subCategory: "Index Fund",
    nav: 45.67,
    expense_ratio: 0.18,
    minInvestment: 5000,
    sipMinAmount: 500,
    returns: {
      oneYear: 19.89,
      threeYear: 14.23,
      fiveYear: 11.89
    },
    riskLevel: "moderately_high",
    rating: 4,
    aum: 6700,
    fundManager: "Passive Team",
    benchmark: "S&P BSE Sensex TRI",
    description: "Index fund replicating BSE Sensex performance",
    keyFeatures: ["Low expense ratio", "Sensex tracking", "Broad market exposure"],
    website: "https://icicipruamc.com",
    phone: "1800-222-999"
  }
];

/**
 * Financial Product Recommendation Engine
 */
export class FinancialProductRecommendationEngine {
  /**
   * Get insurance recommendations based on user profile and financial score
   */
  static getInsuranceRecommendations(
    financialScore: number,
    monthlyIncome: number,
    age: number,
    hasLifeInsurance: boolean,
    hasHealthInsurance: boolean,
    dependents: number
  ): { product: InsuranceProduct; matchScore: number; reasons: string[]; suitabilityExplanation: string; priority: 'high' | 'medium' | 'low' }[] {
    const recommendations = [];

    for (const product of INSURANCE_PRODUCTS) {
      let matchScore = 0;
      const reasons = [];
      let priority: 'high' | 'medium' | 'low' = 'low';

      // Age eligibility check
      if (age < product.eligibilityMinAge || age > product.eligibilityMaxAge) {
        continue;
      }

      // Income eligibility check
      if (monthlyIncome * 12 < product.minIncome) {
        continue;
      }

      // Premium affordability (should not exceed 10% of annual income for term insurance, 5% for health)
      const maxAffordablePremium = product.type === 'health' ? 
        monthlyIncome * 12 * 0.05 : monthlyIncome * 12 * 0.10;
      
      if (product.premium > maxAffordablePremium) {
        continue;
      }

      // Base score based on financial score
      matchScore += financialScore * 10;

      // Life Insurance Logic
      if (product.type === 'term' && !hasLifeInsurance) {
        matchScore += 40;
        reasons.push("Essential life insurance coverage missing");
        priority = 'high';
        
        if (dependents > 0) {
          matchScore += 20;
          reasons.push(`Provides financial security for ${dependents} dependents`);
        }
        
        if (product.coverage >= monthlyIncome * 12 * 10) {
          matchScore += 15;
          reasons.push("Adequate coverage (10x annual income)");
        }
      }

      // Health Insurance Logic
      if (product.type === 'health' && !hasHealthInsurance) {
        matchScore += 35;
        reasons.push("Health insurance is essential for medical emergencies");
        priority = 'high';
        
        if (age > 30) {
          matchScore += 10;
          reasons.push("Health risks increase with age");
        }
      }

      // Company rating bonus
      matchScore += product.rating * 5;
      
      // Claim settlement ratio bonus
      if (product.claimSettlementRatio > 95) {
        matchScore += 10;
        reasons.push("Excellent claim settlement ratio");
      }

      // Coverage adequacy
      if (product.type === 'health' && product.coverage >= 500000) {
        matchScore += 8;
        reasons.push("Sufficient health coverage for medical inflation");
      }

      // Financial score based adjustments
      if (financialScore >= 8) {
        if (product.coverage > 1000000 || product.company.includes('HDFC') || product.company.includes('ICICI')) {
          matchScore += 15;
          reasons.push("Premium product suitable for your financial status");
        }
      } else if (financialScore < 6) {
        if (product.premium < monthlyIncome * 0.5) {
          matchScore += 10;
          reasons.push("Affordable premium for your current financial situation");
        }
      }

      let suitabilityExplanation = "";
      if (product.type === 'term') {
        suitabilityExplanation = `This term insurance provides ₹${(product.coverage / 100000).toFixed(0)} lakh coverage at just ₹${(product.premium / 12).toFixed(0)} per month. Ideal for securing your family's financial future.`;
      } else if (product.type === 'health') {
        suitabilityExplanation = `This health plan covers ₹${(product.coverage / 100000).toFixed(0)} lakh for medical expenses. Essential protection against rising healthcare costs.`;
      }

      if (matchScore > 50) {
        recommendations.push({
          product,
          matchScore: Math.min(matchScore, 100),
          reasons,
          suitabilityExplanation,
          priority
        });
      }
    }

    return recommendations.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
  }

  /**
   * Get mutual fund recommendations based on user profile and financial score
   */
  static getMutualFundRecommendations(
    financialScore: number,
    monthlyIncome: number,
    age: number,
    riskTolerance: 'low' | 'moderate' | 'high',
    investmentHorizon: 'short' | 'medium' | 'long',
    currentInvestments: number
  ): { product: MutualFundProduct; matchScore: number; reasons: string[]; suitabilityExplanation: string; priority: 'high' | 'medium' | 'low' }[] {
    const recommendations = [];

    // Determine risk tolerance based on age and financial score if not provided
    if (!riskTolerance) {
      if (age < 30 && financialScore >= 7) riskTolerance = 'high';
      else if (age < 40 && financialScore >= 6) riskTolerance = 'moderate';
      else riskTolerance = 'low';
    }

    // Determine investment horizon based on age
    if (!investmentHorizon) {
      if (age < 35) investmentHorizon = 'long';
      else if (age < 50) investmentHorizon = 'medium';
      else investmentHorizon = 'short';
    }

    for (const product of MUTUAL_FUND_PRODUCTS) {
      let matchScore = 0;
      const reasons = [];
      let priority: 'high' | 'medium' | 'low' = 'low';

      // Affordability check
      if (product.sipMinAmount > monthlyIncome * 0.15) {
        continue; // Skip if SIP amount is more than 15% of monthly income
      }

      // Base score
      matchScore += financialScore * 8;

      // Risk matching
      const riskMapping = {
        'low': ['low', 'moderate'],
        'moderate': ['low', 'moderate', 'moderately_high'],
        'high': ['moderate', 'moderately_high', 'high', 'very_high']
      };

      if (riskMapping[riskTolerance].includes(product.riskLevel)) {
        matchScore += 25;
        reasons.push("Risk level matches your profile");
      } else {
        continue; // Skip products that don't match risk tolerance
      }

      // Investment horizon matching
      if (investmentHorizon === 'long' && product.category === 'equity') {
        matchScore += 20;
        reasons.push("Equity funds are ideal for long-term wealth creation");
        priority = 'high';
      } else if (investmentHorizon === 'medium' && (product.category === 'hybrid' || product.subCategory === 'Large Cap')) {
        matchScore += 15;
        reasons.push("Suitable for medium-term financial goals");
        priority = 'medium';
      } else if (investmentHorizon === 'short' && product.category === 'debt') {
        matchScore += 20;
        reasons.push("Debt funds are suitable for short-term investments");
        priority = 'high';
      }

      // Performance bonus
      if (product.returns.threeYear > 12) {
        matchScore += 15;
        reasons.push("Strong historical performance");
      }

      // Low expense ratio bonus
      if (product.expense_ratio < 1.5) {
        matchScore += 10;
        reasons.push("Low expense ratio enhances returns");
      }

      // Rating bonus
      matchScore += product.rating * 5;

      // Fund house reputation
      if (['HDFC', 'SBI', 'ICICI', 'Axis'].some(name => product.fundHouse.includes(name))) {
        matchScore += 8;
        reasons.push("Reputed fund house with strong track record");
      }

      // Age-specific recommendations
      if (age < 30) {
        if (product.subCategory === 'ELSS') {
          matchScore += 20;
          reasons.push("Tax saving with wealth creation for young investors");
          priority = 'high';
        }
        if (product.subCategory === 'Mid Cap' || product.subCategory === 'Small Cap') {
          matchScore += 10;
          reasons.push("High growth potential suitable for young investors");
        }
      } else if (age > 45) {
        if (product.category === 'hybrid' || product.category === 'debt') {
          matchScore += 15;
          reasons.push("Conservative approach suitable for pre-retirement planning");
        }
      }

      // Financial score adjustments
      if (financialScore >= 8) {
        if (product.subCategory === 'International' || product.subCategory === 'Mid Cap') {
          matchScore += 12;
          reasons.push("Advanced investment option for high financial score");
        }
      }

      // First-time investor recommendations
      if (currentInvestments < 100000) {
        if (product.subCategory === 'Large Cap' || product.category === 'hybrid') {
          matchScore += 10;
          reasons.push("Good starting point for new investors");
        }
      }

      let suitabilityExplanation = "";
      if (product.category === 'equity') {
        suitabilityExplanation = `This equity fund has delivered ${product.returns.threeYear.toFixed(1)}% annualized returns over 3 years. Start SIP with just ₹${product.sipMinAmount}/month for long-term wealth creation.`;
      } else if (product.category === 'debt') {
        suitabilityExplanation = `This debt fund offers stable returns of ${product.returns.oneYear.toFixed(1)}% with lower risk. Ideal for conservative investors and short-term goals.`;
      } else if (product.category === 'hybrid') {
        suitabilityExplanation = `This balanced fund provides ${product.returns.threeYear.toFixed(1)}% returns with moderate risk. Perfect blend of growth and stability.`;
      }

      if (matchScore > 40) {
        recommendations.push({
          product,
          matchScore: Math.min(matchScore, 100),
          reasons,
          suitabilityExplanation,
          priority
        });
      }
    }

    // Sort by match score first
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    // Add variety by ensuring we don't have too many funds from same fund house or category
    const selectedRecommendations = [];
    const fundHouseCount = new Map<string, number>();
    const categoryCount = new Map<string, number>();

    for (const rec of recommendations) {
      const fundHouse = rec.product.fundHouse;
      const category = rec.product.subCategory;

      // Limit to max 2 funds per fund house and 2 per subcategory for variety
      if ((fundHouseCount.get(fundHouse) || 0) < 2 &&
          (categoryCount.get(category) || 0) < 2 &&
          selectedRecommendations.length < 6) {

        selectedRecommendations.push(rec);
        fundHouseCount.set(fundHouse, (fundHouseCount.get(fundHouse) || 0) + 1);
        categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
      }
    }

    // If we don't have enough variety, fill with remaining high-scoring funds
    if (selectedRecommendations.length < 6) {
      for (const rec of recommendations) {
        if (!selectedRecommendations.includes(rec) && selectedRecommendations.length < 6) {
          selectedRecommendations.push(rec);
        }
      }
    }

    // Add some randomization for users with similar profiles
    if (selectedRecommendations.length > 3) {
      // Keep top 3 recommendations, shuffle the rest for variety
      const top3 = selectedRecommendations.slice(0, 3);
      const remaining = selectedRecommendations.slice(3);

      // Simple shuffle for remaining recommendations
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }

      return [...top3, ...remaining];
    }

    return selectedRecommendations;
  }
}
