import React, { useState } from 'react';
import { useFormBuilder } from '../context/FormBuilderContext';
import { FormStep } from '../types';
import { PlusCircle, Trash2, Edit, Check, X } from 'lucide-react';

const StepManager: React.FC = () => {
  const { state, addStep, deleteStep, setCurrentStep } = useFormBuilder();
  const { currentForm, currentStepIndex } = state;
  
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  
  const handleAddStep = () => {
    addStep();
  };
  
  const handleDeleteStep = (index: number) => {
    if (currentForm.steps.length > 1) {
      if (confirm('Are you sure you want to delete this step? All fields in this step will be removed.')) {
        deleteStep(index);
      }
    }
  };
  
  const startEditingStep = (step: FormStep) => {
    setEditingStepId(step.id);
    setEditingTitle(step.title);
  };
  
  const saveStepTitle = (step: FormStep) => {
    if (editingTitle.trim()) {
      const updatedStep = { ...step, title: editingTitle.trim() };
      // Update step in context
      const newSteps = [...currentForm.steps];
      const stepIndex = newSteps.findIndex(s => s.id === step.id);
      newSteps[stepIndex] = updatedStep;
      
      // Use dispatch to update state
      state.dispatch({ 
        type: 'UPDATE_STEP', 
        step: updatedStep
      });
      
      setEditingStepId(null);
    }
  };
  
  const cancelEditing = () => {
    setEditingStepId(null);
  };
  
  return (
    <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium text-gray-800">Form Steps</h3>
        <button 
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          onClick={handleAddStep}
          title="Add new step"
        >
          <PlusCircle size={16} className="mr-1" />
          Add Step
        </button>
      </div>
      
      <div className="p-2">
        <ul className="space-y-1">
          {currentForm.steps.map((step, index) => (
            <li 
              key={step.id} 
              className={`rounded-md p-2 flex items-center justify-between ${
                index === currentStepIndex 
                  ? 'bg-blue-50 border border-blue-200' 
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => setCurrentStep(index)}
              >
                {editingStepId === step.id ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveStepTitle(step);
                      if (e.key === 'Escape') cancelEditing();
                    }}
                  />
                ) : (
                  <div className="flex items-center">
                    <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full text-xs font-medium mr-2">
                      {index + 1}
                    </span>
                    <span className="font-medium">{step.title}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      {step.fields.length} {step.fields.length === 1 ? 'field' : 'fields'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                {editingStepId === step.id ? (
                  <>
                    <button
                      onClick={() => saveStepTitle(step)}
                      className="p-1 text-green-600 hover:text-green-800 rounded hover:bg-green-50"
                      title="Save step title"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="p-1 text-gray-600 hover:text-gray-800 rounded hover:bg-gray-100"
                      title="Cancel editing"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditingStep(step)}
                      className="p-1 text-gray-600 hover:text-gray-800 rounded hover:bg-gray-100"
                      title="Edit step title"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteStep(index)}
                      className="p-1 text-gray-600 hover:text-red-600 rounded hover:bg-red-50"
                      title="Delete step"
                      disabled={currentForm.steps.length <= 1}
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StepManager;