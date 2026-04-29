import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { getApiErrorMessage } from "../api";
import styles from "./CustomerForm.module.css";

export interface CustomerFormValues {
  name: string;
  email: string;
  phone: string;
}

interface CustomerFormProps {
  onSubmit: (data: CustomerFormValues) => Promise<void>;
}

export default function CustomerForm({ onSubmit }: CustomerFormProps) {
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const submitCustomer = useCallback(
    async (data: CustomerFormValues) => {
      setServerError("");

      try {
        await onSubmit(data);
        reset();
      } catch (error: unknown) {
        setServerError(
          getApiErrorMessage(
            error,
            "We couldn't save this customer right now. Please try again."
          )
        );
      }
    },
    [onSubmit, reset]
  );

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <span className={styles.badge}>New customer</span>
        <h2>Add a contact in seconds</h2>
        <p>
          Capture the essentials quickly so your team can follow up with the
          right people without losing momentum.
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit(submitCustomer)} noValidate>
        <label className={styles.field}>
          <span>Full name</span>
          <input
            className={styles.input}
            type="text"
            placeholder="Avery Johnson"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters",
              },
            })}
          />
          {errors.name ? <small className={styles.errorText}>{errors.name.message}</small> : null}
        </label>

        <label className={styles.field}>
          <span>Email address</span>
          <input
            className={styles.input}
            type="email"
            placeholder="avery@company.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Enter a valid email address",
              },
            })}
          />
          {errors.email ? <small className={styles.errorText}>{errors.email.message}</small> : null}
        </label>

        <label className={styles.field}>
          <span>Phone number</span>
          <input
            className={styles.input}
            type="tel"
            placeholder="+1 202 555 0136"
            {...register("phone", {
              required: "Phone number is required",
              minLength: {
                value: 10,
                message: "Phone number must be at least 10 digits",
              },
            })}
          />
          {errors.phone ? <small className={styles.errorText}>{errors.phone.message}</small> : null}
        </label>

        {serverError ? <p className={styles.serverError}>{serverError}</p> : null}

        <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving customer..." : "Add customer"}
        </button>
      </form>
    </section>
  );
}
