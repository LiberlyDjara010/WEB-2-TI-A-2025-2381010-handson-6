import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const crudModules = [
    {
      title: 'Posts',
      description: 'Manage blog posts with title, content, and tags',
      path: '/posts',
      icon: '📝',
    },
    {
      title: 'Recipes',
      description: 'Create and manage cooking recipes with ingredients and instructions',
      path: '/recipes',
      icon: '🍳',
    },
    {
      title: 'Quotes',
      description: 'Collect inspiring quotes from famous authors',
      path: '/QuotesPage',
      icon: '💬',
    },
    {
      title: 'Todos',
      description: 'Keep track of your tasks and mark them as completed',
      path: '/TodosPage',
      icon: '✅',
    },
  ];

  return (
    <div className="py-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">CRUD Operations Demo</h1>
        <p className="text-xl text-gray-600">
          A demonstration of CRUD operations using DummyJSON API
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {crudModules.map((module) => (
          <Link
            key={module.path}
            to={module.path}
            className="block p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex items-center">
              <div className="text-4xl mr-4">{module.icon}</div>
              <div>
                <h2 className="text-2xl font-bold">{module.title}</h2>
                <p className="text-gray-600">{module.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;