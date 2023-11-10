import Footer from "../layout/Footer";
import NavBar from "../layout/Navbar";
import {Outlet} from "react-router-dom";

export default function Layout() {
  return (
    <>
      <NavBar></NavBar>
      <Outlet></Outlet>
      <Footer></Footer>
    </>
  );
}
