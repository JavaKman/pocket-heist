import styles from "./Select.module.css"

interface SelectProps {
  id: string
  name: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: Array<{ value: string; label: string }>
  error?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
}

export default function Select({
  id,
  name,
  label,
  value,
  onChange,
  options,
  error,
  placeholder = "Select an option",
  required = false,
  disabled = false,
}: SelectProps) {
  return (
    <div className={styles.selectGroup}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`${styles.select} ${error ? styles.hasError : ""}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}
