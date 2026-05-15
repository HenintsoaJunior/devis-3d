import { ComponentProps } from "react";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input {...props} className={["form-control", className].filter(Boolean).join(" ")} />;
}
