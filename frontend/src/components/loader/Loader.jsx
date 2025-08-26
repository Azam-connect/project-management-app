export default function Loader() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm"
      style={{ zIndex: 99999 }}
    >
      <svg
        className="animate-spin h-16 w-16 text-indigo-600"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray="8 20"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
