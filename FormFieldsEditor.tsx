import React, { useRef } from 'react';
import { useFormBuilder } from '../context/FormBuilderContext';
import { FormField } from '../types';
import { Trash2, GripVertical } from 'lucide-react';

interface FormFieldsEditorProps {
  onEditField: (field: FormField) => void;
}

const FormFieldsEditor: React.FC<FormFieldsEditorProps> = ({ onEditField }) => {
  const { state, deleteField, selectField, reorderFields } = useFormBuilder();
  const { currentForm, currentStepIndex, selectedFieldId } = state;
  const currentFields = currentForm.steps[currentStepIndex].fields;
  
  const dragField = useRef<number | null>(null);
  
  const handleDragStart = (index: number) => {
    dragField.current = index;
  };
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    const listItem = e.currentTarget as HTMLElement;
    const boundingRect = listItem.getBoundingClientRect();
    const mouseY = e.clientY;
    const thresholdY = boundingRect.top + boundingRect.height / 2;
    
    if (mouseY < thresholdY) {
      listItem.style.borderTop = '2px solid #3B82F6';
      listItem.style.borderBottom = 'none';
    } else {
      listItem.style.borderBottom = '2px solid #3B82F6';
      listItem.style.borderTop = 'none';
    }
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    const listItem = e.currentTarget as HTMLElement;
    listItem.style.borderTop = 'none';
    listItem.style.borderBottom = 'none';
  };
  
  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    const listItem = e.currentTarget as HTMLElement;
    listItem.style.borderTop = 'none';
    listItem.style.borderBottom = 'none';
    
    if (dragField.current === null) return;
    
    const boundingRect = listItem.getBoundingClientRect();
    const mouseY = e.clientY;
    const thresholdY = boundingRect.top + boundingRect.height / 2;
    
    let targetIndex = index;
    if (mouseY > thresholdY) {
      targetIndex += 1;
    }
    
    reorderFields(dragField.current, targetIndex);
    dragField.current = null;
  };
  
  const handleExternalDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fieldType = e.dataTransfer.getData('field-type');
    
    if (fieldType) {
      // This is handled in the main FormBuilder component
    }
  };
  
  const getFieldPreviewText = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return 'Text Input';
      case 'textarea':
        return 'Multiline Text';
      case 'select':
        return `Dropdown (${field.options?.length || 0} options)`;
      case 'checkbox':
        return 'Checkbox';
      case 'radio':
        return `Radio (${field.options?.length || 0} options)`;
      case 'date':
        return 'Date Picker';
      default:
        return field.type;
    }
  };
  
  return (
    <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="font-medium text-gray-800">Form Fields</h3>
      </div>
      
      <div 
        className="p-2 min-h-[200px]"
        onDrop={handleExternalDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {currentFields.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] border-2 border-dashed border-gray-300 rounded-md">
            <p className="text-gray-500 text-sm">Drag and drop fields here to add them to your form</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {currentFields.map((field, index) => (
              <li 
                key={field.id} 
                className={`p-3 rounded-md border ${selectedFieldId === field.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} cursor-pointer transition-colors flex items-center`}
                onClick={() => {
                  selectField(field.id);
                  onEditField(field);
                }}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="mr-2 cursor-grab text-gray-500">
                  <GripVertical size={16} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{field.label}</div>
                  <div className="text-sm text-gray-600">{getFieldPreviewText(field)}</div>
                </div>
                <button 
                  className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteField(field.id);
                  }}
                  aria-label={`Delete ${field.label}`}
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FormFieldsEditor;