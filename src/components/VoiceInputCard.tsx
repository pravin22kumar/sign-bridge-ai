import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Type, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputCardProps {
  onTranscript: (text: string) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export function VoiceInputCard({ onTranscript, isListening, setIsListening }: VoiceInputCardProps) {
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [isTextMode, setIsTextMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);
        if (finalTranscript) {
          onTranscript(finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: "Please try again or use text input.",
          variant: "destructive"
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    } else {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Please use text input instead.",
        variant: "destructive"
      });
    }
  }, [onTranscript, setIsListening, toast]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      setTranscript('');
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      onTranscript(textInput);
      setTextInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Volume2 className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Voice & Text Input</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={isTextMode ? "outline" : "default"}
              size="sm"
              onClick={() => setIsTextMode(false)}
              disabled={isListening}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              variant={isTextMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsTextMode(true)}
            >
              <Type className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isTextMode ? (
          <div className="space-y-3">
            <Textarea
              placeholder="Type your message here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="min-h-[120px] resize-none border-border focus:ring-primary"
            />
            <Button
              onClick={handleTextSubmit}
              disabled={!textInput.trim()}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              Send Message
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Button
                onClick={toggleListening}
                disabled={!recognition}
                size="lg"
                className={`h-20 w-20 rounded-full transition-all duration-300 ${
                  isListening
                    ? 'bg-destructive hover:bg-destructive/90 shadow-glow animate-pulse'
                    : 'bg-gradient-primary hover:shadow-glow'
                }`}
              >
                {isListening ? (
                  <MicOff className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                {isListening ? 'Listening... Click to stop' : 'Click to start speaking'}
              </p>
            </div>

            {transcript && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Live Transcript:</p>
                <p className="text-foreground">{transcript}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}