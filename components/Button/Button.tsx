import styles from "./Button.module.css"

interface ButtonProps {
  children: React.ReactNode
  type?: "button" | "submit" | "reset"
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
}

export default function Button({
  children,
  type = "button",
  loading = false,
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${styles.button} ${loading ? styles.loading : ""}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
