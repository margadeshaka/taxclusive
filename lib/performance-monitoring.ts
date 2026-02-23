export interface Metric {
  name: string;
  id: string;
  value: number;
  delta: number;
  rating?: "good" | "needs-improvement" | "poor";
  navigationType?: string;
}

export type ReportHandler = (metric: Metric) => void;

/**
 * Web Vitals reporting function
 * @param metric - The web vital metric to report
 */
export function reportWebVitals(metric: Metric) {
  if (process.env.NODE_ENV === "development") {
    console.warn("Web Vitals metric:", metric);
  }

  if (process.env.NODE_ENV === "production") {
    const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;
    if (!analyticsId) {
      return;
    }

    const body = {
      name: metric.name,
      id: metric.id,
      value: metric.value,
      delta: metric.delta,
      rating: metric.rating,
      navigationType: metric.navigationType,
    };

    fetch(`/api/vitals?id=${analyticsId}`, {
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((error) => {
      console.error("Error sending web vitals:", error);
    });
  }
}

/**
 * Initialize performance monitoring
 * Runtime web-vitals collection is intentionally optional to avoid hard dependency issues.
 */
export function initPerformanceMonitoring(onPerfEntry?: ReportHandler) {
  if (typeof window !== "undefined" && onPerfEntry && typeof onPerfEntry === "function") {
    // Hook kept for compatibility with callers; detailed metric collection can be wired here.
  }
}
