import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, Hand, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PermissionGuide } from './PermissionGuide';

interface SignInputCardProps {
  onSignDetected: (text: string) => void;
  isDetecting: boolean;
  setIsDetecting: (detecting: boolean) => void;
}

export function SignInputCard({ onSignDetected, isDetecting, setIsDetecting }: SignInputCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [detectedSign, setDetectedSign] = useState('');
  const [lastDetection, setLastDetection] = useState('');
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 }, 
          facingMode: 'user' 
        },
        audio: false // Only request video for sign detection
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Ensure video plays
        await videoRef.current.play();
      }
      
      setStream(mediaStream);
      setIsDetecting(true);
      
      // Simulate sign detection (in real implementation, this would use MediaPipe/TensorFlow)
      simulateSignDetection();
      
      toast({
        title: "Camera Started Successfully",
        description: "Ready to detect sign language gestures"
      });
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      
      let errorMessage = "Unknown camera error";
      let errorTitle = "Camera Access Error";
      
      if (error.name === 'NotAllowedError' || error.message.includes('not-allowed')) {
        errorTitle = "Camera Permission Denied";
        errorMessage = "Please allow camera access in your browser settings and refresh the page";
        setShowPermissionGuide(true);
      } else if (error.name === 'NotFoundError') {
        errorTitle = "No Camera Found";
        errorMessage = "No camera device was found on your system";
      } else if (error.name === 'NotReadableError') {
        errorTitle = "Camera In Use";
        errorMessage = "Camera is already being used by another application";
      } else if (error.message.includes('not supported')) {
        errorTitle = "Browser Not Supported";
        errorMessage = "Your browser doesn't support camera access";
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const retryCamera = () => {
    setShowPermissionGuide(false);
    startCamera();
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsDetecting(false);
    setDetectedSign('');
  };

  const simulateSignDetection = () => {
    // Simulated sign detection - in real implementation, this would integrate with MediaPipe Hands
    const signs = [
      'Hello', 'Thank you', 'Please', 'Sorry', 'Good morning',
      'How are you?', 'I am fine', 'Nice to meet you', 'Goodbye', 'Yes', 'No'
    ];
    
    const interval = setInterval(() => {
      if (!isDetecting) {
        clearInterval(interval);
        return;
      }
      
      // Randomly detect a sign every 3-5 seconds
      if (Math.random() > 0.7) {
        const randomSign = signs[Math.floor(Math.random() * signs.length)];
        setDetectedSign(randomSign);
        setLastDetection(randomSign);
        onSignDetected(randomSign);
        
        // Clear detection after 2 seconds
        setTimeout(() => setDetectedSign(''), 2000);
      }
    }, 1000);
  };

  const replayLastDetection = () => {
    if (lastDetection) {
      onSignDetected(lastDetection);
      toast({
        title: "Replaying",
        description: `"${lastDetection}"`
      });
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <>
      <Card className="p-6 bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Hand className="h-6 w-6 text-secondary" />
              <h3 className="text-lg font-semibold text-foreground">Sign Language Input</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={replayLastDetection}
                disabled={!lastDetection}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              {isDetecting ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Camera not active</p>
                  </div>
                </div>
              )}
              
              {detectedSign && (
                <div className="absolute top-4 left-4 bg-secondary text-secondary-foreground px-3 py-2 rounded-lg shadow-elevated animate-pulse">
                  <p className="font-medium">Detected: {detectedSign}</p>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <Button
                onClick={isDetecting ? stopCamera : startCamera}
                size="lg"
                className={`h-12 px-8 transition-all duration-300 ${
                  isDetecting
                    ? 'bg-destructive hover:bg-destructive/90'
                    : 'bg-gradient-secondary hover:shadow-glow'
                }`}
              >
                {isDetecting ? (
                  <>
                    <CameraOff className="h-5 w-5 mr-2" />
                    Stop Detection
                  </>
                ) : (
                  <>
                    <Camera className="h-5 w-5 mr-2" />
                    Start Detection
                  </>
                )}
              </Button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                {isDetecting 
                  ? 'Perform sign language gestures naturally' 
                  : 'Click to start sign language detection'
                }
              </p>
              {lastDetection && (
                <p className="text-xs text-muted-foreground">
                  Last detected: "{lastDetection}"
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>
      
      {showPermissionGuide && (
        <PermissionGuide onRetry={retryCamera} />
      )}
    </>
  );
}