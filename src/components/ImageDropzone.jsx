import { useState, useRef } from "react";

function ImageDropzone({ currentImageUrl, onFileSelect }) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    onFileSelect(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div>
      <label className="fw-semibold text-navy mb-2 d-block">Cover Image</label>
      <div className="d-flex gap-3">
        <div
          className="d-flex align-items-center justify-content-center bg-light rounded"
          style={{ width: "100px", height: "80px", flexShrink: 0, overflow: "hidden" }}
        >
          {preview || currentImageUrl ? (
            <img
              src={preview || currentImageUrl}
              alt="Current cover"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span className="text-muted small">Current</span>
          )}
        </div>

        <div
          className={`flex-grow-1 d-flex align-items-center justify-content-center rounded border ${
            dragActive ? "border-navy" : "border-dashed"
          }`}
          style={{
            borderStyle: "dashed",
            borderWidth: "2px",
            minHeight: "80px",
            cursor: "pointer",
            backgroundColor: dragActive ? "rgba(10, 31, 68, 0.04)" : "transparent",
          }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFile(e.dataTransfer.files[0]);
          }}
        >
          <span className="text-muted small text-center px-3">
            Drag and drop a new cover image, or click to browse
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="d-none"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>
      </div>
    </div>
  );
}

export default ImageDropzone;