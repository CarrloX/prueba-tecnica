export interface Category {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  estado: "Activo" | "Inactivo";
}

const API_BASE_URL = 'http://localhost:8080/api/v1/categories';

class CategoriesService {
  private getHeaders(userId: number) {
    return {
      'Content-Type': 'application/json',
      'X-User-Id': userId.toString(),
    };
  }

  async getAllCategories(userId: number): Promise<Category[]> {
    const response = await fetch(API_BASE_URL, {
      headers: this.getHeaders(userId),
    });
    if (!response.ok) {
      throw new Error('Error al obtener categorías');
    }
    return response.json();
  }

  async getCategoryById(id: number, userId: number): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      headers: this.getHeaders(userId),
    });
    if (!response.ok) {
      throw new Error('Error al obtener categoría');
    }
    return response.json();
  }

  async createCategory(categoryData: Omit<Category, 'id' | 'fecha'>, userId: number): Promise<Category> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: this.getHeaders(userId),
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
      throw new Error('Error al crear categoría');
    }
    return response.json();
  }

  async updateCategory(id: number, categoryData: Partial<Omit<Category, 'id' | 'fecha'>>, userId: number): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(userId),
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar categoría');
    }
    return response.json();
  }

  async deleteCategory(id: number, userId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(userId),
    });
    if (!response.ok) {
      throw new Error('Error al eliminar categoría');
    }
  }
}

export const categoriesService = new CategoriesService();
