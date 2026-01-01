import React, { useState, useEffect } from "react";
import "./CategoryDrawer.css";

type CategoryDrawerMode = "create" | "edit";

interface CategoryDrawerProps {
  mode: CategoryDrawerMode;
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (category: { nombre: string; descripcion: string; estado: "Activo" | "Inactivo" }) => void;
  category?: { id: number; nombre: string; descripcion: string; estado: "Activo" | "Inactivo" } | null;
  onUpdate?: (id: number, category: { nombre: string; descripcion: string; estado: "Activo" | "Inactivo" }) => void;
}

const CategoryDrawer: React.FC<CategoryDrawerProps> = ({
  mode,
  isOpen,
  onClose,
  onCreate,
  category,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    color: "",
    activo: true,
  });

  // Initialize form data when category changes (only in edit mode)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (mode === "edit" && category) {
      setFormData(prev => {
        const newData = {
          nombre: category.nombre,
          descripcion: category.descripcion,
          color: "", // Not used in backend
          activo: category.estado === "Activo",
        };
        // Only update if data has actually changed
        if (
          prev.nombre !== newData.nombre ||
          prev.descripcion !== newData.descripcion ||
          prev.activo !== newData.activo
        ) {
          return newData;
        }
        return prev;
      });
    } else if (mode === "create") {
      // Reset form for create mode
      setFormData(prev => {
        if (prev.nombre !== "" || prev.descripcion !== "" || !prev.activo) {
          return {
            nombre: "",
            descripcion: "",
            color: "",
            activo: true,
          };
        }
        return prev;
      });
    }
  }, [category, mode]);

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

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.nombre.trim() || !formData.descripcion.trim()) {
      alert("Por favor complete todos los campos requeridos.");
      return;
    }

    // Create category object
    const categoryData = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      estado: formData.activo ? "Activo" as const : "Inactivo" as const,
    };

    if (mode === "create" && onCreate) {
      onCreate(categoryData);
      // Reset form
      setFormData({
        nombre: "",
        descripcion: "",
        color: "",
        activo: true,
      });
    } else if (mode === "edit" && category && onUpdate) {
      onUpdate(category.id, categoryData);
    }

    // Close drawer
    onClose();
  };

  const title = mode === "create" ? "Crear categoria" : "Editar categoria";
  const buttonText = mode === "create" ? "Crear" : "Actualizar";

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
            {title}
          </h2>
          <button className="close-button" onClick={onClose} aria-label="Cerrar">
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
              <span className="upload-placeholder">Carga archivo</span>
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
            <input
              type="checkbox"
              id="activo-toggle"
              className="toggle-switch"
              checked={formData.activo}
              onChange={handleToggle}
              aria-label="Estado de la categoría"
            />
            <label htmlFor="activo-toggle" className="toggle-label">Activo</label>
          </div>
        </div>

        <div className="drawer-footer">
          <button className="btn btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className={`btn btn-create ${isFormValid ? 'active' : ''}`} onClick={handleSubmit}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryDrawer;
