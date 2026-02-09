"use client";

import { Clock8 } from "lucide-react";
import styles from "./Spinner.module.css";

export default function Spinner() {
  return (
    <div className="center-content">
      <Clock8
        size={48}
        className={styles.spinner}
        aria-label="Loading"
      />
    </div>
  );
}
