import React, { useState } from 'react'
import styles from './Navbar.module.css'
import { useRouter } from 'next/router';

// const clearIcon = document.querySelector(".clear-icon");
// const searchBar = document.querySelector(".search");

const Navbar = () => {
  const [searchText, setSearchText] = useState("")
  const router = useRouter()
  

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      router.replace(`/products?q=${searchText.split(' ')}`)
    }
  }
  return (
    <div className={styles.nav}>
    <div className={styles.logo} onClick={() => {  router.replace('/products')}}>Jungle Cart</div>
    <input onChange={(e) => setSearchText(e.target.value)}  value={searchText} placeholder="Search the Jungle" className={styles.input}
    onKeyDown={(e) => handleKeyDown(e) }
    ></input>
    <div onClick={() => router.push("/seller")} className={styles.avatar}></div> 
    <div></div>
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