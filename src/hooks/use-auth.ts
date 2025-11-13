'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const session = Cookies.get('session');
    if (session === 'admin-logged-in') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return { isAuthenticated };
}
