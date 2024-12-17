import React from 'react';

export const TestMovementsPage: React.FC = () => {
  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-primary">
        Página de Teste de Movimentos
      </h1>
      <div className="bg-blue-100 p-4 rounded-lg">
        <p className="text-blue-800">
          Esta é uma página de teste simples para verificar a navegação de movimentos.
        </p>
      </div>
    </div>
  );
};
