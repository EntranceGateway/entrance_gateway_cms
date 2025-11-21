import api from "./index";

// Create a product
export const createNotes = async (Data) => {
  return await api.post("/api/v1/notes", Data);
};

// Get all products
export const getProducts = async () => {
  return await api.get("/api/v1/notes");
};

// Update product by id
export const updateProduct = async (id, Data) => {
  return await api.put(`/api/v1/notes/getNotefile/${id}`, Data);
};

// Delete product by id
export const deleteProduct = async (id) => {
  return await api.delete(`/api/v1/notes/${id}`);
};
