export default function MovieCard({ movie }) {
  return (
    <div className="bg-[#092C39] p-2 md:p-[10px] rounded-lg overflow-hidden">
      <img 
        src={movie.image} 
        alt={movie.title} 
        className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-lg" 
      />
      <div className="mt-3 md:mt-4">
        <h3 className="text-white text-sm md:text-lg font-medium mb-1 line-clamp-2">{movie.title}</h3>
        <p className="text-white text-xs md:text-sm">{movie.year}</p>
      </div>
    </div>
  );
}
