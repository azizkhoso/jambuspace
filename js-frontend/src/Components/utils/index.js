export const objToFormData = (obj) => {
  const fd = new FormData();
  // ---------
  const keyToFormData = (key, value) => {
    // if value is other than object
    if (typeof value !== 'object') {
      fd.append(key, value);
    } else if (value instanceof File) {
      fd.append(key, value);
    } else {
      // if value is an array
      if (Array.isArray(value)) {
        value.forEach((val) => {
          keyToFormData(`${key}`, val);
        });
      } else if (value) {
        Object.keys(value).forEach((k) => {
          keyToFormData(`${key}.${k}`, value[k]);
        });
      }
    }
  };
  // ---------
  Object.keys(obj).forEach((key) => {
    keyToFormData(key, obj[key]);
  });
  return fd;
};
