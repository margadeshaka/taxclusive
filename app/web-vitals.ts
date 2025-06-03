import { initPerformanceMonitoring, reportWebVitals } from "@/lib/performance-monitoring";

// Initialize performance monitoring
initPerformanceMonitoring(reportWebVitals);

// Export for Next.js to use
export { reportWebVitals };
