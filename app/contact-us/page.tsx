import Contactus from "../components/contactus";
import Footer from "../components/footer";
import Nav from "../components/nav";

export default function ContactUs() {
  return (
    <>
      <Nav />
      <section className="w-full border-b border-zinc-200">
        <div className="pt-30 w-[90%] mx-auto pb-20">
          <Contactus />
        </div>
      </section>
      <Footer />
    </>
  );
}
