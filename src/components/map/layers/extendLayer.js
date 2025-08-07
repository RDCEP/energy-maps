
export const extendLayer = function(args, func) {
  if (Array.isArray(args) || (args !== null && typeof args === 'object')) {
    for (const i in args) {
      func[i] = args[i];
    }
  }
  return func;
};