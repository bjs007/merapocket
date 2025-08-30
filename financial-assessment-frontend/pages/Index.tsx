import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Calculator, TrendingUp, Award, Lightbulb, AlertCircle, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  BasicFinancialData, 
  AdvancedFinancialData, 
  FinancialAssessmentRequest, 
  FinancialAssessmentResponse,
  ApiError,
  COUNTRIES_DATA 
} from "@shared/api";

export default function Index() {
  const [basicData, setBasicData] = useState<BasicFinancialData>({
    name: "",
    gender: "",
    profession: "",
    salaryPerMonth: 0,
    foodExpenses: 0,
    houseRent: 0,
    utilitiesExpenses: 0,
    lifeInsurance: false,
    healthInsurance: false,
    bike: false,
    car: false,
    dependents: 0,
    education: "",
    housesOwned: 0,
    country: "India",
  });

  const [advancedData, setAdvancedData] = useState<AdvancedFinancialData>({
    liquidCashFD: 0,
    landNetWorth: 0,
    stocksNetWorth: 0,
    mutualFundNetWorth: 0,
    goldNetWorth: 0,
    otherInvestment: 0,
    city: "",
    state: "",
  });

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<FinancialAssessmentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const professions = [
    "Student",
    "Private job",
    "Govt job",
    "House wife",
    "Business owner"
  ];

  const educationLevels = [
    "Secondary (10)",
    "Higher Secondary (+2)",
    "Bachelor",
    "Master",
    "BTech/MTech/MS",
    "Doctor",
    "Lawyer",
    "Other"
  ];

  const genderOptions = [
    "Male",
    "Female",
    "Other",
    "Prefer not to say"
  ];

  // Get available states and cities based on selected country
  const availableStatesAndCities = useMemo(() => {
    const selectedCountry = COUNTRIES_DATA.find(country => country.name === basicData.country);
    if (!selectedCountry) {
      return { states: [], cities: [] };
    }

    const states = selectedCountry.states.map(state => state.name);

    // Get cities for the selected state, or all cities if no state is selected
    let cities: Array<{name: string, state: string, key: string}> = [];
    if (advancedData.state) {
      const selectedState = selectedCountry.states.find(state => state.name === advancedData.state);
      if (selectedState) {
        cities = selectedState.cities.map(city => ({
          name: city,
          state: selectedState.name,
          key: `${selectedState.name}-${city}`
        }));
      }
    } else {
      // Show all cities from all states in the country with unique keys
      cities = selectedCountry.states.flatMap(state =>
        state.cities.map(city => ({
          name: city,
          state: state.name,
          key: `${state.name}-${city}`
        }))
      );
    }

    return { states, cities };
  }, [basicData.country, advancedData.state]);

  const handleBasicDataChange = (field: keyof BasicFinancialData, value: any) => {
    setBasicData(prev => ({ ...prev, [field]: value }));
    setError(null); // Clear any previous errors
    
    // Reset state and city when country changes
    if (field === "country") {
      setAdvancedData(prev => ({ ...prev, state: "", city: "" }));
    }
  };

  const handleAdvancedDataChange = (field: keyof AdvancedFinancialData, value: any) => {
    setAdvancedData(prev => ({ ...prev, [field]: value }));
    
    // Reset city when state changes
    if (field === "state") {
      setAdvancedData(prev => ({ ...prev, city: "" }));
    }
  };

  const calculateFinancialScore = async () => {
    setIsCalculating(true);
    setResults(null);
    setError(null);

    try {
      const requestData: FinancialAssessmentRequest = {
        basicData,
        advancedData
      };

      const response = await fetch('/api/financial-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to calculate financial score';
        try {
          const errorData: ApiError = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          // If we can't parse the error response as JSON, use the status text
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result: FinancialAssessmentResponse = await response.json();
      setResults(result);
    } catch (err) {
      console.error('Error calculating financial score:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const resetForm = () => {
    setBasicData({
      name: "",
      gender: "",
      profession: "",
      salaryPerMonth: 0,
      foodExpenses: 0,
      houseRent: 0,
      utilitiesExpenses: 0,
      lifeInsurance: false,
      healthInsurance: false,
      bike: false,
      car: false,
      dependents: 0,
      education: "",
      housesOwned: 0,
      country: "India",
    });
    setAdvancedData({
      liquidCashFD: 0,
      landNetWorth: 0,
      stocksNetWorth: 0,
      mutualFundNetWorth: 0,
      goldNetWorth: 0,
      otherInvestment: 0,
      city: "",
      state: "",
    });
    setResults(null);
    setError(null);
    setIsAdvancedOpen(false);
  };

  const isFormValid = basicData.profession && basicData.education && basicData.country;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Financial Health Assessment
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get a comprehensive analysis of your financial situation and personalized advice to improve your financial score
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error: {error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Basic Search Section */}
        <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Basic Financial Information
            </CardTitle>
            <CardDescription className="text-blue-100">
              Provide your essential financial details
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={basicData.name}
                  onChange={(e) => handleBasicDataChange("name", e.target.value)}
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Gender
                </label>
                <Select value={basicData.gender} onValueChange={(value) => handleBasicDataChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Country */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Country <span className="text-red-500">*</span>
                </label>
                <Select value={basicData.country} onValueChange={(value) => handleBasicDataChange("country", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES_DATA.map((country) => (
                      <SelectItem key={country.code} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Profession */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Profession <span className="text-red-500">*</span>
                </label>
                <Select value={basicData.profession} onValueChange={(value) => handleBasicDataChange("profession", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select profession" />
                  </SelectTrigger>
                  <SelectContent>
                    {professions.map((profession) => (
                      <SelectItem key={profession} value={profession}>
                        {profession}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Salary */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Salary per Month (₹)</label>
                <Input
                  type="number"
                  placeholder="Enter monthly salary"
                  value={basicData.salaryPerMonth || ""}
                  onChange={(e) => handleBasicDataChange("salaryPerMonth", Number(e.target.value))}
                />
              </div>

              {/* Education */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Education <span className="text-red-500">*</span>
                </label>
                <Select value={basicData.education} onValueChange={(value) => handleBasicDataChange("education", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Houses Owned */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Houses/Flats You Own</label>
                <Input
                  type="number"
                  placeholder="Number of properties"
                  value={basicData.housesOwned || ""}
                  onChange={(e) => handleBasicDataChange("housesOwned", Number(e.target.value))}
                />
              </div>

              {/* Dependents */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Number of Dependents</label>
                <Input
                  type="number"
                  placeholder="Total dependents"
                  value={basicData.dependents || ""}
                  onChange={(e) => handleBasicDataChange("dependents", Number(e.target.value))}
                />
              </div>

              {/* Kids */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Kids</label>
                <Input
                  type="number"
                  placeholder="Number of kids"
                  value={basicData.kids || ""}
                  onChange={(e) => handleBasicDataChange("kids", Number(e.target.value))}
                />
              </div>

              {/* Other Family Members */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Other Family Members</label>
                <Input
                  type="number"
                  placeholder="Other family members"
                  value={basicData.otherFamilyMembers || ""}
                  onChange={(e) => handleBasicDataChange("otherFamilyMembers", Number(e.target.value))}
                />
              </div>
            </div>

            {/* Yes/No Questions */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Insurance & Assets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: "lifeInsurance", label: "Life Insurance" },
                  { key: "healthInsurance", label: "Health Insurance" },
                  { key: "bike", label: "Bike" },
                  { key: "car", label: "Car" }
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <div className="flex gap-2">
                      <Button
                        variant={basicData[key as keyof BasicFinancialData] === true ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleBasicDataChange(key as keyof BasicFinancialData, true)}
                      >
                        Yes
                      </Button>
                      <Button
                        variant={basicData[key as keyof BasicFinancialData] === false ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleBasicDataChange(key as keyof BasicFinancialData, false)}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Search Section */}
        <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur">
          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg cursor-pointer hover:from-purple-700 hover:to-pink-700 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Advanced Portfolio & Location Details
                  </div>
                  {isAdvancedOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Optional: Add your investment details and location for a more accurate assessment
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="p-6">
                {/* Location Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    Location Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* State/Province */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">State/Province</label>
                      <Select 
                        value={advancedData.state} 
                        onValueChange={(value) => handleAdvancedDataChange("state", value)}
                        disabled={!basicData.country}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={basicData.country ? "Select state/province" : "Select country first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableStatesAndCities.states.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!basicData.country && (
                        <p className="text-xs text-gray-500">Please select a country first</p>
                      )}
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">City</label>
                      <Select
                        value={advancedData.city}
                        onValueChange={(value) => handleAdvancedDataChange("city", value)}
                        disabled={!basicData.country}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={basicData.country ? "Select city" : "Select country first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableStatesAndCities.cities.map((cityObj) => (
                            <SelectItem key={cityObj.key} value={cityObj.name}>
                              {advancedData.state ? cityObj.name : `${cityObj.name} (${cityObj.state})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!basicData.country && (
                        <p className="text-xs text-gray-500">Please select a country first</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Investment Portfolio Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    Investment Portfolio
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Land You Own (Net Worth ₹)</label>
                      <Input
                        type="number"
                        placeholder="Land net worth"
                        value={advancedData.landNetWorth || ""}
                        onChange={(e) => handleAdvancedDataChange("landNetWorth", Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Stocks Net Worth (₹)</label>
                      <Input
                        type="number"
                        placeholder="Stocks portfolio value"
                        value={advancedData.stocksNetWorth || ""}
                        onChange={(e) => handleAdvancedDataChange("stocksNetWorth", Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Mutual Fund (Net Worth ₹)</label>
                      <Input
                        type="number"
                        placeholder="Mutual fund investments"
                        value={advancedData.mutualFundNetWorth || ""}
                        onChange={(e) => handleAdvancedDataChange("mutualFundNetWorth", Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Gold (Net Worth ₹)</label>
                      <Input
                        type="number"
                        placeholder="Gold investments"
                        value={advancedData.goldNetWorth || ""}
                        onChange={(e) => handleAdvancedDataChange("goldNetWorth", Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <Button
            onClick={calculateFinancialScore}
            disabled={isCalculating || !isFormValid}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isCalculating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Financial Score
              </>
            )}
          </Button>
          <Button variant="outline" onClick={resetForm} size="lg" disabled={isCalculating}>
            Reset Form
          </Button>
        </div>

        {/* Loading State */}
        {isCalculating && (
          <Card className="mb-6 shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Analyzing Your Financial Health
              </h3>
              <p className="text-gray-600">
                Please sit tight while we calculate your financial score.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {results && !isCalculating && (
          <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-blue-50">
            <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                {basicData.name ? `${basicData.name}, Your Financial Assessment Results` : 'Your Financial Assessment Results'}
              </CardTitle>
              <CardDescription className="text-green-100">
                Based on your provided information • Calculated on {new Date(results.timestamp).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-teal-500 rounded-full mb-4">
                  <span className="text-3xl font-bold text-white">{results.overallScore}</span>
                  <span className="text-lg text-green-100">/10</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Overall Financial Score
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4 max-w-md mx-auto">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(results.overallScore / 10) * 100}%` }}
                  />
                </div>
                {results.calculationId && (
                  <p className="text-xs text-gray-500">Assessment ID: {results.calculationId}</p>
                )}
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-inner">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Personalized Advice to Improve Your Score
                </h4>
                <p className="text-gray-700 leading-relaxed">{results.advice}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
