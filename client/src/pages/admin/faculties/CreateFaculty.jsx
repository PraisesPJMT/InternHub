import { z } from "zod";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import api from "@/api/api";

import Button from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Separate schemas for each step
const facultySchema = z.object({
  name: z.string().min(3, "Faculty name must be at least 3 characters"),
  code: z.string().min(2, "Faculty code must be at least 2 characters").max(50),
  description: z.string().optional(),
});

const CreateFaculty = () => {
  const [step, setStep] = useState(0);
  const [faculty, setFaculty] = useState({});

  const navigate = useNavigate();
  const queryClient = useQueryClient()

  const mutation = useMutation({
    // Call the real faculty creation endpoint
    mutationFn: async (data) => {
      const response = await api.post("/faculties", data);
      return response;
    },
    onSuccess: (res) => {
      // response is already unwrapped by api interceptor (api returns response.data)
      const message = res?.message || "Faculty created successfully";
      const createdFaculty = res?.data;
      queryClient.invalidateQueries(["faculties"]);
      toast.success(message);
      setFaculty(createdFaculty || {});
      setStep(1);
    },
    onError: (error) => {
      // console.error("Create Faculty Error:", error?.response || error);
      const errorMsg =
        error?.response?.data?.message || error?.message || "An error occurred";
      toast.error(`Create faculty failed. ${errorMsg}`);
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
    validators: {
      onChange: facultySchema,
    },
    onSubmit: async ({ value }) => {
      // console.log("Value: ", value);
      mutation.mutate(value);
    },
  });

  const onClose = () => {
    form.reset();
    navigate(location.pathname.replace("/new", ""));
  };

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
                  Create Faculty
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

            {/* Faculty Name Field */}
            <form.Field
              name="name"
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
                      placeholder="Faculty of Science"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Faculty Code Field */}
            <form.Field
              name="code"
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
                      placeholder="SCI1234"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Faculty Description Field */}
            <form.Field
              name="description"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Brief description of faculty"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

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
                    disabled={mutation.isPending}
                    loading={mutation.isPending}
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
                Faculty Creation Successful
              </h1>
              <p className="text-center">
                The faculty has been created successfully.
                <br />
                You can now proceed to create departments.
              </p>
            </div>

            <div className="my-10 flex items-center justify-center text-green-500">
              <Icon icon="icon-park-solid:success" className="w-30 h-30" />
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={() => navigate(faculty.id)}
              // loading={mutation.isPending}
            >
              View Faculty
            </Button>
          </>
        )}
      </form>
    </main>
  );
};

export default CreateFaculty;
