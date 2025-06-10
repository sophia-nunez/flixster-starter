import { useState, useEffect } from "react";
import '../styles/NavBar.css';

import { searchData, parseMovieData } from "../utils/utils";

const NavBar = (props) => {
  const [searchInput, setSearchInput] = useState("");
  const [dropdownValue, setDropdownValue] = useState("");

  useEffect(() => {
    setDropdownValue("default");
    handleSearch();
  }, [searchInput]);

  useEffect(() => {
    if (dropdownValue) {
      props.sortMovies(dropdownValue);
    }
  }, [dropdownValue]);

  const updateSearch = (event) => {
    const {value} = event.target;

    setSearchInput(value);
  }

  const handleSearch = (event) => {

    if (searchInput === "") {
      props.getMovieData();
      return;
    }
    
    searchForMovie();
  }
  
  async function searchForMovie() {
    const data = await searchData(searchInput);
    const movies = await parseMovieData(data);

    props.setMovieList(movies);
  }

  const handleChange = (event) => {
    const {value} = event.target;
    setDropdownValue(value);
  }
  
  return (
    <nav className="nav-bar">
                <div>
                    <input type="search" id="search-bar" placeholder="Find a movie..." value={searchInput} onChange={updateSearch}></input>
                    <button type="submit" onClick={handleSearch}>Search</button>
                </div>
                <div>
                    <select id="sort-by" name="sort-by" defaultValue="default" value={dropdownValue} onChange={handleChange}>
                        <option value="default" disabled={true}>Select option</option>
                        <option value="alphabetical">Title (A-Z)</option>
                        <option value="release">Most recent</option>
                        <option value="rating">Highly Rated</option>
                    </select>
                </div>

            </nav>
  )
}

export default NavBar;