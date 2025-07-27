import React, { useRef, useEffect, useState } from 'react';
import './LandingPage.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';


const LandingPage = () => {
  // Fade-in animation for Vision section
  const visionRef = useRef(null);
  const [isVisionVisible, setIsVisionVisible] = useState(false);

  useEffect(() => {
    const node = visionRef.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisionVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (

    <div className="landing-page">
      <Navbar />

      {/* Home Page Content */}
      <main className="pt-20">
        <section id="hero" className="relative px-4 py-[100px] overflow-hidden bg-white">
          {/* Background Circle Gradient */}
          <div className="absolute -top-20 -left-20 w-80 h-80 md:w-[30rem] md:h-[30rem] rounded-full bg-gradient-to-br from-secondary-clr/30 to-secondary-clr/10 blur-2xl z-0"></div>
          <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
            {/* Image with 3D frame */}
            <div className="relative w-full max-w-xs md:max-w-sm lg:max-w-md">
              <div className="absolute -inset-3 rotate-[8deg] rounded-2xl bg-accent-clr shadow-xl z-0"></div>
              <img src="/assets/images/SPB-Photos/SPB-Photo-4.jpg" alt="SP Balasubrahmanyam" className="relative z-10 rounded-2xl shadow-lg" />
            </div>
            {/* Text Content */}
            <div className="text-center md:text-left space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-clr">Aaradhya</h1>
              <h2 className="text-lg font-semibold text-secondary-clr">The Vision</h2>
              <p className="text-base md:text-lg leading-relaxed text-primary-clr">
                Aaradhya is a tribute to Shri S.P. Balasubrahmanyam, celebrating his timeless legacy and music.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-primary-clr italic">
                Born from love and remembrance, it unites generations through his soulful voice...
              </p>
              <a href="#vision" className="inline-block px-6 py-3 rounded-full text-white bg-accent-clr hover:bg-secondary-clr transition duration-300 font-medium shadow-md">
                Explore More
              </a>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section
          id="vision"
          className="w-[calc(100%-88px)] mx-auto rounded-2xl shadow-lg relative px-4 py-10 md:py-16 overflow-hidden"
        >
          <div
            ref={visionRef}
            className={`space-y-8 text-white fade-in-section${isVisionVisible ? ' is-visible' : ''}`}
          >
            <h2 className="vision-title text-3xl md:text-4xl font-bold">The Vision</h2>
            <p className="vision-paragraph text-base md:text-lg leading-relaxed">
              The word <span className="highlight">Aaradhya <i className="fas fa-heart text-accent-clr"></i></span> means “worshipped”. It is a Sanskrit term inferring the blessing of Lord Ganesh. <span className="highlight">Aaradhya</span> is a foundation started by family members of the late <span className="highlight">Shri S.P. Balasubrahmanyam <i className="fas fa-music text-accent-clr"></i></span> to remember, commemorate and celebrate the legendary singer’s life and legacy. The core of <span className="highlight">Aaradhya</span> dwells upon this foundation.
            </p>
            <p className="vision-paragraph text-base md:text-lg leading-relaxed">
              The vision of <span className="highlight">Aaradhya</span> came into existence during the difficult time of COVID-19 when the legendary singer breathed his last and attained a heavenly abode at the feet of the Almighty.
            </p>
            <p className="vision-paragraph text-base md:text-lg leading-relaxed">
              Though he is no longer with us, his music and songs have deeply impacted every listener’s heart, enabling them to <span className="highlight">cherish</span> each emotion through his soulful voice.
            </p>
            <p className="vision-paragraph text-base md:text-lg leading-relaxed">
              Such a legend must be celebrated for eternity; hence, <span className="highlight">Aaradhya</span> symbolizes his earthly existence through a foundation where people come together to celebrate <span className="highlight">Shri. S.P. Balasubrahmanyam and his music</span> for generations to come...
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section id="memorial-cta" className="relative py-16 px-4 sm:px-8 md:px-16 overflow-hidden">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide">Enter the Memorial</h2>
            <p className="text-lg md:text-xl mb-6 leading-relaxed">
              Step into a timeless space where melodies linger and memories come alive. <br />
              Celebrate the legacy of Shri. S.P. Balasubrahmanyam — a tribute for every heart he touched.
            </p>
            <a href="#memorial" className="inline-block mt-4 px-8 py-3 text-lg font-semibold rounded-full bg-accent-clr text-primary-clr hover:bg-white hover:text-secondary-clr transition-all duration-300 shadow-lg">
              Enter Now
            </a>
          </div>
          <div className="absolute -top-10 -right-10 opacity-10 text-[10rem] rotate-12">
            <i className="fas fa-music"></i>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
