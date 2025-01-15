// app/dreams/[id]/LoadingState.tsx
export function LoadingState() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative w-24 h-32 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2a1810] to-[#3a2820] rounded-lg animate-pulse"></div>
          <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-[#1a0c06] to-[#2a1810]"></div>
        </div>
        <p className="text-[#f0d6a3] text-lg font-serif">
          Opening your dream book...
        </p>
      </div>
    </div>
  );
}
