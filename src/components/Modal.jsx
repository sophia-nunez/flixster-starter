import { useEffect, useState } from "react";

import "../styles/Modal.css";
import { fetchByID, fetchVideo } from "../utils/utils";
import noPoster from "../assets/images/no-poster.png";

const Modal = ({ movie, reference }) => {
  // modal information
  const [runtime, setRuntime] = useState(0);
  const [title, setTitle] = useState(0);
  const [backdrop, setBackdrop] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [genres, setGenres] = useState("");
  const [overview, setOverview] = useState("");
  const [trailer, setTrailer] = useState("");

  useEffect(() => {
    loadInformation();
  }, []);

  const loadInformation = async () => {
    // set props for display: title, poster, rating, etc.
    const genres = movie.genres;
    const genreNames = genres.map((genre) => genre.name);

    setTitle(movie.title);
    if (movie.backdrop_path) {
      setBackdrop(movie.backdrop_path);
    }
    setRuntime(movie.runtime);
    setOverview(movie.overview);
    setReleaseDate(movie.release_date);
    setGenres(genreNames.join(" | "));

    // get video, first trailer in fetched data
    const videos = await fetchVideo(movie.id);
    const trailers = videos.results.filter(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );
    if (trailers.length > 0) {
      setTrailer(trailers[0].key);
    }
  };

  const formatDate = (date) => {
    // date format to "Month DD, YYYY"
    const dateObj = new Date(date);

    const options = { month: "long", day: "numeric", year: "numeric" };

    const USFormat = dateObj.toLocaleString("en-US", options);

    return USFormat;
  };

  return (
    <aside id="movie-modal" className="modal" ref={reference}>
      <span className="close">&times;</span>
      <section id="modal-content">
        <article id="movie-card">
          <img className="modal-backdrop"
            src={
              backdrop === ""
              ? noPoster
              : `https://image.tmdb.org/t/p/w300${backdrop}`
            }
            alt={`Movie backdrop for ${title}`}
            />
            <h2>{title}</h2>
          <p>
            <strong>Runtime: </strong> {runtime} mins
          </p>
          <p>
            <strong>Release Date: </strong> {formatDate(releaseDate)}
          </p>
          <p>
            <strong>Overview: </strong> {overview}
          </p>
          <p>
            <strong>Genres: </strong> {genres}
          </p>
          {trailer === "" ? (
            <p>No trailer to display</p>
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${trailer}`}
              alt={`Trailer for ${title}`}
            ></iframe>
          )}
        </article>
      </section>
    </aside>
  );
};

export default Modal;
