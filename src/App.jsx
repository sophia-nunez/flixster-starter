import { useState, useEffect, useRef } from "react";
import "./styles/App.css";
import FlixsterHeader from "./components/FlixsterHeader";
import MovieList from "./components/MovieList";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import { fetchByID } from "./utils/utils";

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [runtime, setRuntime] = useState(0);
  const [title, setTitle] = useState(0);
  const [backdrop, setBackdrop] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [genres, setGenres] = useState("");
  const [overview, setOverview] = useState("");
  const modalRef = useRef(null);

  async function openModal(movieID) {
    const movie = await fetchByID(movieID);

    // set props to pass: title, poster, rating
    const genres = movie.genres;

    const genreNames = genres.map(genre => genre.name);

    console.log(genres);
    setTitle(movie.title);
    setBackdrop(movie.poster_path);
    setRuntime(movie.runtime);
    setOverview(movie.overview);
    setReleaseDate(movie.release_date);
    setGenres(genreNames.join(" | "));

    setModalOpen(true);
  }

  useEffect(() => {
    function handleWindowClick(event) {
      const span = document.getElementsByClassName("close")[0];
      if (event.target === span) {
        setModalOpen(false);
      }
      if (modalRef.current && event.target === modalRef.current) {
        setModalOpen(false);
      }
    }

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  return (
    <div className="App">
      <FlixsterHeader></FlixsterHeader>
      <MovieList toggleModal={() => openModal}></MovieList>
      <Footer></Footer>

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
        ></Modal>
      )}
    </div>
  );
};

export default App;
