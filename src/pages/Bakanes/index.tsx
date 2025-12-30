import React, { useState } from "react";
import { Search, Filter, Edit2, Trash2, Eye } from "lucide-react";
import "./Bakanes.css";

type Tab = "categorias" | "tipos" | "evidencias";

interface Category {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  estado: "Activo" | "Inactivo";
}

export default function Bakanes() {
  const [activeTab, setActiveTab] = useState<Tab>("categorias");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sample data matching Figma design
  const categories: Category[] = [
    {
      id: 1,
      nombre: "Foto + Descripción",
      descripcion: "Realizar actividad física al menos 30 minutos cada día",
      fecha: "Abr 3, 2024",
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "Foto + Descripción",
      descripcion: "Realizar actividad física al menos 30 minutos cada día",
      fecha: "Abr 3, 2024",
      estado: "Activo",
    },
  ];

  const totalItems = 40;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
        {/* Search */}
        <div className="bakanes-search-container">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600/70 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bakanes-search-input"
          />
        </div>

        {/* Filters */}
        <button className="bakanes-filter-button">
          <Filter className="w-5 h-5" />
          <span className="text-sm font-medium">Filtros</span>
        </button>

        {/* Create Button */}
        <button
          className="bakanes-create-button"
          style={{ marginLeft: "auto" }}
        >
          Crear tipo de categoria
        </button>
      </div>

      {/* Table */}
      <div className="bakanes-table-wrapper">
        <table className="bakanes-table">
          <thead>
            <tr>
              <th>Nombre de la categoría</th>
              <th>Icono de la categoría</th>
              <th>Estado</th>
              <th>Descripción</th>
              <th>Fecha de creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td style={{ fontWeight: 500 }}>{category.nombre}</td>
                <td>
                  <div className="icon-circle-gradient">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </td>
                <td style={{ textAlign: "center" }}>
                  <span className="status-badge-active">{category.estado}</span>
                </td>
                <td style={{ maxWidth: "400px" }}>{category.descripcion}</td>
                <td>{category.fecha}</td>
                <td>
                  <div className="action-buttons-container">
                    <button className="action-icon-button" title="Editar">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="action-icon-button" title="Eliminar">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="action-icon-button" title="Ver">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination-container">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Resultados por página</span>
            <select
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

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              1 - 10 de {totalItems}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="action-icon-button disabled:opacity-50"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="action-icon-button disabled:opacity-50"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="action-icon-button disabled:opacity-50"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="action-icon-button disabled:opacity-50"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
