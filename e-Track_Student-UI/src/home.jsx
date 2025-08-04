import React from 'react';
import { Link, Outlet } from 'react-router-dom'
import Header from './components/Header';
import Footer from './components/Footer';
function Home() {
  return (
<><Header />
   
    <Outlet /> 
    <Footer/>
    </>)
}
export default Home