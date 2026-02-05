"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { validateEmail, validatePassword } from "@/lib/validations";

export function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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
      const result = await signUp.email({
        email,
        password,
        name: name || undefined,
      });

      if (result.error) {
        if (result.error.message?.includes("already exists")) {
          setError("An account with this email already exists");
        } else {
          setError(result.error.message || "Registration failed");
        }
        return;
      }

      // Auto-redirect to tasks page on successful registration
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
        label="Name (optional)"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="John Doe"
        autoComplete="name"
      />

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
        placeholder="At least 8 characters"
        error={fieldErrors.password}
        autoComplete="new-password"
        required
      />

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Create Account
      </Button>
    </form>
  );
}
