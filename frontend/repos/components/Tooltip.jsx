const Tooltip = ({ text, children }) => {
  return (
    <div className="relative flex items-center group w-fit">
      {children}
      {/* Tooltip */}
      <span
        className="
          absolute 
          left-1/2 -translate-x-1/2 
          -top-9
          opacity-0 group-hover:opacity-100 
          group-hover:-translate-y-1
          transition-all duration-200 
          bg-white text-black 
          text-xs px-2 py-1 rounded-md 
          whitespace-nowrap 
          pointer-events-none
          shadow-md
        "
      >
        {text}
      </span>
    </div>
  );
};

export default Tooltip;
