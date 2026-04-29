import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../api";
import styles from "./Login.module.css";

interface LoginData {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = async (data: LoginData) => {
    setServerError("");
    setIsSubmitting(true);

    try {
      const res = await api.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error: any) {
      setServerError(
        error?.response?.data?.msg || "Unable to log in right now. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.pageShell}>
      <section className={styles.heroPanel}>
        <span className={styles.eyebrow}>Customer Support Hub</span>
        <h1 className={styles.heroTitle}>Welcome back to your support workspace.</h1>
        <p className={styles.heroText}>
          Track tickets, respond faster, and keep customer conversations moving
          from one calm, focused dashboard.
        </p>

        <div className={styles.featureList}>
          <div className={styles.featureItem}>Live ticket visibility across your team</div>
          <div className={styles.featureItem}>Secure access for support agents</div>
          <div className={styles.featureItem}>A smoother workflow from login to resolution</div>
        </div>
      </section>

      <section className={styles.formPanel}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <span className={styles.badge}>Sign in</span>
            <h2>Log in to continue</h2>
            <p>Use your registered email and password to access the dashboard.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit(login)} noValidate>
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
                placeholder="Enter your password"
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

            {serverError ? <p className={styles.serverError}>{serverError}</p> : null}

            <button className={styles.button} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Log in"}
            </button>
          </form>

          <p className={styles.footerText}>
            New here? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
