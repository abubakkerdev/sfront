import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "../components/error/ErrorMessage";
import { useEffect, useState, useRef } from "react";
import { useLoginUserMutation } from "../features/user/userAPISlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../components/loader/Loader";
import "./css/Login.css";
import { addItem } from "../features/user/userSlice";

const loginToken = import.meta.env.VITE_LOGIN_TOKEN;

function Login() {
  const [loginUser, { data, isLoading, isSuccess, isError }] =
    useLoginUserMutation();

  const userAuth = useSelector((state) => state.userInfo.items);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const changePasswordType = useRef();

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [iconToggle, setIconToggle] = useState(false);

  const handleChange = (el) => {
    let { name, value } = el.target;
    setErrorMessage("");
    if (value !== "") {
      setLoginError({ ...loginError, [name]: "" });
    }
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  useEffect(() => {
    if (userAuth.length > 0) {
      if ("login" in userAuth[0]) {
        if (userAuth[0].login && Date.now() <= userAuth[0].exp) {
          navigate("/");
        }
      }
    }
  }, [navigate, userAuth]);


  // useEffect(() => { now do not need this
  //   dispatch(fetchItems());
  // }, [dispatch]);

  useEffect(() => {
    if (data && !isError) {
      if (data && "success" in data) {
        dispatch(addItem(data.success.info));

        setLoginInfo({
          email: "",
          password: "",
        });

        toast.success(data.success.message, {
          position: "top-right",
          onClose: () => {
            navigate("/");
          },
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        if (typeof data.error === "object") {
          if ("field" in data.error) {
            setLoginError({
              [data.error.field]: data.error.message,
            });
          } else {
            setErrorMessage(data.error.message);
          }
        } else {
          setErrorMessage(data.error);
        }
      }
    }

    if (isError) {
      setErrorMessage("There was an server-side Error.");
    }
  }, [data, isSuccess, isError, navigate, dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      await loginUser({ data: { ...loginInfo }, token: loginToken }).unwrap();
    } catch (error) {
      // console.error("Error adding user:", error);
    }
  };

  const handleIconChange = () => {
    setIconToggle(!iconToggle);
    if (changePasswordType.current) {
      changePasswordType.current.type = !iconToggle ? "text" : "password";
    }
  };

  return (
    <section className="container commonColor forms">
      <div className="form login">
        <div className="form-content  text-center">
          <h2>Login</h2>
          <form method="POST" onSubmit={handleLogin}>
            <div className=" form-group mt-3 ">
              <input
                type="email"
                className="form-control"
                name="email"
                onChange={handleChange}
                placeholder="Your Email"
                value={loginInfo.email}
              />

              {loginError?.email && <ErrorMessage message={loginError.email} />}
            </div>

            <div className="mb-4 mt-4 form-group iconposition">
              <input
                type="password"
                name="password"
                className="form-control "
                onChange={handleChange}
                value={loginInfo.password}
                placeholder="Your Password"
                ref={changePasswordType}
              />

              {iconToggle ? (
                <i
                  onClick={handleIconChange}
                  className="bi bi-eye-fill iconfill"
                ></i>
              ) : (
                <i
                  onClick={handleIconChange}
                  className="bi bi-eye-slash-fill iconfill"
                ></i>
              )}

              {loginError?.password && (
                <ErrorMessage message={loginError.password} />
              )}
              {errorMessage && <ErrorMessage message={errorMessage} />}
            </div>

            <div className="form-link">
              <Link to="/forgot" className="forgot-pass">
                Forgot password?
              </Link>
            </div>

            {isLoading ? (
              <Loader />
            ) : (
              <div className="button-fieldC">
                <button className="button-fieldBTN">Login</button>
              </div>
            )}
          </form>
          <div className="form-link">
            <span>
              Don&apos;t have an account?{" "}
              <Link to="/registrar" className="link signup-link">
                Signup
              </Link>
            </span>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </section>
  );
}

export default Login;
