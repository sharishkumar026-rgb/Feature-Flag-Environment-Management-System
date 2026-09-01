import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthSlider: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-2xl overflow-hidden">
        <div
          className={`flex w-[200%] transition-transform duration-500 ease-in-out ${
            isRegister
              ? "-translate-x-1/2"
              : "translate-x-0"
          }`}
        >
          {/* =================================================
              LOGIN
          ================================================== */}

          <div className="w-1/2 shrink-0 px-2 sm:px-6">
            <AuthHeader
              title="Welcome back"
              description="Sign in to your account to continue."
            />

            <LoginForm />

            <div className="mt-8 text-center">
              <p className="text-base text-gray-500">
                Don't have an account?
              </p>

              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="mt-2 text-base font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Create an account
              </button>
            </div>
          </div>

          {/* =================================================
              REGISTER
          ================================================== */}

          <div className="w-1/2 shrink-0 px-2 sm:px-6">
            <AuthHeader
              title="Create your account"
              description="Register to start managing your features."
            />

            <RegisterForm />

            <div className="mt-8 text-center">
              <p className="text-base text-gray-500">
                Already have an account?
              </p>

              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="mt-2 text-base font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Sign in instead
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   AUTH HEADER
============================================================ */

interface AuthHeaderProps {
  title: string;
  description: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <div className="mb-9">
      <h2 className="text-4xl font-bold tracking-tight text-gray-900">
        {title}
      </h2>

      <p className="mt-3 text-base leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
};

export default AuthSlider;