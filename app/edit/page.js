"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export default function EditMovie() {
  const router = useRouter();
  const { user, loading, requireAuth } = useAuth();

  // Check authentication on component mount
  useEffect(() => {
    if (!loading) {
      requireAuth();
    }
  }, [loading, requireAuth]);

  // Show loading spinner while checking authentication
  if (loading) {
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

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#002b36] text-white">
      <h1 className="text-2xl font-bold mb-4">Edit Movie</h1>
      <input
        type="text"
        placeholder="Updated movie title"
        className="px-4 py-2 text-black rounded mb-4"
      />
      <button
        onClick={() => router.push("/movies")}
        className="px-6 py-2 bg-green-500 rounded hover:bg-green-600"
      >
        Update
      </button>
    </div>
  );
}
