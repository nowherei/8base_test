export const removeTypename = (value) => {
  if (value === null || value === undefined) {
    return value;
  } else if (Array.isArray(value)) {
    return value.map(v => removeTypename(v));
  } else if (typeof value === 'object') {
    const newObj = {};
    Object.entries(value).forEach(([key, v]) => {
      if (key !== '__typename') {
        newObj[key] = removeTypename(v);
      }
    });
    return newObj;
  }
  return value;
};

export const getTotalOrder = (items) => {
  return items.reduce((acc, current) => {
    const {product:{price}, quantity } = current;
    const cost = Math.round(+price * quantity * 100) / 100;
    return Math.round((acc + cost) * 100) / 100;
  }, 0)
}