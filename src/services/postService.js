import api from './api';

// Serwis do obsługi postów
class PostService {
  // Pobieranie wszystkich postów
  async getAllPosts(params = {}) {
    const response = await api.get('/posts/all', { params });
    return response.data;
  }

  // Pobieranie posta po ID
  async getPostById(id) {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  }

  // Tworzenie nowego posta
  async createPost(postData) {
    try {
      const response = await api.post('/posts', postData);
      return response.data;
    } catch (error) {
      // Próbuj wyciągnąć konkretny błąd z odpowiedzi backendu
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.response?.data?.detail ||
                          (error.response?.status === 500 ? 'Błąd serwera - sprawdź logi backendu' : null) ||
                          error.message ||
                          'Wystąpił nieznany błąd podczas tworzenia posta';
      
      throw new Error(errorMessage);
    }
  }

  // Aktualizacja posta
  async updatePost(id, postData) {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  }

  // Usuwanie posta
  async deletePost(id) {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  }

  // Pobieranie komentarzy posta
  async getPostComments(postId) {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  }

  // Dodawanie komentarza do posta
  async addComment(postId, content) {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  }

  // Funkcje administracyjne
  async moderatePost(id, data) {
    const response = await api.patch(`/admin/posts/${id}/moderate`, data);
    return response.data;
  }

  // Pobieranie wszystkich postów dla admina (włącznie ze zmoderowanymi)
  async getAllPostsAdmin(params = {}) {
    const response = await api.get('/admin/posts', { params });
    return response.data;
  }

  // Pobieranie zgłoszonych postów
  async getReportedPosts() {
    const response = await api.get('/admin/posts/reported');
    return response.data;
  }

  // Zgłaszanie posta
  async reportPost(id, reason) {
    const response = await api.post(`/posts/${id}/report`, { reason });
    return response.data;
  }

  // === KOMENTARZE ===

  // Pobieranie komentarzy posta z opcjami sortowania
  async getPostComments(postId, options = {}) {
    const response = await api.get(`/posts/${postId}/comments`, { 
      params: options 
    });
    return response.data;
  }

  // Dodawanie odpowiedzi do komentarza
  async addCommentReply(parentId, content) {
    const response = await api.post(`/comments/${parentId}/replies`, { content });
    return response.data;
  }

  // Aktualizacja komentarza
  async updateComment(commentId, content) {
    const response = await api.put(`/comments/${commentId}`, { content });
    return response.data;
  }

  // Usuwanie komentarza
  async deleteComment(commentId) {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  }

  // Zgłaszanie komentarza
  async reportComment(commentId, reason) {
    const response = await api.post(`/comments/${commentId}/report`, { reason });
    return response.data;
  }
}

export default new PostService();
