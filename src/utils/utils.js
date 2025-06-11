const API_KEY = import.meta.env.VITE_API_KEY;

const fetchData = async (page) => {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    };

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}&include_adult=false&sort_by=title.asc`,
      options
      // optionally use:  `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=${filter}.desc&with_release_type=2|3&release_date.gte={min_date}&release_date.lte={max_date}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch movie data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

const searchData = async (search) => {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    };

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false`,
      options
    );
    if (!response.ok) {
      throw new Error("Failed to fetch movie search data");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

const fetchByID = async (movieID) => {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    };

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieID}?language=en-US`,
      options
    );
    if (!response.ok) {
      throw new Error("Failed to fetch movie by ID data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

async function parseMovieData(data) {
  const movies = [];

  data.results.forEach((movie) => {
    // set values: title, poster, rating
    const id = movie.id;
    const title = movie.title;
    const poster = movie.poster_path;
    const rating = movie.vote_average;
    const releaseDate = movie.release_date;

    // make object
    const newMovie = {
      id,
      title,
      poster,
      rating,
      releaseDate
    };

    // add to array
    movies.push(newMovie);
  });

  return movies;
}

export { fetchData, searchData, fetchByID, parseMovieData };
