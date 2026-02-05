import styles from "./Skeleton.module.css"

export interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular"
  width?: string
  height?: string
  className?: string
}

export default function Skeleton({
  variant = "text",
  width,
  height,
  className = "",
}: SkeletonProps) {
  const variantClass = styles[variant]
  const style = {
    width: width || undefined,
    height: height || undefined,
  }

  return (
    <div
      className={`${styles.skeleton} ${variantClass} ${className}`}
      style={style}
      aria-hidden="true"
    />
  )
}
