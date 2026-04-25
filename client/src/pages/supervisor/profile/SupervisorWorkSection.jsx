import { z } from "zod";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { useForm, useStore } from "@tanstack/react-form";
import { PhoneInput } from "@/components/ui/phone-input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/slice/auth/authSlice";

const step1Schema = z.object({
  facultyId: z.string().min(1, "Please select a faculty"),
  departmentId: z.string().min(1, "Please select a program"),
});

const PersonalInfoSection = () => {
  const { user } = useSelector((state) => state.authStore);

  const [facultyOptions, setFacultyOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  const [editMode, setEditMode] = useState(false);

  const dispatch = useDispatch();

  const form = useForm({
    defaultValues: {
      facultyId: user?.facultyId || "",
      departmentId: user?.departmentId || "",
    },
    validators: {
      onChange: step1Schema,
    },
    onSubmit: async ({ value }) => {
      // console.log("Value: ", value);
      // // Validate current step
      // const isValid = validateCurrentStep();
      // if (!isValid) {
      //   toast.error("Please fill in all required fields correctly");
      //   return;
      // }
      // if (step === 3) {
      //   registerSchema.parse(form.state.values);
      //   console.log("Value: ", value);
      //   mutation.mutate(value);
      // } else {
      //   // Move to next step
      //   setStep(step + 1);
      // }
    },
  });

  const selectedFaculty = useStore(
    form.store,
    (state) => state.values.facultyId,
  );

  // const { data: faculties } = useQuery({
  useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await api.get("/users/profile");
      console.log("Profile: ", response);
      dispatch(setUser(response.data));
      // setFacultyOptions(
      //   response.data.map((faculty) => ({
      //     label: faculty.name,
      //     value: faculty.id,
      //   })),
      // );
      return response.data;
    },
  });

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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-5 p-5"
    >
      <div>
        <h3 className="text-lg font-semibold">Work Info</h3>
        <p className="text-sm text-gray-500">
          You can change your work information settings here.
        </p>
      </div>

      <div className="p-5 border rounded-lg flex flex-col gap-5 relative">
        {!editMode && (
          <Button
            type="button"
            className="w-fit absolute -top-5 right-0 z-10"
            onClick={() => setEditMode(true)}
            // variant="outline"
            // disabled={mutation.isPending}
            // loading={mutation.isPending}
          >
            <Icon icon="iconamoon:edit-fill" width="24" height="24" />
            Edit
          </Button>
        )}

        {/* Faculty Select Field */}
        <form.Field
          name="facultyId"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
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
                  disabled={!editMode}
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
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        {/* Program Select Field */}
        <form.Field
          name="departmentId"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
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
                  disabled={!editMode}
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
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        {editMode && (
          <div className="flex items-center justify-end gap-5">
            <Button
              type="button"
              className="w-fit"
              variant="outline"
              onClick={() => {
                setEditMode(false);
                form.reset();
              }}
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
                  className="w-fit"
                  // disabled={mutation.isPending}
                  // loading={mutation.isPending}
                >
                  Update
                </Button>
              )}
            />
          </div>
        )}
      </div>
    </form>
  );
};

export default PersonalInfoSection;
