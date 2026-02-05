import styles from './Avatar.module.css'

interface AvatarProps {
  name: string
}

export default function Avatar({ name }: AvatarProps) {
  const getInitials = (name: string): string => {
    // Find all uppercase letters in the string
    const uppercaseLetters = name.match(/[A-Z]/g)

    // If we have 2 or more uppercase letters (PascalCase), use first 2
    if (uppercaseLetters && uppercaseLetters.length >= 2) {
      return uppercaseLetters.slice(0, 2).join('')
    }

    // Otherwise, return the first character (uppercased)
    return name.charAt(0).toUpperCase()
  }

  const initials = getInitials(name)

  return (
    <div className={styles.avatar}>
      {initials}
    </div>
  )
}
