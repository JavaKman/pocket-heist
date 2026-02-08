"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Input from "@/components/Input"
import PasswordInput from "@/components/PasswordInput"
import Button from "@/components/Button"
import styles from "./LoginForm.module.css"

export default function LoginForm() {
  const router = useRouter()
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

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password)
      // Redirect to heists page on successful login
      router.push("/heists")
    } catch (error: any) {
      // Handle Firebase auth errors
      let errorMessage = "Failed to log in. Please try again."

      if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password"
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email"
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password"
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later."
      }

      setErrors({ ...errors, password: errorMessage })
      setLoading(false)
    }
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
