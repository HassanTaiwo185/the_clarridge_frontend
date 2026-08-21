function ImagePreviewModal({ show, imageUrl, title, onClose }) {
  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(6, 21, 48, 0.75)", zIndex: 1060 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded overflow-hidden"
        style={{ maxWidth: "600px", width: "90%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h6 className="mb-0 fw-bold text-navy">{title}</h6>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
          />
        </div>
        <img
          src={imageUrl}
          alt={title}
          style={{ width: "100%", maxHeight: "70vh", objectFit: "contain", display: "block" }}
        />
      </div>
    </div>
  );
}

export default ImagePreviewModal;