import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '36px', color: '#2c3e50', textAlign: 'center', marginBottom: '40px' }}>Web 2 TI-A 2025 Hands-on Project</h1>
      
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '30px', 
        borderRadius: '10px', 
        boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)', 
        marginBottom: '30px' 
      }}>
        <p style={{ fontSize: '18px', lineHeight: 1.6, color: '#34495e', marginBottom: '20px' }}>
          Welcome to this demo application built with React and TypeScript. This project demonstrates 
          fetching and displaying data from external APIs, as well as managing component state.
        </p>
        <p style={{ fontSize: '18px', lineHeight: 1.6, color: '#34495e', marginBottom: '20px' }}>
          Use the navigation links below to explore different sections of the application:
        </p>
      </div>
      
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '50px' }}>
        <Link 
          to="/todos" 
          style={{ 
            backgroundColor: '#3498db', 
            color: 'white', 
            textDecoration: 'none', 
            padding: '15px 25px', 
            borderRadius: '8px', 
            fontSize: '18px', 
            fontWeight: 'bold', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
          }}
        >
          Todos
        </Link>
        <Link 
          to="/comments" 
          style={{ 
            backgroundColor: '#9b59b6', 
            color: 'white', 
            textDecoration: 'none', 
            padding: '15px 25px', 
            borderRadius: '8px', 
            fontSize: '18px', 
            fontWeight: 'bold', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
          }}
        >
          Comments
        </Link>
        <Link 
          to="/recipes" 
          style={{ 
            backgroundColor: '#27ae60', 
            color: 'white', 
            textDecoration: 'none', 
            padding: '15px 25px', 
            borderRadius: '8px', 
            fontSize: '18px', 
            fontWeight: 'bold', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
          }}
        >
          Recipes
        </Link>
      </nav>
    </div>
  );
};

export default HomePage;