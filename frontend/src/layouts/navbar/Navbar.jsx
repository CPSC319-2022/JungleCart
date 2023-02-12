import React from 'react'
import styles from './Navbar.module.css'


// const clearIcon = document.querySelector(".clear-icon");
// const searchBar = document.querySelector(".search");

const Navbar = () => {
  return (
    <div className={styles.nav}>
    <div className={styles.logo}>Jungle Cart</div>
    <input className={styles.input}></input>
    <div className={styles.avatar}></div>
    </div>)
  
  {/* searchBar.addEventListener("keyup", () => {
  styles.searchBar.value && clearIcon.style.visibility != "visible"){
    clearIcon.style.visibility = "visible";
  } else if(!searchBar.value) {
    clearIcon.style.visibility = "hidden";
  }
});

clearIcon.addEventListener("click", () => {
  searchBar.value = "";
  clearIcon.style.visibility = "hidden";
}) */}
}

export default Navbar;