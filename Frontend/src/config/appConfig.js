export const appConfig = {
  appName: "Civic Pulse",
  appDescription: "Citizen Complaint Management Platform",
  appVersion: "1.0.0",
  
  // API Endpoints Configuration (Matches your Express Backend routes)
  api: {
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000",
    useMockFallback: import.meta.env.VITE_USE_MOCK === "true",
    endpoints: {
      // Auth Endpoints (Updated to match backend Express routes)
      register: "/api/auth/signup", // Changed from /api/v1/auth/register
      login: "/api/auth/login",     // Changed from /api/v1/auth/login
      profile: "/api/auth/profile",
      
      // Complaints Resource Endpoint
      crudResource: "/api/complaints", // Changed from /api/v1/data
      exportCsv: "/api/complaints/export",
    },
  },

  // Resource Customization
  resource: {
    singular: "Complaint",
    plural: "Complaints",
    primaryKey: "_id",
  },

  // Theme Defaults
  defaultTheme: "light",
};