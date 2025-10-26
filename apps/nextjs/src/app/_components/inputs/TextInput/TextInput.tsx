import type { TablerIcon } from "@tabler/icons-react";
import * as React from "react";
import { IconQuestionMark } from "@tabler/icons-react";

import type { Input } from "@acme/ui/input";
import { cn } from "@acme/ui";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@acme/ui/input-group";
import { Label } from "@acme/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@acme/ui/tooltip";

export interface CustomTextInputProps
  extends React.ComponentProps<typeof Input> {
  id: string;
  label?: string;
  subLabel?: string;
  rightLabel?: React.ReactNode;
  errorMessage?: string;
  bottomLabel?: string;
  leftAddon?: React.ReactNode;
  rightElement?: React.ReactNode;
  tooltip?: string;
  hasRequiredLabel?: boolean;
  containerClassName?: string;
  labelDirection?: "column" | "row";
  icon?: TablerIcon;
  iconClassName?: string;
  isRequired?: boolean;
}

const TextInput = React.forwardRef<HTMLInputElement, CustomTextInputProps>(
  (
    {
      id,
      className,
      containerClassName,
      label,
      subLabel,
      rightLabel,
      labelDirection = "column",
      errorMessage,
      bottomLabel,
      icon: Icon,
      iconClassName,
      tooltip,
      hasRequiredLabel,
      isRequired,
      ...props
    },
    ref,
  ) => {
    const hasError = !!errorMessage;

    return (
      <div
        className={cn(
          "flex w-full gap-1",
          labelDirection === "row" ? "flex-row items-start" : "flex-col",
          containerClassName,
        )}
      >
        {/* Label and Right Label container */}
        {(label ?? rightLabel) && (
          <div className="flex min-h-6 w-full items-center justify-between">
            <div className="flex items-center gap-1.5">
              {label && (
                <div className="flex flex-col">
                  <div className="space-x-2">
                    <Label htmlFor={id}>{label}</Label>
                    {isRequired && <span className="text-primary-500">*</span>}
                  </div>
                  {subLabel && (
                    <p className="text-muted-foreground text-xs">{subLabel}</p>
                  )}
                </div>
              )}
              {tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <IconQuestionMark className="text-muted-foreground h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {rightLabel && (
              <div className="text-muted-foreground text-sm">{rightLabel}</div>
            )}
          </div>
        )}

        {/* Input and messages container */}
        <div className="w-full">
          <div className="relative flex w-full items-center">
            {/* 1. Conditionally render the icon if it's provided */}

            <InputGroup>
              {Icon && (
                <InputGroupAddon>
                  <Icon className={cn("text-secondary-950", iconClassName)} />
                </InputGroupAddon>
              )}
              <InputGroupInput
                id={id}
                ref={ref}
                className={cn(hasError && "border-destructive", className)}
                {...props}
              />
            </InputGroup>
          </div>

          {/* Bottom messages container */}
          {(errorMessage ?? hasRequiredLabel ?? bottomLabel) && (
            <div className="mt-1 flex min-h-3">
              <div>
                {errorMessage ? (
                  <p className="text-destructive text-sm">{errorMessage}</p>
                ) : hasRequiredLabel ? (
                  <p className="text-extra-small text-white">Required</p>
                ) : null}
              </div>
              {bottomLabel && (
                <p className="text-extra-small text-white">{bottomLabel}</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);
TextInput.displayName = "TextInput";

export { TextInput };
