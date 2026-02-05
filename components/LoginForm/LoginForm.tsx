"use client"

import { useState } from "react"
import Link from "next/link"
import Input from "@/components/Input"
import PasswordInput from "@/components/PasswordInput"
import Button from "@/components/Button"
import styles from "./LoginForm.module.css"

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors = { email: "", password: "" }
    let isValid = true

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Login submitted:", formData)
      setLoading(false)
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        id="email"
        name="email"
        type="text"
        label="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        placeholder="you@example.com"
        autoComplete="email"
        disabled={loading}
      />

      <PasswordInput
        id="password"
        name="password"
        label="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        error={errors.password}
        placeholder="Enter your password"
        autoComplete="current-password"
        disabled={loading}
      />

      <Button type="submit" loading={loading} disabled={loading}>
        Log In
      </Button>

      <div className={styles.footer}>
        Don't have an account?{" "}
        <Link href="/signup" className={styles.link}>
          Sign up
        </Link>
      </div>
    </form>
  )
}
