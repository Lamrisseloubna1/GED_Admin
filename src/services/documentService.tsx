export interface DocumentData {
  id?: number;
  titre: string;
  auteur: string;
  description: string;
  file?: string;
  idTheme?: Theme;
}

export interface Theme {
  id: number;
  titre: string;
}
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/doc';
const THEME_API_URL = 'http://localhost:8080/api/theme';

// Fetch all documents
export const getAllDocuments = async (): Promise<DocumentData[]> => {
  try {
    const response = await axios.get<DocumentData[]>(`${API_URL}/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

// Add a new document
export const addDocument = async (documentData: DocumentData, file: File, themeId: number): Promise<DocumentData> => {
  const formData = new FormData();
  formData.append('titre', documentData.titre);
  formData.append('auteur', documentData.auteur);
  formData.append('description', documentData.description);
  formData.append('file', file);
  formData.append('idTheme', themeId.toString());

  try {
    const response = await axios.post<DocumentData>(`${API_URL}/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du document', error);
    throw error;
  }
};

export const updateDocument = async (
  id: number,
  documentData: DocumentData,
  file?: File // Optional file parameter
): Promise<DocumentData> => {
  try {
    // Create a FormData object to send the data
    const formData = new FormData();

    // Append the document fields
    formData.append('titre', documentData.titre);
    formData.append('auteur', documentData.auteur);
    formData.append('description', documentData.description);
    formData.append('idTheme', documentData.idTheme ? documentData.idTheme.toString() : '');

    // Append the file if it exists
    if (file) {
      formData.append('file', file);
    }

    // Perform the PUT request with the form data
    const response = await axios.put<DocumentData>(`${API_URL}/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set the correct content type
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du document', error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (id: number): Promise<boolean> => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.status === 204;
  } catch (error) {
    console.error('Erreur lors de la suppression du document', error);
    throw error;
  }
};

// Get a document by ID
export const getDocumentById = async (id: number): Promise<DocumentData> => {
  try {
    const response = await axios.get<DocumentData>(`${API_URL}/get/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du document', error);
    throw error;
  }
};

// Fetch all themes
export const getAllThemes = async (): Promise<Theme[]> => {
  try {
    const response = await axios.get<Theme[]>(THEME_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching themes:', error);
    throw error;
  }
};

// Fetch a theme by ID
export const getTheme = async (id: number): Promise<Theme> => {
  try {
    const response = await axios.get<Theme>(`${THEME_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching theme:', error);
    throw error;
  }
};
export const getTotalDocuments = async (): Promise<number> => {
  try {
    const response = await axios.get<number>(`${API_URL}/total`);
    return response.data;
  } catch (error) {
    console.error('Error fetching total documents:', error);
    throw error;
  }
};

export const getNewDocumentsThisMonth = async (): Promise<number> => {
  try {
    const response = await axios.get<number>(`${API_URL}/new-this-month`);
    return response.data;
  } catch (error) {
    console.error('Error fetching new documents this month:', error);
    throw error;
  }
};

