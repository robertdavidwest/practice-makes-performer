export default function DeleteSpinner() {
  return (
    <div className="mt-2 inline-flex items-center py-2 px-1 font-bold text-red-700">
      <svg
        className="h-7 w-7 animate-spin text-red-700"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-10a2 2 0 11-4 0 2 2 0 014 0z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}
