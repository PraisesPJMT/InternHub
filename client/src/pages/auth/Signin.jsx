import { z } from "zod";
import { toast } from "sonner";
import { Link } from "react-router";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { PasswordInput } from "@/components/ui/password-input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import Button from "@/components/ui/button";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const Signin = () => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error);
          return;
        }

        toast.success("Login successful!");
        window.location.href = "/dashboard";
      } catch (error) {
        const errorMsg = error.message || "An error occurred";
        toast.error(`Login failed. ${errorMsg}`);
      }
    },
  });

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="w-[90%] max-w-100 space-y-5"
      >
        <div>
          <h1 className="text-primary text-3xl font-bold text-center">
            Sign In To Your Account
          </h1>
          <p className="text-center">
            Let's sign you in to your account to get started
          </p>
        </div>

        {/* Email Field */}
        <form.Field
          name="email"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="example@email.com"
                  // autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <div className="space-y-2">
          {/* Password Field */}
          <form.Field
            name="password"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <PasswordInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="*************"
                    // autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <Link
            to="/forgot-password"
            className="block text-right text-primary hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit]) => (
            <Button
              // loading
              type="submit"
              className="w-full"
              disabled={!canSubmit}
            >
              Sign In
            </Button>
          )}
        />

        <div className="flex items-center justify-center gap-2 ">
          <p>Don't have an account?</p>
          <Link to="/signup" className="text-primary hover:underline">
            Sign Up
          </Link>
        </div>

        <Button
          type="button"
          className="w-full"
          variant="outline"
          onClick={() => {}}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="48px"
            height="48px"
          >
            <path
              fill="#fbc02d"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#e53935"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4caf50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
              fill="#1565c0"
              d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C40.486,35.33,44,30.074,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
          Sign In With Google
        </Button>
      </form>
    </main>
  );
};

export default Signin;
