let globalContext: any = null;

export const setGlobalContext = (context: any) => {
  globalContext = context;
};

export const getGlobalContext = () => globalContext;
