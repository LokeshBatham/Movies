"use client";
import MovieCard from "../components/MovieCard";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";

// Mock movies data - in a real app, this would come from an API
const initialMovies = [
  // { id: 1, title: "Movie 1", year: "2021", image: "https://picsum.photos/200/300?1" },

];

export default function MovieList() {
  const router = useRouter();
  const { user, loading, logout, requireAuth } = useAuth();
  const [movies, setMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalMovies: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Function to clear all movies (for testing empty state)
  const clearMovies = () => {
    setMovies([]);
  };

  // Fetch movies from API with pagination
  const fetchMovies = async (page = 1) => {
    try {
      const response = await fetch(`/api/movies?page=${page}&limit=10`);
      const data = await response.json();
      
      if (response.ok) {
        setMovies(data.movies);
        setPagination(data.pagination);
      } else {
        console.error('Failed to fetch movies:', data.error);
        // Fallback to initial movies if API fails
        setMovies(initialMovies);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      // Fallback to initial movies if API fails
      setMovies(initialMovies);
    } finally {
      setMoviesLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setMoviesLoading(true);
      fetchMovies(newPage);
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    if (!loading) {
      requireAuth();
    }
  }, [loading, requireAuth]);

  // Fetch movies when component mounts
  useEffect(() => {
    if (user) {
      fetchMovies(1);
    }
  }, [user]);

  // Pagination Component
  const PaginationComponent = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2 mt-6 md:mt-8">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className={`px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
            pagination.hasPrevPage
              ? "bg-[#224957] text-white hover:bg-[#2BD17E]"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </button>

        {/* Page Numbers */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium bg-[#224957] text-white hover:bg-[#2BD17E] transition-colors"
            >
              1
            </button>
            {startPage > 2 && <span className="text-gray-400 text-xs md:text-sm">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
              page === pagination.currentPage
                ? "bg-[#2BD17E] text-white"
                : "bg-[#224957] text-white hover:bg-[#2BD17E]"
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < pagination.totalPages && (
          <>
            {endPage < pagination.totalPages - 1 && <span className="text-gray-400 text-xs md:text-sm">...</span>}
            <button
              onClick={() => handlePageChange(pagination.totalPages)}
              className="px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium bg-[#224957] text-white hover:bg-[#2BD17E] transition-colors"
            >
              {pagination.totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className={`px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
            pagination.hasNextPage
              ? "bg-[#224957] text-white hover:bg-[#2BD17E]"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  // Show loading spinner while checking authentication or fetching movies
  if (loading || moviesLoading) {
    return (
      <div className="min-h-screen bg-[#093545] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // If not authenticated, the useAuth hook will redirect to login
  if (!user) {
    return null;
  }

  // Show empty state if no movies
  if (movies.length === 0) {
    return (
      <div className="min-h-screen bg-[#093545] p-4 md:p-8 empty-movie-list back">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-4xl font-bold text-white">My movies</h2>
            <button
              onClick={() => router.push("/create")}
              className="text-white text-2xl md:text-3xl font-bold add-button"
            >
              +
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div 
              className="flex items-center gap-2 text-white cursor-pointer hover:text-gray-300 transition-colors"
              onClick={logout}
            >
              <span className="text-base md:text-lg">Logout</span>
              <img src={"/logout_black.svg"} alt="logout" className="w-4 h-4 md:w-5 md:h-5" />
            </div>
          </div>
        </div>
  
        {/* Empty State */}
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <h1 className="text-xl md:text-2xl font-semibold text-white mb-4">Your movie list is empty</h1>
          <button
            onClick={() => router.push("/create")}
            className="px-6 py-3 bg-[#2BD17E] rounded-md text-white hover:bg-[#2BD17E]/80 transition-colors font-medium"
          >
            Add a new movie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#093545] p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl md:text-4xl font-bold text-white">My movies</h2>
          <button
            onClick={() => router.push("/create")}
            className="text-white text-2xl md:text-3xl font-bold add-button"
          >
            +
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-2 text-white cursor-pointer hover:text-gray-300 transition-colors"
            onClick={logout}
          >
            <span className="text-base md:text-lg">Logout</span>
            <img src={"/logout_black.svg"} alt="logout" className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>

      {/* Movies Count */}
      <div className="mb-4 text-white">
        <p className="text-sm text-gray-300">
          Showing {movies.length} of {pagination.totalMovies} movies
        </p>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Pagination */}
      <PaginationComponent />
    </div>
  );
}
