import { useRouter } from "next/router";
import { useEffect } from "react";

export const useAuth = () => {
  const router = useRouter();
  
  let isAuthenticated = false;
  
  // Verifica se está no cliente e não no servidor
  if (typeof window !== 'undefined') {
    isAuthenticated = !!sessionStorage.getItem('authenticated');
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login'); // redireciona para a página de login
    }
  }, []);

  return isAuthenticated;
};
