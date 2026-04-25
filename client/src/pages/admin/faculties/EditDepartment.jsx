import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "react-router";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Textarea } from "@/components/ui/textarea";

// Separate schemas for each step
const departmentSchema = z.object({
  facultyId: z.string().uuid("Faculty ID must be a valid UUID"),
  name: z.string().min(3, "Department name must be at least 3 characters"),
  code: z
    .string()
    .min(2, "Department code must be at least 2 characters")
    .max(50),
  description: z.string().optional(),
});

const EditDepartment = () => {
  const [step, setStep] = useState(0);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { departmentId } = useParams();

  // Fetch department data
  const department = useQuery({
    queryKey: ["department", departmentId],
    queryFn: async () => {
      // Use backend route exposed in the controller: GET /departments/:id
      // If your backend uses a different path, adjust accordingly.
      const response = await api.get(`/departments/${departmentId}`);
      return response.data;
    },
    onError: (error) => {
      // Show a toast on fetch error
      console.error("Department Error: ", error?.response ?? error);
      const errorMsg =
        error?.response?.data?.message || error?.message || "An error occurred";
      toast.error(`Department fetch failed. ${errorMsg}`);
    },
    // don't attempt to refetch on window focus while editing
    refetchOnWindowFocus: false,
    enabled: !!departmentId,
  });

  // Fetch faculties for select field
  const faculties = useQuery({
    queryKey: ["faculties"],
    queryFn: async () => {
      const response = await api.get("/faculties");
      return response.data;
    },
    onError: (error) => {
      console.error("Faculties fetch error:", error?.response ?? error);
      const errorMsg =
        error?.response?.data?.message || error?.message || "An error occurred";
      toast.error(`Faculties fetch failed. ${errorMsg}`);
    },
    refetchOnWindowFocus: false,
  });

  // Mutation to update department
  const mutation = useMutation({
    mutationFn: async (data) => {
      // PATCH/PUT to update department based on backend controller
      const response = await api.put(`/departments/${departmentId}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Department updated successfully");
      // Invalidate queries to refresh lists
      queryClient.invalidateQueries(["departments"]);
      queryClient.invalidateQueries(["department", departmentId]);
      setStep(1);
    },
    onError: (error) => {
      console.error("Update Error: ", error?.response ?? error);
      const errorMsg =
        error?.response?.data?.message || error?.message || "An error occurred";
      toast.error(`Department update failed. ${errorMsg}`);
    },
  });

  const form = useForm({
    defaultValues: {
      facultyId: "",
      name: "",
      code: "",
      description: "",
    },
    validators: {
      onChange: departmentSchema,
    },
    onSubmit: async ({ value }) => {
      // Disable submitting when mutation is running
      if (mutation.isLoading) return;
      mutation.mutate(value);
    },
  });

  // When department data loads, populate form values
  // useEffect(() => {
  //   if (department?.data) {
  //     form.setValue("facultyId", department.data.facultyId || "");
  //     form.setValue("name", department.data.name || "");
  //     form.setValue("code", department.data.code || "");
  //     form.setValue("description", department.data.description || "");
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [department?.data]);

  const onClose = () => {
    form.reset();
    navigate(location.pathname.replace(departmentId + "/edit", ""));
  };

  // Disable form controls while fetching or submitting
  const isBusy =
    department.isLoading || faculties.isLoading || mutation.isLoading;

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
                  Update Department
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
                        disabled={isBusy}
                      >
                        <SelectValue placeholder="Select Faculty" />
                      </SelectTrigger>
                      <SelectContent>
                        {faculties?.data?.map((option) => (
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
            />

            {/* Department Name Field */}
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
                      placeholder="Department of Science"
                      disabled={isBusy}
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
                    <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="SCI1234"
                      disabled={isBusy}
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
                      disabled={isBusy}
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
                disabled={isBusy}
                onClick={onClose}
                // loading={mutation.isPending}
              >
                Close
              </Button>

              <form.Subscribe
                selector={(state) => state.isSubmitting}
                children={() => (
                  <Button
                    type="submit"
                    className=""
                    disabled={isBusy}
                    loading={mutation.isLoading}
                  >
                    Save
                  </Button>
                )}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <h1 className="text-primary text-3xl font-bold text-center">
                Department Updated Successful
              </h1>
              <p className="text-center">
                The department has been updated successfully.
              </p>
            </div>

            <div className="my-10 flex items-center justify-center text-green-500">
              <Icon icon="icon-park-solid:success" className="w-30 h-30" />
            </div>

            <Button
              type="button"
              className="w-full"
              variant="outline"
              onClick={() => navigate(location.pathname.replace("/edit", ""))}
            >
              Go to Department
            </Button>
          </>
        )}
      </form>
    </main>
  );
};

export default EditDepartment;
