import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GraduationCap, Accessibility, Globe } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full bg-gradient-hero shadow-elevated">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
              <Accessibility className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              SignSync AI
            </h1>
          </div>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Breaking barriers between hearing and sign language communities through 
            AI-powered real-time translation
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Card className="p-4 bg-white/10 backdrop-blur border-white/20">
              <div className="flex items-center space-x-2 text-white">
                <Globe className="h-5 w-5" />
                <span className="font-medium">Multi-language Support</span>
              </div>
            </Card>
            
            <Card className="p-4 bg-white/10 backdrop-blur border-white/20">
              <div className="flex items-center space-x-2 text-white">
                <GraduationCap className="h-5 w-5" />
                <span className="font-medium">ISL Learning Mode</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </header>
  );
}