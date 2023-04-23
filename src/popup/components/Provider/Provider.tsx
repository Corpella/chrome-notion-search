import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

export const Provider = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <QueryParamProvider adapter={ReactRouter6Adapter}>
      {children}
    </QueryParamProvider>
  </BrowserRouter>
);
