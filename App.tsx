import React from 'react';
import { FormBuilderProvider } from './context/FormBuilderContext';
import FormBuilder from './components/FormBuilder';

function App() {
  return (
    <FormBuilderProvider>
      <FormBuilder />
    </FormBuilderProvider>
  );
}

export default App;