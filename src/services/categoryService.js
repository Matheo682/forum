import api from './api';

// Serwis do obsługi kategorii
class CategoryService {
  // Pobieranie wszystkich kategorii
  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  }

  // Pobieranie kategorii po ID
  async getCategoryById(id) {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  }

  // Tworzenie nowej kategorii
  async createCategory(categoryData) {
    const response = await api.post('/categories', categoryData);
    return response.data;
  }

  // Aktualizacja kategorii
  async updateCategory(id, categoryData) {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  }

  // Usuwanie kategorii
  async deleteCategory(id) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
}

export default new CategoryService();
