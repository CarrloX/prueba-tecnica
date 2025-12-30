import React, { useState } from "react";
import "./CreateCategoryDrawer.css";

interface CreateCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (category: { nombre: string; descripcion: string; estado: "Activo" | "Inactivo" }) => void;
}

const CreateCategoryDrawer: React.FC<CreateCategoryDrawerProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    color: "",
    activo: true,
  });

  // Check if form is valid (required fields filled)
  const isFormValid = formData.nombre.trim() && formData.descripcion.trim();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, activo: !prev.activo }));
  };

  // Prevent click on drawer from closing it
  const handleDrawerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCreate = () => {
    // Validate required fields
    if (!formData.nombre.trim() || !formData.descripcion.trim()) {
      alert("Por favor complete todos los campos requeridos.");
      return;
    }

    // Create category object
    const newCategory = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      estado: formData.activo ? "Activo" as const : "Inactivo" as const,
    };

    // Call onCreate callback
    onCreate(newCategory);

    // Reset form
    setFormData({
      nombre: "",
      descripcion: "",
      color: "",
      activo: true,
    });

    // Close drawer
    onClose();
  };

  return (
    <div className={`drawer-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div
        className="drawer-container"
        onClick={handleDrawerClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="drawer-header">
          <h2 id="drawer-title" className="drawer-title">
            Crear categoria
          </h2>
          <button className="close-button" onClick={onClose}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L13 13M1 13L13 1"
                stroke="#333"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="drawer-form">
          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              Nombre de la categoria*
            </label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              className="form-input"
              placeholder="Escribe el nombre de la buena acción"
              value={formData.nombre}
              onChange={handleInputChange}
            />
          </div>

          {/* Description Field */}
          <div className="form-group">
            <label htmlFor="descripcion" className="form-label">
              Descripción de la buena acción*
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              className="form-textarea"
              placeholder="Agregar descripción"
              maxLength={200}
              value={formData.descripcion}
              onChange={handleInputChange}
            />
            <div className="char-count">{formData.descripcion.length}/200</div>
          </div>

          {/* Logo Field (Mock) */}
          <div className="form-group">
            <label className="form-label">Logo*</label>
            <div
              className="file-upload-box"
              role="button"
              tabIndex={0}
              aria-label="Cargar archivo"
            >
              <span style={{ color: "#aaa" }}>Carga archivo</span>
              <svg
                className="upload-icon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 11V3M8 3L4 7M8 3L12 7"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.5 13H13.5"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Color Field */}
          <div className="form-group">
            <label htmlFor="color" className="form-label">
              Color*
            </label>
            <input
              id="color"
              type="text"
              name="color"
              className="form-input"
              placeholder="Registra color codigo HEX"
              value={formData.color}
              onChange={handleInputChange}
            />
          </div>

          {/* Active Toggle */}
          <div className="toggle-container">
            <div
              className={`toggle-switch ${formData.activo ? "active" : ""}`}
              onClick={handleToggle}
              role="switch"
              aria-checked={formData.activo}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleToggle();
              }}
            >
              <div className="toggle-slider"></div>
            </div>
            <span className="toggle-label">Activo</span>
          </div>
        </div>

        <div className="drawer-footer">
          <button className="btn btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className={`btn btn-create ${isFormValid ? 'active' : ''}`} onClick={handleCreate}>Crear</button>
        </div>
      </div>
    </div>
  );
};

export default CreateCategoryDrawer;
