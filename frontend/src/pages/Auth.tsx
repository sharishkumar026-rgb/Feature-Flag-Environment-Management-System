import React from "react";
import AuthBranding from "../components/auth/AuthBranding";
import AuthSlider from "../components/auth/AuthSlider";

// ============================================================
// AUTH PAGE
// ============================================================

const Auth: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">

        {/* ====================================================
            LEFT - BRANDING
        ===================================================== */}

        <div className="hidden min-h-screen lg:block">
          <AuthBranding />
        </div>

        {/* ====================================================
            RIGHT - AUTH FORM / SLIDER
        ===================================================== */}

        <div className="flex min-h-screen w-full items-center justify-center bg-white px-8 py-12 sm:px-12 lg:px-14 xl:px-16">

          <div className="w-full max-w-2xl">
            <AuthSlider />
          </div>

        </div>

      </div>
    </div>
  );
};

export default Auth;