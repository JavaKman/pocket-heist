import styles from "./Textarea.module.css"

interface TextareaProps {
  id: string
  name: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  error?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  rows?: number
  maxLength?: number
  showCounter?: boolean
}

export default function Textarea({
  id,
  name,
  label,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
  showCounter = false,
}: TextareaProps) {
  const currentLength = value?.length || 0
  const isNearLimit = maxLength && currentLength > maxLength * 0.9

  return (
    <div className={styles.textareaGroup}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`${styles.textarea} ${error ? styles.hasError : ""}`}
      />
      {showCounter && maxLength && (
        <div
          className={`${styles.counter} ${isNearLimit ? styles.counterNearLimit : ""}`}
        >
          {currentLength}/{maxLength}
        </div>
      )}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}
