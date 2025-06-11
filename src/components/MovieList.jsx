import { useEffect, useState } from "react";

import MovieCard from "./MovieCard";
import SearchBar from "./SearchBar";
import "../styles/MovieList.css";
import { fetchData, parseMovieData } from "../utils/utils";

const MovieList = ({toggleModal, movieType}) => {
  const [movieList, setMovieList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const [morePages, setMorePages] = useState(true);
  const [filter, setFilter] = useState("default");

  useEffect(() => {
    try {
      getMovieData();
      sortMovies(filter);

      if (currentPage >= totalPages) {
        setMorePages(false); // no Load More button
      }
    } catch (error) {
      console.log("Movie data could not be fetched: " + error);
    }
  }, [currentPage]);

  useEffect(() => {
    // filter movieList based on what page we're on
    switch (movieType) {
      case 'now-playing':
        getMovieData();
        break;
      case 'favorites':
        const likedList = movieList.filter(movie => movie.liked === true);
        setMovieList(likedList);
        break;
      case 'watched':
        const watchedList = movieList.filter(movie => movie.watched === true);
        setMovieList(watchedList);
        break;
    }
  }, [movieType]);

  async function getMovieData() {
    const data = await fetchData(currentPage);
    const list = await parseMovieData(data);

    setTotalPages(data.total_pages);
    setMovieList((movieList) => currentPage === 1 ? list : [...movieList, ...list]);
  }

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const sortMovies = (filter) => {
    let sortedMovies = [...movieList];

    switch (filter) {
      case 'alphabetical':
        sortedMovies.sort((a, b) => a.title.localeCompare(b.title))
        break;
      case 'release':
        sortedMovies.sort((a, b) => {
          const dateA = new Date(a.releaseDate);
          const dateB = new Date(b.releaseDate);

          return dateB - dateA;
        })
        break;
      case 'rating':
        sortedMovies.sort((a, b) => b.rating - a.rating);
        break;
    }

    setMovieList(sortedMovies);
  }

  const likeMovie = (selectedId, liked) => {
    const likedMovie = movieList.find(movie => movie.id === selectedId);
    if (liked) {
      likedMovie.liked = false;
    } else {
      likedMovie.liked = true;
    }

    console.log(movieList);
  }

  const watchMovie = (selectedId, watched) => {
    const watchedMovie = movieList.find(movie => movie.id === selectedId);
    if (watched) {
      watchedMovie.watched = false;
    } else {
      watchedMovie.watched = true;
    }

    console.log(movieList);
  }

  return (
    <>
      <SearchBar setMovieList={setMovieList} getMovieData={getMovieData} sortMovies={sortMovies} setFilter={setFilter}></SearchBar>
      <main>
        <h1>Movies</h1>
        <section id="movie-list">
          {movieList.length == 0 && <p>No movies to display.</p>}
          {movieList.map((movie) => {
            const { id, title, poster, rating } = movie;

            return (
              <MovieCard
                key={id}
                id={id}
                title={title}
                poster={poster}
                rating={rating}
                onClick={toggleModal(id)}
                likeMovie={likeMovie}
                watchMovie={watchMovie}
              ></MovieCard>
            );
          })}
        </section>
        {morePages && (
          <button className="load-btn" onClick={nextPage}>
            Load More
          </button>
        )}
        <p>
          Page {currentPage} of {totalPages}
        </p>
      </main>
    </>
  );
};

export default MovieList;
