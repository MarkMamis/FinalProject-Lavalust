import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshUser } = useAuth();
  const [debugOrigin] = useState<string>(typeof window !== 'undefined' ? window.location.origin : '');
  const GOOGLE_CLIENT_ID = '966160341487-0vo684f8u4nfqa4s8prl4n64faspcpo1.apps.googleusercontent.com';
  const [lastGoogleResponse, setLastGoogleResponse] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(email, password);
    
    if (success) {
      toast({
        title: 'Welcome back!',
        description: 'Successfully logged in to PayFlow HR.',
      });
      
      // Refresh user to get the latest role information
      await refreshUser();
      
      // After login, check the user's role and redirect accordingly
      // Note: We need to wait a bit for the context to update
      setTimeout(() => {
        navigate('/');
      }, 100);
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
  };

  // Google Sign-In setup
  useEffect(() => {
    const id = 'google-identity-script';
    if (document.getElementById(id)) return;
    const script = document.createElement('script');
    script.id = id;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      if (window.google && window.google.accounts && window.google.accounts.id) {
        // @ts-ignore
        window.google.accounts.id.initialize({
          client_id: '966160341487-0vo684f8u4nfqa4s8prl4n64faspcpo1.apps.googleusercontent.com',
          callback: handleGoogleCredential
        });
        // @ts-ignore
        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInDiv'),
          { theme: 'outline', size: 'large' }
        );
      }
    };

    return () => {
      const s = document.getElementById(id);
      if (s) s.remove();
    };
  }, []);

    async function handleGoogleCredential(response: any) {
      const id_token = response?.credential;
      if (!id_token) return;

      try {
        const res = await fetch('/api/login/google', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_token })
        });

        // Try to parse JSON body for helpful diagnostics
        let data: any = null;
        try { data = await res.json(); } catch (e) { /* ignore parse errors */ }

        if (!res.ok) {
          console.error('Google login failed', res.status, data);
          setLastGoogleResponse({ status: res.status, body: data });
          toast({ title: 'Google login failed', description: (data && data.detail) ? String(data.detail) : `Server returned ${res.status}` , variant: 'destructive' });
          return;
        }

        if (data && data.success) {
          setLastGoogleResponse({ status: res.status, body: data });
          toast({ title: 'Signed in', description: `Signed in as ${data.user?.email ?? 'unknown'}` });
          // Refresh session state from server and navigate into the app
          try {
            // refreshUser may be sync or async depending on implementation
            await Promise.resolve(refreshUser());
          } catch (e) {
            // ignore refresh errors
          }
          // Redirect to app home after successful sign-in
          try {
            navigate('/');
          } catch (e) {
            // ignore navigation errors
          }
        } else {
          console.error('Unexpected Google login response', data);
          setLastGoogleResponse({ status: res.status, body: data });
          toast({ title: 'Google login failed', description: (data && data.error) ? String(data.error) : 'Unknown error', variant: 'destructive' });
        }
      } catch (err) {
        console.error('Google login error', err);
        toast({ title: 'Network error', description: 'Failed to contact the server for Google login', variant: 'destructive' });
      }
    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <DollarSign className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">PayFlow HR</CardTitle>
          <CardDescription>Sign in to manage your workforce</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertDescription className="text-sm">
              <strong>Demo Accounts:</strong>
              <br />
              Admin: admin@payflow.com / demo123
              <br />
              HR: hr@payflow.com / demo123
              <br />
              Employee: employee@payflow.com / demo123
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@payflow.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <div className="mt-4 flex justify-center">
            <div id="googleSignInDiv"></div>
          </div>
          
        </CardContent>
      </Card>
    </div>
  );
}
