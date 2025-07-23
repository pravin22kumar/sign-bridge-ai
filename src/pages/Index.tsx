import { useState } from 'react';
import { Header } from '@/components/Header';
import { VoiceInputCard } from '@/components/VoiceInputCard';
import { SignInputCard } from '@/components/SignInputCard';
import { TranslationOutputCard } from '@/components/TranslationOutputCard';

const Index = () => {
  const [currentInput, setCurrentInput] = useState('');
  const [inputType, setInputType] = useState<'voice' | 'sign'>('voice');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isSignDetecting, setIsSignDetecting] = useState(false);

  const handleVoiceTranscript = (text: string) => {
    setCurrentInput(text);
    setInputType('voice');
  };

  const handleSignDetected = (text: string) => {
    setCurrentInput(text);
    setInputType('sign');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Voice Input Section */}
          <div className="space-y-4">
            <VoiceInputCard
              onTranscript={handleVoiceTranscript}
              isListening={isVoiceListening}
              setIsListening={setIsVoiceListening}
            />
          </div>

          {/* Translation Output Section */}
          <div className="space-y-4">
            <TranslationOutputCard
              inputText={currentInput}
              inputType={inputType}
            />
          </div>

          {/* Sign Input Section */}
          <div className="space-y-4">
            <SignInputCard
              onSignDetected={handleSignDetected}
              isDetecting={isSignDetecting}
              setIsDetecting={setIsSignDetecting}
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            How SignSync AI Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Speak or Type</h3>
              <p className="text-muted-foreground">
                Use voice input or type messages. AI simplifies complex sentences for ISL users.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">AI Translation</h3>
              <p className="text-muted-foreground">
                Real-time translation between languages with cultural context awareness.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Sign & Hear</h3>
              <p className="text-muted-foreground">
                Sign language gestures are converted to speech and text instantly.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
