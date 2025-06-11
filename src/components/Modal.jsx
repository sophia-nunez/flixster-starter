import '../styles/Modal.css'
import { fetchByID } from '../utils/utils';

const Modal = (props) => {

  return (
    <aside id="movie-modal" className="modal" ref={props.reference}>
      <span className="close">&times;</span>
      <section id="modal-content">
        <article id="movie-card">
          <h2>{props.title}</h2>
          <img src={`https://image.tmdb.org/t/p/w300${props.backdrop}`} />
          <p><strong>Runtime: </strong> {props.runtime} mins</p>
          <p><strong>Release Date: </strong> {props.releaseDate}</p>
          <p><strong>Overview: </strong> {props.overview}</p>
          <p><strong>Genres: </strong> {props.genres}</p>
          {props.trailer === "" ? <p>No trailer to display</p> : <iframe src={`https://www.youtube.com/embed/${props.trailer}`}></iframe>}
        </article>
      </section>
    </aside>
  )
}

export default Modal;