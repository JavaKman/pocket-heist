import styles from "./Input.module.css"

interface InputProps {
  id: string
  name: string
  type?: "text" | "email"
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  autoComplete?: string
}

export default function Input({
  id,
  name,
  type = "text",
  label,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  autoComplete,
}: InputProps) {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`${styles.input} ${error ? styles.hasError : ""}`}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}
