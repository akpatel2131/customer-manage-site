import { useCallback, useEffect, useMemo, useState } from "react";
import api, { getApiErrorMessage } from "../api";
import CustomerForm, { CustomerFormValues } from "../components/CustomerForm";
import NotificationBanner from "../components/NotificationBanner";
import styles from "./Dashboard.module.css";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function Dashboard() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    tone: "success" | "error";
  } | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setPageError("");

    try {
      const res = await api.get<Customer[]>("/customers");
      setCustomers(res.data);
    } catch (error: unknown) {
      const message = getApiErrorMessage(
        error,
        "We couldn't load customers right now. Please refresh and try again."
      );
      setPageError(message);
      setNotification({ message, tone: "error" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const add = useCallback(
    async (formData: CustomerFormValues) => {
      setPageError("");

      try {
        await api.post("/customers", formData);
        await load();
        setNotification({
          message: "Customer created successfully.",
          tone: "success",
        });
      } catch (error: unknown) {
        const message = getApiErrorMessage(
          error,
          "We couldn't create that customer right now. Please try again."
        );
        setPageError(message);
        setNotification({ message, tone: "error" });
        throw error;
      }
    },
    [load]
  );

  const remove = useCallback(
    async (id: number) => {
      setPageError("");
      setIsDeletingId(id);

      try {
        await api.delete(`/customers/${id}`);
        await load();
        setNotification({
          message: "Customer deleted successfully.",
          tone: "success",
        });
      } catch (error: unknown) {
        const message = getApiErrorMessage(
          error,
          "We couldn't delete that customer right now. Please try again."
        );
        setPageError(message);
        setNotification({ message, tone: "error" });
      } finally {
        setIsDeletingId(null);
      }
    },
    [load]
  );

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!notification) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setNotification(null);
    }, 2600);

    return () => window.clearTimeout(timeoutId);
  }, [notification]);

  const stats = useMemo(
    () => ({
      totalCustomers: customers.length,
      companyEmails: customers.filter((customer) =>
        customer.email.toLowerCase().includes("@")
      ).length,
      phoneReadyContacts: customers.filter((customer) => customer.phone.trim()).length,
    }),
    [customers]
  );

  return (
    <main className={styles.pageShell}>
      <section className={styles.heroSection}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Support dashboard</span>
          <h1>Customer contact management with a calmer workflow.</h1>
          <p>
            Add new contacts quickly, keep your support roster organized, and
            maintain a clearer view of the people your team needs to follow up with.
          </p>
        </div>

        <div className={styles.statGrid}>
          <article className={styles.statCard}>
            <span>Total customers</span>
            <strong>{stats.totalCustomers}</strong>
            <p>All saved contacts currently tracked in your workspace.</p>
          </article>
          <article className={styles.statCard}>
            <span>Email ready</span>
            <strong>{stats.companyEmails}</strong>
            <p>Contacts available for direct email follow-up.</p>
          </article>
          <article className={styles.statCard}>
            <span>Phone ready</span>
            <strong>{stats.phoneReadyContacts}</strong>
            <p>Contacts with a phone number ready for quick outreach.</p>
          </article>
        </div>
      </section>

      <section className={styles.contentGrid}>
        <CustomerForm onSubmit={add} />

        <section className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div>
              <span className={styles.badge}>Customer list</span>
              <h2>Saved contacts</h2>
            </div>
            <p>Review, manage, and clean up your customer records from one place.</p>
          </div>

          {notification ? (
            <div className={styles.notificationWrap}>
              <NotificationBanner
                message={notification.message}
                tone={notification.tone}
              />
            </div>
          ) : null}

          {pageError ? <p className={styles.pageError}>{pageError}</p> : null}

          {isLoading ? (
            <div className={styles.emptyState}>
              <h3>Loading customers...</h3>
              <p>Your dashboard is pulling in the latest contact data.</p>
            </div>
          ) : customers.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No customers yet</h3>
              <p>
                Add your first customer from the form on the left to start building
                your support contact list.
              </p>
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      <td>
                        <button
                          className={styles.deleteButton}
                          onClick={() => remove(customer.id)}
                          disabled={isDeletingId === customer.id}
                        >
                          {isDeletingId === customer.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
