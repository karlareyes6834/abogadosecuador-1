import React, { useState, useEffect } from "react";

export function CookiesBanner() {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("cookies_consent");
    if (consent !== "true") {
      setAccepted(false);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookies_consent", "true");
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex flex-col md:flex-row items-center justify-between opacity-95 z-50">
      <p className="mb-2 md:mb-0 text-sm">
        Usamos cookies para mejorar tu experiencia. Al continuar, aceptas nuestra{" "}
        <a href="#/privacy" className="underline hover:text-gray-300">
          política de privacidad
        </a>
        .
      </p>
      <button
        onClick={acceptCookies}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-semibold transition"
      >
        Aceptar
      </button>
    </div>
  );
}

export default CookiesBanner;