function ConfirmDialog({ show, title, message, confirmLabel = "Confirm", onConfirm, onCancel, variant = "navy" }) {
  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(6, 21, 48, 0.5)", zIndex: 1060 }}
      onClick={onCancel}
    >
      <div
        className="glass-card bg-white p-4"
        style={{ maxWidth: "400px", width: "90%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h5 className="text-navy fw-bold mb-2">{title}</h5>
        <p className="text-muted small mb-4">{message}</p>
        <div className="d-flex gap-2 justify-content-end">
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={`btn ${variant === "danger" ? "btn-danger" : "btn-navy"}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;