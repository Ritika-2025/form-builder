import React from 'react';
import { useFormBuilder } from '../context/FormBuilderContext';
import { 
  Type, 
  AlignLeft, 
  List, 
  CheckSquare, 
  Calendar, 
  Mail, 
  Lock, 
  Hash, 
  Circle
} from 'lucide-react';

const FormBuilderSidebar: React.FC = () => {
  const { createField } = useFormBuilder();
  
  const fieldTypes = [
    { type: 'text', label: 'Text', icon: <Type size={18} /> },
    { type: 'textarea', label: 'Textarea', icon: <AlignLeft size={18} /> },
    { type: 'select', label: 'Dropdown', icon: <List size={18} /> },
    { type: 'checkbox', label: 'Checkbox', icon: <CheckSquare size={18} /> },
    { type: 'radio', label: 'Radio', icon: <Circle size={18} /> },
    { type: 'date', label: 'Date', icon: <Calendar size={18} /> },
    { type: 'email', label: 'Email', icon: <Mail size={18} /> },
    { type: 'password', label: 'Password', icon: <Lock size={18} /> },
    { type: 'number', label: 'Number', icon: <Hash size={18} /> },
  ] as const;
  
  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-medium mb-4">Form Elements</h2>
      <p className="text-sm text-gray-600 mb-4">Drag and drop elements to add them to your form</p>
      
      <div className="space-y-2">
        {fieldTypes.map(({ type, label, icon }) => (
          <div 
            key={type}
            className="bg-white border border-gray-200 rounded-md p-3 shadow-sm hover:shadow-md cursor-grab transition-all duration-200 flex items-center"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('field-type', type);
              e.dataTransfer.effectAllowed = 'copy';
            }}
            onClick={() => createField(type)}
          >
            <div className="mr-2 text-gray-700">{icon}</div>
            <span>{label}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Instructions</h3>
        <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
          <li>Drag elements from above to add them to your form</li>
          <li>Click on a field in the preview to edit its properties</li>
          <li>Drag fields in the preview to reorder them</li>
          <li>Click "Save" to store your form</li>
        </ul>
      </div>
    </div>
  );
};

export default FormBuilderSidebar;