import Link from "next/link";
import { Clock, User } from "lucide-react";
import { Heist } from "@/types/firestore";
import styles from "./HeistCard.module.css";

interface HeistCardProps {
  heist: Heist;
  variant: "active" | "assigned";
}

function formatDeadline(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function calculateHoursLeft(deadline: Date): number {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  return Math.floor(diff / (1000 * 60 * 60));
}

export default function HeistCard({ heist }: HeistCardProps) {
  const hoursLeft = calculateHoursLeft(heist.deadline);

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Link href={`/heists/${heist.id}`} className={styles.titleLink}>
            {heist.title}
          </Link>
        </h3>
      </div>

      <p className={styles.description}>
        {heist.description || "(No description)"}
      </p>

      <div className={styles.assigneeSection}>
        <User size={16} className={styles.icon} />
        <span className={styles.assigneeLabel}>By:</span>
        <span className={styles.assigneeName}>{heist.createdByCodename}</span>
      </div>

      <div className={styles.assigneeSection}>
        <User size={16} className={styles.icon} />
        <span className={styles.assigneeLabel}>To:</span>
        <span className={styles.assigneeName}>{heist.assignedToCodename}</span>
      </div>

      <div className={styles.hoursLeftSection}>
        <span className={styles.hoursLeft}>
          {hoursLeft > 0 ? `${hoursLeft}h left` : "Expired"}
        </span>
      </div>

      <div className={styles.deadlineSection}>
        <Clock size={16} />
        <span>{formatDeadline(heist.deadline)}</span>
      </div>

      {heist.finalStatus && (
        <div
          className={`${styles.statusBadge} ${
            heist.finalStatus === "success"
              ? styles.statusSuccess
              : styles.statusFailure
          }`}
        >
          {heist.finalStatus === "success" ? "Success" : "Failure"}
        </div>
      )}
    </article>
  );
}
