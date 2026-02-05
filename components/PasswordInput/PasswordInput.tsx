"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import styles from "./PasswordInput.module.css"

interface PasswordInputProps {
  id: string
  name: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  autoComplete?: string
}

export default function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  autoComplete,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const toggleVisibility = () => setShowPassword(!showPassword)

  return (
    <div className={styles.inputGroup}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.inputWrapper}>
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`${styles.input} ${error ? styles.hasError : ""}`}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className={styles.toggleButton}
          aria-label="Toggle password visibility"
          disabled={disabled}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}
