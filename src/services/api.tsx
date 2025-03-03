import axios from 'axios';

const API_URL = 'https://dummyjson.com';

export interface BaseItem {
  id: number;
}

export interface Post extends BaseItem {
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: number;
}

export interface Recipe extends BaseItem {
  name: string;
  ingredients: string[];
  instructions: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
}

export interface Quote extends BaseItem {
  quote: string;
  author: string;
}

export interface Todo extends BaseItem {
  todo: string;
  completed: boolean;
  userId: number;
}

// Generic CRUD functions
export const fetchItems = async <T extends BaseItem>(endpoint: string): Promise<T[]> => {
  try {
    const response = await axios.get(`${API_URL}/${endpoint}`);
    return response.data.products || response.data.posts || response.data.todos || 
           response.data.quotes || response.data.recipes || [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
};

export const fetchItemById = async <T extends BaseItem>(endpoint: string, id: number): Promise<T | null> => {
  try {
    const response = await axios.get(`${API_URL}/${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint} with id ${id}:`, error);
    return null;
  }
};

export const createItem = async <T extends BaseItem>(endpoint: string, item: Omit<T, 'id'>): Promise<T | null> => {
  try {
    const response = await axios.post(`${API_URL}/${endpoint}/add`, item);
    return response.data;
  } catch (error) {
    console.error(`Error creating ${endpoint}:`, error);
    return null;
  }
};

export const updateItem = async <T extends BaseItem>(endpoint: string, id: number, item: Partial<T>): Promise<T | null> => {
  try {
    const response = await axios.put(`${API_URL}/${endpoint}/${id}`, item);
    return response.data;
  } catch (error) {
    console.error(`Error updating ${endpoint} with id ${id}:`, error);
    return null;
  }
};

export const deleteItem = async (endpoint: string, id: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/${endpoint}/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting ${endpoint} with id ${id}:`, error);
    return false;
  }
};

// Specific endpoints
export const postAPI = {
  getAll: () => fetchItems<Post>('posts'),
  getById: (id: number) => fetchItemById<Post>('posts', id),
  create: (post: Omit<Post, 'id'>) => createItem<Post>('posts', post),
  update: (id: number, post: Partial<Post>) => updateItem<Post>('posts', id, post),
  delete: (id: number) => deleteItem('posts', id)
};

export const recipeAPI = {
  getAll: () => fetchItems<Recipe>('recipes'),
  getById: (id: number) => fetchItemById<Recipe>('recipes', id),
  create: (recipe: Omit<Recipe, 'id'>) => createItem<Recipe>('recipes', recipe),
  update: (id: number, recipe: Partial<Recipe>) => updateItem<Recipe>('recipes', id, recipe),
  delete: (id: number) => deleteItem('recipes', id)
};

export const quoteAPI = {
  getAll: () => fetchItems<Quote>('quotes'),
  getById: (id: number) => fetchItemById<Quote>('quotes', id),
  create: (quote: Omit<Quote, 'id'>) => createItem<Quote>('quotes', quote),
  update: (id: number, quote: Partial<Quote>) => updateItem<Quote>('quotes', id, quote),
  delete: (id: number) => deleteItem('quotes', id)
};

export const todoAPI = {
  getAll: () => fetchItems<Todo>('todos'),
  getById: (id: number) => fetchItemById<Todo>('todos', id),
  create: (todo: Omit<Todo, 'id'>) => createItem<Todo>('todos', todo),
  update: (id: number, todo: Partial<Todo>) => updateItem<Todo>('todos', id, todo),
  delete: (id: number) => deleteItem('todos', id)
};