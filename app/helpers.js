import R from 'ramda';

export const renameKeys = R.curry((keysMap, obj) => {
  return R.reduce((acc, key) => {
    acc[keysMap[key] || key] = obj[key];
    return acc;
  }, {}, R.keys(obj));
});
