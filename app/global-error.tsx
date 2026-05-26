'use client';
import { useEffect } from 'react';

export const dynamic = "force-dynamic";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="bg-black text-white flex flex-col items-center justify-center min-h-screen font-sans">
        <div className="text-center p-10 max-w-md border border-white/10 rounded-3xl bg-[#111] shadow-2xl">
          <h2 className="text-2xl font-black text-red-600 mb-4 tracking-tight uppercase">Something went wrong!</h2>
          <p className="text-white/60 text-sm mb-8 leading-relaxed">
            An unexpected error occurred. Please try reloading the page or contact support if the issue persists.
          </p>
          <button
            onClick={() => reset()}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-xs tracking-widest uppercase transition-all shadow-lg active:scale-95"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
