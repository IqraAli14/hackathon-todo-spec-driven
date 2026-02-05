import Link from "next/link";
import { SignInForm } from "@/components/auth/SignInForm";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <h1 className="text-center text-2xl font-bold text-gray-900">
              Sign in to your account
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              Welcome back! Please enter your details.
            </p>
          </CardHeader>
          <CardContent>
            <SignInForm />
            <p className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
