import { z } from "zod";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { MoveLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { PasswordInput } from "@/components/ui/password-input";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { REGEXP_ONLY_DIGITS } from "input-otp";

import api from "@/api/api";

import Button from "@/components/ui/button";

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const tk = searchParams.get("tk");
  const success = searchParams.get("success");

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      {success && email && tk ? (
        <ResetPasswordSuccess />
      ) : email && tk ? (
        <ResetPasswordForm />
      ) : email ? (
        <ConfirmEmailForm />
      ) : (
        <ForgotPasswordForm />
      )}
    </main>
  );
};

export default ForgotPassword;

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ForgotPasswordForm = () => {
  const [, setSearchParams] = useSearchParams();
  // const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (email) => {
      const response = await api.post("/auth/forgot-password", {
        email,
      });

      return response;
    },
    onSuccess: (response, value) => {
      toast.success(response?.message || "An OTP has been sent to your email!");
      setSearchParams((prev) => {
        prev.set("email", value);
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
    schema: forgotPasswordSchema,
    defaultValues: {
      email: "",
    },
    validators: {
      onChange: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value.email);
    },
  });

  return (
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
          Forgot Password?
        </h1>
        <p className="text-center">
          No worries. Let's submit password reset. It will be send to your
          email.
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

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={() => (
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
            loading={mutation.isPending}
          >
            Request OTP
          </Button>
        )}
      />

      <Link to="/signin">
        <Button
          type="button"
          className="w-full"
          variant="outline"
          onClick={() => {}}
        >
          <MoveLeft />
          Back to Sign In
        </Button>
      </Link>
    </form>
  );
};

const confirmEmailSchema = z.object({
  code: z
    .string()
    .min(6, "Code must be 6 digits")
    .max(6, "Code must be 6 digits")
    .regex(/^\d+$/, "Code must contain only numbers"),
});

const ConfirmEmailForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const canResend = timeLeft <= 0;

  const mutation = useMutation({
    mutationFn: async ({ email, otp }) => {
      const response = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      return response;
    },
    onSuccess: (response, value) => {
      toast.success(response?.message || "Email confirmed successfully!");
      setSearchParams((prev) => {
        prev.set("tk", value.otp);
        return prev;
      });
    },
    onError: (error) => {
      console.log("Forgot Password Error: ", error);
      const errorMsg = error.response.data.message || "An error occurred";
      toast.error(`Forgot Password Error: ${errorMsg}`);
    },
  });

  const resendMutation = useMutation({
    mutationFn: async (email) => {
      const response = await api.post("/auth/forgot-password", {
        email,
      });

      return response;
    },
    onSuccess: (response) => {
      toast.success(response?.message || "An OTP has been sent to your email!");
      setTimeLeft(300);
    },
    onError: (error) => {
      console.log("Forgot Password Error: ", error);
      const errorMsg = error.response.data.message || "An error occurred";
      toast.error(`Forgot Password Error: ${errorMsg}`);
    },
  });

  const form = useForm({
    defaultValues: {
      code: "",
    },
    validators: {
      onChange: confirmEmailSchema,
    },
    onSubmit: async ({ value }) => {
      mutation.mutate({
        email: searchParams.get("email"),
        otp: value.code,
      });
    },
  });

  // Timer effect
  useEffect(() => {
    // If time has already expired, nothing to start
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResend = async () =>
    resendMutation.mutate(searchParams.get("email"));

  return (
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
          Confirm Your Email
        </h1>
        <p className="text-center">
          Enter your 6-digit code sent to your email in order to confirm your
          email address.
        </p>
      </div>

      <form.Field
        name="code"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field
              data-invalid={isInvalid}
              className="flex flex-col items-center"
            >
              <div className="w-full flex justify-center mb-2">
                <FieldLabel htmlFor="digits-only" className="sr-only">
                  Verification code
                </FieldLabel>
              </div>

              <div className="w-full flex justify-center">
                <InputOTP
                  id="digits-only"
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  onBlur={() => field.handleBlur()}
                  containerClassName="w-full flex justify-center"
                >
                  <InputOTPGroup className="flex gap-4 justify-center">
                    <InputOTPSlot index={0} className="h-14 w-14 text-2xl" />
                    <InputOTPSlot index={1} className="h-14 w-14 text-2xl" />
                    <InputOTPSlot index={2} className="h-14 w-14 text-2xl" />
                    <InputOTPSlot index={3} className="h-14 w-14 text-2xl" />
                    <InputOTPSlot index={4} className="h-14 w-14 text-2xl" />
                    <InputOTPSlot index={5} className="h-14 w-14 text-2xl" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={() => (
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending || resendMutation.isPending}
            loading={mutation.isPending}
          >
            {mutation.isPending ? "Confirming..." : "Confirm"}
          </Button>
        )}
      />

      <div className="flex items-center justify-center gap-2">
        {canResend ? (
          <>
            <p>Didn't receive a code?</p>
            <button
              type="button"
              onClick={handleResend}
              className="text-primary hover:underline"
            >
              Resend
            </button>
          </>
        ) : (
          <>
            <p>Resend code in</p>
            <span className="font-semibold text-primary">
              {formatTime(timeLeft)}
            </span>
          </>
        )}
      </div>
    </form>
  );
};

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

const ResetPasswordForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const mutation = useMutation({
    mutationFn: async ({ email, otp, newPassword }) => {
      const response = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      return response;
    },
    onSuccess: (response) => {
      toast.success(response?.message || "Password reset successfully!");
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
    schema: resetPasswordSchema,
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      mutation.mutate({
        email: searchParams.get("email"),
        otp: searchParams.get("tk"),
        newPassword: value.password,
      });
    },
  });

  return (
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
          Reset Your Password
        </h1>
        <p className="text-center">
          Enter your new password to reset your credentials.
        </p>
      </div>

      {/* Password Field */}
      <form.Field
        name="password"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
              <PasswordInput
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="*************"
                autoComplete="off"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
              <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
              <PasswordInput
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="*************"
                autoComplete="off"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
            Reset Password
          </Button>
        )}
      />
    </form>
  );
};

const ResetPasswordSuccess = () => {
  const navigate = useNavigate();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="w-[90%] max-w-100 space-y-5"
    >
      <div>
        <h1 className="text-primary text-3xl font-bold text-center">
          Password Reset Successful
        </h1>
        <p className="text-center">
          Your password has been reset successfully.
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
    </form>
  );
};
