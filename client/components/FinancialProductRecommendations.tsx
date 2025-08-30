import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Shield, 
  TrendingUp, 
  Phone, 
  Globe, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  CheckCircle,
  IndianRupee,
  Calendar,
  Award,
  BarChart3,
  Target,
  ExternalLink
} from "lucide-react";
import { FinancialProductRecommendations, ProductRecommendation, InsuranceProduct, MutualFundProduct } from "@shared/api";

interface FinancialProductRecommendationsProps {
  recommendations: FinancialProductRecommendations;
}

interface InsuranceCardProps {
  recommendation: ProductRecommendation;
}

interface MutualFundCardProps {
  recommendation: ProductRecommendation;
}

const InsuranceCard: React.FC<InsuranceCardProps> = ({ recommendation }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const product = recommendation.product as InsuranceProduct;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'term': return '🛡️';
      case 'health': return '🏥';
      case 'motor': return '🚗';
      default: return '📄';
    }
  };

  return (
    <Card className="h-full border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{getTypeIcon(product.type)}</span>
              <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
              <Badge className={getPriorityColor(recommendation.priority)}>
                {recommendation.priority} priority
              </Badge>
            </div>
            <CardDescription className="text-sm text-gray-600">
              {product.company}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-orange-600">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">{product.rating}/5</span>
            </div>
            <div className="text-xs text-gray-500">
              Match: {recommendation.matchScore}%
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Key Details */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Coverage</div>
            <div className="text-lg font-bold text-blue-700">
              ₹{(product.coverage / 100000).toFixed(0)} Lakhs
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Premium</div>
            <div className="text-lg font-bold text-green-600">
              ₹{(product.premium / 12).toFixed(0)}/month
            </div>
          </div>
        </div>

        {/* Suitability Explanation */}
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-green-800">{recommendation.suitabilityExplanation}</p>
          </div>
        </div>

        {/* Why Recommended */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Why recommended for you:</div>
          <div className="space-y-1">
            {recommendation.reasons.slice(0, 3).map((reason, index) => (
              <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button className="flex-1" size="sm">
            <Phone className="w-4 h-4 mr-2" />
            Call {product.phone}
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={product.website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>

        {/* Expandable Details */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full">
              {isExpanded ? (
                <>Hide Details <ChevronUp className="w-4 h-4 ml-2" /></>
              ) : (
                <>Show Details <ChevronDown className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-3">
            {/* Key Features */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Key Features:</div>
              <div className="space-y-1">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 text-xs text-gray-600">
                    <CheckCircle className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Benefits */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Key Benefits:</div>
              <div className="space-y-1">
                {product.keyBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2 text-xs text-gray-600">
                    <Award className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
              <div>
                <div className="text-xs text-gray-500">Claim Settlement</div>
                <div className="text-sm font-medium">{product.claimSettlementRatio}%</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Age Limit</div>
                <div className="text-sm font-medium">{product.eligibilityMinAge}-{product.eligibilityMaxAge} years</div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

const MutualFundCard: React.FC<MutualFundCardProps> = ({ recommendation }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const product = recommendation.product as MutualFundProduct;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'moderately_high': return 'text-orange-600';
      case 'high': return 'text-red-600';
      case 'very_high': return 'text-red-700';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'equity': return '📈';
      case 'debt': return '🏦';
      case 'hybrid': return '⚖️';
      case 'etf': return '🔄';
      default: return '💼';
    }
  };

  return (
    <Card className="h-full border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{getCategoryIcon(product.category)}</span>
              <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
              <Badge className={getPriorityColor(recommendation.priority)}>
                {recommendation.priority} priority
              </Badge>
            </div>
            <CardDescription className="text-sm text-gray-600">
              {product.fundHouse} • {product.subCategory}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-orange-600">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">{product.rating}/5</span>
            </div>
            <div className="text-xs text-gray-500">
              Match: {recommendation.matchScore}%
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Key Details */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-green-50 rounded-lg">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">3Y Returns</div>
            <div className="text-lg font-bold text-green-700">
              {product.returns.threeYear.toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">SIP Min</div>
            <div className="text-lg font-bold text-blue-600">
              ₹{product.sipMinAmount}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Risk</div>
            <div className={`text-sm font-bold capitalize ${getRiskColor(product.riskLevel)}`}>
              {product.riskLevel.replace('_', ' ')}
            </div>
          </div>
        </div>

        {/* Suitability Explanation */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">{recommendation.suitabilityExplanation}</p>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Historical Returns:</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">1 Year</span>
              <span className="text-sm font-medium text-green-600">
                {product.returns.oneYear.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">3 Years</span>
              <span className="text-sm font-medium text-green-600">
                {product.returns.threeYear.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">5 Years</span>
              <span className="text-sm font-medium text-green-600">
                {product.returns.fiveYear.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Why Recommended */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Why recommended for you:</div>
          <div className="space-y-1">
            {recommendation.reasons.slice(0, 3).map((reason, index) => (
              <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button className="flex-1" size="sm">
            <IndianRupee className="w-4 h-4 mr-2" />
            Start SIP
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={product.website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>

        {/* Expandable Details */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full">
              {isExpanded ? (
                <>Hide Details <ChevronUp className="w-4 h-4 ml-2" /></>
              ) : (
                <>Show Details <ChevronDown className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-3">
            {/* Fund Details */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
              <div>
                <div className="text-xs text-gray-500">NAV</div>
                <div className="text-sm font-medium">₹{product.nav.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Expense Ratio</div>
                <div className="text-sm font-medium">{product.expense_ratio}%</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">AUM</div>
                <div className="text-sm font-medium">₹{(product.aum / 100).toFixed(0)} Cr</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Fund Manager</div>
                <div className="text-sm font-medium">{product.fundManager}</div>
              </div>
            </div>

            {/* Key Features */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Key Features:</div>
              <div className="space-y-1">
                {product.keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 text-xs text-gray-600">
                    <BarChart3 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

const FinancialProductRecommendationsComponent: React.FC<FinancialProductRecommendationsProps> = ({ recommendations }) => {
  const [activeTab, setActiveTab] = useState("mutual-funds");
  const [isInsuranceAdviceOpen, setIsInsuranceAdviceOpen] = useState(false);

  if (recommendations.totalRecommendations === 0) {
    return (
      <Card className="bg-gray-50">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <CardTitle className="text-lg text-gray-600 mb-2">No Recommendations Available</CardTitle>
          <p className="text-gray-500">
            We couldn't find suitable financial products for your current profile.
            This might be due to income eligibility or other factors.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Product Recommendations */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-green-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Personalized Product Recommendations
          </CardTitle>
          <CardDescription className="text-blue-100">
            Based on your financial profile • {recommendations.totalRecommendations} products recommended
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="mutual-funds" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Investment Recommendations ({recommendations.mutualFundRecommendations.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mutual-funds" className="mt-6">
              {recommendations.mutualFundRecommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.mutualFundRecommendations.map((recommendation, index) => (
                    <MutualFundCard key={index} recommendation={recommendation} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No mutual fund recommendations available for your profile.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Insurance Advice Section */}
      {recommendations.insuranceRecommendations.length > 0 && (
        <Card className="shadow-xl border-0 bg-gradient-to-br from-orange-50 to-red-50">
          <Collapsible open={isInsuranceAdviceOpen} onOpenChange={setIsInsuranceAdviceOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg cursor-pointer hover:from-orange-700 hover:to-red-700 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Insurance Advice Section ({recommendations.insuranceRecommendations.length} recommendations)
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 h-auto p-2"
                  >
                    {isInsuranceAdviceOpen ? (
                      <>
                        Hide Advice <ChevronUp className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        View Insurance Advice <ChevronDown className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardTitle>
                <CardDescription className="text-orange-100">
                  Specialized insurance recommendations tailored to your financial profile
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="p-6">
                <div className="mb-4 p-4 bg-orange-100 rounded-lg border-l-4 border-orange-500">
                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-1">Insurance Protection Recommendations</h4>
                      <p className="text-sm text-orange-700">
                        Based on your income, dependents, and financial goals, here are our recommended insurance products
                        to protect you and your family's financial future.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.insuranceRecommendations.map((recommendation, index) => (
                    <InsuranceCard key={index} recommendation={recommendation} />
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}
    </div>
  );
};

export default FinancialProductRecommendationsComponent;
