import { NextResponse } from 'next/server';

// Mock movies storage - in a real app, this would be a database
let movies = [];

// GET - Fetch movies with pagination
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Get paginated movies
    const paginatedMovies = movies.slice(startIndex, endIndex);
    
    // Calculate total pages
    const totalPages = Math.ceil(movies.length / limit);
    
    return NextResponse.json({
      success: true,
      movies: paginatedMovies,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalMovies: movies.length,
        limit: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}

// POST - Add a new movie
export async function POST(request) {
  try {
    const { title, year, image } = await request.json();

    // Validate input
    if (!title || !year) {
      return NextResponse.json(
        { error: 'Title and year are required' },
        { status: 400 }
      );
    }

    // Validate year format (should be 4 digits)
    if (!/^\d{4}$/.test(year)) {
      return NextResponse.json(
        { error: 'Year must be a 4-digit number' },
        { status: 400 }
      );
    }

    // Validate year range (reasonable movie years)
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(year);
    if (yearNum < 1888 || yearNum > currentYear + 5) {
      return NextResponse.json(
        { error: `Year must be between 1888 and ${currentYear + 5}` },
        { status: 400 }
      );
    }

    // Create new movie
    const newMovie = {
      id: movies.length + 1,
      title: title.trim(),
      year: year,
      image: image || `https://picsum.photos/200/300?${movies.length + 1}`
    };

    // Add to movies array
    movies.push(newMovie);

    return NextResponse.json({
      success: true,
      message: 'Movie added successfully',
      movie: newMovie
    });

  } catch (error) {
    console.error('Error adding movie:', error);
    return NextResponse.json(
      { error: 'Failed to add movie' },
      { status: 500 }
    );
  }
}
