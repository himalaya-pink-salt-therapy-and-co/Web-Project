import Image from "next/image";
import Nav from "./components/nav";
import HeroSection from "./components/herosection";
import Products from "./components/product";
import Footer from "./components/footer";
import Contactus from "./components/contactus";

export default function Home() {
  return (
    <>
      <Nav />
      <HeroSection />
      <Products />
      <Contactus />
      <Footer />
    </>
  );
}
