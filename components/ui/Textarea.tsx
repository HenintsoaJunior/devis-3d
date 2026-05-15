import { ComponentProps } from "react";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea {...props} className={["form-control", className].filter(Boolean).join(" ")} />;
}
