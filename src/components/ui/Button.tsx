import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router";
import { buttonClassName, type ButtonStyleOptions } from "@/components/ui/buttonStyles.ts";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonStyleOptions & {
    loading?: boolean;
    children: ReactNode;
  };

export function Button({
  variant,
  size,
  fullWidth,
  loading = false,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, fullWidth, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
            aria-hidden="true"
          />
          Please wait
        </>
      ) : (
        children
      )}
    </button>
  );
}

type ButtonLinkProps = ButtonStyleOptions & {
  to: string;
  children: ReactNode;
  onClick?: () => void;
};

export function ButtonLink({ variant, size, fullWidth, className, to, children, onClick }: ButtonLinkProps) {
  return (
    <Link to={to} onClick={onClick} className={buttonClassName({ variant, size, fullWidth, className })}>
      {children}
    </Link>
  );
}
