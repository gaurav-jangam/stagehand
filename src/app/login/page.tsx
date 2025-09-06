"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { login } from './actions';
import { FloatingInstruments } from '@/components/floating-instruments';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen w-full bg-background">
      <FloatingInstruments />
      <div className="relative flex h-screen w-full items-center justify-center p-4">
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
    </div>
  );
}
