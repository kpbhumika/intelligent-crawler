import Navigation from "./Navigation";
import Footer from "./Footer";
import "./HeroSection.css";

const Layout = ({ children }) => {
  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
