"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Music, Mic, Guitar, Piano, Drum, AudioLines } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { login } from './actions';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const errorMessage = await login(formData);
      if (errorMessage) {
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: errorMessage,
        });
        setLoading(false);
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
       if (err.message !== 'NEXT_REDIRECT') {
          setError('An unexpected error occurred.');
           toast({
            variant: "destructive",
            title: "Login Failed",
            description: 'An unexpected error occurred.',
          });
          setLoading(false);
       }
    }
  };

 const floatingInstruments = [
    { icon: <Music className="text-white neon-glow" />, size: 'w-16 h-16', top: '10%', left: '15%', animation: 'animate-float-1' },
    { icon: <Mic className="text-white neon-glow" />, size: 'w-12 h-12', top: '70%', left: '5%', animation: 'animate-float-2' },
    { icon: <Guitar className="text-white neon-glow" />, size: 'w-20 h-20', top: '25%', left: '80%', animation: 'animate-float-3' },
    { icon: <Piano className="text-white neon-glow" />, size: 'w-8 h-8', top: '80%', left: '90%', animation: 'animate-float-1' },
    { icon: <Drum className="text-white neon-glow" />, size: 'w-10 h-10', top: '50%', left: '45%', animation: 'animate-float-2' },
    { icon: <AudioLines className="text-white neon-glow" />, size: 'w-14 h-14', top: '5%', left: '50%', animation: 'animate-float-3' },
    { icon: <Guitar className="text-white neon-glow" />, size: 'w-18 h-18', top: '60%', left: '70%', animation: 'animate-float-1' },
    { icon: <Mic className="text-white neon-glow" />, size: 'w-16 h-16', top: '90%', left: '25%', animation: 'animate-float-2' },
    { icon: <Music className="text-white neon-glow" />, size: 'w-10 h-10', top: '15%', left: '5%', animation: 'animate-float-3' },
  ];

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background p-4">
      {isMounted && floatingInstruments.map((item, index) => (
        <div key={index} className={`absolute ${item.size} ${item.animation} opacity-50`} style={{ top: item.top, left: item.left, zIndex: 0 }}>
          <div className="transition-transform duration-500 hover:scale-125 hover:rotate-12">{item.icon}</div>
        </div>
      ))}
      
      <Card className="w-full max-w-sm z-10 border-primary/20 bg-card/60 backdrop-blur-[2px] shadow-2xl shadow-primary/10">
        <form onSubmit={handleLogin}>
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl text-primary">Stagehand</CardTitle>
            <CardDescription>Enter your credentials to manage your music.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="gandharva"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>
             {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
