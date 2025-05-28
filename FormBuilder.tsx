import React, { useState, useRef } from 'react';
import { useFormBuilder } from '../context/FormBuilderContext';
import { FormField } from '../types';
import { v4 as uuidv4 } from 'uuid';
import FormBuilderHeader from './FormBuilderHeader';
import FormBuilderSidebar from './FormBuilderSidebar';
import FormFieldsEditor from './FormFieldsEditor';
import FieldConfigPanel from './FieldConfigPanel';
import FormPreview from './FormPreview';
import StepManager from './StepManager';

const FormBuilder: React.FC = () => {
  const { state, createField } = useFormBuilder();
  const { selectedFieldId } = state;
  
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  
  const handleFieldClick = (field: FormField) => {
    setSelectedField(field);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.add('bg-blue-50', 'border-blue-300');
    }
  };
  
  const handleDragLeave = () => {
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove('bg-blue-50', 'border-blue-300');
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove('bg-blue-50', 'border-blue-300');
    }
    
    const fieldType = e.dataTransfer.getData('field-type');
    
    if (fieldType) {
      createField(fieldType as any);
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <FormBuilderHeader />
      
      <div className="flex flex-1 overflow-hidden">
        <FormBuilderSidebar />
        
        <div 
          className="flex-1 p-4 overflow-hidden"
          ref={dropAreaRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="grid grid-cols-2 gap-4 h-full">
            <div className="space-y-4 overflow-hidden flex flex-col">
              <div className="flex-shrink-0">
                <StepManager />
              </div>
              
              <div className="flex-1 overflow-hidden">
                <FormFieldsEditor onEditField={handleFieldClick} />
              </div>
              
              {selectedFieldId && (
                <div className="h-[500px] flex-shrink-0">
                  <FieldConfigPanel field={selectedField} />
                </div>
              )}
            </div>
            
            <div className="border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
              <FormPreview onFieldClick={handleFieldClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;