import api from './api';

// Serwis do obsługi pojazdów (marek, modeli, generacji)
class CarService {
  // === MARKI POJAZDÓW ===
  
  // Pobieranie wszystkich marek
  async getBrands() {
    const response = await api.get('/brands');
    return response.data;
  }

  // Pobieranie marki po ID
  async getBrandById(id) {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  }

  // Pobieranie modeli dla danej marki
  async getBrandModels(id) {
    const response = await api.get(`/brands/${id}/models`);
    return response.data;
  }

  // Tworzenie nowej marki
  async createBrand(brandData) {
    const response = await api.post('/brands', brandData);
    return response.data;
  }

  // Aktualizacja marki
  async updateBrand(id, brandData) {
    const response = await api.put(`/brands/${id}`, brandData);
    return response.data;
  }

  // Usuwanie marki
  async deleteBrand(id) {
    const response = await api.delete(`/brands/${id}`);
    return response.data;
  }

  // === MODELE POJAZDÓW ===
  
  // Pobieranie wszystkich modeli
  async getModels() {
    const response = await api.get('/models');
    return response.data;
  }

  // Pobieranie modelu po ID
  async getModelById(id) {
    const response = await api.get(`/models/${id}`);
    return response.data;
  }

  // Pobieranie generacji dla danego modelu
  async getModelGenerations(id) {
    const response = await api.get(`/models/${id}/generations`);
    return response.data;
  }

  // Tworzenie nowego modelu
  async createModel(modelData) {
    const response = await api.post('/models', modelData);
    return response.data;
  }

  // Aktualizacja modelu
  async updateModel(id, modelData) {
    const response = await api.put(`/models/${id}`, modelData);
    return response.data;
  }

  // Usuwanie modelu
  async deleteModel(id) {
    const response = await api.delete(`/models/${id}`);
    return response.data;
  }

  // === GENERACJE POJAZDÓW ===
  
  // Pobieranie wszystkich generacji
  async getGenerations() {
    const response = await api.get('/generations');
    return response.data;
  }

  // Pobieranie generacji po ID
  async getGenerationById(id) {
    const response = await api.get(`/generations/${id}`);
    return response.data;
  }

  // Tworzenie nowej generacji
  async createGeneration(generationData) {
    const response = await api.post('/generations', generationData);
    return response.data;
  }

  // Aktualizacja generacji
  async updateGeneration(id, generationData) {
    const response = await api.put(`/generations/${id}`, generationData);
    return response.data;
  }

  // Usuwanie generacji
  async deleteGeneration(id) {
    const response = await api.delete(`/generations/${id}`);
    return response.data;
  }
}

export default new CarService();
