export function register() {
  // This function is called when the app is initialized
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Server-side instrumentation
  }

  if (typeof window !== "undefined") {
    // Client-side instrumentation
    import("./web-vitals").catch((err) => {
      console.error("Error importing web-vitals:", err);
    });
  }
}
