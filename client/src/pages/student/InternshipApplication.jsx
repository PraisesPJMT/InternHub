import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { Fragment } from "react";
import { useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { PhoneInput } from "@/components/ui/phone-input";

const InternshipApplication = () => {
  const [step, setStep] = useState(1);

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
    // validators: {
    //   onChange:
    //     step === 1 ? step1Schema : step === 2 ? step2Schema : step3Schema,
    // },
    onSubmit: async ({ value }) => {
      setStep(step + 1);
      // console.log("Value: ", value);
      // Validate current step
      // const isValid = validateCurrentStep();
      // if (!isValid) {
      //   toast.error("Please fill in all required fields correctly");
      //   return;
      // }

      // if (step === 4) {
      //   registerSchema.parse(form.state.values);
      //   console.log("Value: ", value);
      //   mutation.mutate(value);
      // } else {
      //   // Move to next step
      //   setStep(step + 1);
      // }
    },
  });

  // const validateCurrentStep = () => {
  //   const values = form.state.values;

  //   try {
  //     if (step === 1) {
  //       step1Schema.parse({
  //         firstName: values.firstName,
  //         lastName: values.lastName,
  //         phone: values.phone,
  //       });
  //     } else if (step === 2) {
  //       step2Schema.parse({
  //         facultyId: values.facultyId,
  //         departmentId: values.departmentId,
  //         studentNumber: values.studentNumber,
  //         matricNumber: values.matricNumber,
  //       });
  //     } else if (step === 3) {
  //       step3Schema.parse({
  //         email: values.email,
  //         password: values.password,
  //         confirmPassword: values.confirmPassword,
  //       });
  //       // Check password match
  //       if (values.password !== values.confirmPassword) {
  //         form.setFieldMeta("confirmPassword", (prev) => ({
  //           ...prev,
  //           errors: ["Passwords do not match"],
  //         }));
  //         return false;
  //       }
  //     }
  //     return true;
  //   } catch (error) {
  //     if (error instanceof z.ZodError) {
  //       // Set errors on fields
  //       error.errors.forEach((err) => {
  //         const fieldName = err.path[0];
  //         if (fieldName) {
  //           form.setFieldMeta(fieldName, (prev) => ({
  //             ...prev,
  //             errors: [err.message],
  //             isTouched: true,
  //           }));
  //         }
  //       });
  //     }
  //     return false;
  //   }
  // };

  return (
    <main className="w-screen h-screen fixed top-0 left-0 bg-black/50 flex items-center justify-center z-50">
      <form className="p-5 rounded-xl bg-white w-[90%] max-w-100 m-auto space-y-5">
        {step < 5 ? (
          <>
            <div className="flex justify-between gap-4">
              <div>
                <h1 className="text-primary text-xl md:text-2xl font-bold">
                  Register Your Internship
                </h1>
                {/* <p className="text-gray-500">
                  Set up a faculty account to manage your department's interns.
                </p>*/}
              </div>

              <button
                type="button"
                title="Close dialog"
                // onClick={() => onClose()}
                className="h-fit aspect-square border rounded-full p-2 cursor-pointer hover:text-red-400 hover:border-red-400 hover:rotate-90 transition-all duration-300 ease-in-out"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: 4 }).map((_, i) => {
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

            {/* Step 2: Organisation Information */}
            {step === 2 && (
              <>
                <div className="flex items-end gap-2">
                  <h2 className="text-primary text-center whitespace-nowrap">
                    Organisation Information
                  </h2>
                  <hr className="w-full border-primary" />
                </div>
              </>
            )}

            {/* Step 3: Supervisor Information */}
            {step === 3 && (
              <>
                <div className="flex items-end gap-2">
                  <h2 className="text-primary text-center whitespace-nowrap">
                    Supervisor Information
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
              </>
            )}

            <div>
              <Button
                type="submit"
                variant="secondary"
                // className="w-full"
                // disabled={mutation.isPending}
                // loading={mutation.isPending}
              >
                Cancel
              </Button>

              <form.Subscribe
                selector={(state) => state.isSubmitting}
                children={() => (
                  <Button
                    type="submit"
                    // className="w-full"
                    // disabled={mutation.isPending}
                    // loading={mutation.isPending}
                  >
                    {step < 3 ? "Continue" : "Sign Up"}
                  </Button>
                )}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <h1 className="text-primary text-3xl font-bold text-center">
                Registration Successful
              </h1>
              <p className="text-center">
                Your internship application has been submitted successfully.
                <br />
                You will be notified via email when your application is
                reviewed.
              </p>
            </div>

            <div className="my-10 flex items-center justify-center text-green-500">
              <Icon icon="icon-park-solid:success" className="w-30 h-30" />
            </div>

            <Button
              type="button"
              className="w-full"
              // onClick={() => navigate("/")}
            >
              Go to Dashboard
            </Button>
          </>
        )}
      </form>
    </main>
  );
};

export default InternshipApplication;
