import { useEffect, useRef, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { MoveLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
  const { email, tk } = Route.useSearch()

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      {email && tk ? (
        <ResetPasswordForm />
      ) : email ? (
        <ConfirmEmailForm />
      ) : (
        <ForgotPasswordForm />
      )}
    </main>
  )
}

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const ForgotPasswordForm = () => {
  const navigate = useNavigate({ from: Route.fullPath })

  const form = useForm({
    schema: forgotPasswordSchema,
    defaultValues: {
      email: '',
    },
    validators: {
      onChange: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      toast.success('Verification email sent successfully')
      navigate({
        search: (prev) => ({ ...prev, email: value.email }),
        replace: true,
      })
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
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
            field.state.meta.isTouched && !field.state.meta.isValid
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
                autoComplete="off"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button
            // loading
            type="submit"
            className="w-full"
            disabled={!canSubmit}
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
  )
}

const confirmEmailSchema = z.object({
  code: z
    .string()
    .min(6, 'Code must be 6 digits')
    .max(6, 'Code must be 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers'),
})

const ConfirmEmailForm = () => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false)

  const navigate = useNavigate({ from: Route.fullPath })

  const form = useForm({
    defaultValues: {
      code: '',
    },
    validators: {
      onChange: confirmEmailSchema,
    },
    onSubmit: async ({ value }) => {
      toast.success('Email confirmed successfully')
      navigate({
        search: (prev) => ({ ...prev, tk: value.code }),
        replace: true,
      })
    },
  })

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleResend = () => {
    // Add your resend logic here
    toast.success('Code resent!')
    setTimeLeft(300) // Reset to 5 minutes
    setCanResend(false)
  }

  const handleInputChange = (index: number, value: string) => {
    const currentCode = form.getFieldValue('code') || ''
    const codeArray = currentCode.padEnd(6, ' ').split('')

    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1)
    }

    // Only allow numbers
    if (value && !/^\d$/.test(value)) {
      return
    }

    codeArray[index] = value || ' '
    const newCode = codeArray.join('').replace(/ /g, '')

    form.setFieldValue('code', newCode)

    // Move to next input if value entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      const currentCode = form.getFieldValue('code') || ''
      const codeArray = currentCode.padEnd(6, ' ').split('')

      if (!codeArray[index] || codeArray[index] === ' ') {
        // If current input is empty, move to previous input
        if (index > 0) {
          inputRefs.current[index - 1]?.focus()
        }
      } else {
        // Clear current input
        codeArray[index] = ' '
        const newCode = codeArray.join('').replace(/ /g, '')
        form.setFieldValue('code', newCode)
      }
    }
    // Handle left/right arrow keys
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)

    if (pastedData) {
      form.setFieldValue('code', pastedData)

      // Focus the last filled input or the first empty one
      const focusIndex = Math.min(pastedData.length, 5)
      setTimeout(() => {
        inputRefs.current[focusIndex]?.focus()
      }, 0)
    }
  }

  const getInputValue = (index: number) => {
    const code = form.getFieldValue('code') || ''
    return code[index] || ''
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
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

      {/* Code Input Fields */}
      <form.Field
        name="code"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid

          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor="code-0" className="sr-only">
                Verification Code
              </FieldLabel>
              <div className="grid grid-cols-6 gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <Input
                    key={index}
                    id={`code-${index}`}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={getInputValue(index)}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                    className="min-h-14 text-center text-lg font-semibold"
                    autoComplete="off"
                  />
                ))}
              </div>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            className="w-full"
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? 'Confirming...' : 'Confirm'}
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
  )
}

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
})

const ResetPasswordForm = () => {
  const form = useForm({
    schema: resetPasswordSchema,
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    validators: {
      onChange: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      toast.success('Form submitted successfully')
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
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
            field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
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
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      />

      {/* Confirm Password Field */}
      <form.Field
        name="confirmPassword"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
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
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button
            // loading
            type="submit"
            className="w-full"
            disabled={!canSubmit}
          >
            Reset Password
          </Button>
        )}
      />
    </form>
  )
}
