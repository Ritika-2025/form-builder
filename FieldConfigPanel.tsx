import React, { useState, useEffect } from 'react';
import { useFormBuilder } from '../context/FormBuilderContext';
import { FormField, FieldOption } from '../types';
import { X, Plus, Trash2 } from 'lucide-react';

interface FieldConfigPanelProps {
  field: FormField | null;
}

const FieldConfigPanel: React.FC<FieldConfigPanelProps> = ({ field }) => {
  const { updateField, selectField } = useFormBuilder();
  const [localField, setLocalField] = useState<FormField | null>(null);
  
  useEffect(() => {
    setLocalField(field ? { ...field } : null);
  }, [field]);
  
  if (!localField) {
    return null;
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name.startsWith('validation.')) {
      const validationProperty = name.split('.')[1];
      setLocalField({
        ...localField,
        validation: {
          ...localField.validation,
          [validationProperty]: type === 'checkbox' 
            ? (e.target as HTMLInputElement).checked 
            : (type === 'number' ? Number(value) : value)
        }
      });
    } else {
      setLocalField({
        ...localField,
        [name]: value
      });
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (name.startsWith('validation.')) {
      const validationProperty = name.split('.')[1];
      setLocalField({
        ...localField,
        validation: {
          ...localField.validation,
          [validationProperty]: checked
        }
      });
    } else {
      setLocalField({
        ...localField,
        [name]: checked
      });
    }
  };
  
  const handleOptionChange = (index: number, key: keyof FieldOption, value: string) => {
    if (!localField.options) return;
    
    const newOptions = [...localField.options];
    newOptions[index] = {
      ...newOptions[index],
      [key]: value
    };
    
    setLocalField({
      ...localField,
      options: newOptions
    });
  };
  
  const addOption = () => {
    if (!localField.options) {
      setLocalField({
        ...localField,
        options: []
      });
    }
    
    setLocalField({
      ...localField,
      options: [
        ...(localField.options || []),
        { label: `Option ${(localField.options?.length || 0) + 1}`, value: `option${(localField.options?.length || 0) + 1}` }
      ]
    });
  };
  
  const removeOption = (index: number) => {
    if (!localField.options) return;
    
    setLocalField({
      ...localField,
      options: localField.options.filter((_, i) => i !== index)
    });
  };
  
  const handleSave = () => {
    if (localField) {
      updateField(localField);
    }
  };
  
  useEffect(() => {
    // Save field when it changes
    if (localField && field && JSON.stringify(localField) !== JSON.stringify(field)) {
      handleSave();
    }
  }, [localField]);
  
  return (
    <div className="border border-gray-200 rounded-md overflow-hidden bg-white h-full flex flex-col">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium text-gray-800">Field Properties</h3>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={() => selectField(null)}
          aria-label="Close properties panel"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="p-4 overflow-y-auto flex-1">
        <div className="space-y-4">
          <div>
            <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
              Label
            </label>
            <input
              type="text"
              id="label"
              name="label"
              value={localField.label}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Field Name (for form data)
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={localField.name}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="placeholder" className="block text-sm font-medium text-gray-700 mb-1">
              Placeholder
            </label>
            <input
              type="text"
              id="placeholder"
              name="placeholder"
              value={localField.placeholder || ''}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="helpText" className="block text-sm font-medium text-gray-700 mb-1">
              Help Text
            </label>
            <input
              type="text"
              id="helpText"
              name="helpText"
              value={localField.helpText || ''}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {(localField.type === 'select' || localField.type === 'radio' || localField.type === 'checkbox') && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Options
                </label>
                <button
                  type="button"
                  onClick={addOption}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <Plus size={16} className="mr-1" />
                  Add Option
                </button>
              </div>
              
              {localField.options && localField.options.length > 0 ? (
                <div className="space-y-2">
                  {localField.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option.label}
                        onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                        placeholder="Label"
                        className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={option.value}
                        onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                        placeholder="Value"
                        className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="text-gray-500 hover:text-red-500"
                        aria-label="Remove option"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={addOption}
                  className="w-full border-2 border-dashed border-gray-300 rounded-md p-3 text-center text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
                >
                  Add your first option
                </button>
              )}
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Validation</h4>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="validation.required"
                  name="validation.required"
                  checked={localField.validation?.required || false}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="validation.required" className="ml-2 block text-sm text-gray-700">
                  Required field
                </label>
              </div>
              
              {(localField.type === 'text' || localField.type === 'textarea' || localField.type === 'email' || localField.type === 'password') && (
                <>
                  <div>
                    <label htmlFor="validation.minLength" className="block text-sm text-gray-700 mb-1">
                      Minimum Length
                    </label>
                    <input
                      type="number"
                      id="validation.minLength"
                      name="validation.minLength"
                      value={localField.validation?.minLength || ''}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="validation.maxLength" className="block text-sm text-gray-700 mb-1">
                      Maximum Length
                    </label>
                    <input
                      type="number"
                      id="validation.maxLength"
                      name="validation.maxLength"
                      value={localField.validation?.maxLength || ''}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
              
              {(localField.type === 'text' || localField.type === 'email' || localField.type === 'password') && (
                <div>
                  <label htmlFor="validation.pattern" className="block text-sm text-gray-700 mb-1">
                    Pattern (Regex)
                  </label>
                  <input
                    type="text"
                    id="validation.pattern"
                    name="validation.pattern"
                    value={localField.validation?.pattern || ''}
                    onChange={handleInputChange}
                    placeholder={localField.type === 'email' ? '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$' : ''}
                    className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {localField.type === 'email' ? 'Tip: For email validation use ^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$' : 
                     localField.type === 'password' ? 'Tip: For strong password use ^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$' : ''}
                  </p>
                  
                  {localField.validation?.pattern && (
                    <div className="mt-2">
                      <label htmlFor="validation.patternError" className="block text-sm text-gray-700 mb-1">
                        Error Message
                      </label>
                      <input
                        type="text"
                        id="validation.patternError"
                        name="validation.patternError"
                        value={localField.validation?.patternError || ''}
                        onChange={handleInputChange}
                        placeholder="Please enter a valid format"
                        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldConfigPanel;