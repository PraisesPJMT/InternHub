import { z } from "zod";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { useForm, useStore } from "@tanstack/react-form";
import { PhoneInput } from "@/components/ui/phone-input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useState } from "react";
import { PasswordInput } from "@/components/ui/password-input";
import { useSelector } from "react-redux";

const step1Schema = z.object({
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
});

const AdminSecuritySection = () => {
  const { user } = useSelector((state) => state.authStore);
  const [editMode, setEditMode] = useState(false);

  const form = useForm({
    defaultValues: {
      password: "",
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
        <h3 className="text-lg font-semibold">Security</h3>
        <p className="text-sm text-gray-500">
          You can update your security settings here.
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

        <SignatureImageForm editMode={editMode} />

        <div className={editMode ? "grid grid-cols-2 gap-5" : "flex"}>
          {/* Password Field */}
          <form.Field
            name="password"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
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
                    autoComplete="off"
                    disabled={true}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          {editMode && (
            <div className="mt-auto h-fit flex items-center justify-end gap-5">
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
                    Change Password
                  </Button>
                )}
              />
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default AdminSecuritySection;

const SignatureImageForm = ({ editMode }) => {
  const { user } = useSelector((state) => state.authStore);

  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Image: ", file);
      // Store the string URL directly in state to avoid re-calling createObjectURL in the render
      setPreview(file);
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <FieldLabel>{editMode ? "Change Signature" : "Signature"}</FieldLabel>

      <div className="w-full flex items-center gap-5">
        <div className="flex items-center justify-center">
          <label
            htmlFor="profile-image"
            className={`${editMode ? "cursor-pointer" : "cursor-default"}`}
          >
            <div className="relative w-32 h-14 rounded-xl bg-gray-300 overflow-hidden">
              {preview ? (
                <img
                  src={URL.createObjectURL(preview)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : user?.signature ? (
                <img
                  src={user?.signature}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-xl flex items-center justify-center"></div>
              )}

              {editMode && (
                <div className="absolute inset-0 bg-gray-300 text-gray-700 bg-opacity-50 flex items-center justify-center">
                  <Icon icon="iconamoon:edit-fill" width="24" height="24" />
                </div>
              )}
            </div>
          </label>
          <input
            type="file"
            id="profile-image"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            disabled={!editMode}
          />
        </div>

        {editMode && (
          <div className="flex items-center gap-4">
            <Button
              type="button"
              className="w-fit"
              // variant="outline"
              onClick={() => {
                // setEditMode(false);
                // form.reset();
              }}
              // disabled={mutation.isPending}
              // loading={mutation.isPending}
            >
              Upload
            </Button>

            <Button
              type="button"
              className="w-fit"
              variant="destructive"
              onClick={() => {
                // setEditMode(false);
                // form.reset();
              }}
              // disabled={mutation.isPending}
              // loading={mutation.isPending}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
