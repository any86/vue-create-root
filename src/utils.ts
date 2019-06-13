export const throwError = (message: string): never => {
    throw (`__PKG_NAME__: ${message}`);
};