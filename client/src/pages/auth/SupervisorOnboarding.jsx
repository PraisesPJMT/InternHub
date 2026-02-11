import { z } from "zod";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import api from "@/api/api";

import Button from "@/components/ui/button";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const SupervisorOnboarding = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const email = searchParams.get("email") ?? undefined;
  const tk = searchParams.get("tk") ?? undefined;
  const success = searchParams.get("success") ?? undefined;

  const mutation = useMutation({
    mutationFn: async ({ token, password }) => {
      const response = await api.post("/auth/onboarding/supervisor", {
        token,
        password,
      });

      return response;
    },
    onSuccess: (response) => {
      toast.success(response?.message || "Password set successfully!");
      setSearchParams((prev) => {
        prev.set("success", "true");
        return prev;
      });
    },
    onError: (error) => {
      console.log("Forgot Password Error: ", error);
      const errorMsg = error.response.data.message || "An error occurred";
      toast.error(`Forgot Password Error: ${errorMsg}`);
    },
  });

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      mutation.mutate({
        token: tk,
        password: value.password,
      });
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
        {success && email && tk ? (
          <>
            <div>
              <h1 className="text-primary text-3xl font-bold text-center">
                Password Set Successful
              </h1>
              <p className="text-center">
                Your password has been set successfully.
                <br />
                You can now proceed to sign in.
              </p>
            </div>

            <div className="my-10 flex items-center justify-center text-green-500">
              <Icon icon="icon-park-solid:success" className="w-30 h-30" />
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={() => navigate("/signin")}
            >
              Go to Sign In
            </Button>
          </>
        ) : email && tk ? (
          <>
            <div>
              <h1 className="text-primary text-3xl font-bold text-center">
                Set Your Password
              </h1>
              <p className="text-center">
                Enter your password to set your credentials.
              </p>
              <p className="text-center font-bold">{email}</p>
            </div>

            {/* Password Field */}
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="*************"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Confirm Password Field */}
            <form.Field
              name="confirmPassword"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="*************"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={() => (
                <Button
                  // loading
                  type="submit"
                  className="w-full"
                  disabled={mutation.isPending}
                  loading={mutation.isPending}
                >
                  Set Password
                </Button>
              )}
            />
          </>
        ) : (
          <>
            <div>
              <h1 className="text-primary text-3xl font-bold text-center">
                Warning
              </h1>
              <p className="text-center">
                You do not have access to this page.
              </p>
            </div>

            <div className="my-10 flex items-center justify-center text-red-500">
              <Icon icon="ph:seal-warning-fill" className="w-30 h-30" />
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={() => navigate("/signin")}
            >
              Go to Sign In
            </Button>
          </>
        )}
      </form>
    </main>
  );
};

export default SupervisorOnboarding;
