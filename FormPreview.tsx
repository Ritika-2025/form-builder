import React, { useState, useEffect } from 'react';
import { useFormBuilder } from '../context/FormBuilderContext';
import { FormField, FormStep } from '../types';
import { Smartphone, Tablet, Monitor, ChevronLeft, ChevronRight } from 'lucide-react';

interface FormPreviewProps {
  onFieldClick: (field: FormField) => void;
}

const FormPreview: React.FC<FormPreviewProps> = ({ onFieldClick }) => {
  const { state, selectField, setPreviewDevice, setCurrentStep } = useFormBuilder();
  const { currentForm, currentStepIndex, previewDevice, selectedFieldId } = state;
  
  const currentStep = currentForm.steps[currentStepIndex];
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Reset form values and errors when changing steps
    setFormValues({});
    setFormErrors({});
  }, [currentStepIndex]);
  
  const handleFieldChange = (field: FormField, value: any) => {
    setFormValues({
      ...formValues,
      [field.name]: value
    });
    
    // Validate field and update errors
    const error = validateField(field, value);
    if (error) {
      setFormErrors({
        ...formErrors,
        [field.name]: error
      });
    } else {
      const newErrors = { ...formErrors };
      delete newErrors[field.name];
      setFormErrors(newErrors);
    }
  };
  
  const validateField = (field: FormField, value: any): string | null => {
    if (!field.validation) return null;
    
    if (field.validation.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return 'This field is required';
    }
    
    if (typeof value === 'string' && field.validation.minLength && value.length < field.validation.minLength) {
      return `Minimum length is ${field.validation.minLength} characters`;
    }
    
    if (typeof value === 'string' && field.validation.maxLength && value.length > field.validation.maxLength) {
      return `Maximum length is ${field.validation.maxLength} characters`;
    }
    
    if (typeof value === 'string' && field.validation.pattern) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(value)) {
        return field.validation.patternError || 'Invalid format';
      }
    }
    
    return null;
  };
  
  const renderField = (field: FormField) => {
    const isSelected = selectedFieldId === field.id;
    const value = formValues[field.name];
    const error = formErrors[field.name];
    
    const commonProps = {
      id: field.name,
      name: field.name,
      placeholder: field.placeholder,
      className: `w-full rounded-md ${isSelected ? 'ring-2 ring-blue-500 border-transparent' : 'border-gray-300'} ${error ? 'border-red-500' : ''} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`,
      'aria-describedby': `${field.name}-help ${field.name}-error`,
      'aria-required': field.validation?.required,
      'aria-invalid': Boolean(error),
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        selectField(field.id);
        onFieldClick(field);
      }
    };
    
    let fieldElement;
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        fieldElement = (
          <input
            type={field.type}
            value={value || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            {...commonProps}
          />
        );
        break;
        
      case 'textarea':
        fieldElement = (
          <textarea
            value={value || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            rows={4}
            {...commonProps}
          />
        );
        break;
        
      case 'select':
        fieldElement = (
          <select
            value={value || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            {...commonProps}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        break;
        
      case 'checkbox':
        fieldElement = (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => handleFieldChange(field, e.target.checked)}
              className={`h-4 w-4 text-blue-600 focus:ring-blue-500 rounded ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
              {...commonProps}
            />
            <label htmlFor={field.name} className="ml-2">
              {field.label}
            </label>
          </div>
        );
        break;
        
      case 'radio':
        fieldElement = (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.name}-${option.value}`}
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => handleFieldChange(field, option.value)}
                  className={`h-4 w-4 text-blue-600 focus:ring-blue-500 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectField(field.id);
                    onFieldClick(field);
                  }}
                />
                <label htmlFor={`${field.name}-${option.value}`} className="ml-2">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
        break;
        
      case 'date':
        fieldElement = (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            {...commonProps}
          />
        );
        break;
        
      default:
        fieldElement = null;
    }
    
    // Skip label for checkbox as it's already included with the input
    const showLabel = field.type !== 'checkbox';
    
    return (
      <div key={field.id} className={`mb-4 p-2 rounded ${isSelected ? 'bg-blue-50' : ''} hover:bg-gray-50 transition-colors`}>
        {showLabel && (
          <label 
            htmlFor={field.name} 
            className="block text-sm font-medium text-gray-700 mb-1"
            onClick={(e) => {
              e.preventDefault();
              selectField(field.id);
              onFieldClick(field);
            }}
          >
            {field.label}
            {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        {fieldElement}
        
        {field.helpText && (
          <p id={`${field.name}-help`} className="mt-1 text-xs text-gray-500">
            {field.helpText}
          </p>
        )}
        
        {error && (
          <p id={`${field.name}-error`} className="mt-1 text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  };
  
  const deviceWidthClass = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]'
  }[previewDevice];
  
  const getDeviceFrame = () => {
    switch (previewDevice) {
      case 'mobile':
        return 'border-8 border-gray-800 rounded-[36px] shadow-lg';
      case 'tablet':
        return 'border-[12px] border-gray-800 rounded-[24px] shadow-lg';
      default:
        return 'border border-gray-200 rounded-md shadow-sm';
    }
  };
  
  const isLastStep = currentStepIndex === currentForm.steps.length - 1;
  const isFirstStep = currentStepIndex === 0;
  
  const handlePrevStep = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStepIndex - 1);
    }
  };
  
  const handleNextStep = () => {
    // Validate all fields in the current step
    let hasErrors = false;
    const newErrors: Record<string, string> = {};
    
    currentStep.fields.forEach(field => {
      const value = formValues[field.name];
      const error = validateField(field, value);
      if (error) {
        newErrors[field.name] = error;
        hasErrors = true;
      }
    });
    
    if (hasErrors) {
      setFormErrors(newErrors);
      return;
    }
    
    if (!isLastStep) {
      setCurrentStep(currentStepIndex + 1);
    }
  };
  
  const renderStepIndicator = () => {
    if (currentForm.steps.length <= 1) return null;
    
    return (
      <div className="flex justify-center mt-6 space-x-1">
        {currentForm.steps.map((step, index) => (
          <button
            key={step.id}
            className={`h-2 rounded-full transition-all ${
              index === currentStepIndex
                ? 'w-8 bg-blue-600'
                : index < currentStepIndex
                ? 'w-2 bg-blue-400'
                : 'w-2 bg-gray-300'
            }`}
            onClick={() => setCurrentStep(index)}
            aria-label={`Go to step ${index + 1}: ${step.title}`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <h3 className="font-medium text-gray-800">Form Preview</h3>
        
        <div className="flex space-x-2">
          <button
            className={`p-1.5 rounded ${previewDevice === 'mobile' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={() => setPreviewDevice('mobile')}
            aria-label="Mobile preview"
            title="Mobile preview"
          >
            <Smartphone size={18} />
          </button>
          <button
            className={`p-1.5 rounded ${previewDevice === 'tablet' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={() => setPreviewDevice('tablet')}
            aria-label="Tablet preview"
            title="Tablet preview"
          >
            <Tablet size={18} />
          </button>
          <button
            className={`p-1.5 rounded ${previewDevice === 'desktop' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={() => setPreviewDevice('desktop')}
            aria-label="Desktop preview"
            title="Desktop preview"
          >
            <Monitor size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex justify-center">
        <div className={`${deviceWidthClass} ${getDeviceFrame()} bg-white h-fit`}>
          <div className="p-6">
            {currentForm.steps.length > 1 && (
              <h2 className="text-xl font-semibold mb-4">{currentStep.title}</h2>
            )}
            
            {currentStep.fields.length === 0 ? (
              <div className="py-8 border-2 border-dashed border-gray-300 rounded-md text-center">
                <p className="text-gray-500">Add fields to your form to see the preview</p>
              </div>
            ) : (
              <form onSubmit={(e) => e.preventDefault()}>
                {currentStep.fields.map(renderField)}
                
                {currentForm.steps.length > 1 && (
                  <div className="flex mt-6 space-x-2">
                    {!isFirstStep && (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <ChevronLeft size={18} className="mr-1" />
                        Previous
                      </button>
                    )}
                    
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex items-center ml-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {isLastStep ? 'Submit' : 'Next'}
                      {!isLastStep && <ChevronRight size={18} className="ml-1" />}
                    </button>
                  </div>
                )}
                
                {renderStepIndicator()}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;