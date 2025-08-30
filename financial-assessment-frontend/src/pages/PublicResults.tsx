import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Lightbulb, ArrowLeft, Share2, Download } from "lucide-react";
import { FinancialAssessmentResponse } from "@/types/api";
import html2canvas from "html2canvas";

interface StoredAssessmentResult extends FinancialAssessmentResponse {
  id: string;
  createdAt: string;
  name?: string;
}

export default function PublicResults() {
  const { id } = useParams<{ id: string }>();
  const [results, setResults] = useState<StoredAssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCapturingImage, setIsCapturingImage] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [showImageMode, setShowImageMode] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      loadResults(id);
    }
  }, [id]);

  useEffect(() => {
    if (results && resultsRef.current && !resultImage) {
      // Automatically generate image after results are loaded
      generateResultImage();
    }
  }, [results, resultImage]);

  const loadResults = (resultId: string) => {
    try {
      const storedResults = localStorage.getItem(`financial-assessment-${resultId}`);
      if (storedResults) {
        const parsedResults = JSON.parse(storedResults);
        setResults(parsedResults);
      } else {
        setError("Assessment results not found. The link may be invalid or expired.");
      }
    } catch (err) {
      console.error("Error loading results:", err);
      setError("Failed to load assessment results.");
    } finally {
      setLoading(false);
    }
  };

  const generateResultImage = async () => {
    if (!resultsRef.current) return;

    setIsCapturingImage(true);
    try {
      // Wait for fonts and images to load completely
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Ensure all fonts are loaded
      if (document.fonts) {
        await document.fonts.ready;
      }

      const canvas = await html2canvas(resultsRef.current, {
        backgroundColor: '#ffffff',
        scale: 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        height: resultsRef.current.scrollHeight,
        width: resultsRef.current.scrollWidth,
        scrollX: 0,
        scrollY: 0,
        logging: false, // Disable logging for cleaner console
        removeContainer: true,
        foreignObjectRendering: true
      });

      const imageDataUrl = canvas.toDataURL('image/png', 1.0);
      setResultImage(imageDataUrl);

      // Switch to image mode after a short delay
      setTimeout(() => {
        setShowImageMode(true);
      }, 300);

    } catch (error) {
      console.error('Error generating result image:', error);
      // If image generation fails, stay in HTML mode
      alert('⚠️ Unable to generate image view. Showing interactive version instead.');
    } finally {
      setIsCapturingImage(false);
    }
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
    let imageToDownload = resultImage;

    // If no image is available, try to capture one
    if (!imageToDownload) {
      const imageBlob = await captureResultsAsImage();
      if (imageBlob) {
        imageToDownload = URL.createObjectURL(imageBlob);
      }
    }

    if (imageToDownload) {
      const link = document.createElement('a');
      link.href = imageToDownload;
      link.download = `financial-assessment-score-${results?.overallScore || 'results'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Only revoke if it was a blob URL we created
      if (!resultImage && imageToDownload.startsWith('blob:')) {
        URL.revokeObjectURL(imageToDownload);
      }
    } else {
      alert('⚠️ Unable to generate image. Please try again.');
    }
  };

  const shareResults = async () => {
    try {
      const shareText = `🎯 I scored ${results?.overallScore}/10 on my Financial Health Assessment! Check out my results and try it yourself.`;

      // Try to share with image if available
      if (navigator.share && resultImage) {
        try {
          // Convert data URL to blob for sharing
          const response = await fetch(resultImage);
          const blob = await response.blob();
          const file = new File([blob], 'financial-assessment-results.png', { type: 'image/png' });

          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({
              title: 'My Financial Health Assessment Results',
              text: shareText,
              files: [file],
              url: window.location.href
            });
            return;
          }
        } catch (error) {
          console.log('Image sharing failed, trying text/URL sharing:', error);
        }
      }

      // Fallback to text/URL sharing
      const shareData = {
        title: 'My Financial Health Assessment Results',
        text: shareText,
        url: window.location.href
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('✅ Link copied to clipboard! You can now share it anywhere.');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: copy link to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('✅ Link copied to clipboard! You can now share it anywhere.');
      } catch (clipboardError) {
        alert('⚠️ Unable to share. Please copy the URL from your browser address bar.');
      }
    }
  };

  if (loading || isCapturingImage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {loading ? 'Loading assessment results...' : 'Generating results image...'}
          </p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Results Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/">
            <Button className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Take Assessment
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // If image mode is enabled and image is ready, show image
  if (showImageMode && resultImage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="bg-white p-4 rounded-xl shadow-2xl">
            <img
              src={resultImage}
              alt="Financial Assessment Results"
              className="w-full h-auto rounded-lg border border-gray-200 animate-fade-in"
              style={{ maxHeight: '85vh', objectFit: 'contain' }}
              loading="eager"
            />
          </div>

          {/* Action buttons below image */}
          <div className="flex flex-wrap gap-4 justify-center mt-6">
            <Button
              onClick={shareResults}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Share2 className="w-4 h-4" />
              Share Results
            </Button>

            <Button
              onClick={downloadResultsImage}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Image
            </Button>

            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Take Assessment
              </Button>
            </Link>
          </div>

          {/* Call to Action */}
          <div className="mt-8 text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Want to Know Your Financial Score?
            </h2>
            <p className="text-gray-600 mb-4">
              Take our comprehensive Financial Health Assessment to get personalized insights.
            </p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Start Your Assessment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl" style={{ opacity: showImageMode ? 0 : 1, position: showImageMode ? 'absolute' : 'relative', top: showImageMode ? '-9999px' : 'auto' }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Financial Health Assessment Results
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Shared financial assessment results
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Take Your Own Assessment
            </Button>
          </Link>
        </div>

        {/* Results Section */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-blue-50 mb-6" ref={resultsRef}>
          <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              {results?.name ? `${results.name}, Financial Assessment Results` : 'Financial Assessment Results'}
            </CardTitle>
            <CardDescription className="text-green-100">
              Assessment completed on {new Date(results.timestamp).toLocaleDateString()} at {new Date(results.timestamp).toLocaleTimeString()}
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
                Personalized Financial Advice
              </h4>
              <p className="text-gray-700 leading-relaxed">{results.advice}</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={shareResults}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Share2 className="w-4 h-4" />
            Share Results
          </Button>
          
          <Button
            onClick={downloadResultsImage}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isCapturingImage}
          >
            <Download className="w-4 h-4" />
            {isCapturingImage ? 'Generating...' : 'Download Image'}
          </Button>

          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Take Assessment
            </Button>
          </Link>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Want to Know Your Financial Score?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Take our comprehensive Financial Health Assessment to get personalized insights and advice for improving your financial well-being.
          </p>
          <Link to="/">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Start Your Assessment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
