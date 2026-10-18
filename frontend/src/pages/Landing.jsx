import { Link } from "react-router";

import Header from "../components/layout/Header";
import Reveal from "../components/ui/Reveal";
import Footer from "../components/layout/Footer";

import { contacts, faqs } from "../data/support";

import PosterWeeknd from "../assets/images/Poster-Weeknd.png";
import PosterTaylor from "../assets/images/Poster-Taylor.png";
import PosterMJ from "../assets/images/Poster-MJ.png";

export default function Landing() {
  return (
    <div>
      <Header />
      <main className="min-h-screen bg-landing bg-cover bg-center bg-fixed">
        <section id="home">
          <div className="flex min-h-screen items-center px-16 py-24">
            <div className="grid w-full items-center gap-8 lg:grid-cols-2">
              <div className="text-center text-white transition duration-500 starting:opacity-0 starting:-translate-x-12 lg:text-left">
                <div className="w-fit mt-16 mx-auto lg:mx-0 lg:mt-0">
                  <h1 className="text-4xl lg:text-6xl">
                    Your next unforgettable
                  </h1>
                  <h1 className="text-8xl lg:text-9xl lg:-translate-x-2 mt-4">
                    EXPERIENCE
                  </h1>
                  <h1 className="text-4xl lg:text-6xl mt-4">
                    is just one click away.
                  </h1>
                  <div className="my-6 h-1 w-full bg-white" />
                </div>
                <div className="flex flex-col lg:flex-row gap-2">
                  <p className="text-2xl lg:text-3xl text-white/90">
                    Start your journey today!
                  </p>
                  <Link to="/auth" state={{ mode: "register" }} className="text-2xl lg:text-3xl text-white/90 underline hover:text-yellow-400 transition-colors duration-200">
                    Register here!
                  </Link>
                </div>
              </div>
              <div className="relative flex h-124 lg:h-148 items-center justify-center lg:justify-end lg:p-30 transition-opacity duration-1000 starting:opacity-0">
                <img src={PosterTaylor} alt="Taylor Swift" className="-translate-x-30 absolute h-108 w-80 lg:h-136 lg:w-104 bg-white brightness-60" />
                <img src={PosterMJ} alt="Michael Jackson" className="z-1 h-120 w-80 lg:h-148 lg:w-104 bg-white shadow-2xl" />
                <img src={PosterWeeknd} alt="The Weeknd" className="translate-x-30 absolute h-108 w-80 lg:h-136 lg:w-104 bg-white brightness-60" />
              </div>
            </div>
          </div>
        </section>
        <section id="about" className="scroll-mt-20 bg-white px-16 pt-12 pb-6">
          <Reveal className="text-gray-600">
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              About Us
            </h2>
            <div className="mt-4 h-1 w-20 bg-cyan-500" />
            <div className="text-2xl mt-10 space-y-6">
              <p>
                <strong className="font-semibold text-gray-900">EVENTRIX</strong>{" "}
                is your gateway to unforgettable experiences across the Philippines. We make it easy to explore, discover, and book tickets for concerts, festivals,
                theater shows, and live performances happening on stages nationwide!
              </p>
              <p>
                Whether you're a music lover, theater enthusiast, or just looking for something exciting to do, EVENTRIX connects you directly with events that bring
                people together through art, culture, and entertainment.
              </p>
              <p>
                Our mission is to provide a seamless and secure ticketing experience, from browsing your favorite shows to securing your spot in seconds! With EVENTRIX,
                your next big moment is only a few clicks away.
              </p>
            </div>
          </Reveal>
        </section>
        <section id="support" className="scroll-mt-20 bg-white px-16 pt-12 pb-6">
          <Reveal className="text-gray-600">
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Support Us
            </h2>
            <div className="mt-4 h-1 w-20 bg-cyan-500" />
            <div className="text-2xl mt-10 space-y-6">
              {contacts.map(({ label, value }) => (
                <p key={label}>
                  <strong className="text-gray-900">{label}</strong>{" "}
                  {value}
                </p>
              ))}
            </div>
          </Reveal>
        </section>
        <section id="questions" className="scroll-mt-20 bg-white px-16 pt-12 pb-18">
          <Reveal className="text-gray-600">
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              FAQs
            </h2>
            <div className="mt-4 h-1 w-20 bg-cyan-500" />
            <div className="text-xl leading-8 mt-10 space-y-10">
              {faqs.map(({ question, answer }, i) => (
                <div key={question} className="space-y-6">
                  <p><strong className="text-2xl text-gray-900">Q{i + 1}: {question}</strong></p>
                  <p>{answer}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  )
}