import '../styles/Home.css';
import placeholderImg from '../assets/placeholder-face.png';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar />
      <div className="home-wrapper">
        <section className="home-hero flex h-screen flex-col justify-between py-8 md:flex-row md:items-center">
          <div className="flex w-full justify-center md:w-1/2 md:justify-start">
            <img src={placeholderImg} alt="Profile" className="hero-image" />
          </div>
          <div className="mt-8 px-4 text-center md:mt-0 md:w-1/2 md:text-right">
            <div className="text-group">
              <h1 className="hero-title">&lt;coder&gt;</h1>
              <p className="hero-description">
                Developer who focuses on writing clean, elegant and efficient code. Love HTML5,
                CSS3, WordPress and a touch of jQuery.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
