export const mergeArrays = (arr1, arr2) => [...new Set([...arr1, ...arr2])]

export const capitalizeString = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export const getBaseUrl = () => `${window.location.protocol}//${window.location.host}`