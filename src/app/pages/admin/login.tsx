import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { signIn, signUp } from "../../lib/auth";
import { Lock } from "lucide-react";

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, name);
        setSuccess('Account created successfully! You can now sign in below.');
        setIsSignUp(false);
        setPassword(''); // Clear password for security
      } else {
        await signIn(email, password);
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      if (err.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. If you haven\'t created an account yet, click "Sign up" below.');
      } else {
        setError(err.message || `Failed to ${isSignUp ? 'sign up' : 'sign in'}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-180px)] items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md border-neutral-800 bg-neutral-900/50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-purple-500/10 p-3 w-fit">
            <Lock className="size-6 text-purple-400" />
          </div>
          <CardTitle className="text-2xl text-white">
            {isSignUp ? 'Create Admin Account' : 'Admin Login'}
          </CardTitle>
          <CardDescription>
            {isSignUp ? 'Create your admin account to manage content' : 'Sign in to manage your content'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSignUp && !success && (
            <div className="mb-4 rounded-lg bg-blue-950/50 border border-blue-900 p-3 text-sm text-blue-400">
              <strong>First time?</strong> Click "Sign up" below to create your admin account.
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-lg bg-green-950/50 border border-green-900 p-3 text-sm text-green-400">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-neutral-300">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-neutral-800 border-neutral-700 text-white"
                  placeholder="Your Name"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-neutral-800 border-neutral-700 text-white"
                placeholder="your@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-neutral-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-neutral-800 border-neutral-700 text-white"
                placeholder="••••••••"
              />
              {isSignUp && (
                <p className="text-xs text-neutral-500">Minimum 6 characters</p>
              )}
            </div>
            {error && (
              <div className="rounded-lg bg-red-950/50 border border-red-900 p-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (isSignUp ? 'Creating Account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setSuccess('');
              }}
              className="w-full text-sm text-neutral-400 hover:text-purple-400 transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}