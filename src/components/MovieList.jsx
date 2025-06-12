import { useEffect, useState } from "react";

import MovieCard from "./MovieCard";
import SearchBar from "./SearchBar";
import "../styles/MovieList.css";
import { fetchData, parseMovieData } from "../utils/utils";

const MovieList = ({ toggleModal, movieType }) => {
  const [displayedList, setDisplayedList] = useState(Array());
  const [movieList, setMovieList] = useState(Array());
  const [favorites, setFavorites] = useState(Array());
  const [watchedMovies, setWatchedMovies] = useState(Array());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const [morePages, setMorePages] = useState(true);
  const [filter, setFilter] = useState("default");
  const [headerText, setHeaderText] = useState("Now Playing");

  useEffect(() => {
    getMovieData();
  }, [currentPage]);

  useEffect(() => {
    setDisplayedList(movieList);
  }, [movieList, currentPage]);

  useEffect(() => {
    loadList();
    setHeader();
  }, [movieType]);

  const setHeader = () => {
    switch (movieType) {
      case "now-playing":
        setHeaderText("Now Playing");
        break;
      case "favorites":
        setHeaderText("Favorites");
        break;
      case "watched":
        setHeaderText("Watched");
        break;
      default:
        setHeaderText("Movies");
        break;
    }
  };

  async function getMovieData() {
    const data = await fetchData(currentPage);
    let list = await parseMovieData(data);

    list = list.filter(
      (movie) =>
        !movieList.some((existingMovie) => existingMovie.id === movie.id)
    );

    setTotalPages(data.total_pages);
    setMovieList((movieList) =>
      currentPage === 1 ? list : [...movieList, ...list]
    );
  }

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const loadList = () => {
    // filter movieList based on what page we're on
    switch (movieType) {
      case "now-playing":
        setDisplayedList(movieList);
        break;
      case "favorites":
        setDisplayedList(favorites);
        setMorePages(false);
        break;
      case "watched":
        setDisplayedList(watchedMovies);
        setMorePages(false);
        break;
    }
  };

  const sortMovies = (filter) => {
    let sortedMovies = [...displayedList];

    switch (filter) {
      case "alphabetical":
        sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "release":
        sortedMovies.sort((a, b) => {
          const dateA = new Date(a.releaseDate);
          const dateB = new Date(b.releaseDate);

          return dateB - dateA;
        });
        break;
      case "rating":
        sortedMovies.sort((a, b) => b.rating - a.rating);
        break;
    }

    setDisplayedList(sortedMovies);
  };

  const likeMovie = (selectedId, liked) => {
    const likedMovie = displayedList.find((movie) => movie.id === selectedId);
    if (liked) {
      likedMovie.liked = false;
    } else {
      likedMovie.liked = true;
    }

    if (!liked) {
      if (likedMovie && !favorites.some((fav) => fav.id === selectedId)) {
        // if the movie is NOT in the list
        setFavorites([...favorites, likedMovie]);
      }
    } else {
      // if already liked, remove it (unlike)
      setFavorites(favorites.filter((movie) => movie.id !== selectedId));
    }
  };

  const watchMovie = (selectedId, watched) => {
    const watchedMovie = displayedList.find((movie) => movie.id === selectedId);
    if (watched) {
      watchedMovie.watched = false;
    } else {
      watchedMovie.watched = true;
    }

    if (!watched) {
      if (
        watchedMovie &&
        !watchedMovies.some((movie) => movie.id === selectedId)
      ) {
        // if the movie is NOT in the list
        setWatchedMovies([...watchedMovies, watchedMovie]);
      }
    } else {
      // if already liked, remove it (unlike)
      setWatchedMovies(
        watchedMovies.filter((movie) => movie.id !== selectedId)
      );
    }

    console.log(watchedMovie);
  };

  return (
    <>
      <main>
        <h1>{headerText}</h1>
        <SearchBar
          setDisplayedList={setDisplayedList}
          loadList={loadList}
          sortMovies={sortMovies}
          setFilter={setFilter}
        ></SearchBar>
        <section id="movie-list">
          {displayedList.length == 0 && <p>No movies to display.</p>}
          {displayedList.map((movie) => {
            const { id, title, poster, rating, liked, watched } = movie;

            return (
              <MovieCard
                key={id}
                id={id}
                title={title}
                poster={poster}
                rating={rating}
                liked={liked}
                watched={watched}
                onClick={toggleModal(id)}
                likeMovie={likeMovie}
                watchMovie={watchMovie}
                movieType={movieType}
              ></MovieCard>
            );
          })}
        </section>
        {morePages && (
          <>
            <button className="load-btn" onClick={nextPage}>
              Load More
            </button>
            <p>
              Page {currentPage} of {totalPages}
            </p>
          </>
        )}
      </main>
    </>
  );
};

export default MovieList;
