import classes from './header.module.css'
import headerLogo from '../../assets/images/header-logo.png'
import { useContext } from 'react';
import { AppContext } from '../../Router';
import { useNavigate } from 'react-router';


const Header = () => {
 
  const {user}=useContext(AppContext)
  const navigate = useNavigate()


  const logOut = ()=>{
    localStorage.removeItem('token');
    navigate('/login')
  }

  const token = localStorage.getItem('token')

  return (
    <>
      <header className={classes.header}>
        <div className={classes.container}>
          <a href="/home" className={classes.logo}>
            <img src={headerLogo} alt="Evangadi Logo" />
          </a>
          <nav className={classes.navLinks}>
            <a href="/home">Home</a>
            <a href="/home">How it Works</a>
            {token && (
              <button className={classes.signinBtn} onClick={logOut}>
                Log out
              </button>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}

export default Header
