import { z } from "zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, useParams } from "react-router";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

// import api from "@/api/api";

import Button from "@/components/ui/button";
import api from "@/api/api";

const internshipSchema = z.object({
  title: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  code: z.string().min(4, "Code must be at least 4 characters"),

  duration: z.coerce
    .number({
      invalid_type_error: "Enter a valid number",
    })
    .min(1, "Duration must be above 0"),
});

const EditInternship = () => {
  const [step, setStep] = useState(0);
  // const [internship, setInternship] = useState({});

  const navigate = useNavigate();

  const { internshipId } = useParams();

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["internship", internshipId],
    queryFn: async () => {
      const response = await api.get(`/internships/${internshipId}`);
      return response?.data ?? response;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.put(`/internships/${internshipId}`, data);
      return response;
    },
    onSuccess: (response) => {
      // const payload = response?.data ?? response;
      const message = response?.message || "Internship updated successfully";
      toast.success(message);

      // Invalidate queries to refresh lists
      queryClient.invalidateQueries(["internships"]);
      queryClient.invalidateQueries(["internship", internshipId]);

      setStep(1);
      // setInternship(payload || {});
    },
    onError: (error) => {
      // console.log("Internship Error: ", error?.response || error);
      const errorMsg =
        error?.response?.data?.message || error?.message || "An error occurred";
      toast.error(`Internship update failed. ${errorMsg}`);
    },
  });

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      code: "",
      duration: "",
    },
    validators: {
      onChange: internshipSchema,
    },
    onSubmit: async ({ value }) => {
      // console.log("Value: ", value);
      mutation.mutate(value);
    },
  });

  const onClose = () => {
    form.reset();
    navigate(location.pathname.replace(internshipId + "/edit", ""));
  };

  // When department data loads, populate form values
  useEffect(() => {
    if (data?.internship) {
      form.setFieldValue("title", data?.internship?.title || "");
      form.setFieldValue("description", data?.internship?.description || "");
      form.setFieldValue("code", data?.internship?.code || "");
      form.setFieldValue("duration", data?.internship?.duration || "");
    }
  }, [data, form]);

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
                  Update Internship
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

            {/* Title Field */}
            <form.Field
              name="title"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Internship"
                      disabled={mutation.isPending}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4">
              {/* Code Field */}
              <form.Field
                name="code"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>CODE</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="ICT"
                        disabled={mutation.isPending}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              {/* Duration Field */}
              <form.Field
                name="duration"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Duration (in weeks)
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="12"
                        disabled={mutation.isPending}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>

            {/* Description Field */}
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
                      placeholder="Enter a brief description of the internship"
                      disabled={mutation.isPending}
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
                disabled={mutation.isPending}
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
                    disabled={isLoading || mutation.isPending}
                    loading={mutation.isPending}
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
                Internship Updated Successfully
              </h1>
              <p className="text-center">
                The internship has been updated successfully.
                <br />
                Students can now proceed to complete their onboarding process
                via email.
              </p>
            </div>

            <div className="my-10 flex items-center justify-center text-green-500">
              <Icon icon="icon-park-solid:success" className="w-30 h-30" />
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={() => navigate(location.pathname.replace("/edit", ""))}
            >
              View Internship
            </Button>
          </>
        )}
      </form>
    </main>
  );
};
export default EditInternship;
