
import { useAuth as useAuthContext } from "../context/AuthContext";

// ============================================================
// USE AUTH HOOK
// ============================================================

const useAuth = () => {
  return useAuthContext();
};

export default useAuth;

