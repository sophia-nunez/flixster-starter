import '../styles/NavBar.css'

const NavBar = ({setMovieType, movieType}) => {

  return (
    <nav id="nav-bar" className={movieType}>
      <button className="nav-now" onClick={() => setMovieType("now-playing")}>Home</button>
      <button className="nav-favorites" onClick={() => setMovieType("favorites")}>Favorites</button>
      <button className="nav-watched" onClick={() => setMovieType("watched")}>Watched</button>
    </nav>
  )
}

export default NavBar;