import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import MovieCard from "./MovieCard";
import SearchBar from "./SearchBar";
import "../styles/MovieList.css";
import { fetchData, parseMovieData } from "../utils/utils";

const MovieList = ({ toggleModal, movieType }) => {
  // arrays of movies by user-interacted properties
  const [displayedList, setDisplayedList] = useState(Array());
  const [movieList, setMovieList] = useState(Array());
  const [favorites, setFavorites] = useState(Array());
  const [watchedMovies, setWatchedMovies] = useState(Array());
  // page information
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const [morePages, setMorePages] = useState(true);
  const [headerText, setHeaderText] = useState("Now Playing");
  const [isLoading, setIsLoading] = useState(false);
  // sort menu display & value
  const [dropdownValue, setDropdownValue] = useState("default");

  // adds next page on to current when page is incremented
  useEffect(() => {
    setIsLoading(true);
    getMovieData();
    setIsLoading(false);
  }, [currentPage]);

  useEffect(() => {
    setDisplayedList(movieList);
  }, [movieList, currentPage]);

  // loads display and header name based on tab
  useEffect(() => {
    setIsLoading(true);
    loadList();
    setHeader();
    setIsLoading(false);
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

  // fetches movie data for now playing
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
    setDropdownValue("default"); // reset select to default (no sort)
  };

  // selects displayedList based on tab
  const loadList = () => {
    // optionally filter movieList based on what page we're on
    switch (movieType) {
      case "now-playing":
        setDisplayedList(movieList);
        setDropdownValue("default");
        setMorePages(true);
        break;
      case "favorites":
        setDisplayedList(favorites);
        setDropdownValue("default");
        setMorePages(false);
        break;
      case "watched":
        setDisplayedList(watchedMovies);
        setDropdownValue("default");
        setMorePages(false);
        break;
    }
  };

  // creates temporary array of sorted movies (not stored in state)
  const sortMovies = () => {
    let sortedMovies = [...displayedList];

    switch (dropdownValue) {
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

  // finds the movie by id, toggles the liked property, and add/removes it from the liked list
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
          movieType={movieType}
          setMorePages={setMorePages}
          setDropdownValue={setDropdownValue}
          dropdownValue={dropdownValue}
          setIsLoading={setIsLoading}
        ></SearchBar>
        <section id="movie-list">
          {isLoading && (
            <FontAwesomeIcon icon={faSpinner} className="loading" />
          )}
          {!isLoading && displayedList.length == 0 && (
            <p>No movies to display.</p>
          )}
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
            <p className="page-display">
              Page {currentPage} of {totalPages}
            </p>
          </>
        )}
      </main>
    </>
  );
};

export default MovieList;
