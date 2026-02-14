"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import styles from "./page.module.css"
import Avatar from "@/components/Avatar"
import { useHeist } from "@/lib/hooks"
import Spinner from "@/components/Spinner"

function TimeRemaining({ deadline }: { deadline: Date }) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime()
      const distance = deadline.getTime() - now

      if (distance < 0) {
        setTimeLeft("Expired")
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      const parts = []
      if (days > 0) parts.push(`${days}d`)
      if (hours > 0) parts.push(`${hours}h`)
      if (minutes > 0) parts.push(`${minutes}m`)
      if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`)

      setTimeLeft(parts.join(" "))
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [deadline])

  return <span className={styles.timer}>{timeLeft}</span>
}

export default function HeistDetailsPage() {
  const params = useParams()
  const heistId = params.id as string
  const { heist, loading, error } = useHeist(heistId)

  if (loading) {
    return (
      <div className="page-content">
        <div className={styles.loading}>
          <Spinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-content">
        <div className={styles.notFound}>
          <h2>Error Loading Heist</h2>
          <p>There was an error loading the heist details. Please try again.</p>
        </div>
      </div>
    )
  }

  if (!heist) {
    return (
      <div className="page-content">
        <div className={styles.notFound}>
          <h2>Heist Not Found</h2>
          <p>The heist you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  const isExpired = heist.deadline.getTime() < Date.now()

  return (
    <div className="page-content">
      <div className={styles.heistDetails}>
        <header className={styles.header}>
          <h1 className={styles.title}>{heist.title}</h1>
          <div className={`${styles.timeRemaining} ${isExpired ? styles.expired : ""}`}>
            <span className={styles.label}>Time Remaining:</span>
            <TimeRemaining deadline={heist.deadline} />
          </div>
        </header>

        <div className={styles.participants}>
          <div className={styles.participant}>
            <span className={styles.participantLabel}>Assigned To:</span>
            <div className={styles.participantInfo}>
              <Avatar name={heist.assignedToCodename} />
              <span className={styles.participantName}>
                {heist.assignedToCodename}
              </span>
            </div>
          </div>

          <div className={styles.participant}>
            <span className={styles.participantLabel}>Created By:</span>
            <div className={styles.participantInfo}>
              <Avatar name={heist.createdByCodename} />
              <span className={styles.participantName}>
                {heist.createdByCodename}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.description}>
          <h2 className={styles.sectionTitle}>Mission Details</h2>
          <p className={styles.descriptionText}>{heist.description}</p>
        </div>

        <div className={styles.deadline}>
          <span className={styles.deadlineLabel}>Deadline:</span>
          <span className={styles.deadlineDate}>
            {heist.deadline.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {heist.finalStatus && (
          <div className={styles.statusSection}>
            <span className={styles.statusLabel}>Final Status:</span>
            <span
              className={`${styles.status} ${
                heist.finalStatus === "success"
                  ? styles.statusSuccess
                  : styles.statusFailure
              }`}
            >
              {heist.finalStatus === "success" ? "Success" : "Failure"}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
