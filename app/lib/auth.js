// Mock authentication utilities
// In a real application, this would connect to a backend API

const USERS_KEY = 'cafe_mehfil_users';
const CURRENT_USER_KEY = 'cafe_mehfil_current_user';

// Initialize with a default admin account
const initializeUsers = () => {
  if (typeof window === 'undefined') return;
  
  const existingUsers = localStorage.getItem(USERS_KEY);
  if (!existingUsers) {
    const defaultUsers = [
      {
        id: '1',
        email: 'admin@cafemehfil.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
};

// Get all users
export const getUsers = () => {
  if (typeof window === 'undefined') return [];
  initializeUsers();
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Get current user
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Login
export const login = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return { success: true, user: userWithoutPassword };
  }
  
  return { success: false, error: 'Invalid email or password' };
};

// Signup
export const signup = (email, password, name) => {
  const users = getUsers();
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'Email already exists' };
  }
  
  const newUser = {
    id: crypto.randomUUID(),
    email,
    password,
    name,
    role: 'user',
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  const userWithoutPassword = { ...newUser };
  delete userWithoutPassword.password;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
  
  return { success: true, user: userWithoutPassword };
};

// Logout
export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  return { success: true };
};

// Create user (admin only)
export const createUser = (email, password, name, role = 'user') => {
  const users = getUsers();
  
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'Email already exists' };
  }
  
  const newUser = {
    id: crypto.randomUUID(),
    email,
    password,
    name,
    role,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  return { success: true, user: newUser };
};

// Check if user is admin
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};
