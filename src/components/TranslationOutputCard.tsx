import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Volume2, Languages, Copy, ArrowLeftRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TranslationOutputCardProps {
  inputText: string;
  inputType: 'voice' | 'sign';
}

export function TranslationOutputCard({ inputText, inputType }: TranslationOutputCardProps) {
  const [translatedText, setTranslatedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isSimplified, setIsSimplified] = useState(false);
  const { toast } = useToast();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' }
  ];

  // Simulate text simplification and translation
  useEffect(() => {
    if (!inputText) {
      setTranslatedText('');
      return;
    }

    const simplifyText = (text: string): string => {
      // Simulate text simplification for ISL
      const simplified = text
        .toLowerCase()
        .replace(/[.,!?;:]/g, '')
        .replace(/\b(the|a|an|is|are|was|were)\b/g, '')
        .trim();
      
      return simplified.charAt(0).toUpperCase() + simplified.slice(1);
    };

    const translateText = (text: string, language: string): string => {
      // Simulate translation (in real implementation, this would use Google Translate API or similar)
      const translations: Record<string, Record<string, string>> = {
        'hello': {
          'hi': 'नमस्ते',
          'te': 'హలో',
          'ta': 'வணக்கம்'
        },
        'thank you': {
          'hi': 'धन्यवाद',
          'te': 'ధన్యవాదాలు',
          'ta': 'நன்றி'
        },
        'good morning': {
          'hi': 'सुप्रभात',
          'te': 'శుభోదయం',
          'ta': 'காலை வணக்கம்'
        }
      };

      if (language === 'en') return text;
      
      const lowerText = text.toLowerCase();
      return translations[lowerText]?.[language] || `[${text} in ${language}]`;
    };

    // Process the text
    let processedText = inputText;
    
    if (inputType === 'voice') {
      // Simplify voice input for ISL users
      processedText = simplifyText(inputText);
      setIsSimplified(true);
    } else {
      // Sign language input - convert to speech
      setIsSimplified(false);
    }

    // Apply language translation
    const finalText = translateText(processedText, selectedLanguage);
    setTranslatedText(finalText);
  }, [inputText, selectedLanguage, inputType]);

  const speakText = () => {
    if (!translatedText || !('speechSynthesis' in window)) {
      toast({
        title: "Text-to-Speech Not Available",
        description: "Your browser doesn't support text-to-speech",
        variant: "destructive"
      });
      return;
    }

    const utterance = new SpeechSynthesisUtterance(translatedText);
    
    // Set language for speech synthesis
    const languageMap: Record<string, string> = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'te': 'te-IN',
      'ta': 'ta-IN'
    };
    
    utterance.lang = languageMap[selectedLanguage] || 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1;
    
    speechSynthesis.speak(utterance);
    
    toast({
      title: "Speaking",
      description: "Playing translated text"
    });
  };

  const copyText = async () => {
    if (!translatedText) return;
    
    try {
      await navigator.clipboard.writeText(translatedText);
      toast({
        title: "Copied",
        description: "Text copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy text",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ArrowLeftRight className="h-6 w-6 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">Translation Output</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {inputText && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">
                  Input ({inputType === 'voice' ? 'Voice/Text' : 'Sign Language'}):
                </p>
                {isSimplified && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    Simplified for ISL
                  </span>
                )}
              </div>
              <p className="text-foreground">{inputText}</p>
            </div>
          )}

          {translatedText ? (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-primary font-medium">
                  Translated Output:
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyText}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={speakText}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-foreground text-lg font-medium">{translatedText}</p>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <ArrowLeftRight className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Start speaking or signing to see the translation</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {inputType === 'voice' 
              ? 'Voice and text input is simplified for ISL users' 
              : 'Sign language is converted to text and speech'
            }
          </p>
        </div>
      </div>
    </Card>
  );
}