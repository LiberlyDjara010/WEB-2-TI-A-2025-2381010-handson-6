// src/pages/QuotesPage.tsx
import React, { useEffect, useState } from 'react';
import { Quote, quoteAPI } from '../services/api';
import { ItemList } from '../components/ItemList';
import { ItemForm } from '../components/ItemForm';

const initialQuoteState: Partial<Quote> = {
  quote: '',
  author: ''
};

const QuotesPage: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingQuote, setEditingQuote] = useState<Partial<Quote> | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setIsLoading(true);
    const fetchedQuotes = await quoteAPI.getAll();
    setQuotes(fetchedQuotes);
    setIsLoading(false);
  };

  const handleCreateQuote = () => {
    setEditingQuote(initialQuoteState);
    setIsFormVisible(true);
  };

  const handleEditQuote = (quote: Quote) => {
    setEditingQuote(quote);
    setIsFormVisible(true);
  };

  const handleDeleteQuote = async (quote: Quote) => {
    if (window.confirm(`Are you sure you want to delete this quote?`)) {
      const success = await quoteAPI.delete(quote.id);
      if (success) {
        setQuotes(prev => prev.filter(q => q.id !== quote.id));
      }
    }
  };

  const handleSubmitQuote = async (quote: Partial<Quote>) => {
    try {
      if (quote.id) {
        const updatedQuote = await quoteAPI.update(quote.id, quote);
        if (updatedQuote) {
          setQuotes(prev => prev.map(q => q.id === updatedQuote.id ? updatedQuote : q));
        }
      } else {
        const newQuote = await quoteAPI.create(quote as Omit<Quote, 'id'>);
        if (newQuote) {
          setQuotes(prev => [...prev, newQuote]);
        }
      }
      setIsFormVisible(false);
      setEditingQuote(null);
    } catch (error) {
      console.error('Error saving quote:', error);
    }
  };

  const renderQuoteItem = (quote: Quote) => (
    <>
      <blockquote className="italic text-lg">"{quote.quote}"</blockquote>
      <p className="text-right mt-2 font-semibold">— {quote.author}</p>
    </>
  );

  const renderQuoteFormFields = (quote: Partial<Quote>, handleChange: (field: keyof Quote, value: any) => void) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Quote</label>
        <textarea
          value={quote.quote || ''}
          onChange={(e) => handleChange('quote', e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Author</label>
        <input
          type="text"
          value={quote.author || ''}
          onChange={(e) => handleChange('author', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="text-center py-10">Loading quotes...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quotes</h1>
        <button
          onClick={handleCreateQuote}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add New Quote
        </button>
      </div>

      {isFormVisible ? (
        <ItemForm<Quote>
          initialItem={editingQuote || initialQuoteState}
          onSubmit={handleSubmitQuote}
          onCancel={() => setIsFormVisible(false)}
          renderFormFields={renderQuoteFormFields}
          title={editingQuote?.id ? 'Edit Quote' : 'Create New Quote'}
        />
      ) : (
        <ItemList<Quote>
          items={quotes}
          renderItem={renderQuoteItem}
          onEdit={handleEditQuote}
          onDelete={handleDeleteQuote}
          title="All Quotes"
        />
      )}
    </div>
  );
};

export default QuotesPage;