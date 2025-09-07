/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

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
  housesOwned: number;
}

export interface FinancialAssessmentRequest {
  basicData: BasicFinancialData;
  advancedData: AdvancedFinancialData;
}

export interface AffordabilityItem {
  canAfford: boolean;
  description: string;
}

export interface AffordabilityAnalysis {
  mobile: AffordabilityItem;
  bike: AffordabilityItem;
  car: AffordabilityItem;
  foreignTrip: AffordabilityItem;
  homeUpgrade: AffordabilityItem;
  gadgets: AffordabilityItem;
}

export interface FinancialAssessmentResponse {
  overallScore: number;
  advice: string;
  affordability: AffordabilityAnalysis;
  calculationId?: string;
  timestamp: string;
}

export interface ApiError {
  error: string;
  message: string;
  details?: any;
}

/**
 * Financial Product Recommendation Types
 */
export interface InsuranceProduct {
  id: string;
  name: string;
  company: string;
  type: 'term' | 'whole' | 'endowment' | 'ulip' | 'health' | 'motor';
  coverage: number;
  premium: number;
  premiumFrequency: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  eligibilityMinAge: number;
  eligibilityMaxAge: number;
  minIncome: number;
  rating: number;
  claimSettlementRatio: number;
  description: string;
  keyBenefits: string[];
  exclusions: string[];
  website: string;
  phone: string;
}

export interface MutualFundProduct {
  id: string;
  name: string;
  fundHouse: string;
  category: 'equity' | 'debt' | 'hybrid' | 'solution' | 'etf';
  subCategory: string;
  nav: number;
  expense_ratio: number;
  minInvestment: number;
  sipMinAmount: number;
  returns: {
    oneYear: number;
    threeYear: number;
    fiveYear: number;
  };
  riskLevel: 'low' | 'moderate' | 'moderately_high' | 'high' | 'very_high';
  rating: number;
  aum: number;
  fundManager: string;
  benchmark: string;
  description: string;
  keyFeatures: string[];
  website: string;
  phone: string;
}

export interface ProductRecommendation {
  product: InsuranceProduct | MutualFundProduct;
  matchScore: number;
  reasons: string[];
  suitabilityExplanation: string;
  priority: 'high' | 'medium' | 'low';
}

export interface FinancialProductRecommendations {
  insuranceRecommendations: ProductRecommendation[];
  mutualFundRecommendations: ProductRecommendation[];
  totalRecommendations: number;
}

export interface EnhancedFinancialAssessmentResponse extends FinancialAssessmentResponse {
  productRecommendations: FinancialProductRecommendations;
}

/**
 * Location data types
 */
export interface CountryData {
  name: string;
  code: string;
  states: StateData[];
}

export interface StateData {
  name: string;
  code: string;
  cities: string[];
}

/**
 * Location data for the top 10 most populous countries
 */
export const COUNTRIES_DATA: CountryData[] = [
  {
    name: "China",
    code: "CN",
    states: [
      {
        name: "Beijing",
        code: "BJ",
        cities: ["Beijing", "Chaoyang", "Haidian", "Xicheng", "Dongcheng", "Fengtai", "Shijingshan", "Mentougou"]
      },
      {
        name: "Shanghai",
        code: "SH",
        cities: ["Shanghai", "Pudong", "Huangpu", "Xuhui", "Changning", "Jing'an", "Putuo", "Hongkou"]
      },
      {
        name: "Guangdong",
        code: "GD",
        cities: ["Guangzhou", "Shenzhen", "Dongguan", "Foshan", "Zhongshan", "Zhuhai", "Jiangmen", "Huizhou"]
      },
      {
        name: "Jiangsu",
        code: "JS",
        cities: ["Nanjing", "Suzhou", "Wuxi", "Changzhou", "Nantong", "Yangzhou", "Taizhou", "Xuzhou"]
      },
      {
        name: "Zhejiang",
        code: "ZJ",
        cities: ["Hangzhou", "Ningbo", "Wenzhou", "Jinhua", "Shaoxing", "Huzhou", "Taizhou", "Jiaxing"]
      },
      {
        name: "Shandong",
        code: "SD",
        cities: ["Jinan", "Qingdao", "Yantai", "Weifang", "Zibo", "Jining", "Tai'an", "Weihai"]
      }
    ]
  },
  {
    name: "India",
    code: "IN",
    states: [
      {
        name: "Maharashtra",
        code: "MH",
        cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Sangli", "Kolhapur"]
      },
      {
        name: "Karnataka",
        code: "KA",
        cities: ["Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum", "Gulbarga", "Davangere", "Bellary"]
      },
      {
        name: "Tamil Nadu",
        code: "TN",
        cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore"]
      },
      {
        name: "Delhi",
        code: "DL",
        cities: ["New Delhi", "Central Delhi", "South Delhi", "North Delhi", "East Delhi", "West Delhi"]
      },
      {
        name: "Gujarat",
        code: "GJ",
        cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Anand"]
      },
      {
        name: "Rajasthan",
        code: "RJ",
        cities: ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar"]
      },
      {
        name: "West Bengal",
        code: "WB",
        cities: ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Malda", "Bardhaman", "Kharagpur"]
      },
      {
        name: "Uttar Pradesh",
        code: "UP",
        cities: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Allahabad", "Bareilly", "Aligarh", "Moradabad"]
      }
    ]
  },
  {
    name: "United States",
    code: "US",
    states: [
      {
        name: "California",
        code: "CA",
        cities: ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Fresno", "Sacramento", "Long Beach", "Oakland"]
      },
      {
        name: "New York",
        code: "NY",
        cities: ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany", "New Rochelle", "Mount Vernon"]
      },
      {
        name: "Texas",
        code: "TX",
        cities: ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington", "Corpus Christi"]
      },
      {
        name: "Florida",
        code: "FL",
        cities: ["Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg", "Hialeah", "Tallahassee", "Fort Lauderdale"]
      },
      {
        name: "Illinois",
        code: "IL",
        cities: ["Chicago", "Aurora", "Rockford", "Joliet", "Naperville", "Springfield", "Peoria", "Elgin"]
      },
      {
        name: "Pennsylvania",
        code: "PA",
        cities: ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading", "Scranton", "Bethlehem", "Lancaster"]
      }
    ]
  },
  {
    name: "Indonesia",
    code: "ID",
    states: [
      {
        name: "Jakarta",
        code: "JK",
        cities: ["Jakarta", "Central Jakarta", "South Jakarta", "East Jakarta", "West Jakarta", "North Jakarta"]
      },
      {
        name: "West Java",
        code: "JB",
        cities: ["Bandung", "Bekasi", "Bogor", "Depok", "Cimahi", "Tasikmalaya", "Banjar", "Sukabumi"]
      },
      {
        name: "East Java",
        code: "JI",
        cities: ["Surabaya", "Malang", "Kediri", "Blitar", "Mojokerto", "Madiun", "Pasuruan", "Probolinggo"]
      },
      {
        name: "Central Java",
        code: "JT",
        cities: ["Semarang", "Solo", "Yogyakarta", "Salatiga", "Pekalongan", "Tegal", "Magelang", "Surakarta"]
      },
      {
        name: "North Sumatra",
        code: "SU",
        cities: ["Medan", "Binjai", "Tebing Tinggi", "Pematangsiantar", "Tanjungbalai", "Sibolga", "Padangsidimpuan", "Gunungsitoli"]
      },
      {
        name: "Bali",
        code: "BA",
        cities: ["Denpasar", "Ubud", "Singaraja", "Tabanan", "Gianyar", "Klungkung", "Bangli", "Negara"]
      }
    ]
  },
  {
    name: "Brazil",
    code: "BR",
    states: [
      {
        name: "São Paulo",
        code: "SP",
        cities: ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André", "Osasco", "Ribeirão Preto", "Sorocaba"]
      },
      {
        name: "Rio de Janeiro",
        code: "RJ",
        cities: ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói", "Belford Roxo", "São João de Meriti", "Campos dos Goytacazes"]
      },
      {
        name: "Minas Gerais",
        code: "MG",
        cities: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros", "Ribeirão das Neves", "Uberaba"]
      },
      {
        name: "Bahia",
        code: "BA",
        cities: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Juazeiro", "Teixeira de Freitas", "Alagoinhas", "Ilhéus"]
      },
      {
        name: "Paraná",
        code: "PR",
        cities: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel", "São José dos Pinhais", "Foz do Iguaçu", "Colombo"]
      },
      {
        name: "Rio Grande do Sul",
        code: "RS",
        cities: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria", "Gravataí", "Viamão", "Novo Hamburgo"]
      }
    ]
  },
  {
    name: "Russia",
    code: "RU",
    states: [
      {
        name: "Moscow",
        code: "MOW",
        cities: ["Moscow", "Balashikha", "Podolsk", "Khimki", "Mytishchi", "Korolev", "Lyubertsy", "Elektrostal"]
      },
      {
        name: "Saint Petersburg",
        code: "SPE",
        cities: ["Saint Petersburg", "Kolpino", "Pushkin", "Kronstadt", "Lomonosov", "Petergof", "Sestroretsk", "Zelenogorsk"]
      },
      {
        name: "Moscow Oblast",
        code: "MOS",
        cities: ["Balashikha", "Khimki", "Podolsk", "Mytishchi", "Korolev", "Lyubertsy", "Elektrostal", "Kolomna"]
      },
      {
        name: "Tatarstan",
        code: "TA",
        cities: ["Kazan", "Naberezhnye Chelny", "Nizhnekamsk", "Almetyevsk", "Zelenodolsk", "Bugulma", "Yelabuga", "Leninogorsk"]
      },
      {
        name: "Krasnodar Krai",
        code: "KDA",
        cities: ["Krasnodar", "Sochi", "Novorossiysk", "Armavir", "Maykop", "Yeisk", "Anapa", "Gelendzhik"]
      },
      {
        name: "Sverdlovsk Oblast",
        code: "SVE",
        cities: ["Yekaterinburg", "Nizhny Tagil", "Kamensk-Uralsky", "Pervouralsk", "Serov", "Novouralsk", "Verkhnyaya Pyshma", "Aramil"]
      }
    ]
  },
  {
    name: "Nigeria",
    code: "NG",
    states: [
      {
        name: "Lagos",
        code: "LA",
        cities: ["Lagos", "Ikeja", "Agege", "Alimosho", "Amuwo-Odofin", "Apapa", "Eti-Osa", "Ifako-Ijaiye"]
      },
      {
        name: "Kano",
        code: "KN",
        cities: ["Kano", "Wudil", "Garko", "Bebeji", "Bichi", "Bagwai", "Rano", "Karaye"]
      },
      {
        name: "Kaduna",
        code: "KD",
        cities: ["Kaduna", "Zaria", "Kafanchan", "Kagoro", "Makarfi", "Sabon Gari", "Rigasa", "Barnawa"]
      },
      {
        name: "Rivers",
        code: "RI",
        cities: ["Port Harcourt", "Obio-Akpor", "Okrika", "Ogu", "Degema", "Asari-Toru", "Akuku-Toru", "Andoni"]
      },
      {
        name: "Oyo",
        code: "OY",
        cities: ["Ibadan", "Ogbomoso", "Oyo", "Iseyin", "Iwo", "Shaki", "Kishi", "Eruwa"]
      },
      {
        name: "Federal Capital Territory",
        code: "FC",
        cities: ["Abuja", "Gwagwalada", "Kuje", "Bwari", "Kwali", "Abaji", "Garki", "Wuse"]
      }
    ]
  },
  {
    name: "Japan",
    code: "JP",
    states: [
      {
        name: "Tokyo",
        code: "13",
        cities: ["Tokyo", "Shibuya", "Shinjuku", "Minato", "Chiyoda", "Chuo", "Taito", "Sumida"]
      },
      {
        name: "Osaka",
        code: "27",
        cities: ["Osaka", "Sakai", "Higashiosaka", "Hirakata", "Toyonaka", "Takatsuki", "Suita", "Yao"]
      },
      {
        name: "Kanagawa",
        code: "14",
        cities: ["Yokohama", "Kawasaki", "Sagamihara", "Fujisawa", "Hiratsuka", "Chigasaki", "Machida", "Yamato"]
      },
      {
        name: "Aichi",
        code: "23",
        cities: ["Nagoya", "Toyota", "Okazaki", "Ichinomiya", "Kasugai", "Anjo", "Toyohashi", "Nishio"]
      },
      {
        name: "Hokkaido",
        code: "01",
        cities: ["Sapporo", "Asahikawa", "Hakodate", "Kushiro", "Tomakomai", "Obihiro", "Otaru", "Kitami"]
      },
      {
        name: "Fukuoka",
        code: "40",
        cities: ["Fukuoka", "Kitakyushu", "Kurume", "Omuta", "Iizuka", "Yanagawa", "Asakura", "Munakata"]
      }
    ]
  },
  {
    name: "Mexico",
    code: "MX",
    states: [
      {
        name: "Mexico City",
        code: "DF",
        cities: ["Mexico City", "Iztapalapa", "Gustavo A. Madero", "Álvaro Obregón", "Tlalpan", "Coyoacán", "Cuauhtémoc", "Venustiano Carranza"]
      },
      {
        name: "Estado de México",
        code: "MEX",
        cities: ["Ecatepec", "Guadalajara", "Puebla", "Tijuana", "León", "Juárez", "Torreón", "Querétaro"]
      },
      {
        name: "Jalisco",
        code: "JAL",
        cities: ["Guadalajara", "Zapopan", "Tlaquepaque", "Tonalá", "Puerto Vallarta", "Tlajomulco", "El Salto", "Tepatitlán"]
      },
      {
        name: "Nuevo León",
        code: "NL",
        cities: ["Monterrey", "Guadalupe", "San Nicolás", "Apodaca", "General Escobedo", "Santa Catarina", "San Pedro", "Cadereyta"]
      },
      {
        name: "Puebla",
        code: "PUE",
        cities: ["Puebla", "Tehuacán", "San Martín Texmelucan", "Atlixco", "San Pedro Cholula", "Amozoc", "Cuautlancingo", "Huejotzingo"]
      },
      {
        name: "Guanajuato",
        code: "GTO",
        cities: ["León", "Irapuato", "Celaya", "Salamanca", "Guanajuato", "San Francisco del Rincón", "Dolores Hidalgo", "San Miguel de Allende"]
      }
    ]
  },
  {
    name: "Germany",
    code: "DE",
    states: [
      {
        name: "North Rhine-Westphalia",
        code: "NW",
        cities: ["Cologne", "Düsseldorf", "Dortmund", "Essen", "Duisburg", "Bochum", "Wuppertal", "Bielefeld"]
      },
      {
        name: "Bavaria",
        code: "BY",
        cities: ["Munich", "Nuremberg", "Augsburg", "Würzburg", "Regensburg", "Ingolstadt", "Fürth", "Erlangen"]
      },
      {
        name: "Baden-Württemberg",
        code: "BW",
        cities: ["Stuttgart", "Mannheim", "Karlsruhe", "Freiburg", "Heidelberg", "Ulm", "Heilbronn", "Pforzheim"]
      },
      {
        name: "Lower Saxony",
        code: "NI",
        cities: ["Hanover", "Braunschweig", "Oldenburg", "Osnabrück", "Wolfsburg", "Göttingen", "Salzgitter", "Hildesheim"]
      },
      {
        name: "Hesse",
        code: "HE",
        cities: ["Frankfurt", "Wiesbaden", "Kassel", "Darmstadt", "Offenbach", "Hanau", "Marburg", "Fulda"]
      },
      {
        name: "Berlin",
        code: "BE",
        cities: ["Berlin", "Charlottenburg", "Spandau", "Tempelhof", "Neukölln", "Friedrichshain", "Kreuzberg", "Prenzlauer Berg"]
      }
    ]
  }
];
