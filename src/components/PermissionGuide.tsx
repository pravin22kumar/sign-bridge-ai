import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Camera, Settings, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PermissionGuideProps {
  onRetry: () => void;
}

export function PermissionGuide({ onRetry }: PermissionGuideProps) {
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-card">
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Camera access is required for sign language detection. Please follow the steps below:
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="text-sm">
            <h4 className="font-semibold mb-2 flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              How to enable camera access:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Look for the camera icon in your browser's address bar</li>
              <li>Click on it and select "Allow" for camera access</li>
              <li>If you don't see the icon, go to browser settings → Privacy & Security → Site Settings</li>
              <li>Find this website and enable camera permissions</li>
              <li>Refresh the page after enabling permissions</li>
            </ol>
          </div>

          <div className="flex space-x-3">
            <Button onClick={onRetry} variant="outline" size="sm">
              <Camera className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={refreshPage} variant="default" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}