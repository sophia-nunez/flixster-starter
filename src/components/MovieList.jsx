import { useEffect, useState } from "react";

import MovieCard from "./MovieCard";
import NavBar from "./NavBar";
import "../styles/MovieList.css";
import { fetchData, parseMovieData } from "../utils/utils";

const MovieList = (props) => {
  const [movieList, setMovieList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const [morePages, setMorePages] = useState(true);

  useEffect(() => {
    try {
      getMovieData();

      if (currentPage >= totalPages) {
        setMorePages(false); // no Load More button
      }
    } catch (error) {
      console.log("Movie data could not be fetched: " + error);
    }
  }, [currentPage]);

  async function getMovieData() {
    const data = await fetchData(currentPage);
    const list = await parseMovieData(data);

    setTotalPages(data.total_pages);
    setMovieList(list);
  }

  const incrementPage = () => {
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

  return (
    <>
      <NavBar setMovieList={setMovieList} getMovieData={getMovieData} sortMovies={sortMovies}></NavBar>
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
                onClick={props.toggleModal(id)}
              ></MovieCard>
            );
          })}
        </section>
        {morePages && (
          <button className="load-btn" onClick={incrementPage}>
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
