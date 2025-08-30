import { useState, useMemo, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, TrendingUp, Award, Lightbulb, AlertCircle, MapPin, MessageCircle, User, Heart, Languages, Star, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BasicFinancialData,
  AdvancedFinancialData,
  FinancialAssessmentRequest,
  FinancialAssessmentResponse,
  EnhancedFinancialAssessmentResponse,
  ApiError,
  COUNTRIES_DATA,
  FinancialProductRecommendations
} from "@shared/api";
import { MutualFundProduct, InsuranceProduct } from "@shared/api";

// Language support
type Language = 'Hindi' | 'Bengali' | 'Gujarati' | 'Telugu' | 'Tamil' | 'Kannada' | 'English';

const translations = {
  Hindi: {
  appTitle: 'Pocket Score',
  appDescription: 'अपने पैसों की स्थिति का पूरा विश्लेषण पाएं और अपनी खुशी का स्तर बढ़ाने के लिए सलाह लें',
  basicInfo: '���ुनियादी जानकारी',
  basicInfoDesc: 'अपनी जरूरी पैसों की जानकारी दें',
  advancedLevel: 'एडवांस सेक्शन',
  personalDetails: 'व्यक्तिगत जानका��ी',
  locationDetails: 'जगह की जानकारी',
  investmentPortfolio: 'इन्व��स्टमेंट पोर्टफोलियो',
  language: 'भाषा',
  name: 'नाम',
  country: 'देश',
  gender: 'लिंग',
  profession: 'काम',
  education: 'शिक्षा',
  state: '���ाज्य/प्रांत',
  city: 'शहर',
  salaryPerMonth: 'मासिक सैलरी (₹)',
  foodExpenses: 'मासिक खाने का खर्च (₹)',
  houseRent: 'मासिक घर का किराया (₹)',
  otherExpenses: 'अन्य मासिक खर्च (₹)',
  dependents: 'परिवार के सदस्य',
  housesOwned: 'आपके घर/फ्लैट',
  liquidCashFD: 'नकद पैसे/FD (₹)',
  landNetWorth: 'जमीन की कीमत (₹)',
  stocksNetWorth: 'स्टॉक्स की कीमत (₹)',
  mutualFundNetWorth: 'म्यूचुअल फंड (₹)',
  goldNetWorth: 'सोने की कीमत (₹)',
  otherInvestment: 'अन्य इन्वेस्टमेंट (₹)',
  lifeInsurance: 'जीवन बीमा',
  healthInsurance: 'हेल्थ इंश्योरेंस',
  bike: 'बाइक',
  car: 'कार',
  getHappinessLevel: 'पॉकेट स्कोर पाएं',
  resetForm: 'फॉर्म रीसेट करें',
  yes: 'हां',
  no: 'नहीं',
  required: 'जरूरी',
  salaryRequired: 'सैलरी जरूरी है',
  calculating: 'गिनती हो रही है...',
  enterName: '��पना नाम लिखें',
  enterSalary: 'मासिक सैलरी लिखें',
  enterFoodExpenses: 'मासिक खाने का खर्च लिखें',
  enterHouseRent: 'मासिक घर का किराया लिखें',
  enterOtherExpenses: 'बिजली, गैस, मेड, फोन',
  selectGender: 'लिंग चुनें',
  selectProfession: 'काम चुनें',
  selectEducation: 'शिक्षा चुनें',
  selectState: 'राज्य चुनें',
  selectCity: 'शहर चुनें',
  placeholderDependents: 'क���ल परिवार के सदस्य',
  placeholderProperties: 'घर/फ्लैट की संख्या',
  placeholderLiquidCash: 'नकद पैसे और फिक्सड डिपॉजिट',
  placeholderLand: 'जमीन की कुल कीमत',
  placeholderStocks: 'स्टॉक्स की कुल कीमत',
  placeholderMutualFund: 'म्यूचुअल फंड की कुल ��ीमत',
  placeholderGold: 'सोने की कुल कीमत',
  placeholderOtherInvestment: 'अन्य इन्वेस्टमेंट की कुल कीमत'
},

Bengali: {
  appTitle: 'Pocket Score',
  appDescription: 'আপনার টাকার অবস্থার সম্পূর্ণ বিশ্লেষণ পান এবং আপনার খুশির মাত্রা বাড়ানোর জন্য পরামর্শ নিন',
  basicInfo: 'মূল তথ্য',
  basicInfoDesc: 'আপনার প্রয়োজনীয় টাকার তথ্য দিন',
  advancedLevel: 'অ্যাডভান্স সেকশন',
  personalDetails: 'ব্যক্তিগত তথ্য',
  locationDetails: 'জায়গার তথ্য',
  investmentPortfolio: 'ইনভেস্ট��েন্ট পোর্টফোলিও',
  language: 'ভাষা',
  name: 'নাম',
  country: 'দেশ',
  gender: 'লিঙ্গ',
  profession: 'পেশা',
  education: 'শিক্ষা',
  state: 'রাজ্য/প্রদেশ',
  city: 'শহর',
  salaryPerMonth: 'মাসিক বেতন (₹)',
  foodExpenses: 'মাসিক খাবারের খরচ (₹)',
  houseRent: 'মাসি��� বাড়ি ভাড়া (₹)',
  otherExpenses: 'অন্যান্য মাসিক খরচ (₹)',
  dependents: 'পরিবারের সদস্য',
  housesOwned: 'আপনার বাড়ি/ফ্ল্যাট',
  liquidCashFD: 'নগদ টাকা/এফডি (₹)',
  landNetWorth: 'জমির দাম (₹)',
  stocksNetWorth: 'স্টকের দাম (₹)',
  mutualFundNetWorth: 'মিউচুয়াল ফান্ড (₹)',
  goldNetWorth: 'সোনার দাম (₹)',
  otherInvestment: 'অন্যান্য ইনভেস্টমেন্ট (₹)',
  lifeInsurance: 'জীবন বীমা',
  healthInsurance: 'স্বাস্থ্য বীমা',
  bike: 'বাইক',
  car: 'গাড়ি',
  getHappinessLevel: 'পকেট স্কোর পান',
  resetForm: 'ফর্ম ��িসেট করুন',
  yes: 'হ্���াঁ',
  no: 'না',
  required: 'দরকার',
  salaryRequired: 'বেতন দরকার',
  calculating: 'হিসাব করা হচ্ছে...',
  enterName: 'আপনার নাম লিখুন',
  enterSalary: 'মাসিক বেতন লিখুন',
  enterFoodExpenses: 'মাসিক খাবারের খরচ লিখুন',
  enterHouseRent: 'মাসিক বাড়ি ভাড়া লিখুন',
  enterOtherExpenses: 'বিদ্যুৎ, গ্যাস, কাজের লোক, ফোন',
  selectGender: 'লিঙ্গ বেছে নিন',
  selectProfession: 'পেশা বেছে নিন',
  selectEducation: 'শিক্ষা বেছে নিন',
  selectState: 'রাজ্য বেছে নিন',
  selectCity: 'শহর বেছে নিন',
  placeholderDependents: 'মোট পরিবারের সদস্য',
  placeholderProperties: 'বাড়ি/ফ্ল্যাটের সংখ্যা',
  placeholderLiquidCash: 'নগদ টাকা এবং ফিক্সড ডিপোজিট',
  placeholderLand: 'জমির মোট দাম',
  placeholderStocks: 'স্টকের মোট দাম',
  placeholderMutualFund: 'মিউ���ুয়াল ফান্ডের মোট দাম',
  placeholderGold: 'সোনার মোট দাম',
  placeholderOtherInvestment: 'অন্যান্য ইনভেস্টমেন্টের মোট দাম'
},

Gujarati: {
  appTitle: 'Pocket Score',
  appDescription: 'તમારા પૈસાની સ્થિ��િનું સંપૂર્ણ વિશ્લેષણ મેળવો ���ને તમારી ખુશીનું સ્તર વધારવા માટે સલાહ લો',
  basicInfo: 'મૂળ માહિતી',
  basicInfoDesc: 'તમારી જરૂરી પૈસાની માહિત�� આપો',
  advancedLevel: 'એડવાન્સ સેકશન',
  personalDetails: 'વ્યક્તિગત માહિતી',
  locationDetails: 'જગ્યાની માહિતી',
  investmentPortfolio: 'ઈન્વેસ્ટમેન્ટ પોર્ટફોલિયો',
  language: 'ભાષા',
  name: 'નામ',
  country: 'દેશ',
  gender: 'જાતિ',
  profession: 'કામ',
  education: 'શિક્ષણ',
  state: 'રાજ્ય/પ્રદેશ',
  city: 'શહેર',
  salaryPerMonth: 'માસિક પગાર (₹)',
  foodExpenses: 'માસિક ખાવાનો ���ર્ચ (₹)',
  houseRent: 'માસિક ઘર ભાડું (₹)',
  otherExpenses: 'અન્ય માસિક ખર્ચ (₹)',
  dependents: 'પરિવારના સભ્યો',
  housesOwned: 'તમારા ઘર/ફ્લેટ',
  liquidCashFD: 'રોકડ પૈસા/એફડી (₹)',
  landNetWorth: 'જમી��ની કિંમત (₹)',
  stocksNetWorth: 'સ્ટો��ની કિંમત (₹)',
  mutualFundNetWorth: 'મ્યુચ્યુઅલ ફંડ (₹)',
  goldNetWorth: 'સોનાની કિંમત (₹)',
  otherInvestment: 'અન્ય ઈન્વેસ્ટમેન્ટ (₹)',
  lifeInsurance: 'જીવન વીમો',
  healthInsurance: 'આરોગ્ય વીમો',
  bike: 'બાઈક',
  car: 'કાર',
  getHappinessLevel: 'પોકેટ સ્કોર મેળવો',
  resetForm: 'ફોર્મ રીસેટ કરો',
  yes: 'હા',
  no: 'ના',
  required: 'જરૂરી',
  salaryRequired: 'પગાર જરૂરી છે',
  calculating: 'ગણતરી થઈ રહી છે...',
  enterName: 'તમારું નામ લખો',
  enterSalary: 'માસિક પગાર લખો',
  enterFoodExpenses: 'માસિક ખાવાનો ખર્ચ લખો',
  enterHouseRent: 'મ���સિક ઘર ભાડું લખો',
  enterOtherExpenses: 'લાઇટ, ગેસ, કામવાળી, ફોન',
  selectGender: 'જાતિ પસંદ કર���',
  selectProfession: 'કામ પસંદ કરો',
  selectEducation: 'શિક્ષણ પસંદ કરો',
  selectState: 'રાજ્ય ��સંદ કરો',
  selectCity: 'શહેર પ��ંદ કરો',
  placeholderDependents: 'કુલ પરિવારના સભ્યો',
  placeholderProperties: 'ઘર/ફ્લેટની સંખ્યા',
  placeholderLiquidCash: 'રોકડ પૈસા અને ફિક���સડ ડિપોઝિટ',
  placeholderLand: 'જમીનની કુલ કિંમત',
  placeholderStocks: 'સ્ટોકની કુલ કિંમત',
  placeholderMutualFund: 'મ્યુચ્યુઅલ ફંડની કુલ કિંમત',
  placeholderGold: 'સોનાની કુલ કિંમત',
  placeholderOtherInvestment: 'અન્ય ઈન્વેસ્ટમેન્ટની કુલ કિંમત'
},
  English: {
    appTitle: 'Pocket Score',
    appDescription: 'Get a comprehensive analysis of your financial situation and personalized advice to improve your happiness level',
    basicInfo: 'Basic Information',
    basicInfoDesc: 'Provide your essential financial details',
    advancedLevel: 'Advanced Section',
    personalDetails: 'Personal Details',
    locationDetails: 'Location Details',
    investmentPortfolio: 'Investment Portfolio',
    language: 'Language',
    name: 'Name',
    country: 'Country',
    gender: 'Gender',
    profession: 'Profession',
    education: 'Education',
    state: 'State/Province',
    city: 'City',
    salaryPerMonth: 'Salary per Month (₹)',
    foodExpenses: 'Food Expenses per Month (₹)',
    houseRent: 'House Rent per Month (₹)',
    otherExpenses: 'Other Expenses per Month (₹)',
    dependents: 'Number of Dependents',
    housesOwned: 'Houses/Flats You Own',
    liquidCashFD: 'Liquid Cash/FD (Net Worth ₹)',
    landNetWorth: 'Land You Own (Net Worth ₹)',
    stocksNetWorth: 'Stocks Net Worth (₹)',
    mutualFundNetWorth: 'Mutual Fund (Net Worth ₹)',
    goldNetWorth: 'Gold (Net Worth ₹)',
    otherInvestment: 'Other Investment (Net Worth ₹)',
    lifeInsurance: 'Life Insurance',
    healthInsurance: 'Health Insurance',
    bike: 'Bike',
    car: 'Car',
    getHappinessLevel: 'Get Pocket Score',
    resetForm: 'Reset Form',
    yes: 'Yes',
    no: 'No',
    required: 'required',
    salaryRequired: 'Salary is required',
    calculating: 'Calculating...',
    enterName: 'Enter your name',
    enterSalary: 'Enter monthly salary',
    enterFoodExpenses: 'Enter monthly food expenses',
    enterHouseRent: 'Enter monthly house rent',
    enterOtherExpenses: 'Electricity, Gas, Maid, Phone',
    selectGender: 'Select gender',
    selectProfession: 'Select profession',
    selectEducation: 'Select education level',
    selectState: 'Select state/province',
    selectCity: 'Select city',
    placeholderDependents: 'Total dependents'
  }
};

export default function Index() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('English');
  const t = translations[selectedLanguage] || translations.English;
  
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
    housesOwned: 0,
  });

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isAdviceOpen, setIsAdviceOpen] = useState(false);
  const [isInsuranceAdviceOpen, setIsInsuranceAdviceOpen] = useState(false);
  const [isInvestmentAdviceOpen, setIsInvestmentAdviceOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<EnhancedFinancialAssessmentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shareableLink, setShareableLink] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const scoreAndBuyingSectionRef = useRef<HTMLDivElement>(null);
  const [isCapturingImage, setIsCapturingImage] = useState(false);

  // Scroll to results when calculation is complete
  useEffect(() => {
    if (results && !isCalculating && resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [results, isCalculating]);

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

      // Force to use local backend during development
      const endpoint = '/api/financial-assessment';

      console.log('Making request to:', endpoint);
      console.log('Request data:', requestData);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        let errorMessage = 'Failed to calculate financial score';
        try {
          const errorData: ApiError = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.log('Error response data:', errorData);
        } catch (jsonError) {
          // If we can't parse the error response as JSON, use the status text
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
          console.log('Failed to parse error response:', jsonError);
        }
        throw new Error(errorMessage);
      }

      const result: EnhancedFinancialAssessmentResponse = await response.json();
      console.log('Success response:', result);
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
      const publicLink = `https://merapocket.com/results/${shareId}`;
      setShareableLink(publicLink);
    } catch (err) {
      console.error('Error calculating financial score:', err);

      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (err instanceof Error) {
        if (err.message === 'Failed to fetch') {
          errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        } else if (err.name === 'NetworkError' || err.message.includes('network')) {
          errorMessage = 'Network error occurred. Please check your connection and try again.';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
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
      housesOwned: 0,
    });
    setResults(null);
    setError(null);
    setIsAdvancedOpen(false);
    setShareableLink(null);
  };

  // Form validation with salary checks
  const totalMonthlyExpenses = (basicData.foodExpenses || 0) + (basicData.houseRent || 0) + (basicData.utilitiesExpenses || 0);
  const isFormValid = basicData.country && basicData.salaryPerMonth > 0 && basicData.salaryPerMonth > totalMonthlyExpenses;

  const generateShareId = (): string => {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  };

  const captureScoreAndBuyingSection = async (): Promise<Blob | null> => {
    if (!scoreAndBuyingSectionRef.current) return null;

    setIsCapturingImage(true);
    try {
      const canvas = await html2canvas(scoreAndBuyingSectionRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        height: scoreAndBuyingSectionRef.current.scrollHeight,
        width: scoreAndBuyingSectionRef.current.scrollWidth,
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

  const shareToWhatsApp = async () => {
    try {
      const imageBlob = await captureScoreAndBuyingSection();
      if (!imageBlob) {
        alert('⚠️ Unable to capture screenshot. Please try again.');
        return;
      }

      const file = new File([imageBlob], 'my-financial-score.png', { type: 'image/png' });
      const shareText = `🎯 Check out my Financial Score: ${results?.overallScore}/10!\n\n💰 See what I can afford with my current financial health!\n\n✨ Get your own Financial Score at: ${shareableLink || 'https://merapocket.com'}`;

      // Try native sharing with image (preferred method)
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            title: 'My Financial Score Results',
            text: shareText,
            files: [file]
          });
          return;
        } catch (error) {
          console.log('Native sharing failed, trying WhatsApp direct:', error);
        }
      }

      // Fallback: download image and open WhatsApp
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `financial-score-${results?.overallScore || 'results'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Open WhatsApp with text
      const text = encodeURIComponent(shareText + '\n\n📱 Image downloaded! Please attach it to your WhatsApp message.');
      const whatsappUrl = `https://wa.me/?text=${text}`;
      
      const whatsappWindow = window.open(whatsappUrl, '_blank');
      
      if (!whatsappWindow) {
        alert(
          "📱 Image downloaded!\n\n" +
          "To share on WhatsApp:\n" +
          "1. Open WhatsApp\n" +
          "2. Select a chat\n" +
          "3. Attach the downloaded image\n" +
          "4. Add this message:\n\n" +
          shareText
        );
      }

    } catch (error) {
      console.error('WhatsApp sharing error:', error);
      alert('⚠️ WhatsApp sharing failed. Please try again.');
    }
  };

  // Function to get badge based on financial score
  const getBadgeInfo = (score: number) => {
    if (score >= 9.5) {
      return {
        title: "🏆 Financial Champion",
        subtitle: "Exceptional financial management!",
        bgColor: "bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400",
        textColor: "text-white",
        borderColor: "border-yellow-500",
        icon: "🏆"
      };
    } else if (score >= 8.0) {
      return {
        title: "⭐ Excellent Health",
        subtitle: "Outstanding financial stability!",
        bgColor: "bg-gradient-to-r from-blue-500 to-purple-600",
        textColor: "text-white",
        borderColor: "border-blue-500",
        icon: "⭐"
      };
    } else if (score >= 6.0) {
      return {
        title: "🌟 Good Standing",
        subtitle: "Solid financial foundation!",
        bgColor: "bg-gradient-to-r from-green-500 to-teal-600",
        textColor: "text-white",
        borderColor: "border-green-500",
        icon: "🌟"
      };
    } else if (score >= 4.0) {
      return {
        title: "🚀 Making Progress",
        subtitle: "You're on the right track!",
        bgColor: "bg-gradient-to-r from-orange-400 to-yellow-500",
        textColor: "text-white",
        borderColor: "border-orange-500",
        icon: "🚀"
      };
    } else if (score >= 2.0) {
      return {
        title: "🌱 Building Foundation",
        subtitle: "Every expert was once a beginner!",
        bgColor: "bg-gradient-to-r from-indigo-400 to-purple-500",
        textColor: "text-white",
        borderColor: "border-indigo-500",
        icon: "🌱"
      };
    } else {
      return {
        title: "💪 Starting Strong",
        subtitle: "Great first step towards financial wellness!",
        bgColor: "bg-gradient-to-r from-pink-400 to-red-500",
        textColor: "text-white",
        borderColor: "border-pink-500",
        icon: "💪"
      };
    }
  };

  // Function to parse and format the advice text
  const formatAdvice = (advice: string, productRecommendations?: FinancialProductRecommendations) => {
    // Split the advice into sentences and paragraphs
    const sections = advice.split(/\d+\.\s\*\*/).filter(section => section.trim());

    if (sections.length <= 1) {
      // If no numbered sections found, display as paragraph with basic formatting
      return (
        <div className="space-y-3">
          {advice.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-gray-700 leading-relaxed">
              {paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').split('<strong>').map((part, i) => {
                if (i === 0) return part;
                const [bold, rest] = part.split('</strong>');
                return (
                  <span key={i}>
                    <strong className="font-semibold text-gray-900">{bold}</strong>
                    {rest}
                  </span>
                );
              })}
            </p>
          ))}
        </div>
      );
    }

    // Process the introduction (first section)
    const introduction = sections[0].trim();

    // Process numbered sections
    const numberedSections = sections.slice(1).map((section, index) => {
      const parts = section.split('**');
      if (parts.length >= 2) {
        const title = parts[0].replace(/^:+\s*/, '').replace(/:+$/, '').trim();
        const content = parts.slice(1).join('**').replace(/^:+\s*/, '').replace(/^\*\*:?\s*/, '').trim();
        return { title, content, number: index + 1 };
      }
      return { title: `Point ${index + 1}`, content: section.trim(), number: index + 1 };
    });

    return (
      <div className="space-y-4">
        {/* Introduction */}
        {introduction && (
          <p className="text-gray-700 leading-relaxed mb-4">
            {introduction.replace(/\*\*(.*?)\*\*/g, (match, p1) => p1).replace(/Here are some actionable steps you can take:?/i, 'Here are some actionable steps you can take:')}
          </p>
        )}

        {/* Numbered sections */}
        <div className="space-y-4">
          {numberedSections.map((section, index) => (
            <div key={index} className="flex gap-3 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-blue-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                  {section.number}
                </div>
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-gray-900 mb-2">{section.title}</h5>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {section.content.replace(/\*\*(.*?)\*\*/g, (match, p1) => p1)}
                </p>

                {/* Render Investment recommendations if this is Investment Strategy section */}
                {productRecommendations && section.title.toLowerCase().includes('investment') &&
                 productRecommendations.mutualFundRecommendations.length > 0 && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <Collapsible open={isInvestmentAdviceOpen} onOpenChange={setIsInvestmentAdviceOpen}>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-between p-0 h-auto hover:bg-transparent"
                        >
                          <h6 className="font-medium text-green-800 mb-0 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Recommended Mutual Funds for You ({productRecommendations.mutualFundRecommendations.length})
                          </h6>
                          {isInvestmentAdviceOpen ? (
                            <ChevronUp className="w-4 h-4 text-green-800" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-green-800" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="grid grid-cols-1 gap-3 mt-3">
                          {productRecommendations.mutualFundRecommendations.map((recommendation, idx) => {
                            const product = recommendation.product as MutualFundProduct;
                            return (
                              <div key={idx} className="flex items-center justify-between p-3 bg-white rounded border border-green-200">
                                <div className="flex-1">
                                  <h6 className="font-medium text-gray-900 text-sm">{product.name}</h6>
                                  <p className="text-xs text-gray-600">{product.fundHouse} • {product.subCategory}</p>
                                  <div className="flex items-center gap-4 mt-1">
                                    <span className="text-xs font-medium text-green-600">3Y: {product.returns.threeYear.toFixed(1)}%</span>
                                    <span className="text-xs text-gray-500">SIP: ₹{product.sipMinAmount}</span>
                                    <span className="text-xs text-gray-500">Match: {recommendation.matchScore}%</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-1 text-orange-600">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span className="text-xs font-medium">{product.rating}/5</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                )}

                {/* Render Insurance recommendations if this is Insurance Coverage section */}
                {productRecommendations && section.title.toLowerCase().includes('insurance') &&
                 productRecommendations.insuranceRecommendations.length > 0 && (
                  <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <Collapsible open={isInsuranceAdviceOpen} onOpenChange={setIsInsuranceAdviceOpen}>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-between p-0 h-auto hover:bg-transparent"
                        >
                          <h6 className="font-medium text-orange-800 mb-0 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Recommended Insurance Products for You ({productRecommendations.insuranceRecommendations.length})
                          </h6>
                          {isInsuranceAdviceOpen ? (
                            <ChevronUp className="w-4 h-4 text-orange-800" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-orange-800" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="grid grid-cols-1 gap-3 mt-3">
                          {productRecommendations.insuranceRecommendations.map((recommendation, idx) => {
                            const product = recommendation.product as InsuranceProduct;
                            const getTypeIcon = (type: string) => {
                              switch (type) {
                                case 'term': return '🛡️';
                                case 'health': return '🏥';
                                case 'motor': return '🚗';
                                default: return '📄';
                              }
                            };
                            return (
                              <div key={idx} className="flex items-center justify-between p-3 bg-white rounded border border-orange-200">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm">{getTypeIcon(product.type)}</span>
                                    <h6 className="font-medium text-gray-900 text-sm">{product.name}</h6>
                                  </div>
                                  <p className="text-xs text-gray-600">{product.company}</p>
                                  <div className="flex items-center gap-4 mt-1">
                                    <span className="text-xs font-medium text-blue-600">₹{(product.coverage / 100000).toFixed(0)}L Cover</span>
                                    <span className="text-xs text-green-600">₹{(product.premium / 12).toFixed(0)}/month</span>
                                    <span className="text-xs text-gray-500">Match: {recommendation.matchScore}%</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-1 text-orange-600">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span className="text-xs font-medium">{product.rating}/5</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 pb-20 sm:pb-24 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
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
            <div className="flex items-center justify-start gap-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-4xl font-bold text-white">
                  <p>Pocket Score</p>
                </CardTitle>
                <p className="text-blue-100 text-sm mt-1">
                  AI powered - An easy and free way to know your pocket score and guidance
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Language */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Languages className="w-4 h-4" />
                  {t.language}
                </label>
                <Select value={selectedLanguage} onValueChange={(value: Language) => setSelectedLanguage(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hindi">हिन्दी (Hindi)</SelectItem>
                    <SelectItem value="Bengali">বাংলা (Bengali)</SelectItem>
                    <SelectItem value="Gujarati">ગુજરાતી (Gujarati)</SelectItem>
                    <SelectItem value="Telugu">తెలుగు (Telugu)</SelectItem>
                    <SelectItem value="Tamil">தமிழ் (Tamil)</SelectItem>
                    <SelectItem value="Kannada">ಕನ್ನಡ (Kannada)</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {t.name}
                </label>
                <Input
                  type="text"
                  placeholder={t.enterName}
                  value={basicData.name}
                  onChange={(e) => handleBasicDataChange("name", e.target.value)}
                />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {t.country} <span className="text-red-500">*</span>
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

              {/* Salary */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t.salaryPerMonth} <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  placeholder={t.enterSalary}
                  value={basicData.salaryPerMonth || ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 0 || e.target.value === "") {
                      handleBasicDataChange("salaryPerMonth", value >= 0 ? value : 0);
                    }
                  }}
                  className={basicData.salaryPerMonth === 0 ? "border-red-300 focus:border-red-500" : ""}
                />
                {basicData.salaryPerMonth === 0 && (
                  <p className="text-sm text-red-600">{t.salaryRequired}</p>
                )}
                {basicData.salaryPerMonth > 0 && basicData.salaryPerMonth <= totalMonthlyExpenses && (
                  <p className="text-sm text-red-600">
                    Salary must be greater than total monthly expenses (₹{totalMonthlyExpenses.toLocaleString()})
                  </p>
                )}
              </div>

              {/* Food Expenses */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t.foodExpenses}</label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  placeholder={t.enterFoodExpenses}
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
                <label className="text-sm font-medium text-gray-700">{t.houseRent}</label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  placeholder={t.enterHouseRent}
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
                <label className="text-sm font-medium text-gray-700">{t.otherExpenses}</label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  placeholder={t.enterOtherExpenses}
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
                <label className="text-sm font-medium text-gray-700">{t.dependents}</label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  placeholder={t.placeholderDependents}
                  value={basicData.dependents || ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 0 || e.target.value === "") {
                      handleBasicDataChange("dependents", value >= 0 ? value : 0);
                    }
                  }}
                />
              </div>


            </div>

            {/* Yes/No Questions */}
            <div className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { key: "lifeInsurance", label: t.lifeInsurance },
                  { key: "healthInsurance", label: t.healthInsurance },
                  { key: "bike", label: t.bike },
                  { key: "car", label: t.car }
                ].map(({ key, label }) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-3 bg-gray-50 rounded-lg gap-2 sm:gap-0">
                    <span className="text-sm font-medium text-gray-700"><p>{label}</p></span>
                    <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
                      <Button
                        variant={basicData[key as keyof BasicFinancialData] === true ? "default" : "outline"}
                        size="sm"
                        className="flex-1 sm:flex-none min-h-[40px] sm:min-h-[32px]"
                        onClick={() => handleBasicDataChange(key as keyof BasicFinancialData, true)}
                      >
                        {t.yes}
                      </Button>
                      <Button
                        variant={basicData[key as keyof BasicFinancialData] === false ? "default" : "outline"}
                        size="sm"
                        className="flex-1 sm:flex-none min-h-[40px] sm:min-h-[32px]"
                        onClick={() => handleBasicDataChange(key as keyof BasicFinancialData, false)}
                      >
                        {t.no}
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
                    {t.advancedLevel}
                  </div>
                  {isAdvancedOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="p-6">
                {/* Personal Details Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-600" />
                    {t.personalDetails}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Gender */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {t.gender}
                      </label>
                      <Select value={basicData.gender} onValueChange={(value) => handleBasicDataChange("gender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={t.selectGender} />
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

                    {/* Profession */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {t.profession}
                      </label>
                      <Select value={basicData.profession} onValueChange={(value) => handleBasicDataChange("profession", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={t.selectProfession} />
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
                        {t.education}
                      </label>
                      <Select value={basicData.education} onValueChange={(value) => handleBasicDataChange("education", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={t.selectEducation} />
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
                  </div>
                </div>

                {/* Location Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    {t.locationDetails}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* State/Province */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">{t.state}</label>
                      <Select 
                        value={advancedData.state} 
                        onValueChange={(value) => handleAdvancedDataChange("state", value)}
                        disabled={!basicData.country}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={basicData.country ? t.selectState : "Select country first"} />
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
                      <label className="text-sm font-medium text-gray-700">{t.city}</label>
                      <Select
                        value={advancedData.city}
                        onValueChange={(value) => handleAdvancedDataChange("city", value)}
                        disabled={!basicData.country}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={basicData.country ? t.selectCity : "Select country first"} />
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

                {/* Real Estate Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    Real Estate
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">{t.housesOwned}</label>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Number of properties"
                        value={advancedData.housesOwned || ""}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value >= 0 || e.target.value === "") {
                            handleAdvancedDataChange("housesOwned", value >= 0 ? value : 0);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Investment Portfolio Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    {t.investmentPortfolio}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">{t.liquidCashFD}</label>
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
                      <label className="text-sm font-medium text-gray-700">{t.landNetWorth}</label>
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
                      <label className="text-sm font-medium text-gray-700">{t.stocksNetWorth}</label>
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
                      <label className="text-sm font-medium text-gray-700">{t.mutualFundNetWorth}</label>
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
                      <label className="text-sm font-medium text-gray-700">{t.goldNetWorth}</label>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Gold investments value"
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
                      <label className="text-sm font-medium text-gray-700">{t.otherInvestment}</label>
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
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Button
            onClick={calculateFinancialScore}
            disabled={!isFormValid || isCalculating}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 sm:py-4 text-base sm:text-lg shadow-lg transform hover:scale-105 transition-all duration-300 min-h-[48px] sm:min-h-[56px]"
          >
            <Heart className="w-5 h-5 mr-2" />
            {isCalculating ? t.calculating : t.getHappinessLevel}
          </Button>

          <Button
            onClick={resetForm}
            variant="outline"
            className="w-full py-3 min-h-[44px] sm:min-h-[48px]"
          >
            {t.resetForm}
          </Button>
        </div>

        {/* Results Section */}
        {results && !isCalculating && (
          <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-blue-50" ref={resultsRef}>
            <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                {basicData.name ? `${basicData.name}, Your Financial Assessment Results` : 'Your Financial Assessment Results'}
              </CardTitle>
              <CardDescription className="text-green-100">
                Based on your provided information • Calculated on {new Date(results.timestamp).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="text-center mb-6 sm:mb-8" ref={scoreAndBuyingSectionRef}>
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-teal-500 rounded-full mb-4">
                  <span className="text-2xl sm:text-3xl font-bold text-white">{results.overallScore}</span>
                  <span className="text-base sm:text-lg text-green-100">/10</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  Overall Financial Score
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-6 max-w-md mx-auto">
                  <div
                    className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(results.overallScore / 10) * 100}%` }}
                  />
                </div>

                {/* Achievement Badge */}
                {(() => {
                  const badge = getBadgeInfo(results.overallScore);
                  return (
                    <div className="mb-6">
                      <div className={`inline-flex items-center px-6 py-3 rounded-full border-2 ${badge.bgColor} ${badge.borderColor} ${badge.textColor} shadow-lg transform hover:scale-105 transition-all duration-300`}>
                        <span className="text-2xl mr-3">{badge.icon}</span>
                        <div className="text-center">
                          <div className="font-bold text-lg">{badge.title}</div>
                          <div className="text-sm opacity-90">{badge.subtitle}</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Action Buttons Section */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 gap-4">
                    {/* What You Can Buy Button */}
                    {results.affordability && (
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full h-auto p-6 border-2 border-purple-300 hover:border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300"
                          >
                            <div className="flex items-center justify-center gap-3 text-purple-700">
                              <Award className="w-6 h-6" />
                              <span className="text-lg font-bold">What You Can Buy! 🎯</span>
                              <ChevronDown className="w-5 h-5" />
                            </div>
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="mt-4 p-6 bg-white rounded-lg border border-purple-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                              {[
                                // Short-term achievable items first
                                { key: 'mobile', icon: '📱', title: 'New Mobile', color: 'from-blue-500 to-cyan-500' },
                                { key: 'gadgets', icon: '⌚', title: 'Latest Gadgets', color: 'from-pink-500 to-rose-500' },
                                { key: 'foreignTrip', icon: '✈️', title: 'Foreign Trip', color: 'from-orange-500 to-red-500' },
                                // Long-term investment goals
                                { key: 'bike', icon: '🏍️', title: 'Dream Bike', color: 'from-green-500 to-emerald-500' },
                                { key: 'car', icon: '🚗', title: 'Your Car', color: 'from-purple-500 to-violet-500' },
                                { key: 'homeUpgrade', icon: '🏠', title: 'Home Upgrade', color: 'from-indigo-500 to-blue-500' }
                              ].map((item) => {
                                const affordabilityItem = results.affordability[item.key as keyof typeof results.affordability];
                                return (
                                  <div
                                    key={item.key}
                                    className={`relative overflow-hidden rounded-xl p-4 sm:p-5 text-white shadow-lg transform hover:scale-105 transition-all duration-300 ${
                                      affordabilityItem.canAfford
                                        ? `bg-gradient-to-br ${item.color}`
                                        : 'bg-gradient-to-br from-gray-400 to-gray-500'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                                      <span className="text-2xl sm:text-3xl">{item.icon}</span>
                                      {affordabilityItem.canAfford && (
                                        <div className="bg-white bg-opacity-20 rounded-full p-1">
                                          <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                        </div>
                                      )}
                                    </div>
                                    <h5 className="font-bold text-base sm:text-lg mb-2">{item.title}</h5>
                                    <p className="text-xs sm:text-sm opacity-90 leading-relaxed">
                                      {affordabilityItem.description}
                                    </p>
                                    {affordabilityItem.canAfford && (
                                      <div className="absolute top-2 right-2">
                                        <div className="bg-green-400 rounded-full w-3 h-3 animate-pulse"></div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            <div className="text-center mt-6">
                              <p className="text-gray-600 text-sm italic">
                                ✨ Your financial journey is impressive! Each achievement reflects your smart money management. ✨
                              </p>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}

                    {/* Personalized Advice Button */}
                    <Collapsible open={isAdviceOpen} onOpenChange={setIsAdviceOpen}>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-auto p-6 border-2 border-blue-300 hover:border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300"
                        >
                          <div className="flex items-center justify-center gap-3 text-blue-700">
                            <Lightbulb className="w-6 h-6" />
                            <span className="text-lg font-bold">Personalized Advice</span>
                            {isAdviceOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-4 p-6 bg-white rounded-lg border border-blue-200">
                          {formatAdvice(results.advice, results.productRecommendations)}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>
              </div>

              {/* WhatsApp Share Button */}
              <div className="mt-6 text-center">
                <Button
                  onClick={shareToWhatsApp}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-3 mx-auto transition-all duration-300 transform hover:scale-105 shadow-lg"
                  disabled={isCapturingImage}
                >
                  <MessageCircle className="w-5 h-5" />
                  {isCapturingImage ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Preparing image...
                    </>
                  ) : (
                    'Share to WhatsApp 📱'
                  )}
                </Button>
                <p className="text-xs text-gray-500 mt-2">Share your score and achievements as an image</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
