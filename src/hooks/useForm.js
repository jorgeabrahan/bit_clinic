import { useRef, useState } from 'react';

const useForm = (initialEntries) => {
  const getInitialErrors = () => {
    return Object.keys(initialEntries).reduce((errors) => {
      errors = '';
      return errors;
    }, {});
  };
  const [entries, setEntries] = useState(initialEntries);
  const [errors, setErrors] = useState(() => getInitialErrors());
  const isInvalid = useRef(false);
  const onChange = (event) => {
    const { name, value, type } = event.target;
    setEntries((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? event.target?.checked : value,
    }));
  };
  const setValue = (inputKey, value) => {
    setEntries((prevState) => ({
      ...prevState,
      [inputKey]: value,
    }));
  };
  const setError = (inputKey, error) => {
    isInvalid.current = isInvalid.current || error !== '';
    setErrors((prevErrors) => {
      const updatedErrors = prevErrors ? prevErrors : {};
      updatedErrors[inputKey] = error;
      return updatedErrors;
    });
  };
  const clearErrors = () => {
    setErrors(getInitialErrors());
    isInvalid.current = false;
  };
  const reset = () => {
    setEntries(initialEntries);
    clearErrors();
  };
  return {
    ...entries,
    form: {
      ...Object.keys(entries).reduce((acc, key) => {
        const inputKey = key;
        acc[inputKey] = {
          id: inputKey,
          value: entries[inputKey],
          error: errors[inputKey] || '',
        };
        return acc;
      }, {}),
      reset,
      clearErrors,
      isValid: () => !isInvalid.current,
    },
    onChange,
    setValue,
    setEntries,
    setError,
  };
};

export default useForm;
