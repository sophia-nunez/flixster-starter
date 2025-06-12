import '../styles/NavBar.css'

const NavBar = ({setMovieType}) => {

  return (
    <nav id="nav-bar">
      <p>side bar</p>
      <button className="nav-liked" onClick={() => setMovieType("now-playing")}>Now Playing</button>
      <button className="nav-liked" onClick={() => setMovieType("favorites")}>Favorites</button>
      <button className="nav-liked" onClick={() => setMovieType("watched")}>Watched</button>
    </nav>
  )
}

export default NavBar;