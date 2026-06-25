import { Link } from "react-router-dom";
import ContactBanner from "../components/Banners/ContactBanner";
import ContactForm from "../components/ContactForm";
import ContactFaq from "../components/ContactFaq";

export default function Contact() {
  return (
    <div>
      <ContactBanner />

      <div className="w-full flex justify-center">
        <div className="sm:max-w-7xl w-full md:px-10 py-10">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="w-full md:w-1/2 px-5 flex flex-col gap-6">
              <h2 className="text-2xl md:text-3xl font-bold">
                Nous sommes toujours prêts à vous aider
              </h2>

              <p className="text-gray-600">
                Une question sur nos produits, votre commande ou nos services ?
                L’équipe GREENLOOP est à votre écoute pour vous accompagner et
                vous apporter des réponses claires, rapides et personnalisées.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:text-left text-center">
                <div className="flex flex-col gap-2 sm:items-start items-center">
                  <div className="flex items-center gap-2">
                    <img src="/icons/location-dot-solid-full.svg" alt="adresse" className="w-6" />
                    <h3 className="font-semibold">Adresse</h3>
                  </div>
                  <p className="text-gray-600">
                    23 Rue de la Greenloop, 1000 Bruxelles
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:items-start items-center">
                  <div className="flex items-center gap-2">
                    <img src="/icons/envelope-solid-full.svg" alt="email" className="w-6" />
                    <h3 className="font-semibold">Email</h3>
                  </div>
                  <p className="text-gray-600">contact@greenloop.be</p>
                </div>
                <div className="flex flex-col gap-2 sm:items-start items-center">
                  <div className="flex items-center gap-2">
                    <img src="/icons/phone-solid-full (1).svg" alt="telephone" className="w-6" />
                    <h3 className="font-semibold">Téléphone</h3>
                  </div>
                  <p className="text-gray-600">+32 123 45 67 89</p>
                </div>
                <div className="flex gap-3 sm:justify-start justify-center flex-wrap">
                  <a href="#" className="hover:scale-110 transition">
                    <img src="/icons/youtube-brands-solid-full.svg" alt="youtube" className="md:w-8 w-10" />
                  </a>

                  <a href="#" className="hover:scale-110 transition">
                    <img src="/icons/facebook-brands-solid-full.svg" alt="facebook" className="md:w-8 w-10" />
                  </a>

                  <a href="#" className="hover:scale-110 transition">
                    <img src="/icons/whatsapp-brands-solid-full.svg" alt="wathapp" className="md:w-8 w-10" />
                  </a>

                  <a href="#" className="hover:scale-110 transition">
                    <img src="/icons/instagram-brands-solid-full.svg" alt="instagram" className="md:w-8 w-10" />
                  </a>

                  <a href="#" className="hover:scale-110 transition">
                    <img src="/icons/x-twitter-brands-solid-full.svg" alt="x" className="md:w-8 w-10" />
                  </a>
                </div>
              </div>

            </div>
            <div className="w-full md:w-1/2">
              <ContactForm />
            </div>
          </div>

          <div className="mt-12 w-full h-75 md:h-100 rounded-xl overflow-hidden shadow">
            <iframe
              title="map"
              src="https://www.google.com/maps?q=Bruxelles&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            ></iframe>
          </div>

           <div className="mt-12 w-full "> 
              <ContactFaq />
           </div>

        </div>
      </div>
    </div>
  );
}