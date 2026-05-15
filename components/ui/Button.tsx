import { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        variant === "primary"
          ? "bg-black text-white hover:bg-neutral-800 focus-visible:outline-black"
          : "border border-neutral-300 text-neutral-900 hover:bg-neutral-50 focus-visible:outline-neutral-400",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
