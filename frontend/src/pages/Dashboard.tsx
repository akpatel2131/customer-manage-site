import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getApiErrorMessage, isUnauthorizedError } from "../api";
import { clearAuthToken } from "../auth";
import CustomerForm, { CustomerFormValues } from "../components/CustomerForm";
import NotificationBanner from "../components/NotificationBanner";
import styles from "./Dashboard.module.css";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface CustomerListResponse {
  items: Customer[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  summary: {
    totalCustomers: number;
    emailReady: number;
    phoneReady: number;
  };
}

const PAGE_SIZE = 10;

export default function Dashboard() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    tone: "success" | "error";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [summary, setSummary] = useState({
    totalCustomers: 0,
    emailReady: 0,
    phoneReady: 0,
  });
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

  const logout = useCallback(() => {
    clearAuthToken();
    navigate("/", { replace: true });
  }, [navigate]);

  const load = useCallback(async (page = currentPage) => {
    setPageError("");

    try {
      const res = await api.get<CustomerListResponse>("/customers", {
        params: {
          page,
          limit: PAGE_SIZE,
        },
      });
      setCustomers(res.data.items);
      setPagination(res.data.pagination);
      setSummary(res.data.summary);
      setCurrentPage(res.data.pagination.page);
    } catch (error: unknown) {
      if (isUnauthorizedError(error)) {
        logout();
        return;
      }

      const message = getApiErrorMessage(
        error,
        "We couldn't load customers right now. Please refresh and try again."
      );
      setPageError(message);
      setNotification({ message, tone: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, logout]);

  const add = useCallback(
    async (formData: CustomerFormValues) => {
      setPageError("");
      setIsLoading(true);

      try {
        await api.post("/customers", formData);
        await load(1);
        setNotification({
          message: "Customer created successfully.",
          tone: "success",
        });
      } catch (error: unknown) {
        if (isUnauthorizedError(error)) {
          logout();
          return;
        }

        const message = getApiErrorMessage(
          error,
          "We couldn't create that customer right now. Please try again."
        );
        setPageError(message);
        setNotification({ message, tone: "error" });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [load, logout]
  );

  const remove = useCallback(
    async (id: number) => {
      setPageError("");
      setIsDeletingId(id);

      try {
        await api.delete(`/customers/${id}`);
        const nextPage =
          customers.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
        await load(nextPage);
        setNotification({
          message: "Customer deleted successfully.",
          tone: "success",
        });
      } catch (error: unknown) {
        if (isUnauthorizedError(error)) {
          logout();
          return;
        }

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
    [currentPage, customers.length, load, logout]
  );

  useEffect(() => {
    load(currentPage);
  }, [currentPage, load]);

  useEffect(() => {
    if (!notification) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setNotification(null);
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [notification]);

  const stats = useMemo(
    () => ({
      totalCustomers: summary.totalCustomers,
      companyEmails: summary.emailReady,
      phoneReadyContacts: summary.phoneReady,
    }),
    [summary]
  );

  const changePage = useCallback((page: number) => {
    if (page === currentPage || page < 1 || page > pagination.totalPages) {
      return;
    }

    setIsLoading(true);
    setCurrentPage(page);
  }, [currentPage, pagination.totalPages]);

  return (
    <main className={styles.pageShell}>
      <section className={styles.heroSection}>
        <div className={styles.heroTopBar}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Support dashboard</span>
            <h1>Customer contact management with a calmer workflow.</h1>
            <p>
              Add new contacts quickly, keep your support roster organized, and
              maintain a clearer view of the people your team needs to follow up with.
            </p>
          </div>

          <button className={styles.logoutButton} onClick={logout}>
            Log out
          </button>
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
            <>
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

              <div className={styles.mobileCardList}>
                {customers.map((customer) => (
                  <article key={customer.id} className={styles.mobileCard}>
                    <div className={styles.mobileCardRow}>
                      <span className={styles.mobileLabel}>Name</span>
                      <strong>{customer.name}</strong>
                    </div>

                    <div className={styles.mobileCardRow}>
                      <span className={styles.mobileLabel}>Email</span>
                      <p>{customer.email}</p>
                    </div>

                    <div className={styles.mobileCardRow}>
                      <span className={styles.mobileLabel}>Phone</span>
                      <p>{customer.phone}</p>
                    </div>

                    <button
                      className={styles.deleteButton}
                      onClick={() => remove(customer.id)}
                      disabled={isDeletingId === customer.id}
                    >
                      {isDeletingId === customer.id ? "Deleting..." : "Delete"}
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}

          {!isLoading && pagination.totalPages > 1 ? (
            <div className={styles.paginationBar}>
              <button
                className={styles.paginationButton}
                onClick={() => changePage(currentPage - 1)}
                disabled={!pagination.hasPreviousPage}
              >
                Previous
              </button>

              <p className={styles.paginationStatus}>
                Page {pagination.page} of {pagination.totalPages}
              </p>

              <button
                className={styles.paginationButton}
                onClick={() => changePage(currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
              </button>
            </div>
          ) : null}
        </section>
      </section>

      {notification ? (
        <NotificationBanner
          message={notification.message}
          tone={notification.tone}
        />
      ) : null}
    </main>
  );
}
