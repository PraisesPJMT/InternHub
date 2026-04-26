import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "react-router";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import api from "@/api/api";

import Button from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Separate schemas for each step
const departmentSchema = z.object({
  // facultyId: z.string().uuid("Faculty ID must be a valid UUID"),
  name: z.string().min(3, "Department name must be at least 3 characters"),
  code: z
    .string()
    .min(2, "Department code must be at least 2 characters")
    .max(50),
  description: z.string().optional(),
});

const CreateDepartment = () => {
  const [step, setStep] = useState(0);

  const navigate = useNavigate();

  const { facultyId } = useParams();
  const queryClient = useQueryClient();
  const [createdDepartment, setCreatedDepartment] = useState(null);

  // const faculties = useQuery({
  //   queryKey: ["faculties"],
  //   queryFn: async () => {
  //     const response = await api.get("/faculties");
  //     console.log("Faculties: ", response);
  //     // setFacultyOptions(
  //     //   response.data.map((faculty) => ({
  //     //     label: faculty.name,
  //     //     value: faculty.id,
  //     //   })),
  //     // );
  //     return response.data;
  //   },
  // });

  const mutation = useMutation({
    mutationFn: async (payload) => {
      // Create a new department using the backend controller for departments
      const response = await api.post("/departments", payload);
      // Normalise response shapes (api may return { success, data } or the data directly)
      return response?.data ?? response;
    },
    onSuccess: (res) => {
      const created = res?.data ?? res;
      toast.success(res?.message || "Department created successfully");
      setCreatedDepartment(created || null);
      setStep(1);
      queryClient.invalidateQueries(["departments", facultyId]);
    },
    onError: (error) => {
      // console.error("Create Department Error: ", error?.response ?? error);
      const errorMsg =
        error?.response?.data?.message || error?.message || "An error occurred";
      toast.error(`Failed to create department. ${errorMsg}`);
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
    validators: {
      onChange: departmentSchema,
    },
    onSubmit: async ({ value }) => {
      // mutate the form value to create department
      mutation.mutate({ ...value, facultyId });
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
                  Create Department
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

            {/* Faculty Select Field */}
            {/* <form.Field
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
                        {faculties?.data.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
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
            />*/}

            {/* Department Name Field */}
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Department Name
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Department of Science"
                      disabled={mutation.isLoading}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Department Code Field */}
            <form.Field
              name="code"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Department Code
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="SCI1234"
                      disabled={mutation.isLoading}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Department Description Field */}
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
                      placeholder="Brief description of department"
                      disabled={mutation.isLoading}
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
                Department Created Successfully
              </h1>
              <p className="text-center">
                The department has been created successfully.
              </p>
            </div>

            <div className="my-10 flex items-center justify-center text-green-500">
              <Icon icon="icon-park-solid:success" className="w-30 h-30" />
            </div>

            <Button
              type="button"
              className="w-full"
              variant="outline"
              onClick={() =>
                navigate(
                  createdDepartment?.id
                    ? `/admin/faculties/departments/${createdDepartment.id}`
                    : location.pathname.replace("/new", ""),
                )
              }
            >
              Go to Department
            </Button>
          </>
        )}
      </form>
    </main>
  );
};

export default CreateDepartment;
