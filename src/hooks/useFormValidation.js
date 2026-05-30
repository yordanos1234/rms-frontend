import { useState, useCallback } from 'react';

export const useFormValidation = (initialState, validationRules) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';
    for (const rule of rules) {
      const result = rule(value);
      if (result !== true) return result;
    }
    return '';
  }, [validationRules]);

  const handleChange = useCallback((name) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((name) => () => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [values, validateField]);

  const validateAll = useCallback(() => {
    const newErrors = {};
    let isValid = true;
    for (const name of Object.keys(validationRules)) {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    }
    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, k) => ({ ...acc, [k]: true }), {}));
    return isValid;
  }, [values, validateField, validationRules]);

  const resetForm = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setTouched({});
  }, [initialState]);

  const setFormValues = useCallback((newValues) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  return { values, errors, touched, handleChange, handleBlur, validateAll, resetForm, setFormValues, setValues };
};

// Common validators
export const v = {
  required: (msg = 'This field is required') => (val) =>
    (val !== undefined && val !== null && String(val).trim().length > 0) || msg,
  email: (msg = 'Please enter a valid email') => (val) =>
    !val || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(String(val).toLowerCase()) || msg,
  minLength: (len, msg) => (val) =>
    !val || String(val).trim().length >= len || msg || `Must be at least ${len} characters`,
  maxLength: (len, msg) => (val) =>
    !val || String(val).trim().length <= len || msg || `Must be at most ${len} characters`,
  isNumber: (msg = 'Must be a number') => (val) =>
    !val || (!isNaN(Number(val)) && String(val).trim() !== '') || msg,
  min: (minVal, msg) => (val) =>
    !val || Number(val) >= minVal || msg || `Must be at least ${minVal}`,
  max: (maxVal, msg) => (val) =>
    !val || Number(val) <= maxVal || msg || `Must be at most ${maxVal}`,
  integer: (msg = 'Must be a whole number') => (val) =>
    !val || Number.isInteger(Number(val)) || msg,
  phone: (msg = 'Invalid phone number') => (val) =>
    !val || /^0[79]\d{8}$/.test(String(val)) || msg,
  match: (regex, msg) => (val) =>
    !val || regex.test(String(val)) || msg,
};
