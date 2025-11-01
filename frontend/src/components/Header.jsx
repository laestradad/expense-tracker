import { Link } from 'react-router-dom'

export default function Header({ loggedIn, onLogout }) {
  return (
    <nav>
      <Link to="/"> Home </Link> |{ " " }
      <Link to="/about"> About </Link> |{ " " }
      {loggedIn ? (
        <>
          <Link to="/dashboard">Dashboard</Link> |{ " " }
          <Link onClick={onLogout}>Logout</Link>
        </>
        ) : (
        <Link to="/login">Login</Link>
        )
      } 
    </nav>
  )
}