import { useEffect, useState } from "react";

function ColdStartLoader({ delayMs = 3000 }) {
  const [showColdStartMessage, setShowColdStartMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowColdStartMessage(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  return (
    <div className="text-center py-4">
      <div
        className="spinner-border mb-3"
        role="status"
        style={{ color: "var(--clarridge-navy)", width: "2rem", height: "2rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted small mb-0">
        {showColdStartMessage
          ? "Loading...Please wait"
          : "Loading..."}
      </p>
    </div>
  );
}

export default ColdStartLoader;