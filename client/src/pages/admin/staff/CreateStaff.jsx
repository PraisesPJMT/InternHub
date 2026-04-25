import { z } from "zod";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";
import { useForm, useStore } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { PhoneInput } from "@/components/ui/phone-input";

// Separate schemas for each step
const supervisorSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
  facultyId: z.string().min(1, "Please select a faculty"),
  departmentId: z.string().min(1, "Please select a program"),
  // role: z.string().min(1, "Please select a role"),
});

const CreateStaff = () => {
  const [step, setStep] = useState(0);
  const [staff, setStaff] = useState({});
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data) => {
      // Create supervisor via backend
      // the `api` client may unwrap response.data; return whatever it gives and normalize in onSuccess
      const res = await api.post("/supervisors", data);
      return res;
    },
    onSuccess: (res) => {
      // normalize backend shape: could be { success, message, data } or the data object directly
      const payload = res?.data ?? res ?? {};
      const created = payload?.data ?? payload;
      const message =
        payload?.message ?? "Supervisor created. Onboarding email sent.";
      toast.success(message);
      setStaff(created || {});
      setStep(1);
    },
    onError: (error) => {
      console.error("Create Supervisor Error:", error?.response ?? error);
      const errorMsg =
        (error?.response &&
          error.response.data &&
          error.response.data.message) ||
        error?.message ||
        "An error occurred";
      toast.error(`Failed to create supervisor. ${errorMsg}`);
    },
  });

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      facultyId: "",
      departmentId: "",
      // role: "",
    },
    validators: {
      onChange: supervisorSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Value: ", value);
      mutation.mutate(value);
    },
  });

  const onClose = () => {
    form.reset();
    navigate(location.pathname.replace("/new", ""));
  };

  const selectedFaculty = useStore(
    form.store,
    (state) => state.values.facultyId,
  );

  // Load faculties for the faculty select. Normalize response shapes.
  useQuery({
    queryKey: ["faculties"],
    queryFn: async () => {
      const res = await api.get("/faculties");
      // API client may return either the unwrapped data array or an object { success, data }
      const payload = res && res.success ? res.data : (res?.data ?? res ?? []);
      const list = Array.isArray(payload) ? payload : (payload?.data ?? []);
      const items = Array.isArray(list) ? list : [];
      setFacultyOptions(
        items.map((faculty) => ({
          label: faculty.name,
          value: faculty.id,
        })),
      );
      return items;
    },
  });

  // Load departments for the selected faculty. Normalize shapes and set options.
  useQuery({
    queryKey: ["departments", selectedFaculty],
    queryFn: async () => {
      const res = await api.get("/departments", {
        params: {
          facultyId: selectedFaculty,
        },
      });
      const payload = res && res.success ? res.data : (res?.data ?? res ?? []);
      const list = Array.isArray(payload) ? payload : (payload?.data ?? []);
      const items = Array.isArray(list) ? list : [];
      setDepartmentOptions(
        items.map((department) => ({
          label: department.name,
          value: department.id,
        })),
      );
      return items;
    },
    enabled: !!selectedFaculty,
  });

  return (
    <main className="w-screen h-screen fixed top-0 left-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="p-5 rounded-xl bg-white w-[90%] max-w-100 m-auto space-y-5"
      >
        {step < 1 ? (
          <>
            <div className="flex justify-between gap-4">
              <div>
                <h1 className="text-primary text-xl md:text-2xl font-bold">
                  Onboard Staff
                </h1>
                {/* <p className="text-gray-500">
                  Set up a faculty account to manage your department's interns.
                </p>*/}
              </div>

              <button
                type="button"
                title="Close dialog"
                onClick={() => onClose()}
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
                      <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
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
                      <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4">
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
                            <SelectItem key={option.value} value={option.value}>
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
                            <SelectItem key={option.value} value={option.value}>
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

            <div className="flex items-center justify-end gap-5">
              <Button
                type="button"
                className=""
                variant="outline"
                disabled={mutation.isLoading}
                onClick={onClose}
              >
                Close
              </Button>

              <form.Subscribe
                selector={(state) => state.isSubmitting}
                children={() => (
                  <Button
                    type="submit"
                    className=""
                    disabled={mutation.isLoading}
                    loading={mutation.isLoading}
                  >
                    Create
                  </Button>
                )}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <h1 className="text-primary text-3xl font-bold text-center">
                Staff Created Successfully
              </h1>
              <p className="text-center">
                The staff has been created successfully.
                <br />
                Staff can now proceed to to complete their onboarding process
                via email.
              </p>
            </div>

            <div className="my-10 flex items-center justify-center text-green-500">
              <Icon icon="icon-park-solid:success" className="w-30 h-30" />
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={() =>
                navigate(location.pathname.replace("/new"), staff.id)
              }
            >
              View Staff
            </Button>
          </>
        )}
      </form>
    </main>
  );
};

export default CreateStaff;
