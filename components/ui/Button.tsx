import { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "outline-primary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={[
        "btn",
        variant === "primary" && "btn-primary",
        variant === "secondary" && "btn-secondary",
        variant === "outline-primary" && "btn-outline-primary",
        variant === "danger" && "btn-danger",
        variant === "success" && "btn-success",
        size === "sm" && "btn-sm",
        size === "lg" && "btn-lg",
        loading && "btn-loading",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading ? (
        <span className="btn-spinner" />
      ) : (
        children
      )}
    </button>
  );
}
