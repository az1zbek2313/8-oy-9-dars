import { useEffect, useState } from 'react'
import Card from "./components/Card"
import './App.css'

function App() {
  const [countries, setCountries] = useState([]);
const [fetching, setFetching] = useState(true);
const [currentPage, setCurrentPage] = useState(1);
const stored = localStorage.getItem("check")?JSON.parse(localStorage.getItem("check")):[];
const [check, setCheck] = useState(stored)
const [ids, setId] = useState("");


async function getData(limit, currentPage) {
    try {
      const data = await fetch(
        `http://localhost:3000/countries?limit=${limit}&page=${currentPage}`
      );
      const response = await data.json();
      setCountries([...countries, ...response.results]);
      setFetching(false);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
        if (fetching) {
          getData(6, currentPage);
        }
  }, [fetching, currentPage])

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);

    return function() {
        document.removeEventListener("scroll", scrollHandler)
    }
  }, [])

  function scrollHandler() {
      const target = document.documentElement;
      if (target.scrollHeight - (target.scrollTop + window.innerHeight) < 100) {
          setFetching(true);
          setCurrentPage(currentPage => currentPage + 1)
      }
  }

  useEffect(() => {
    setCheck(check); 
  }, [check])

  function hanleClick(id) {
    let copied = JSON.parse(JSON.stringify(stored));
    console.log(stored.some(item => item === id))
    if (stored.some(item => item === id)) { 
      copied = copied.filter(el => el !== id);
      setCheck(copied)
    } else {
      copied.push(id);
      setCheck(copied);
    }
    
    localStorage.setItem("check", JSON.stringify(copied))
  }

  return (
    <>
      <div className='container mt-5 d-flex justify-content-between flex-wrap' >
        {
          countries.length > 0 && countries?.map((el, index) => (
            <div
            key={index}
            onClick={() => {hanleClick(el.id)}}
              className="card card-wrap mt-5 p-0"
              style={
                el.id == ids || check.some(item => item === el.id) ?
                { width: "18rem", height: "24rem", border: "2px solid blue", cursor:"pointer" }:
                { width: "18rem", height: "24rem", cursor:"pointer" }
              }
            >
              <img src={el.flag} className="card-img-top" alt="image" />
              <div className="card-body">
                <h4 className="card-title text-dark">{el.country}</h4>
                <p className="card-text">{el.code}</p>
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default App
