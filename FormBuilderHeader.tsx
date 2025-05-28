import React, { useState } from 'react';
import { useFormBuilder } from '../context/FormBuilderContext';
import { Share, Save, FileDown, FileUp, DownloadCloud, Plus } from 'lucide-react';

const FormBuilderHeader: React.FC = () => {
  const { state, setFormName, saveForm, getFormShareableLink, loadTemplate, createNewForm, availableTemplates } = useFormBuilder();
  const { currentForm, lastSaved } = state;
  
  const [showTemplatesDropdown, setShowTemplatesDropdown] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharableLink, setSharableLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  
  const handleFormNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormName(e.target.value);
  };
  
  const handleSave = () => {
    saveForm();
  };
  
  const handleShare = () => {
    const link = getFormShareableLink();
    setSharableLink(link);
    setShowShareModal(true);
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(sharableLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };
  
  const handleExport = () => {
    const dataStr = JSON.stringify(currentForm, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${currentForm.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const result = event.target?.result as string;
            const importedForm = JSON.parse(result);
            loadTemplate(importedForm);
          } catch (error) {
            console.error('Error importing form:', error);
            alert('Failed to import form. Please make sure it is a valid form JSON file.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };
  
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={currentForm.name}
            onChange={handleFormNameChange}
            className="text-xl font-semibold border-none focus:ring-0 focus:outline-none px-2 py-1 rounded transition-colors hover:bg-gray-100 focus:bg-gray-100"
            aria-label="Form Name"
          />
          {lastSaved && (
            <span className="text-xs text-gray-500">
              Last saved: {new Date(lastSaved).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative">
          <button 
            className="flex items-center bg-white text-gray-700 px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
            onClick={() => setShowTemplatesDropdown(!showTemplatesDropdown)}
          >
            <Plus size={16} className="mr-1" />
            New / Templates
          </button>
          
          {showTemplatesDropdown && (
            <div className="absolute right-0 mt-1 w-64 bg-white shadow-lg rounded-md border border-gray-200 z-10">
              <div className="p-2 border-b border-gray-200">
                <button 
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded transition-colors text-sm"
                  onClick={() => {
                    createNewForm();
                    setShowTemplatesDropdown(false);
                  }}
                >
                  New Blank Form
                </button>
              </div>
              <div className="p-2">
                <p className="px-3 py-1 text-xs font-semibold text-gray-500">Templates</p>
                {availableTemplates.map(template => (
                  <button
                    key={template.id}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded transition-colors text-sm flex flex-col"
                    onClick={() => {
                      loadTemplate(template);
                      setShowTemplatesDropdown(false);
                    }}
                  >
                    <span>{template.name}</span>
                    {template.description && (
                      <span className="text-xs text-gray-500">{template.description}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <button 
          className="flex items-center bg-white text-gray-700 px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
          onClick={handleSave}
          title="Save form"
        >
          <Save size={16} className="mr-1" />
          Save
        </button>
        
        <button 
          className="flex items-center bg-white text-gray-700 px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
          onClick={handleShare}
          title="Get shareable link"
        >
          <Share size={16} className="mr-1" />
          Share
        </button>
        
        <button 
          className="flex items-center bg-white text-gray-700 px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
          onClick={handleExport}
          title="Export form as JSON"
        >
          <FileDown size={16} className="mr-1" />
          Export
        </button>
        
        <button 
          className="flex items-center bg-white text-gray-700 px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
          onClick={handleImport}
          title="Import form from JSON"
        >
          <FileUp size={16} className="mr-1" />
          Import
        </button>
      </div>
      
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Share Your Form</h3>
            <p className="text-sm text-gray-600 mb-4">
              Anyone with this link will be able to view and fill out your form.
            </p>
            
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                value={sharableLink}
                readOnly
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
              >
                {linkCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default FormBuilderHeader;