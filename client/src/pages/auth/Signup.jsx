import { z } from "zod";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { useDispatch } from "react-redux";
import { Fragment, useState } from "react";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import { login } from "@/store/slice/auth/authSlice";
import { useForm, useStore } from "@tanstack/react-form";
import { PhoneInput } from "@/components/ui/phone-input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PasswordInput } from "@/components/ui/password-input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import api from "@/api/api";

import Button from "@/components/ui/button";

// Separate schemas for each step
const step1Schema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
});

const step2Schema = z.object({
  facultyId: z.string().min(1, "Please select a faculty"),
  departmentId: z.string().min(1, "Please select a program"),
  studentNumber: z.string().min(8, "Student ID must be at least 8 characters"),
  matricNumber: z
    .string()
    .min(8, "Matric number must be at least 8 characters"),
});

const step3Schema = z
  .object({
    email: z.string().email("Invalid email address"),
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
// Combined schema for final validation
const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    studentNumber: z
      .string()
      .min(8, "Student ID must be at least 8 characters"),
    matricNumber: z
      .string()
      .min(8, "Matric number must be at least 8 characters"),
    facultyId: z.string().min(1, "Please select a faculty"),
    departmentId: z.string().min(1, "Please select a program"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Signup = () => {
  const [step, setStep] = useState(1);
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/auth/signup/student", data);

      return response.data;
    },
    onSuccess: (response) => {
      toast.success("Signup successful!");
      // window.location.href = "/dashboard";
      console.log("Signup Response: ", response);
      setStep(4);
      dispatch(
        login({
          user: response.user,
          accessToken: response.tokens.accessToken,
          refreshToken: response.tokens.refreshToken,
        }),
      );
      
    },
    onError: (error) => {
      console.log("Signup Error: ", error.response);
      const errorMsg = error.response.data.message || "An error occurred";
      toast.error(`Signup failed. ${errorMsg}`);
    },
  });

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      studentNumber: "",
      matricNumber: "",
      facultyId: "",
      departmentId: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange:
        step === 1 ? step1Schema : step === 2 ? step2Schema : step3Schema,
    },
    onSubmit: async ({ value }) => {
      console.log("Value: ", value);
      // Validate current step
      const isValid = validateCurrentStep();
      if (!isValid) {
        toast.error("Please fill in all required fields correctly");
        return;
      }

      if (step === 3) {
        registerSchema.parse(form.state.values);
        console.log("Value: ", value);
        mutation.mutate(value);
      } else {
        // Move to next step
        setStep(step + 1);
      }
    },
  });

  const selectedFaculty = useStore(
    form.store,
    (state) => state.values.facultyId,
  );

  // const { data: faculties } = useQuery({
  useQuery({
    queryKey: ["faculties"],
    queryFn: async () => {
      const response = await api.get("/faculties");
      console.log("Faculties: ", response);
      setFacultyOptions(
        response.data.map((faculty) => ({
          label: faculty.name,
          value: faculty.id,
        })),
      );
      return response.data;
    },
  });

  // const { data: departments } = useQuery({
  useQuery({
    queryKey: ["departments", selectedFaculty],
    queryFn: async () => {
      const response = await api.get("/departments", {
        params: {
          facultyId: selectedFaculty,
        },
      });
      console.log("Departments: ", response);
      setDepartmentOptions(
        response.data.map((department) => ({
          label: department.name,
          value: department.id,
        })),
      );
      return response.data;
    },
    enabled: !!selectedFaculty,
  });

  const validateCurrentStep = () => {
    const values = form.state.values;

    try {
      if (step === 1) {
        step1Schema.parse({
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
        });
      } else if (step === 2) {
        step2Schema.parse({
          facultyId: values.facultyId,
          departmentId: values.departmentId,
          studentNumber: values.studentNumber,
          matricNumber: values.matricNumber,
        });
      } else if (step === 3) {
        step3Schema.parse({
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        });
        // Check password match
        if (values.password !== values.confirmPassword) {
          form.setFieldMeta("confirmPassword", (prev) => ({
            ...prev,
            errors: ["Passwords do not match"],
          }));
          return false;
        }
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Set errors on fields
        error.errors.forEach((err) => {
          const fieldName = err.path[0];
          if (fieldName) {
            form.setFieldMeta(fieldName, (prev) => ({
              ...prev,
              errors: [err.message],
              isTouched: true,
            }));
          }
        });
      }
      return false;
    }
  };

  // const facultyOptions = [
  //   "Faculty of Science",
  //   "Faculty of Engineering",
  //   "Faculty of Business",
  //   "Faculty of Arts",
  // ];

  // const programOptions = [
  //   "Computer Science",
  //   "Electrical Engineering",
  //   "Business Administration",
  //   "Psychology",
  // ];

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
        {step < 4 ? (
          <>
            <div>
              <h1 className="text-primary text-3xl font-bold text-center">
                Sign Up For Your Account
              </h1>
              <p className="text-center">
                Begin your internship program by signing up
              </p>
              <p className="text-center font-medium">(Students Only)</p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: 3 }).map((_, i) => {
                const stepNumber = i + 1;
                const isCompleted = stepNumber < step;
                const isActive = stepNumber === step;

                return (
                  <Fragment key={i}>
                    <button
                      type="button"
                      disabled={!isCompleted}
                      onClick={() => {
                        if (isCompleted) {
                          setStep(stepNumber);
                        }
                      }}
                      style={{
                        backgroundColor: isActive
                          ? "oklch(57.58% 0.221 275.63)" // Vibrant Purple (#625bf8)
                          : isCompleted
                            ? "oklch(57.58% 0.221 275.63)" // Deep Navy (#01112c)
                            : "oklch(92.21% 0.0215 271.74)", // Light Pastel (#e6e7f9)
                        color:
                          isCompleted || isActive
                            ? "white"
                            : "oklch(57.58% 0.221 275.63)",
                      }}
                      className="w-8 h-8 cursor-pointer rounded-full flex items-center justify-center transition-colors duration-200 text-sm font-medium disabled:cursor-default"
                    >
                      {isCompleted ? "✓" : stepNumber}
                    </button>

                    {i < 2 && (
                      <div
                        className="h-1 w-[15%] rounded-lg transition-colors duration-300"
                        style={{
                          backgroundColor: isCompleted
                            ? "oklch(57.58% 0.221 275.63)"
                            : "oklch(92.21% 0.0215 271.74)",
                        }}
                      />
                    )}
                  </Fragment>
                );
              })}
            </div>

            {/* Step 1: Personal Information */}
            {step === 1 && (
              <>
                <div className="flex items-end gap-2">
                  <h2 className="text-primary text-center whitespace-nowrap">
                    Personal Information
                  </h2>
                  <hr className="w-full border-primary" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4">
                  {/* First Name Field */}
                  <form.Field
                    name="firstName"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            First Name
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="John"
                            autoComplete="given-name"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />

                  {/* Last Name Field */}
                  <form.Field
                    name="lastName"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Last Name
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="Doe"
                            autoComplete="family-name"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </div>

                {/* Phone Field */}
                <form.Field
                  name="phone"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                        <PhoneInput
                          id={field.name}
                          name={field.name}
                          type="tel"
                          value={field.state.value}
                          onBlur={() => field.handleBlur()}
                          onChange={(value) => field.handleChange(value)}
                          aria-invalid={isInvalid}
                          placeholder="+2348000000000"
                          autoComplete="tel"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </>
            )}

            {/* Step 2: Program Information */}
            {step === 2 && (
              <>
                <div className="flex items-end gap-2">
                  <h2 className="text-primary text-center whitespace-nowrap">
                    Program Information
                  </h2>
                  <hr className="w-full border-primary" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4">
                  {/* Faculty Select Field */}
                  <form.Field
                    name="facultyId"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Faculty</FieldLabel>
                          <Select
                            name={field.name}
                            value={field.state.value}
                            onValueChange={(value) => {
                              field.handleChange(value);
                              field.setMeta((prev) => ({
                                ...prev,
                                isTouched: true,
                              }));
                            }}
                          >
                            <SelectTrigger
                              id={field.name}
                              aria-invalid={isInvalid}
                              onBlur={field.handleBlur}
                            >
                              <SelectValue placeholder="Select Faculty" />
                            </SelectTrigger>
                            <SelectContent>
                              {facultyOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />

                  {/* Program Select Field */}
                  <form.Field
                    name="departmentId"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Program</FieldLabel>
                          <Select
                            name={field.name}
                            value={field.state.value}
                            onValueChange={(value) => {
                              field.handleChange(value);
                              field.setMeta((prev) => ({
                                ...prev,
                                isTouched: true,
                              }));
                            }}
                          >
                            <SelectTrigger
                              id={field.name}
                              aria-invalid={isInvalid}
                              onBlur={field.handleBlur}
                            >
                              <SelectValue placeholder="Select Program" />
                            </SelectTrigger>
                            <SelectContent>
                              {departmentOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4">
                  {/* Student ID Field */}
                  <form.Field
                    name="studentNumber"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Student ID
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="12345678"
                            autoComplete="off"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />

                  {/* Matriculation Number Field */}
                  <form.Field
                    name="matricNumber"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Matriculation Number
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="202X/X/XXXX"
                            autoComplete="off"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </div>
              </>
            )}

            {/* Step 3: Account Credentials */}
            {step === 3 && (
              <>
                <div className="flex items-end gap-2">
                  <h2 className="text-primary text-center whitespace-nowrap">
                    Account Credentials
                  </h2>
                  <hr className="w-full border-primary" />
                </div>

                {/* Email Field */}
                <form.Field
                  name="email"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="example@email.com"
                          autoComplete="email"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                {/* Password Field */}
                <form.Field
                  name="password"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0;
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
                          autoComplete="new-password"
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
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Confirm Password
                        </FieldLabel>
                        <PasswordInput
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="*************"
                          autoComplete="new-password"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </>
            )}

            <form.Subscribe
              selector={(state) => state.isSubmitting}
              children={() => (
                <Button
                  type="submit"
                  className="w-full"
                  disabled={mutation.isPending}
                  loading={mutation.isPending}
                >
                  {step < 3 ? "Continue" : "Sign Up"}
                </Button>
              )}
            />

            <div className="flex items-center justify-center gap-2">
              <p>Already have an account?</p>
              <Link to="/signin" className="text-primary hover:underline">
                Sign In
              </Link>
            </div>
          </>
        ) : (
          <>
            <div>
              <h1 className="text-primary text-3xl font-bold text-center">
                Sign Up Successful
              </h1>
              <p className="text-center">
                Your account has been created successfully.
                <br />
                You can now begin your internship program.
              </p>
            </div>

            <div className="my-10 flex items-center justify-center text-green-500">
              <Icon icon="icon-park-solid:success" className="w-30 h-30" />
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Go to Dashboard
            </Button>
          </>
        )}
      </form>
    </main>
  );
};

export default Signup;
