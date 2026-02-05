import Link from "next/link";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <h1 className="text-center text-2xl font-bold text-gray-900">
              Create your account
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              Start managing your tasks today
            </p>
          </CardHeader>
          <CardContent>
            <SignUpForm />
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
