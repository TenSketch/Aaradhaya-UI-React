import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./SPBMemorial.css";


const designImages = [
  '/assets/images/design-plan/Amphitheatre.jpg',
  '/assets/images/design-plan/Virtual_View-Day.jpg',
  '/assets/images/design-plan/Virtual_View-Night.jpg',
  '/assets/images/design-plan/Virtual_View-Night-1.jpg',
  '/assets/images/design-plan/Walk_way.jpg',
];

const SPBMemorial = () => {
  return (
    <div className="spb-memorial-page">
      <Navbar />
      <main className="pt-20">
        {/* Full Screen Video Section */}
        <section className="relative h-screen overflow-hidden memorial-hero-section">
          <video
            autoPlay
            muted
            loop
            className="absolute w-full h-full object-cover"
            poster={"/assets/images/gallery/SPB_Museum-photos-9.jpg"}
          >
            <source src={"/assets/videos/SPB_Museum-completion-render-animation.mp4"} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="relative z-10 flex items-center justify-center h-full bg-black bg-opacity-50">
            <h1 className="text-5xl font-bold text-gold">SPB Memorial</h1>
          </div>
        </section>

        {/* Foundation Content */}
        <section className="container mx-auto px-4 py-10">
          <h2 className="text-3xl font-bold text-gold mb-6">The Foundation</h2>
          <p className="mb-6">
            S.P. Balasubrahmanyam is a name that always resonates synonymous with music. While every obituary to him since he passed away
            due to COVID-19 in 2020 is dedicated to his pure talent, enthralling voice, the magnetism of his personality, and affable nature,
            there is a lesser-known side of him that is known only in his close circle – how environmentally conscious he was.  So, it became a dream that was so close to the heart of his son, Singer, Director, Actor, and Producer S.P.B. Charan, to make a sustainable memorial that is dedicated to the life and legend that S.P.B. was, and after a long search, appointed Vinu Daniel from Wallmakers for the same. The memorial is designed as a large oval-shaped structure built around the samadhi, with a museum, an auditorium, and two amphitheatres. Keeping in mind the simple and eco-friendly nature of S.P.B. and that the memorial is going to be situated in an urban locale like Chennai, a common hazardous material seen in the cities needed to be used for the construction: discarded vehicle tyres. In a country like India, where 2.75 lakh tyres get discarded daily and another 1.7 lakh tyres are dumped in from other parts of the world, it is apt that this memorial is going to be constructed entirely out of 10,720 waste tyres. The technique of Unstabilised Tyre Masonry for the walls, in which the waste tyres are packed with soil and then coated with mud plaster, ensures that the insides of the building remain 5–6 degrees cooler than the outside without any active cooling system and will be the right solution to beat the smouldering heat of this region.
          </p>
          <p className="mb-6">
            The tyres have been designed to output a flower design and swirl in beautiful patterns around the trees and arch up to form the roof, which doubles up as an amphitheater. Each tyre on the roof becomes a seat for people to sit and pay their respects and watch the stage. The S.P.B. Memorial, thus, becomes a piece of architectural poetry that stands tall as an ode to all the things that the legendary singer, S.P. Balasubrahmanyam, believed in. The site in Thamaraipakkam, in which the memorial is to be built, was a beautiful one with a hundred trees, most of them planted painstakingly by S.P.B. himself. The idea of the project revolved around making a structure revolving around the trees at the site so every one of them could be saved. Since on most evenings it was not an uncommon sight to see ardent music lovers gather at S.P.B’s Samadhi to break into songs, it was Charan’s and Vinu’s brainchild to create a memorial space that allowed for a beautiful gathering space for the same.
          </p>
        </section>

        {/* Design & Plan Section */}
        <section className="container mx-auto px-4 py-10">
          <h2 className="text-3xl font-bold text-gold mb-6">Design &amp; Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {designImages.map((img, idx) => (
              <div key={idx} className="design-card">
                <img src={img} alt={`Design ${idx + 1}`} />
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SPBMemorial;
