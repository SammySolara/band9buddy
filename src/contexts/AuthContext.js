import { createContext, useContext, useEffect, useState } from "react";
import { authHelpers } from "../services/supabase";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { session, error } = await authHelpers.getSession();

      // Check if this is a password recovery session
      const urlParams = new URLSearchParams(window.location.hash.substring(1));
      const type = urlParams.get("type");

      if (!error && session && type !== "recovery") {
        // Only set user if NOT a recovery session
        setSession(session);
        setUser(session.user);
      } else if (type === "recovery") {
        // For recovery, set session but NOT user (keeps them on reset page)
        setSession(session);
        setUser(null);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = authHelpers.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event, session);

      // Check if this is a password recovery event
      const urlParams = new URLSearchParams(window.location.hash.substring(1));
      const type = urlParams.get("type");

      // Special handling for password recovery
      if (event === "PASSWORD_RECOVERY" || type === "recovery") {
        // Don't set user during password recovery
        setSession(session);
        setUser(null);
        setLoading(false);
        return;
      }

      // Handle password update completion (after reset)
      // Only sign out if we're on the reset password page
      if (
        event === "USER_UPDATED" &&
        window.location.pathname === "/reset-password"
      ) {
        // After password update, user should be signed out
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      // Normal auth state changes (including signup and regular login)
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Sign up function
  const signUp = async (email, password, additionalData = {}) => {
    try {
      setLoading(true);

      // Add firstLogin flag to user metadata
      const { data, error } = await authHelpers.signUp(email, password, {
        ...additionalData,
        firstLogin: true, // Initialize as true for new users
      });

      if (error) {
        console.error("Signup error:", error);
        return { success: false, error: error.message };
      }

      console.log("Signup successful:", data);

      // Check if email confirmation is required
      if (data?.user && !data.session) {
        // User created but needs to confirm email
        return {
          success: true,
          data,
          requiresEmailConfirmation: true,
        };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Signup exception:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await authHelpers.signIn(email, password);

      if (error) {
        console.error("Login error:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Login exception:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await authHelpers.signOut();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Mark first login as complete (called when user closes welcome modal)
  const completeFirstLogin = async () => {
    try {
      const { error } = await authHelpers.updateUserMetadata({
        firstLogin: false,
      });

      if (error) {
        console.error("Error updating first login status:", error);
        return { success: false, error: error.message };
      }

      // Update local user state immediately
      setUser((prev) => ({
        ...prev,
        user_metadata: {
          ...prev.user_metadata,
          firstLogin: false,
        },
      }));

      return { success: true };
    } catch (error) {
      console.error("Exception updating first login:", error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    completeFirstLogin,
    isAuthenticated: !!user,
    isFirstLogin: user?.user_metadata?.firstLogin === true, // Check if it's their first login
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
