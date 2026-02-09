"use client"

import { useState } from "react"
import { Clock8, LogOut, Plus } from "lucide-react"
import Link from "next/link"
import { useUser, signOut } from "@/lib/auth"
import styles from "./Navbar.module.css"

export default function Navbar() {
  const { user } = useUser()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className={styles.siteNav}>
      <nav>
        <header>
          <h1>
            <Link href="/heists">
              P<Clock8 className={styles.logo} size={14} strokeWidth={2.75} />
              cket Heist
            </Link>
          </h1>
          <div>Tiny missions. Big office mischief.</div>
        </header>
        <ul>
          {user && (
            <li>
              <button
                className={styles.btn}
                onClick={handleLogout}
                disabled={isLoggingOut}
                aria-label="Log out"
              >
                <LogOut size={20} strokeWidth={2} />
                Log Out
              </button>
            </li>
          )}
          <li>
            <Link href="/heists/create" className={styles.btn}>
              <Plus size={20} strokeWidth={2} />
              Create New Heist
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
