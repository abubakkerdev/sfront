import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteItem } from "../../features/user/userSlice";

function Header() {
  const userAuth = useSelector((state) => state.userInfo.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(deleteItem(userAuth[0].id));
    navigate("/login");
  };

  return (
    <header id="header" className="header sticky-top">
      <div className="branding d-flex align-items-center">
        <div className="container position-relative d-flex align-items-center justify-content-end">
          <Link to="/" className="logo d-flex align-items-center me-auto">
            <h1 className="sitename">Deep Learning</h1>
          </Link>
          <nav id="navmenu" className="navmenu">
            <ul>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/add"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Add Content
                </NavLink>
              </li>
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>

          <span onClick={handleLogOut} className="cta-btn">
            Log Out
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
