import Skeleton from "@/components/Skeleton";
import styles from "./HeistCardSkeleton.module.css";

export default function HeistCardSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonHeader}>
        <Skeleton variant="rectangular" width="70%" height="1.5rem" />
      </div>

      <div className={styles.skeletonDescription}>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </div>

      <div className={styles.skeletonAssignee}>
        <Skeleton variant="rectangular" width="16px" height="16px" />
        <Skeleton variant="rectangular" width="100px" height="1rem" />
      </div>

      <div className={styles.skeletonAssignee}>
        <Skeleton variant="rectangular" width="16px" height="16px" />
        <Skeleton variant="rectangular" width="100px" height="1rem" />
      </div>

      <div className={styles.skeletonHoursLeft}>
        <Skeleton variant="rectangular" width="80px" height="1rem" />
      </div>

      <div className={styles.skeletonDeadline}>
        <Skeleton variant="rectangular" width="120px" height="1rem" />
      </div>
    </div>
  );
}
