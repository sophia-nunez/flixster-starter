import { useState, useEffect, useRef } from "react";
import "./styles/App.css";
import FlixsterHeader from "./components/FlixsterHeader";
import NavBar from "./components/NavBar";
import MovieList from "./components/MovieList";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import { fetchByID } from "./utils/utils";

const App = () => {
  const [movieType, setMovieType] = useState("now-playing");
  const [modalMovie, setModalMovie] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef(null);

  async function openModal(movieID) {
    const movie = await fetchByID(movieID);
    setModalMovie(movie);
    setModalOpen(true);
  }

  // closes modal on window click off of modal or on span
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
      <FlixsterHeader movieType={movieType} />
      <div className="content">
        <NavBar setMovieType={setMovieType} movieType={movieType} />
        <MovieList
          toggleModal={() => openModal}
          movieType={movieType}
        ></MovieList>
      </div>
      <Footer />

      {modalOpen && (
        <Modal
          className="modal"
          reference={modalRef}
          movie={modalMovie}
        ></Modal>
      )}
    </div>
  );
};

export default App;
