"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function CreateMovie() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubTitle] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    title: "",
    year: "",
    image: ""
  });
  const { user, authLoading, requireAuth } = useAuth();
  const router = useRouter();

  // Check authentication on component mount
  useEffect(() => {
    if (!authLoading) {
      requireAuth();
    }
  }, [authLoading, requireAuth]);

  // Show loading spinner while checking authentication
  if (authLoading) {
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

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      // Clear image error when file is dropped
      if (fieldErrors.image) {
        setFieldErrors(prev => ({ ...prev, image: "" }));
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // Clear image error when file is selected
      if (fieldErrors.image) {
        setFieldErrors(prev => ({ ...prev, image: "" }));
      }
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    // Clear title error when user starts typing
    if (fieldErrors.title) {
      setFieldErrors(prev => ({ ...prev, title: "" }));
    }
  };

  const handleYearChange = (e) => {
    setSubTitle(e.target.value);
    // Clear year error when user starts typing
    if (fieldErrors.year) {
      setFieldErrors(prev => ({ ...prev, year: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Reset field errors
    setFieldErrors({
      title: "",
      year: "",
      image: ""
    });

    // Validate each field individually
    let hasErrors = false;
    const newFieldErrors = {
      title: "",
      year: "",
      image: ""
    };

    // Validate title
    if (!title.trim()) {
      newFieldErrors.title = "Title is required";
      hasErrors = true;
    }

    // Validate publishing year
    if (!subtitle.trim()) {
      newFieldErrors.year = "Publishing year is required";
      hasErrors = true;
    } else if (!/^\d{4}$/.test(subtitle.trim())) {
      newFieldErrors.year = "Publishing year must be a 4-digit number";
      hasErrors = true;
    }

    // Validate image
    if (!file) {
      newFieldErrors.image = "Please select an image";
      hasErrors = true;
    }

    // If there are validation errors, show them and stop
    if (hasErrors) {
      setFieldErrors(newFieldErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          year: subtitle.trim(),
          image: file ? URL.createObjectURL(file) : null
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - redirect to movies page
        router.push('/movies');
      } else {
        setError(data.error || 'Failed to add movie');
      }
    } catch (error) {
      console.error('Error adding movie:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/movies');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b bg-[#093545] back p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-semibold text-white mb-8 md:mb-12 mt-4 md:mt-8">
          Create a new movie
        </h2>

        {error && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-500/20 border border-red-500/50 rounded-md">
            <p className="text-red-400 text-xs md:text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Left side - File upload area */}
          <div className="flex-1 flex justify-center lg:justify-start">
            <div
              className={`relative border-2 border-dashed rounded-lg h-[300px] md:h-[400px] w-full max-w-[380px] flex flex-col items-center justify-center cursor-pointer transition-colors ${
                fieldErrors.image
                  ? "border-red-500 bg-[#224957]"
                  : dragActive
                  ? "border-teal-400 bg-[#224957]"
                  : "border-white bg-[#224957]"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById("fileInput").click()}
            >
              <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleFileChange}
                accept="video/*,image/*"
              />
              
              <div className="flex flex-col items-center justify-center text-white">
                <svg
                  className="w-8 h-8 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-sm">
                  {file ? file.name : "Drop an image here"}
                </p>
              </div>
            </div>
            {fieldErrors.image && (
              <p className="text-red-400 text-xs md:text-sm mt-2">{fieldErrors.image}</p>
            )}
          </div>

          {/* Right side - Form inputs */}
          <div className="flex-1 flex flex-col">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={handleTitleChange}
                  className={`w-full px-4 py-3 bg-[#224957] border rounded-md text-white placeholder-white focus:outline-none transition-colors ${
                    fieldErrors.title 
                      ? "border-red-500 focus:border-red-500" 
                      : "border-gray-600/50 focus:border-teal-500"
                  }`}
                />
                {fieldErrors.title && (
                  <p className="text-red-400 text-xs md:text-sm mt-1">{fieldErrors.title}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Publishing year"
                  value={subtitle}
                  onChange={handleYearChange}
                  className={`w-full px-3 md:px-4 py-2 md:py-3 bg-[#224957] border rounded-md text-white placeholder-white focus:outline-none transition-colors text-sm md:text-base ${
                    fieldErrors.year 
                      ? "border-red-500 focus:border-red-500" 
                      : "border-gray-600/50 focus:border-teal-500"
                  }`}
                />
                {fieldErrors.year && (
                  <p className="text-red-400 text-xs md:text-sm mt-1">{fieldErrors.year}</p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6 md:mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 md:px-6 py-2 md:py-3 rounded-md text-white bg-transparent font-medium transition-all hover:bg-white/10 duration-200 cancel-button text-sm md:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 md:px-6 py-2 md:py-3 rounded-md text-white transition-all duration-200 font-medium text-sm md:text-base"
              style={{ backgroundColor: '#2BD17E' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#25b870'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2BD17E'}
            >
              {loading ? 'Adding...' : 'Submit'}
            </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}