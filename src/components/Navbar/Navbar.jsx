import React from 'react';
import { Link } from 'react-router-dom'; 

const Navbar = (props) => {
  
  return (
   <>
     <div className='navbar'>
       <div className='navbar-brand'>eShop</div>
       <div className='navbar-button'>Categories</div>
       <form className="form-inline my-2 my-lg-0">
         <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"></input>
         <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
       </form>
       <div className='navbar-button'  onClick={props.toggleCart} ><i className="fa fa-shopping-cart" ></i></div>
       <div className='navbar-button'>{(props.username !== undefined && props.username !== null && props.username !== "")?props.username : 'signin'}</div>
     </div>
   </>
  );
}

export default Navbar;
