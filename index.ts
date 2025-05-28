export type FieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'password'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date';

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternError?: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  placeholder?: string;
  helpText?: string;
  options?: FieldOption[];
  validation?: FieldValidation;
  value?: string | string[] | boolean;
}

export interface FormStep {
  id: string;
  title: string;
  fields: FormField[];
}

export interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  steps: FormStep[];
}

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface FormBuilderState {
  currentForm: FormTemplate;
  currentStepIndex: number;
  selectedFieldId: string | null;
  previewDevice: DeviceType;
  isDragging: boolean;
  isEditing: boolean;
  lastSaved: Date | null;
}