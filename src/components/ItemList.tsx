import React from 'react';
import { BaseItem } from '../services/api';

interface ItemListProps<T extends BaseItem> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  title: string;
}

export function ItemList<T extends BaseItem>({ 
  items, 
  renderItem, 
  onEdit, 
  onDelete, 
  title 
}: ItemListProps<T>) {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 shadow-sm bg-white">
              {renderItem(item)}
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => onEdit(item)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}