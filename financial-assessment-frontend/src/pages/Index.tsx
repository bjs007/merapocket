import { useState, useMemo, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Calculator, TrendingUp, Award, Lightbulb, AlertCircle, MapPin, Share2, Mail, MessageCircle, Facebook, Linkedin, Instagram, Download, User } from "lucide-react";
import { 
  BasicFinancialData, 
  AdvancedFinancialData, 
  FinancialAssessmentRequest, 
  FinancialAssessmentResponse,
  ApiError,
  COUNTRIES_DATA 
} from "@/types/api";

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
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [shareableLink, setShareableLink] = useState<string | null>(null);
  const shareDropdownRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isCapturingImage, setIsCapturingImage] = useState(false);

  // Click outside handler for share dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareDropdownRef.current && !shareDropdownRef.current.contains(event.target as Node)) {
        setShowShareOptions(false);
      }
    };

    if (showShareOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareOptions]);

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

      // Generate and store shareable link
      const shareId = generateShareId();
      const storedResult = {
        ...result,
        id: shareId,
        createdAt: new Date().toISOString(),
        name: basicData.name
      };

      // Store in localStorage
      localStorage.setItem(`financial-assessment-${shareId}`, JSON.stringify(storedResult));

      // Generate public link
      const publicLink = `${window.location.origin}/results/${shareId}`;
      setShareableLink(publicLink);
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
    setShareableLink(null);
  };

  const isFormValid = basicData.profession && basicData.education && basicData.country;

  const generateShareId = (): string => {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  };

  const generateShareContent = () => {
    if (!results) return "";
    const linkText = shareableLink ? `\n\n🔗 *View my detailed results:* ${shareableLink}` : "";
    return `🎯 *Financial Health Assessment Results*\n\nMy Score: *${results.overallScore}/10*\n\n💡 *Key Insights:*\n${results.advice.substring(0, 200)}...\n\n✨ *Try the Financial Health Assessment yourself!*${linkText}\n\n#FinancialHealth #MoneyGoals #PersonalFinance`;
  };

  const captureResultsAsImage = async (): Promise<Blob | null> => {
    if (!resultsRef.current) return null;

    setIsCapturingImage(true);
    try {
      const canvas = await html2canvas(resultsRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        height: resultsRef.current.scrollHeight,
        width: resultsRef.current.scrollWidth,
        scrollX: 0,
        scrollY: 0
      });

      return new Promise(resolve => {
        canvas.toBlob(resolve, 'image/png', 1.0);
      });
    } catch (error) {
      console.error('Error capturing image:', error);
      return null;
    } finally {
      setIsCapturingImage(false);
    }
  };

  const downloadResultsImage = async () => {
    const imageBlob = await captureResultsAsImage();
    if (imageBlob) {
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `financial-assessment-score-${results?.overallScore || 'results'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      alert('⚠️ Unable to generate image. Please try again.');
    }
  };

  const shareViaEmail = async () => {
    try {
      const imageBlob = await captureResultsAsImage();
      if (!imageBlob) {
        alert('⚠️ Unable to capture screenshot. Please try again.');
        return;
      }

      const file = new File([imageBlob], 'financial-assessment-results.png', { type: 'image/png' });

      // Try native sharing with screenshot
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            title: 'My Financial Health Assessment Results',
            text: generateShareContent(),
            files: [file]
          });
          return;
        } catch (error) {
          console.log('Native sharing failed:', error);
        }
      }

      // Fallback: download image and open email
      await downloadResultsImage();
      const subject = encodeURIComponent("My Financial Health Assessment Results");
      const body = encodeURIComponent(generateShareContent() + "\n\nPlease attach the downloaded image to see the complete visual assessment!");
      window.open(`mailto:?subject=${subject}&body=${body}`);

    } catch (error) {
      console.error('Email sharing error:', error);
      alert('⚠️ Email sharing failed. Please try the Download option.');
    }
  };

  const shareViaWhatsApp = async () => {
    try {
      const shareText = generateShareContent();

      // Try native sharing with link (preferred method)
      if (navigator.share && shareableLink) {
        try {
          await navigator.share({
            title: 'My Financial Health Assessment Results',
            text: shareText,
            url: shareableLink
          });
          return;
        } catch (error) {
          console.log('Native sharing failed, trying WhatsApp direct:', error);
        }
      }

      // Open WhatsApp with text and link
      const text = encodeURIComponent(shareText);
      const whatsappUrl = `https://wa.me/?text=${text}`;

      const whatsappWindow = window.open(whatsappUrl, '_blank');

      if (!whatsappWindow) {
        // If popup was blocked, provide fallback
        alert(
          "⚠️ Popup blocked! \n\n" +
          "Please copy this message and share manually:\n\n" +
          shareText
        );
      }

    } catch (error) {
      console.error('WhatsApp sharing error:', error);
      alert('⚠️ WhatsApp sharing failed. Please try copying the link manually.');
    }
  };

  const shareViaFacebook = async () => {
    try {
      const imageBlob = await captureResultsAsImage();
      if (!imageBlob) {
        alert('⚠️ Unable to capture screenshot. Please try again.');
        return;
      }

      const file = new File([imageBlob], 'financial-assessment-results.png', { type: 'image/png' });

      // Try native sharing with screenshot
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            title: 'My Financial Health Assessment Results',
            text: generateShareContent(),
            files: [file]
          });
          return;
        } catch (error) {
          console.log('Native sharing failed:', error);
        }
      }

      // Fallback: download image and show instructions
      await downloadResultsImage();
      alert(
        "📱 Screenshot downloaded!\n\n" +
        "To share on Facebook:\n" +
        "1. Go to Facebook\n" +
        "2. Create a new post\n" +
        "3. Add the downloaded screenshot\n" +
        "4. Copy and paste this text:\n\n" +
        generateShareContent()
      );

    } catch (error) {
      console.error('Facebook sharing error:', error);
      alert('⚠️ Facebook sharing failed. Please try the Download option.');
    }
  };

  const shareViaLinkedIn = async () => {
    try {
      const imageBlob = await captureResultsAsImage();
      if (!imageBlob) {
        alert('⚠️ Unable to capture screenshot. Please try again.');
        return;
      }

      const file = new File([imageBlob], 'financial-assessment-results.png', { type: 'image/png' });

      // Try native sharing with screenshot
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            title: 'My Financial Health Assessment Results',
            text: generateShareContent(),
            files: [file]
          });
          return;
        } catch (error) {
          console.log('Native sharing failed:', error);
        }
      }

      // Fallback: download image and show instructions
      await downloadResultsImage();
      alert(
        "📱 Screenshot downloaded!\n\n" +
        "To share on LinkedIn:\n" +
        "1. Go to LinkedIn\n" +
        "2. Create a new post\n" +
        "3. Add the downloaded screenshot\n" +
        "4. Copy and paste this text:\n\n" +
        generateShareContent()
      );

    } catch (error) {
      console.error('LinkedIn sharing error:', error);
      alert('⚠️ LinkedIn sharing failed. Please try the Download option.');
    }
  };

  const shareViaInstagram = async () => {
    try {
      const imageBlob = await captureResultsAsImage();
      if (!imageBlob) {
        alert('⚠️ Unable to capture screenshot. Please try again.');
        return;
      }

      const file = new File([imageBlob], 'financial-assessment-results.png', { type: 'image/png' });

      // Try native sharing with screenshot
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            title: 'My Financial Health Assessment Results',
            text: generateShareContent(),
            files: [file]
          });
          return;
        } catch (error) {
          console.log('Native sharing failed:', error);
        }
      }

      // Download image for Instagram
      await downloadResultsImage();

      // Copy caption to clipboard
      const content = generateShareContent();
      try {
        await navigator.clipboard.writeText(content);
        alert(
          "📱 Screenshot downloaded & caption copied!\n\n" +
          "To share on Instagram:\n" +
          "1. Open Instagram\n" +
          "2. Create a new post or story\n" +
          "3. Select the downloaded screenshot\n" +
          "4. Paste the caption (already copied!)\n" +
          "5. Share your achievement!"
        );
      } catch (error) {
        alert(
          "📱 Screenshot downloaded!\n\n" +
          "To share on Instagram:\n" +
          "1. Open Instagram\n" +
          "2. Create a new post or story\n" +
          "3. Select the downloaded screenshot\n" +
          "4. Use this caption:\n\n" +
          content
        );
      }

    } catch (error) {
      console.error('Instagram sharing error:', error);
      alert('⚠️ Instagram sharing failed. Please try the Download option.');
    }
  };

  const shareOptions = [
    { name: "Email", icon: Mail, action: shareViaEmail, color: "text-blue-600" },
    { name: "WhatsApp", icon: MessageCircle, action: shareViaWhatsApp, color: "text-green-600" },
    { name: "Facebook", icon: Facebook, action: shareViaFacebook, color: "text-blue-800" },
    { name: "LinkedIn", icon: Linkedin, action: shareViaLinkedIn, color: "text-blue-700" },
    { name: "Instagram", icon: Instagram, action: shareViaInstagram, color: "text-pink-600" },
    { name: "Download", icon: Download, action: downloadResultsImage, color: "text-gray-600" },
  ];

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
              Basic Information
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

              {/* Salary */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Salary per Month (₹)</label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Enter monthly salary"
                  value={basicData.salaryPerMonth || ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 0 || e.target.value === "") {
                      handleBasicDataChange("salaryPerMonth", value >= 0 ? value : 0);
                    }
                  }}
                />
              </div>

              {/* Food Expenses */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Food Expenses per Month (₹)</label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Enter monthly food expenses"
                  value={basicData.foodExpenses || ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 0 || e.target.value === "") {
                      handleBasicDataChange("foodExpenses", value >= 0 ? value : 0);
                    }
                  }}
                />
              </div>

              {/* House Rent */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">House Rent per Month (₹)</label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Enter monthly house rent"
                  value={basicData.houseRent || ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 0 || e.target.value === "") {
                      handleBasicDataChange("houseRent", value >= 0 ? value : 0);
                    }
                  }}
                />
              </div>

              {/* Other Expenses */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Other Expenses per Month (₹)</label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Electricity, Cylinder, Maid, Phone"
                  value={basicData.utilitiesExpenses || ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 0 || e.target.value === "") {
                      handleBasicDataChange("utilitiesExpenses", value >= 0 ? value : 0);
                    }
                  }}
                />
              </div>

              {/* Dependents */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Number of Dependents</label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Total dependents"
                  value={basicData.dependents || ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 0 || e.target.value === "") {
                      handleBasicDataChange("dependents", value >= 0 ? value : 0);
                    }
                  }}
                />
              </div>

              {/* Houses Owned */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Houses/Flats You Own</label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Number of properties"
                  value={basicData.housesOwned || ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 0 || e.target.value === "") {
                      handleBasicDataChange("housesOwned", value >= 0 ? value : 0);
                    }
                  }}
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
                      <label className="text-sm font-medium text-gray-700">Liquid Cash/FD (Net Worth ₹)</label>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Liquid cash and fixed deposits"
                        value={advancedData.liquidCashFD || ""}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value >= 0 || e.target.value === "") {
                            handleAdvancedDataChange("liquidCashFD", value >= 0 ? value : 0);
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Land You Own (Net Worth ₹)</label>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Land net worth"
                        value={advancedData.landNetWorth || ""}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value >= 0 || e.target.value === "") {
                            handleAdvancedDataChange("landNetWorth", value >= 0 ? value : 0);
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Stocks Net Worth (₹)</label>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Stocks portfolio value"
                        value={advancedData.stocksNetWorth || ""}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value >= 0 || e.target.value === "") {
                            handleAdvancedDataChange("stocksNetWorth", value >= 0 ? value : 0);
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Mutual Fund (Net Worth ₹)</label>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Mutual fund investments"
                        value={advancedData.mutualFundNetWorth || ""}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value >= 0 || e.target.value === "") {
                            handleAdvancedDataChange("mutualFundNetWorth", value >= 0 ? value : 0);
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Gold (Net Worth ₹)</label>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Gold investments"
                        value={advancedData.goldNetWorth || ""}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value >= 0 || e.target.value === "") {
                            handleAdvancedDataChange("goldNetWorth", value >= 0 ? value : 0);
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Other Investment (Net Worth ₹)</label>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Other investments"
                        value={advancedData.otherInvestment || ""}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value >= 0 || e.target.value === "") {
                            handleAdvancedDataChange("otherInvestment", value >= 0 ? value : 0);
                          }
                        }}
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
          <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-blue-50" ref={resultsRef}>
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

                {/* Share Link Button */}
                {shareableLink && (
                  <div className="mt-4">
                    <Button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(shareableLink);
                          alert('✅ Public link copied to clipboard! Share this link with anyone to show your results.');
                        } catch (error) {
                          alert(`🔗 Share this link:\n\n${shareableLink}`);
                        }
                      }}
                      variant="default"
                      className="flex items-center gap-2 mx-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      <Share2 className="w-4 h-4" />
                      Copy Public Link
                    </Button>
                  </div>
                )}

                {/* Share Button */}
                <div className="mt-6 relative" ref={shareDropdownRef}>
                  <Button
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    variant="outline"
                    className="flex items-center gap-2 mx-auto"
                    disabled={isCapturingImage}
                  >
                    <Share2 className="w-4 h-4" />
                    {isCapturingImage ? 'Capturing Screenshot...' : 'Share Results'}
                  </Button>

                  {showShareOptions && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10 min-w-[200px]">
                      <p className="text-sm font-medium text-gray-700 mb-1 text-center">Share Options:</p>
                      <p className="text-xs text-gray-500 mb-3 text-center">Link + screenshot via platforms</p>
                      <div className="grid grid-cols-2 gap-2">
                        {shareOptions.map((option) => {
                          const IconComponent = option.icon;
                          return (
                            <Button
                              key={option.name}
                              onClick={async () => {
                                setShowShareOptions(false);
                                await option.action();
                              }}
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-2 justify-start hover:bg-gray-50"
                              disabled={isCapturingImage}
                            >
                              <IconComponent className={`w-4 h-4 ${option.color}`} />
                              <span className="text-sm">{option.name}</span>
                            </Button>
                          );
                        })}
                      </div>
                      {isCapturingImage && (
                        <div className="text-center mt-3">
                          <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                            Taking screenshot...
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
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
