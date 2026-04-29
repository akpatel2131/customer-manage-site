import styles from "./NotificationBanner.module.css";

interface NotificationBannerProps {
  message: string;
  tone?: "success" | "error";
}

export default function NotificationBanner({
  message,
  tone = "success",
}: NotificationBannerProps) {
  return (
    <div
      className={`${styles.banner} ${
        tone === "success" ? styles.success : styles.error
      }`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
