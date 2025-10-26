"use client";

import { useFormContext } from "react-hook-form";

import type { CustomTextInputProps } from "./TextInput";
import { TextInput } from "./TextInput";

interface FormTextInputProps extends CustomTextInputProps {
  externalOnChange?: (value: string) => void;
  numericConversion?: "integer" | "float" | "none";
  min?: number;
  max?: number;
}

export const FormTextInput = ({
  id,
  errorMessage,
  externalOnChange,
  numericConversion = "none",
  min,
  max,
  type = "text",
  ...rest
}: FormTextInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  // Get error message from form state if not provided explicitly
  const fieldError = errors[id]?.message as string | undefined;
  const displayErrorMessage = errorMessage || fieldError;

  // Configure register options based on numeric conversion
  const registerOptions = {
    ...(numericConversion !== "none" && {
      setValueAs: (value: string) => {
        if (value === "" || value == null) return undefined;

        if (numericConversion === "integer") {
          const parsed = parseInt(value, 10);
          return isNaN(parsed) ? value : parsed;
        }

        if (numericConversion === "float") {
          const parsed = parseFloat(value);
          return isNaN(parsed) ? value : parsed;
        }

        return value;
      },
    }),
    ...(min !== undefined && { min }),
    ...(max !== undefined && { max }),
  };

  const registerProps = register(id, registerOptions);

  // Handle input type based on numeric conversion
  const inputType = numericConversion !== "none" ? "number" : type;

  return (
    <TextInput
      id={id}
      type={inputType}
      errorMessage={displayErrorMessage}
      {...registerProps}
      onChange={(event) => {
        const value = event.target.value;
        externalOnChange?.(value);
        void registerProps.onChange(event);
      }}
      {...rest}
    />
  );
};
