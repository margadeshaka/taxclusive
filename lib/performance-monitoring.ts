import { ReportHandler, Metric } from "web-vitals";

/**
 * Web Vitals reporting function
 * @param metric - The web vital metric to report
 */
export function reportWebVitals(metric: Metric) {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.warn("Web Vitals metric:", metric);
  }

  // Send to analytics service in production
  if (process.env.NODE_ENV === "production") {
    // Example: Send to Google Analytics
    const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;
    if (analyticsId) {
      // This is a placeholder for sending to your analytics service
      // Replace with your actual analytics implementation
      const body = {
        name: metric.name,
        id: metric.id,
        value: metric.value,
        delta: metric.delta,
        rating: metric.rating,
        navigationType: metric.navigationType,
      };

      // Example: Send to a custom endpoint
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
}

/**
 * Initialize performance monitoring
 * @param onPerfEntry - Optional callback for performance entries
 */
export function initPerformanceMonitoring(onPerfEntry?: ReportHandler) {
  if (typeof window !== "undefined" && onPerfEntry && onPerfEntry instanceof Function) {
    import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry); // Cumulative Layout Shift
      getFID(onPerfEntry); // First Input Delay
      getFCP(onPerfEntry); // First Contentful Paint
      getLCP(onPerfEntry); // Largest Contentful Paint
      getTTFB(onPerfEntry); // Time to First Byte
    });
  }
}
