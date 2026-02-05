"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { validateEmail, validatePassword } from "@/lib/validations";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    const emailError = validateEmail(email);
    if (emailError) {
      errors.email = emailError.message;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      errors.password = passwordError.message;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        // Generic error message to prevent user enumeration (FR-015)
        setError("Invalid email or password");
        return;
      }

      // Redirect to tasks page on successful sign in
      router.push("/tasks");
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (fieldErrors.email) {
            setFieldErrors((prev) => ({ ...prev, email: "" }));
          }
        }}
        placeholder="you@example.com"
        error={fieldErrors.email}
        autoComplete="email"
        required
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (fieldErrors.password) {
            setFieldErrors((prev) => ({ ...prev, password: "" }));
          }
        }}
        placeholder="Your password"
        error={fieldErrors.password}
        autoComplete="current-password"
        required
      />

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Sign In
      </Button>
    </form>
  );
}
