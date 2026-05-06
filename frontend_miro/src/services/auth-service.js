// Simulador de servicios para probar el Frontend sin Backend
export const login = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        resolve({ token: 'token-falso-de-prueba-123', user: { email } });
      } else {
        reject(new Error('Credenciales inválidas'));
      }
    }, 1000);
  });
};

export const register = async (name, email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: 'Usuario creado con éxito (Simulado)' });
    }, 1000);
  });
};