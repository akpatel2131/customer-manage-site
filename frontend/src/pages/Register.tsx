import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api, { getApiErrorMessage } from "../api";
import NotificationBanner from "../components/NotificationBanner";
import styles from "./Register.module.css";

interface RegisterData {
  email: string;
  password: string;
  userName: string;
}

export default function Register() {
  const navigate = useNavigate();
  const redirectTimeoutRef = useRef<number | null>(null);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegisterData & { confirmPassword: string }>({
    defaultValues: {
      email: "",
      password: "",
      userName: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");
  const confirmPasswordRules = useMemo(
    () => ({
      required: "Please confirm your password",
      validate: (value: string) =>
        value === passwordValue || "Passwords do not match",
    }),
    [passwordValue]
  );

  const registerUser = useCallback(
    async (data: RegisterData & { confirmPassword: string }) => {
      setServerError("");
      setSuccessMessage("");
      setIsSubmitting(true);

      try {
        await api.post("/auth/register", {
          email: data.email,
          password: data.password,
          userName: data.userName,
        });
        setSuccessMessage("Registration successful. Redirecting you to login...");
        reset();
        redirectTimeoutRef.current = window.setTimeout(() => navigate("/"), 1200);
      } catch (error: unknown) {
        setServerError(
          getApiErrorMessage(error, "Unable to register right now. Please try again.")
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [navigate, reset]
  );

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  return (
    <main className={styles.pageShell}>
      <section className={styles.heroPanel}>
        <span className={styles.eyebrow}>Join The Team</span>
        <h1 className={styles.heroTitle}>Create your support account in a cleaner flow.</h1>
        <p className={styles.heroText}>
          Set up your profile, start collaborating with your team, and step into a
          workspace designed for quick, confident customer support.
        </p>

        <div className={styles.featureList}>
          <div className={styles.featureItem}>Fast onboarding for new support agents</div>
          <div className={styles.featureItem}>Clear validation so mistakes are easy to fix</div>
          <div className={styles.featureItem}>Responsive design that feels polished on any screen</div>
        </div>
      </section>

      <section className={styles.formPanel}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <span className={styles.badge}>Register</span>
            <h2>Create your account</h2>
            <p>Fill in your details to get started with the support dashboard.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit(registerUser)} noValidate>
            <label className={styles.field}>
              <span>User name</span>
              <input
                className={styles.input}
                type="text"
                placeholder="Krunal Patel"
                {...register("userName", {
                  required: "User name is required",
                  minLength: {
                    value: 3,
                    message: "User name must be at least 3 characters",
                  },
                })}
              />
              {errors.userName ? (
                <small className={styles.errorText}>{errors.userName.message}</small>
              ) : null}
            </label>

            <label className={styles.field}>
              <span>Email address</span>
              <input
                className={styles.input}
                type="email"
                placeholder="agent@supporthub.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email ? (
                <small className={styles.errorText}>{errors.email.message}</small>
              ) : null}
            </label>

            <label className={styles.field}>
              <span>Password</span>
              <input
                className={styles.input}
                type="password"
                placeholder="Create a secure password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password ? (
                <small className={styles.errorText}>{errors.password.message}</small>
              ) : null}
            </label>

            <label className={styles.field}>
              <span>Confirm password</span>
              <input
                className={styles.input}
                type="password"
                placeholder="Re-enter your password"
                {...register("confirmPassword", confirmPasswordRules)}
              />
              {errors.confirmPassword ? (
                <small className={styles.errorText}>
                  {errors.confirmPassword.message}
                </small>
              ) : null}
            </label>

            {serverError ? (
              <NotificationBanner message={serverError} tone="error" />
            ) : null}
            {successMessage ? (
              <NotificationBanner message={successMessage} tone="success" />
            ) : null}

            <button className={styles.button} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className={styles.footerText}>
            Already have an account? <Link to="/">Log in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
