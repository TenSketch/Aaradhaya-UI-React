import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Gallery.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const galleryImages = [
  '/assets/images/gallery/SPB_Museum-photos-1.jpg',
  '/assets/images/gallery/SPB_Museum-photos-2.jpg',
  '/assets/images/gallery/SPB_Museum-photos-3.jpg',
  '/assets/images/gallery/SPB_Museum-photos-4.jpg',
  '/assets/images/gallery/SPB_Museum-photos-5.jpg',
  '/assets/images/gallery/SPB_Museum-photos-6.jpg',
  '/assets/images/gallery/SPB_Museum-photos-7.jpg',
  '/assets/images/gallery/SPB_Museum-photos-8.jpg',
  '/assets/images/gallery/SPB_Museum-photos-9.jpg',
  '/assets/images/gallery/SPB_Museum-photos-10.jpg',
];


const Gallery = () => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = galleryImages.map((src) => ({ src }));

  return (
    <div className="gallery-page">
      <Navbar />
      <main className="container mx-auto px-4">
        <h1>Gallery</h1>
        <p>
          Welcome to a bird's eye view of the tombstone where Shri S.P. Balasubrahmanyam was laid to rest.
          Aaradhya connects the world through its architectural poetry and ode to the legendary singer.
        </p>
        <div className="gallery-grid">
          {galleryImages.map((src, idx) => (
            <div key={idx} className="gallery-card">
              <img
                src={src}
                alt={`Gallery Image ${idx + 1}`}
                loading="lazy"
                style={{ cursor: "zoom-in" }}
                onClick={() => { setOpen(true); setIndex(idx); }}
              />
            </div>
          ))}
        </div>
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={slides}
          index={index}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Gallery;
