import React, { useState, useEffect } from 'react';
import { BaseItem } from '../services/api';

interface ItemFormProps<T extends BaseItem> {
  initialItem: Partial<T>;
  onSubmit: (item: Partial<T>) => void;
  onCancel: () => void;
  renderFormFields: (item: Partial<T>, handleChange: (field: keyof T, value: any) => void) => React.ReactNode;
  title: string;
}

export function ItemForm<T extends BaseItem>({
  initialItem,
  onSubmit,
  onCancel,
  renderFormFields,
  title
}: ItemFormProps<T>) {
  const [item, setItem] = useState<Partial<T>>(initialItem);

  useEffect(() => {
    setItem(initialItem);
  }, [initialItem]);

  const handleChange = (field: keyof T, value: any) => {
    setItem(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(item);
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {renderFormFields(item, handleChange)}
        <div className="mt-6 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}