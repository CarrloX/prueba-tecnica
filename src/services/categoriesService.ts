export interface Category {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  estado: "Activo" | "Inactivo";
}

const API_BASE_URL = 'http://localhost:8080/api/v1/categories';

class CategoriesService {
  async getAllCategories(): Promise<Category[]> {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error('Error al obtener categorías');
    }
    return response.json();
  }

  async getCategoryById(id: number): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener categoría');
    }
    return response.json();
  }

  async createCategory(categoryData: Omit<Category, 'id' | 'fecha'>): Promise<Category> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
      throw new Error('Error al crear categoría');
    }
    return response.json();
  }

  async updateCategory(id: number, categoryData: Partial<Omit<Category, 'id' | 'fecha'>>): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar categoría');
    }
    return response.json();
  }

  async deleteCategory(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar categoría');
    }
  }
}

export const categoriesService = new CategoriesService();
