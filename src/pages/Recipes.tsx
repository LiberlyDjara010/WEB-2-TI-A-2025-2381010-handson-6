import React, { useEffect, useState } from 'react';
import { Recipe, recipeAPI } from '../services/api';
import { ItemList } from '../components/ItemList';
import { ItemForm } from '../components/ItemForm';

const initialRecipeState: Partial<Recipe> = {
  name: '',
  ingredients: [],
  instructions: '',
  prepTimeMinutes: 0,
  cookTimeMinutes: 0,
  servings: 1,
  difficulty: 'Easy',
  cuisine: '',
  caloriesPerServing: 0,
  tags: [],
  userId: 1
};

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRecipe, setEditingRecipe] = useState<Partial<Recipe> | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setIsLoading(true);
    const fetchedRecipes = await recipeAPI.getAll();
    setRecipes(fetchedRecipes);
    setIsLoading(false);
  };

  const handleCreateRecipe = () => {
    setEditingRecipe(initialRecipeState);
    setIsFormVisible(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsFormVisible(true);
  };

  const handleDeleteRecipe = async (recipe: Recipe) => {
    if (window.confirm(`Are you sure you want to delete "${recipe.name}"?`)) {
      const success = await recipeAPI.delete(recipe.id);
      if (success) {
        setRecipes(prev => prev.filter(r => r.id !== recipe.id));
      }
    }
  };

  const handleSubmitRecipe = async (recipe: Partial<Recipe>) => {
    try {
      if (recipe.id) {
        const updatedRecipe = await recipeAPI.update(recipe.id, recipe);
        if (updatedRecipe) {
          setRecipes(prev => prev.map(r => r.id === updatedRecipe.id ? updatedRecipe : r));
        }
      } else {
        const newRecipe = await recipeAPI.create(recipe as Omit<Recipe, 'id'>);
        if (newRecipe) {
          setRecipes(prev => [...prev, newRecipe]);
        }
      }
      setIsFormVisible(false);
      setEditingRecipe(null);
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const renderRecipeItem = (recipe: Recipe) => (
    <>
      <h3 className="text-xl font-semibold">{recipe.name}</h3>
      <p className="text-gray-600 mt-2">{recipe.cuisine} • {recipe.difficulty}</p>
      <div className="mt-2">
        <p>Prep: {recipe.prepTimeMinutes} mins | Cook: {recipe.cookTimeMinutes} mins</p>
        <p>Servings: {recipe.servings} | Calories: {recipe.caloriesPerServing} per serving</p>
      </div>
      <div className="mt-2 text-sm">
        <span className="text-blue-500">
          {recipe.tags?.map(tag => `#${tag}`).join(' ')}
        </span>
      </div>
    </>
  );

  const renderRecipeFormFields = (recipe: Partial<Recipe>, handleChange: (field: keyof Recipe, value: any) => void) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Recipe Name</label>
        <input
          type="text"
          value={recipe.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Ingredients (one per line)</label>
        <textarea
          value={recipe.ingredients?.join('\n') || ''}
          onChange={(e) => handleChange('ingredients', e.target.value.split('\n').map(i => i.trim()).filter(i => i))}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Instructions</label>
        <textarea
          value={recipe.instructions || ''}
          onChange={(e) => handleChange('instructions', e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Prep Time (minutes)</label>
          <input
            type="number"
            value={recipe.prepTimeMinutes || 0}
            onChange={(e) => handleChange('prepTimeMinutes', parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cook Time (minutes)</label>
          <input
            type="number"
            value={recipe.cookTimeMinutes || 0}
            onChange={(e) => handleChange('cookTimeMinutes', parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Servings</label>
          <input
            type="number"
            value={recipe.servings || 1}
            onChange={(e) => handleChange('servings', parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Calories Per Serving</label>
          <input
            type="number"
            value={recipe.caloriesPerServing || 0}
            onChange={(e) => handleChange('caloriesPerServing', parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Difficulty</label>
          <select
            value={recipe.difficulty || 'Easy'}
            onChange={(e) => handleChange('difficulty', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cuisine</label>
          <input
            type="text"
            value={recipe.cuisine || ''}
            onChange={(e) => handleChange('cuisine', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
        <input
          type="text"
          value={recipe.tags?.join(', ') || ''}
          onChange={(e) => handleChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="text-center py-10">Loading recipes...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Recipes</h1>
        <button
          onClick={handleCreateRecipe}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add New Recipe
        </button>
      </div>

      {isFormVisible ? (
        <ItemForm<Recipe>
          initialItem={editingRecipe || initialRecipeState}
          onSubmit={handleSubmitRecipe}
          onCancel={() => setIsFormVisible(false)}
          renderFormFields={renderRecipeFormFields}
          title={editingRecipe?.id ? 'Edit Recipe' : 'Create New Recipe'}
        />
      ) : (
        <ItemList<Recipe>
          items={recipes}
          renderItem={renderRecipeItem}
          onEdit={handleEditRecipe}
          onDelete={handleDeleteRecipe}
          title="All Recipes"
        />
      )}
    </div>
  );
};

export default Recipes;