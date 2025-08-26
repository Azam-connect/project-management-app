import { ArrowUpRight } from 'lucide-react';

export default function ProjectCard({
  item,
  title,
  descriptions,
  handleClick,
}) {
  return (
    <div className="w-full bg-white shadow-lg rounded-2xl p-6 flex flex-col justify-between">
      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
        {title}
      </h3>
      <hr />

      {/* Description */}
      <p className="text-gray-600 text-sm sm:text-base flex-grow">
        {descriptions}
      </p>

      {/* Button */}
      <button
        className="mt-4 bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-700 transition  flex justify-center max-w-24"
        onClick={() => handleClick(item)}
      >
        <span>Go</span>
        <ArrowUpRight />
      </button>
    </div>
  );
}
