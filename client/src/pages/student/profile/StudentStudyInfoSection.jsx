import { z } from "zod";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { useForm, useStore } from "@tanstack/react-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";

const step1Schema = z.object({
  facultyId: z.string().min(1, "Please select a faculty"),
  departmentId: z.string().min(1, "Please select a program"),
  studentNumber: z.string().min(8, "Student ID must be at least 8 characters"),
  matricNumber: z
    .string()
    .min(8, "Matric number must be at least 8 characters"),
});

const StudentStudyInfoSection = () => {
  const { user } = useSelector((state) => state.authStore);
  const queryClient = useQueryClient();

  const [editMode, setEditMode] = useState(false);

  const form = useForm({
    defaultValues: {
      facultyId: user?.facultyId || "",
      departmentId: user?.departmentId || "",
      studentNumber: user?.studentNumber || "",
      matricNumber: user?.matricNumber || "",
    },
    validators: {
      onChange: step1Schema,
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value);
    },
  });

  const selectedFaculty = useStore(
    form.store,
    (state) => state.values.facultyId
  );

  /*
  -------------------------
  UPDATE PROFILE MUTATION
  -------------------------
  */

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.patch("/users/profile", data);
      return res.data;
    },
    onSuccess: (data) => {
      // dispatch(setUser(data.data));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(data.message || "Profile updated successfully");
      setEditMode(false);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update profile"
      );
    },
  });

  /*
  -------------------------
  FACULTIES
  -------------------------
  */

  const { data: faculties } = useQuery({
    queryKey: ["faculties"],
    queryFn: async () => {
      const res = await api.get("/faculties");
      return res.data;
    },
  });

  const facultyOptions =
    faculties?.map((faculty) => ({
      label: faculty.name,
      value: faculty.id,
    })) || [];

  /*
  -------------------------
  DEPARTMENTS
  -------------------------
  */

  const { data: departments } = useQuery({
    queryKey: ["departments", selectedFaculty],
    queryFn: async () => {
      const res = await api.get("/departments", {
        params: { facultyId: selectedFaculty },
      });
      return res.data;
    },
    enabled: !!selectedFaculty,
  });

  const departmentOptions =
    departments?.map((department) => ({
      label: department.name,
      value: department.id,
    })) || [];

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
        <h3 className="text-lg font-semibold">Study Info</h3>
        <p className="text-sm text-gray-500">
          You can change your study information settings here.
        </p>
      </div>

      <div className="p-5 border rounded-lg flex flex-col gap-5 relative">
        {!editMode && (
          <Button
            type="button"
            className="w-fit absolute -top-5 right-0 z-10"
            onClick={() => setEditMode(true)}
          >
            <Icon icon="iconamoon:edit-fill" width="24" height="24" />
            Edit
          </Button>
        )}

        {/* FACULTY + DEPARTMENT */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4">
          {/* Faculty */}
          <form.Field
            name="facultyId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Faculty</FieldLabel>

                  <Select
                    value={field.state.value}
                    disabled={!editMode}
                    onValueChange={(value) => {
                      field.handleChange(value);

                      // reset department if faculty changes
                      form.setFieldValue("departmentId", "");
                    }}
                  >
                    <SelectTrigger aria-invalid={isInvalid}>
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

          {/* Department */}
          <form.Field
            name="departmentId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Program</FieldLabel>

                  <Select
                    value={field.state.value}
                    disabled={!editMode}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger aria-invalid={isInvalid}>
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

        {/* STUDENT INFO */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4">
          <form.Field
            name="studentNumber"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Student ID</FieldLabel>

                  <Input
                    value={field.state.value}
                    disabled={!editMode}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(e.target.value)
                    }
                    placeholder="12345678"
                  />

                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              );
            }}
          />

          <form.Field
            name="matricNumber"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Matric Number</FieldLabel>

                  <Input
                    value={field.state.value}
                    disabled={!editMode}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(e.target.value)
                    }
                    placeholder="202X/X/XXXX"
                  />

                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              );
            }}
          />
        </div>

        {editMode && (
          <div className="flex justify-end gap-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditMode(false);
                form.reset();
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={mutation.isPending}
              disabled={mutation.isPending}
            >
              Update
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};

export default StudentStudyInfoSection;