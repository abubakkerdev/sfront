import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { deleteItem } from "../features/user/userSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function MainLayout() {
  const userAuth = useSelector((state) => state.userInfo.items);
  const navigate = useNavigate();

  useEffect(() => {
    if (userAuth.length > 0) {
      if ("login" in userAuth[0]) {
        if (Date.now() > userAuth[0].exp) {
          dispatch(deleteItem(userAuth[0].id));
          navigate("/login");
        }
      }
    } else if (userAuth.length === 0) {
      navigate("/login");
    }
  }, [navigate, userAuth]);

  return (
    <>
      <Header />
      <main className="main">
        <Outlet context={{ userAuth }} />
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;
