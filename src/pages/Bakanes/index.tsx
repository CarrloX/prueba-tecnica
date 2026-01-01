import { useState, useEffect, useRef } from "react";
import { MdSwapVert } from "react-icons/md";
import CategoryDrawer from "../../components/CategoryDrawer/CategoryDrawer";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { categoriesService, type Category } from "../../services/categoriesService";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./Bakanes.css";

// Hook to detect mobile screen size
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

type Tab = "categorias" | "tipos" | "evidencias";

export default function Bakanes() {
  const { user } = useAuthContext();
  const isMobile = useIsMobile();

  const [activeTab, setActiveTab] = useState<Tab>("categorias");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // API states
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Column order state for reordering columns
  const [columnOrder, setColumnOrder] = useState<string[]>([
    'nombre', 'icono', 'estado', 'descripcion', 'fecha', 'acciones'
  ]);

  // Column widths state for resizing
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    'nombre': 200,
    'icono': 100,
    'estado': 120,
    'descripcion': 300,
    'fecha': 150,
    'acciones': 200
  });

  // Resizing state for UI feedback
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);

  // Global cursor state for better UX during resize
  const [globalCursor, setGlobalCursor] = useState<string>('');

  // Resizing ref to avoid stale closure issues
  const resizingRef = useRef<{
    column: string;
    startX: number;
    startWidth: number;
  } | null>(null);

  // Function to add a new category using API
  const addCategory = async (newCategory: Omit<Category, 'id' | 'fecha'>) => {
    if (!user) {
      setError('Usuario no autenticado');
      return;
    }

    try {
      const createdCategory = await categoriesService.createCategory(newCategory, user.id);
      setCategories(prev => [...prev, createdCategory]);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error creating category:', err);
      setError('Error al crear la categoría');
    }
  };

  // Function to show delete confirmation modal
  const deleteCategory = (category: Category) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  };

  // Function to confirm and delete a category
  const confirmDeleteCategory = async () => {
    if (!user || !deletingCategory) {
      setError('Usuario no autenticado o categoría no encontrada');
      return;
    }

    try {
      await categoriesService.deleteCategory(deletingCategory.id, user.id);
      setCategories(prev => prev.filter(cat => cat.id !== deletingCategory.id));
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Error al eliminar la categoría');
    }
  };

  // Function to handle edit
  const editCategory = (category: Category) => {
    setEditingCategory(category);
    setIsEditDrawerOpen(true);
  };

  // Function to update a category using API
  const updateCategory = async (id: number, updatedCategory: { nombre: string; descripcion: string; estado: "Activo" | "Inactivo" }) => {
    if (!user) {
      setError('Usuario no autenticado');
      return;
    }

    try {
      const result = await categoriesService.updateCategory(id, updatedCategory, user.id);
      setCategories(prev => prev.map(cat => cat.id === id ? result : cat));
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Error al actualizar la categoría');
    }
  };

  const totalItems = 40;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Column definitions
  const columnDefinitions: Record<string, { label: string; key: string }> = {
    nombre: { label: 'Nombre de la categoría', key: 'nombre' },
    icono: { label: 'Icono de la categoría', key: 'icono' },
    estado: { label: 'Estado', key: 'estado' },
    descripcion: { label: 'Descripción', key: 'descripcion' },
    fecha: { label: 'Fecha de creación', key: 'fecha' },
    acciones: { label: 'Acciones', key: 'acciones' }
  };

  // Función para intercambiar posiciones de columnas
  const swapColumns = (fromColumn: string, toColumn: string) => {
    const fromIndex = columnOrder.indexOf(fromColumn);
    const toIndex = columnOrder.indexOf(toColumn);

    if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
      const newColumnOrder = [...columnOrder];
      [newColumnOrder[fromIndex], newColumnOrder[toIndex]] = [newColumnOrder[toIndex], newColumnOrder[fromIndex]];
      setColumnOrder(newColumnOrder);
    }
    setOpenDropdownId(null); // Cerrar dropdown después del intercambio
  };

  // Función para manejar el inicio del redimensionamiento
  const handleMouseDown = (column: string, event: React.MouseEvent) => {
    if (!column || !columnWidths) return;

    event.preventDefault();
    event.stopPropagation(); // Evita que se activen otros eventos

    const startX = event.clientX;
    const startWidth = columnWidths[column] || 150;

    setResizingColumn(column);
    resizingRef.current = {
      column,
      startX,
      startWidth
    };

    // Cambiar cursor globalmente mientras se arrastra
    setGlobalCursor('col-resize');

    const handleMouseMove = (e: MouseEvent) => {
      if (resizingRef.current && resizingRef.current.column) {
        // Usamos requestAnimationFrame para mejor rendimiento visual
        requestAnimationFrame(() => {
          const diff = e.clientX - resizingRef.current!.startX;
          const newWidth = Math.max(80, resizingRef.current!.startWidth + diff); // Mínimo 80px

          setColumnWidths(prev => {
            if (!prev || !resizingRef.current?.column) return prev;
            return {
              ...prev,
              [resizingRef.current.column]: newWidth
            };
          });
        });
      }
    };

    const handleMouseUp = () => {
      resizingRef.current = null;
      setResizingColumn(null);
      setGlobalCursor(''); // Restaurar cursor
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Función para renderizar el contenido de una celda según la columna
  const renderCell = (category: Category, columnKey: string) => {
    switch (columnKey) {
      case 'nombre':
        return <td key={columnKey} className="cell-name">{category.nombre}</td>;
      case 'icono':
        return (
          <td key={columnKey} className="cell-icon">
            <div className="icon-circle-gradient">
              <svg
                width="14"
                height="21"
                viewBox="0 0 12 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 12V9.33333C0 8.41111 0.325 7.625 0.975 6.975C1.625 6.325 2.41111 6 3.33333 6H10.4833C10.9056 6 11.2639 6.14444 11.5583 6.43333C11.8528 6.72222 12 7.07778 12 7.5C12 7.84444 11.8944 8.15278 11.6833 8.425C11.4722 8.69722 11.2056 8.87778 10.8833 8.96667L9.33333 9.41667V12C9.33333 12.2333 9.28056 12.4444 9.175 12.6333C9.06944 12.8222 8.92778 12.9778 8.75 13.1C8.57222 13.2222 8.37778 13.2972 8.16667 13.325C7.95556 13.3528 7.73889 13.3222 7.51667 13.2333L4.36667 12H0ZM8 10H4.25C4.17222 10 4.11389 10.0222 4.075 10.0667C4.03611 10.1111 4.01111 10.1611 4 10.2167C3.98889 10.2722 3.99722 10.325 4.025 10.375C4.05278 10.425 4.1 10.4611 4.16667 10.4833L8 12V10ZM1.33333 10.6667H2.73333C2.71111 10.6 2.69444 10.5333 2.68333 10.4667C2.67222 10.4 2.66667 10.3278 2.66667 10.25C2.66667 9.81667 2.82222 9.44444 3.13333 9.13333C3.44444 8.82222 3.81667 8.66667 4.25 8.66667H6.96667L10.5333 7.68333C10.5889 7.66111 10.6278 7.63333 10.65 7.6C10.6722 7.56667 10.6778 7.52778 10.6667 7.48333C10.6556 7.43889 10.6361 7.40278 10.6083 7.375C10.5806 7.34722 10.5389 7.33333 10.4833 7.33333H3.33333C2.77778 7.33333 2.30556 7.52778 1.91667 7.91667C1.52778 8.30556 1.33333 8.77778 1.33333 9.33333V10.6667ZM4.66667 5.33333C3.93333 5.33333 3.30556 5.07222 2.78333 4.55C2.26111 4.02778 2 3.4 2 2.66667C2 1.93333 2.26111 1.30556 2.78333 0.783333C3.30556 0.261111 3.93333 0 4.66667 0C5.4 0 6.02778 0.261111 6.55 0.783333C7.07222 1.30556 7.33333 1.93333 7.33333 2.66667C7.33333 3.4 7.07222 4.02778 6.55 4.55C6.02778 5.07222 5.4 5.33333 4.66667 5.33333ZM4.66667 4C5.03333 4 5.34722 3.86944 5.60833 3.60833C5.86944 3.34722 6 3.03333 6 2.66667C6 2.3 5.86944 1.98611 5.60833 1.725C5.34722 1.46389 5.03333 1.33333 4.66667 1.33333C4.3 1.33333 3.98611 1.46389 3.725 1.725C3.46389 1.98611 3.33333 2.3 3.33333 2.66667C3.33333 3.03333 3.46389 3.34722 3.725 3.60833C3.98611 3.86944 4.3 4 4.66667 4Z"
                  fill="black"
                />
              </svg>
            </div>
          </td>
        );
      case 'estado': {
        const statusClass = category.estado === "Activo" ? "active" : "inactive";
        return (
          <td key={columnKey} className="cell-estado">
            <span className={`status-badge-${statusClass}`}>{category.estado}</span>
          </td>
        );
      }
      case 'descripcion':
        return <td key={columnKey} className="cell-desc">{category.descripcion}</td>;
      case 'fecha':
        return <td key={columnKey} className="cell-fecha">{category.fecha}</td>;
      case 'acciones':
        return (
          <td key={columnKey} className="cell-acciones">
            <div className="action-buttons-container">
              <button
                className="action-icon-button"
                title="Editar"
                onClick={() => editCategory(category)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.37251 6.01333L9.98584 6.62667L3.94584 12.6667H3.33251V12.0533L9.37251 6.01333ZM11.7725 2C11.6058 2 11.4325 2.06667 11.3058 2.19333L10.0858 3.41333L12.5858 5.91333L13.8058 4.69333C14.0658 4.43333 14.0658 4.01333 13.8058 3.75333L12.2458 2.19333C12.1125 2.06 11.9458 2 11.7725 2ZM9.37251 4.12667L1.99918 11.5V14H4.49918L11.8725 6.62667L9.37251 4.12667Z"
                    fill="#28272A"
                  />
                </svg>
              </button>
              <button
                className="action-icon-button"
                title="Eliminar"
                onClick={() => deleteCategory(category)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.6667 6V12.6667H5.33334V6H10.6667ZM9.66668 2H6.33334L5.66668 2.66667H3.33334V4H12.6667V2.66667H10.3333L9.66668 2ZM12 4.66667H4.00001V12.6667C4.00001 13.4 4.60001 14 5.33334 14H10.6667C11.4 14 12 13.4 12 12.6667V4.66667Z"
                    fill="#28272A"
                  />
                </svg>
              </button>
              <button className="action-icon-button" title="Visualizar">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 15 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.33333 8.49333C8.4379 8.49333 9.33333 6.78008 9.33333 4.66667C9.33333 2.55326 8.4379 0.84 7.33333 0.84C6.22876 0.84 5.33333 2.55326 5.33333 4.66667C5.33333 6.78008 6.22876 8.49333 7.33333 8.49333Z"
                    fill="#28272A"
                  />
                  <path
                    d="M5.36 7.91333C5.14 7.96667 4.90667 8 4.66667 8C2.82667 8 1.33333 6.50667 1.33333 4.66667C1.33333 2.82667 2.82667 1.33333 4.66667 1.33333C4.90667 1.33333 5.14 1.36667 5.36 1.42C5.62 1.04667 5.94667 0.673333 6.35333 0.333333C5.83333 0.126667 5.26667 0 4.66667 0C2.09333 0 0 2.09333 0 4.66667C0 7.24 2.09333 9.33333 4.66667 9.33333C5.26667 9.33333 5.83333 9.20667 6.35333 9C5.94667 8.66 5.62 8.28667 5.36 7.91333Z"
                    fill="#28272A"
                  />
                  <path
                    d="M10 0C9.4 0 8.83333 0.126667 8.31333 0.333333C8.72 0.673333 9.04667 1.04667 9.30667 1.42C9.52667 1.36667 9.76 1.33333 10 1.33333C11.84 1.33333 13.3333 2.82667 13.3333 4.66667C13.3333 6.50667 11.84 8 10 8C9.76 8 9.52667 7.96667 9.30667 7.91333C9.04667 8.28667 8.72 8.66 8.31333 9C8.83333 9.20667 9.4 9.33333 10 9.33333C12.5733 9.33333 14.6667 7.24 14.6667 4.66667C14.6667 2.09333 14.6667 0 10 0Z"
                    fill="#28272A"
                  />
                </svg>
              </button>
            </div>
          </td>
        );
      default:
        return <td key={columnKey}></td>;
    }
  };

  // Fetch categories on component mount and when user changes
  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) {
        setCategories([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const fetchedCategories = await categoriesService.getAllCategories(user.id);
        setCategories(fetchedCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Error al cargar las categorías');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [user]);

  // useEffect para manejar clics fuera del dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.column-swap-container')) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // useEffect para aplicar cursor global
  useEffect(() => {
    document.body.style.cursor = globalCursor;
  }, [globalCursor]);

  return (
    <div className="bakanes-container">
      {/* Header */}
      <h1 className="bakanes-title">Categorías</h1>

      {/* Tabs */}
      <div className="bakanes-tabs-container">
        <button
          onClick={() => setActiveTab("categorias")}
          className={`bakanes-tab ${
            activeTab === "categorias"
              ? "bakanes-tab-active"
              : "bakanes-tab-inactive"
          }`}
        >
          Categorías
          {activeTab === "categorias" && (
            <div className="bakanes-tab-underline"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("tipos")}
          className={`bakanes-tab ${
            activeTab === "tipos"
              ? "bakanes-tab-active"
              : "bakanes-tab-inactive"
          }`}
        >
          Tipos
          {activeTab === "tipos" && (
            <div className="bakanes-tab-underline"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("evidencias")}
          className={`bakanes-tab ${
            activeTab === "evidencias"
              ? "bakanes-tab-active"
              : "bakanes-tab-inactive"
          }`}
        >
          Evidencias
          {activeTab === "evidencias" && (
            <div className="bakanes-tab-underline"></div>
          )}
        </button>
      </div>

      {/* Toolbar */}
      <div className="bakanes-toolbar">
        <div className="bakanes-toolbar-group">
          {/* Search */}
          <div className="bakanes-search-container">
            <div className="bakanes-search-input-wrapper">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="search-icon-svg"
              >
                <path
                  d="M8.33333 7.33333H7.80667L7.62 7.15333C8.27333 6.39333 8.66667 5.40667 8.66667 4.33333C8.66667 1.94 6.72667 0 4.33333 0C1.94 0 0 1.94 0 4.33333C0 6.72667 1.94 8.66667 4.33333 8.66667C5.40667 8.66667 6.39333 8.27333 7.15333 7.62L7.33333 7.80667V8.33333L10.6667 11.66L11.66 10.6667L8.33333 7.33333ZM4.33333 7.33333C2.67333 7.33333 1.33333 5.99333 1.33333 4.33333C1.33333 2.67333 2.67333 1.33333 4.33333 1.33333C5.99333 1.33333 7.33333 2.67333 7.33333 4.33333C7.33333 5.99333 5.99333 7.33333 4.33333 7.33333Z"
                  fill="#1840B2"
                />
              </svg>
              <input
                type="text"
                placeholder="Buscar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bakanes-search-input"
              />
            </div>
          </div>

          {/* Filters */}
          <button className="bakanes-filter-button">
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.9743 1.33343L8.64096 1.33395L5.30063 5.53369L1.9743 1.33343ZM0.140984 1.07328C1.48751 2.80006 3.97393 6.00025 3.97393 6.00025L3.97361 10.0003C3.97358 10.3669 4.27356 10.6669 4.64023 10.667L5.97356 10.6671C6.34023 10.6671 6.64025 10.3671 6.64028 10.0005L6.6406 6.00046C6.6406 6.00046 9.12085 2.80066 10.4677 1.0741C10.8077 0.634126 10.4944 0.000767541 9.94107 0.000723854L0.667736 -8.31464e-06C0.114403 -5.20026e-05 -0.198981 0.633257 0.140984 1.07328Z"
                fill="#28272A"
              />
            </svg>
            <span className="text-sm font-medium">Filtros</span>
          </button>
        </div>

        {/* Create Button */}
        <button
          className="bakanes-create-button"
          onClick={() => setIsDrawerOpen(true)}
        >
          Crear tipo de categoria
        </button>
      </div>

      {/* Table */}
      <div className="bakanes-table-wrapper">
        {/* Dinamic column width styles (generated from state) */}
        <style>{Object.keys(columnWidths).map(k => `.bakanes-table th.col-${k} { width: ${columnWidths[k]}px; }`).join('\n')}</style>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="table-container">
          {loading ? (
            <div className="loading-placeholder">
              Cargando categorías...
            </div>
          ) : isMobile ? (
            // Mobile card layout
            <div className="mobile-cards-container">
              {categories.length === 0 ? (
                <div className="empty-state">
                  No hay categorías disponibles
                </div>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="category-card">
                    <div className="card-header">
                      <div className="card-icon">
                        <div className="icon-circle-gradient">
                          <svg
                            width="16"
                            height="24"
                            viewBox="0 0 12 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0 12V9.33333C0 8.41111 0.325 7.625 0.975 6.975C1.625 6.325 2.41111 6 3.33333 6H10.4833C10.9056 6 11.2639 6.14444 11.5583 6.43333C11.8528 6.72222 12 7.07778 12 7.5C12 7.84444 11.8944 8.15278 11.6833 8.425C11.4722 8.69722 11.2056 8.87778 10.8833 8.96667L9.33333 9.41667V12C9.33333 12.2333 9.28056 12.4444 9.175 12.6333C9.06944 12.8222 8.92778 12.9778 8.75 13.1C8.57222 13.2222 8.37778 13.2972 8.16667 13.325C7.95556 13.3528 7.73889 13.3222 7.51667 13.2333L4.36667 12H0ZM8 10H4.25C4.17222 10 4.11389 10.0222 4.075 10.0667C4.03611 10.1111 4.01111 10.1611 4 10.2167C3.98889 10.2722 3.99722 10.325 4.025 10.375C4.05278 10.425 4.1 10.4611 4.16667 10.4833L8 12V10ZM1.33333 10.6667H2.73333C2.71111 10.6 2.69444 10.5333 2.68333 10.4667C2.67222 10.4 2.66667 10.3278 2.66667 10.25C2.66667 9.81667 2.82222 9.44444 3.13333 9.13333C3.44444 8.82222 3.81667 8.66667 4.25 8.66667H6.96667L10.5333 7.68333C10.5889 7.66111 10.6278 7.63333 10.65 7.6C10.6722 7.56667 10.6778 7.52778 10.6667 7.48333C10.6556 7.43889 10.6361 7.40278 10.6083 7.375C10.5806 7.34722 10.5389 7.33333 10.4833 7.33333H3.33333C2.77778 7.33333 2.30556 7.52778 1.91667 7.91667C1.52778 8.30556 1.33333 8.77778 1.33333 9.33333V10.6667ZM4.66667 5.33333C3.93333 5.33333 3.30556 5.07222 2.78333 4.55C2.26111 4.02778 2 3.4 2 2.66667C2 1.93333 2.26111 1.30556 2.78333 0.783333C3.30556 0.261111 3.93333 0 4.66667 0C5.4 0 6.02778 0.261111 6.55 0.783333C7.07222 1.30556 7.33333 1.93333 7.33333 2.66667C7.33333 3.4 7.07222 4.02778 6.55 4.55C6.02778 5.07222 5.4 5.33333 4.66667 5.33333ZM4.66667 4C5.03333 4 5.34722 3.86944 5.60833 3.60833C5.86944 3.34722 6 3.03333 6 2.66667C6 2.3 5.86944 1.98611 5.60833 1.725C5.34722 1.46389 5.03333 1.33333 4.66667 1.33333C4.3 1.33333 3.98611 1.46389 3.725 1.725C3.46389 1.98611 3.33333 2.3 3.33333 2.66667C3.33333 3.03333 3.46389 3.34722 3.725 3.60833C3.98611 3.86944 4.3 4 4.66667 4Z"
                              fill="black"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="card-title-section">
                        <h3 className="card-title">{category.nombre}</h3>
                        <span className={`status-badge-mobile ${category.estado === "Activo" ? "active" : "inactive"}`}>
                          {category.estado}
                        </span>
                      </div>
                    </div>

                    <div className="card-content">
                      <p className="card-description">{category.descripcion}</p>
                      <div className="card-meta">
                        <span className="card-date">{category.fecha}</span>
                      </div>
                    </div>

                    <div className="card-actions">
                      <button
                        className="card-action-btn edit-btn"
                        onClick={() => editCategory(category)}
                        title="Editar"
                      >
                        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.37251 6.01333L9.98584 6.62667L3.94584 12.6667H3.33251V12.0533L9.37251 6.01333ZM11.7725 2C11.6058 2 11.4325 2.06667 11.3058 2.19333L10.0858 3.41333L12.5858 5.91333L13.8058 4.69333C14.0658 4.43333 14.0658 4.01333 13.8058 3.75333L12.2458 2.19333C12.1125 2.06 11.9458 2 11.7725 2ZM9.37251 4.12667L1.99918 11.5V14H4.49918L11.8725 6.62667L9.37251 4.12667Z" fill="#28272A"/>
                        </svg>
                        Editar
                      </button>
                      <button
                        className="card-action-btn view-btn"
                        title="Visualizar"
                      >
                        <svg width="18" height="18" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.33333 8.49333C8.4379 8.49333 9.33333 6.78008 9.33333 4.66667C9.33333 2.55326 8.4379 0.84 7.33333 0.84C6.22876 0.84 5.33333 2.55326 5.33333 4.66667C5.33333 6.78008 6.22876 8.49333 7.33333 8.49333Z" fill="#28272A"/>
                          <path d="M5.36 7.91333C5.14 7.96667 4.90667 8 4.66667 8C2.82667 8 1.33333 6.50667 1.33333 4.66667C1.33333 2.82667 2.82667 1.33333 4.66667 1.33333C4.90667 1.33333 5.14 1.36667 5.36 1.42C5.62 1.04667 5.94667 0.673333 6.35333 0.333333C5.83333 0.126667 5.26667 0 4.66667 0C2.09333 0 0 2.09333 0 4.66667C0 7.24 2.09333 9.33333 4.66667 9.33333C5.26667 9.33333 5.83333 9.20667 6.35333 9C5.94667 8.66 5.62 8.28667 5.36 7.91333Z" fill="#28272A"/>
                          <path d="M10 0C9.4 0 8.83333 0.126667 8.31333 0.333333C8.72 0.673333 9.04667 1.04667 9.30667 1.42C9.52667 1.36667 9.76 1.33333 10 1.33333C11.84 1.33333 13.3333 2.82667 13.3333 4.66667C13.3333 6.50667 11.84 8 10 8C9.76 8 9.52667 7.96667 9.30667 7.91333C9.04667 8.28667 8.72 8.66 8.31333 9C8.83333 9.20667 9.4 9.33333 10 9.33333C12.5733 9.33333 14.6667 7.24 14.6667 4.66667C14.6667 2.09333 14.6667 0 10 0Z" fill="#28272A"/>
                        </svg>
                        Ver
                      </button>
                      <button
                        className="card-action-btn delete-btn"
                        onClick={() => deleteCategory(category)}
                        title="Eliminar"
                      >
                        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.6667 6V12.6667H5.33334V6H10.6667ZM9.66668 2H6.33334L5.66668 2.66667H3.33334V4H12.6667V2.66667H10.3333L9.66668 2ZM12 4.66667H4.00001V12.6667C4.00001 13.4 4.60001 14 5.33334 14H10.6667C11.4 14 12 13.4 12 12.6667V4.66667Z" fill="#DC2626"/>
                        </svg>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            // Desktop table layout
            <table className="bakanes-table">
              <thead>
                <tr>
                  {columnOrder.map((columnKey, index) => (
                    <th
                      key={columnKey}
                      className={`col-${columnKey}`}
                    >
                      <div className="th-container">
                        <span>{columnDefinitions[columnKey].label}</span>
                        <div className="column-swap-container">
                          <button
                            className="column-swap-button"
                            title="Intercambiar columna"
                            onClick={() => setOpenDropdownId(openDropdownId === columnKey ? null : columnKey)}
                          >
                            <MdSwapVert size={16} />
                          </button>
                          {openDropdownId === columnKey && (
                            <div className="column-swap-dropdown">
                              {columnOrder
                                .filter(col => col !== columnKey)
                                .map(col => (
                                  <button
                                    key={col}
                                    className="column-swap-dropdown-item"
                                    onClick={() => swapColumns(columnKey, col)}
                                  >
                                    Intercambiar con "{columnDefinitions[col].label}"
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* AQUÍ ESTÁ EL CAMBIO:
                          El resizer va dentro del th.
                          No mostramos resizer en la última columna para evitar scroll horizontal innecesario
                      */}
                      {index < columnOrder.length - 1 && (
                        <div
                          className={`resizer ${resizingColumn === columnKey ? 'is-resizing' : ''}`}
                          onMouseDown={(e) => handleMouseDown(columnKey, e)}
                        />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columnOrder.length}
                      className="empty-state"
                    >
                      No hay categorías disponibles
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id}>
                      {columnOrder.map((columnKey) => renderCell(category, columnKey))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="pagination-container">
          <div className="results-per-page-group">
            <label htmlFor="results-per-page-select" className="results-per-page-label">Resultados por página</label>
            <select
              id="results-per-page-select"
              aria-label="Resultados por página"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="results-per-page-select"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="pagination-nav">
            <span className="text-gray-600 text-sm">
              1 - 10 de {totalItems}
            </span>
            <div className="pagination-arrows-group">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="pagination-arrow"
                title="Ir a la primera página"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="pagination-arrow"
                title="Página anterior"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="pagination-arrow"
                title="Página siguiente"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="pagination-arrow"
                title="Ir a la última página"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <CategoryDrawer
        mode="create"
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onCreate={addCategory}
      />

      <CategoryDrawer
        mode="edit"
        isOpen={isEditDrawerOpen}
        onClose={() => {
          setIsEditDrawerOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onUpdate={updateCategory}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteCategory}
        title="Eliminar categoría"
        message={`¿Estás seguro de que quieres eliminar la categoría "${deletingCategory?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}
