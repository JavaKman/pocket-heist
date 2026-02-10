"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useUser } from "@/lib/auth/useUser"
import { CreateHeistInput } from "@/types/firestore/heist"
import { COLLECTIONS } from "@/types/firestore"
import Input from "@/components/Input"
import Textarea from "@/components/Textarea"
import Select from "@/components/Select"
import Button from "@/components/Button"
import styles from "./CreateHeistForm.module.css"

interface FormData {
  title: string
  description: string
  assignedTo: string
  assignedToCodename: string
}

interface FormErrors {
  title: string
  description: string
  assignedTo: string
  general?: string
}

interface User {
  id: string
  codename: string
}

const DRAFT_KEY = "heist-draft"
const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000

export default function CreateHeistForm() {
  const router = useRouter()
  const { user, loading: authLoading } = useUser()

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    assignedTo: "",
    assignedToCodename: "",
  })

  const [errors, setErrors] = useState<FormErrors>({
    title: "",
    description: "",
    assignedTo: "",
  })

  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState("")

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY)
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft)
        setFormData(draft)
      } catch (e) {
        console.error("Failed to load draft", e)
      }
    }
  }, [])

  // Auto-save to localStorage on form data change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData))
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [formData])

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return

      try {
        setUsersLoading(true)
        const usersRef = collection(db, COLLECTIONS.USERS)
        const snapshot = await getDocs(usersRef)

        const allUsers = snapshot.docs.map((doc) => ({
          id: doc.data().id,
          codename: doc.data().codename,
        }))

        // Filter out current user
        const filteredUsers = allUsers.filter((u) => u.id !== user.id)
        setUsers(filteredUsers)
        setUsersError("")
      } catch (error) {
        console.error("Failed to fetch users:", error)
        setUsersError("Failed to load users. Please refresh the page.")
      } finally {
        setUsersLoading(false)
      }
    }

    if (!authLoading) {
      fetchUsers()
    }
  }, [user, authLoading])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      title: "",
      description: "",
      assignedTo: "",
    }
    let isValid = true

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
      isValid = false
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters"
      isValid = false
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must not exceed 100 characters"
      isValid = false
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
      isValid = false
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters"
      isValid = false
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must not exceed 500 characters"
      isValid = false
    }

    // Assigned To validation
    if (!formData.assignedTo) {
      newErrors.assignedTo = "Please select a user to assign this heist to"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!user) {
      setErrors((prev) => ({
        ...prev,
        general: "You must be logged in to create a heist",
      }))
      return
    }

    setLoading(true)

    try {
      // Construct CreateHeistInput
      const heistData: CreateHeistInput = {
        title: formData.title,
        description: formData.description,
        createdBy: user.id,
        createdByCodename: user.displayName || "Unknown",
        assignedTo: formData.assignedTo,
        assignedToCodename: formData.assignedToCodename,
        createdAt: serverTimestamp(),
        deadline: Timestamp.fromMillis(Date.now() + FORTY_EIGHT_HOURS_MS),
        finalStatus: null,
      }

      // Create heist in Firestore
      await addDoc(collection(db, COLLECTIONS.HEISTS), heistData)

      // Clear localStorage draft
      localStorage.removeItem(DRAFT_KEY)

      // Redirect to heists page
      router.push("/heists")
    } catch (error: any) {
      console.error("Failed to create heist:", error)
      setErrors((prev) => ({
        ...prev,
        general: "Failed to create heist. Please try again.",
      }))
      setLoading(false)
    }
  }

  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value
    const selectedUser = users.find((u) => u.id === userId)

    setFormData({
      ...formData,
      assignedTo: userId,
      assignedToCodename: selectedUser?.codename || "",
    })
  }

  // Show loading state while auth or users are loading
  if (authLoading || usersLoading) {
    return <div className={styles.loadingMessage}>Loading...</div>
  }

  // Show error if users failed to load
  if (usersError) {
    return <div className={styles.errorMessage}>{usersError}</div>
  }

  // Show message if no users available to assign
  if (users.length === 0) {
    return (
      <div className={styles.noUsersMessage}>
        No users available to assign this heist to. Please invite team members
        first.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <Input
        id="title"
        name="title"
        type="text"
        label="Heist Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        error={errors.title}
        placeholder="e.g., Replace boss's coffee with decaf"
        required
        disabled={loading}
      />

      <Textarea
        id="description"
        name="description"
        label="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        error={errors.description}
        placeholder="Describe the mission details..."
        required
        disabled={loading}
        rows={5}
        maxLength={500}
        showCounter
      />

      <Select
        id="assignedTo"
        name="assignedTo"
        label="Assign To"
        value={formData.assignedTo}
        onChange={handleUserSelect}
        options={users.map((u) => ({ value: u.id, label: u.codename }))}
        error={errors.assignedTo}
        placeholder="Select a team member"
        required
        disabled={loading}
      />

      {errors.general && (
        <div className={styles.generalError}>{errors.general}</div>
      )}

      <Button type="submit" loading={loading} disabled={loading}>
        Create Heist
      </Button>
    </form>
  )
}
