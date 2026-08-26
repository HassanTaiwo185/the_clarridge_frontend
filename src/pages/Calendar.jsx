import { useEffect, useState } from "react";
import PublicNavbar from "../components/PublicNavbar";
import { getPublicCalendarEvents } from "../api/calendarPublic";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPublicCalendarEvents();
        setEvents(res.data);
      } catch {
        setError("Unable to load calendar events right now.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const eventsForMonth = events.filter((e) => {
    const startMonth = new Date(e.start_date).getMonth() + 1;
    return startMonth === selectedMonth;
  });

  return (
    <div>
      <PublicNavbar />

      <div style={{ backgroundColor: "var(--clarridge-navy)" }} className="text-white py-4">
        <div className="container d-flex justify-content-between align-items-start flex-wrap gap-2">
          <div>
            <div className="small text-uppercase fw-semibold mb-1" style={{ color: "var(--clarridge-gold)", letterSpacing: "1px" }}>
              Programme Timeline
            </div>
            <h1 className="fw-normal mb-0" style={{ fontSize: "1.75rem" }}>
              The Clarridge Calendar
            </h1>
          </div>
          <p className="small text-white-50 mb-0 text-end" style={{ maxWidth: "320px" }}>
            Month-by-month view of the Year One programme calendar 
          </p>
        </div>
      </div>

      <div className="container py-5" style={{ maxWidth: "800px" }}>
        <div className="d-flex align-items-center gap-2 mb-2">
          <span style={{ width: "30px", height: "1px", backgroundColor: "var(--clarridge-gold)" }} />
          <span className="text-uppercase fw-semibold" style={{ color: "var(--clarridge-gold)", fontSize: "0.8rem", letterSpacing: "1px" }}>
            Year One
          </span>
        </div>
        <h2 className="text-navy fw-normal mb-4" style={{ fontSize: "1.75rem" }}>
          The Clarridge Calendar
        </h2>

        <div className="d-flex flex-wrap gap-2 mb-4">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((monthNum) => (
            <button
              key={monthNum}
              type="button"
              className="btn btn-sm rounded-circle fw-semibold"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: selectedMonth === monthNum ? "var(--clarridge-navy)" : "#fff",
                color: selectedMonth === monthNum ? "#fff" : "var(--clarridge-navy)",
                border: "1px solid #ddd",
              }}
              onClick={() => setSelectedMonth(monthNum)}
            >
              {String(monthNum).padStart(2, "0")}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-muted">Loading calendar...</p>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
            <h6
              className="text-uppercase fw-bold mb-3"
              style={{ color: "var(--clarridge-gold)", fontSize: "0.85rem", letterSpacing: "1px" }}
            >
              Month {String(selectedMonth).padStart(2, "0")} Highlights
            </h6>

            {eventsForMonth.length === 0 ? (
              <p className="text-muted">No events scheduled for {MONTHS[selectedMonth - 1]}.</p>
            ) : (
              <div>
                {eventsForMonth.map((e, idx) => (
                  <div
                    key={e.id}
                    className="d-flex align-items-start gap-4 py-3"
                    style={{
                      borderBottom: idx < eventsForMonth.length - 1 ? "1px solid #e5e7eb" : "none",
                    }}
                  >
                    <div className="text-muted small fw-semibold flex-shrink-0" style={{ minWidth: "70px" }}>
                      {e.week_label}
                    </div>
                    <div>
                      <div className="fw-semibold text-navy">{e.title}</div>
                      {e.description && (
                        <div className="small text-muted mt-1">{e.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Calendar;