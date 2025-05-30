import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInDefaultValues } from '@/lib/constants';
import Link from 'next/link';

const CredentialsSignInForm = () => {
  return (
    <form>
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            required
            autoComplete="email"
            defaultValue={signInDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            name="password"
            required
            autoComplete="password"
            defaultValue={signInDefaultValues.password}
          />
        </div>
        <div>
          <Button className="w-full" variant={'default'}>
            Sign In
          </Button>
        </div>
        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account? <Link href={'/sign-up'}>Sign Up</Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
