import { ComponentProps } from "react";

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select {...props} className={["form-control", className].filter(Boolean).join(" ")} />;
}
