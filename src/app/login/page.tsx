'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { login } from './actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} type="submit" className="w-full">
      {pending ? 'Logging in...' : 'Login'}
    </Button>
  );
}

export default function LoginPage() {
  const [state, action] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="admin123"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
            <LoginButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
