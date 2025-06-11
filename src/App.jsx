import { useState, useEffect, useRef } from "react";
import "./styles/App.css";
import FlixsterHeader from "./components/FlixsterHeader";
import NavBar from "./components/NavBar";
import MovieList from "./components/MovieList";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import { fetchByID, fetchVideo } from "./utils/utils";

const App = () => {
  const [movieType, setMovieType] = useState("now-playing");
  const [modalOpen, setModalOpen] = useState(false);
  const [runtime, setRuntime] = useState(0);
  const [title, setTitle] = useState(0);
  const [backdrop, setBackdrop] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [genres, setGenres] = useState("");
  const [overview, setOverview] = useState("");
  const [trailer, setTrailer] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    console.log(movieType);
  }, [movieType])

  async function openModal(movieID) {
    const movie = await fetchByID(movieID);

    // set props to pass: title, poster, rating
    const genres = movie.genres;
    const genreNames = genres.map(genre => genre.name);

    setTitle(movie.title);
    setBackdrop(movie.poster_path);
    setRuntime(movie.runtime);
    setOverview(movie.overview);
    setReleaseDate(movie.release_date);
    setGenres(genreNames.join(" | "));

    // get video
    const videos = await fetchVideo(movieID);
    const trailers = videos.results.filter(video => video.type === "Teaser" && video.site === "YouTube");
    if (trailers.length > 0) {
      setTrailer(trailers[0].key);
    }
    
    setModalOpen(true);
  }

  useEffect(() => {
    function handleWindowClick(event) {
      const span = document.getElementsByClassName("close")[0];
      if (event.target === span) {
        setModalOpen(false);
        setTrailer("");
      }
      if (modalRef.current && event.target === modalRef.current) {
        setModalOpen(false);
        setTrailer("");
      }
    }

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  return (
    <div className="App">
      <FlixsterHeader/>
      <section className="main-flex">
        <NavBar setMovieType={setMovieType}/>
        <MovieList toggleModal={() => openModal} movieType={movieType}></MovieList>
      </section>
      <Footer/>

      {modalOpen && (
        <Modal
          className="modal"
          reference={modalRef}
          title={title}
          backdrop={backdrop}
          runtime={runtime}
          releaseDate={releaseDate}
          genres={genres}
          overview={overview}
          trailer={trailer}
        ></Modal>
      )}
    </div>
  );
};

export default App;
