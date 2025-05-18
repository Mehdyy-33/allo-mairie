import { Link } from 'react-router-dom'

export default function Home() {
  const images = [...Array(10)].map((_, i) => `/images/img${i + 1}.jpg`)

  return (
    <div className="min-h-screen pt-40 flex flex-col items-center justify-start font-sans">
      {/* Bloc texte + bouton */}
      <div className="max-w-2xl text-center px-4 mb-20">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 opacity-0 animate-fade-in-up">
          Bienvenue sur la plateforme citoyenne
        </h1>
        <p className="text-lg text-gray-700 mb-8 opacity-0 animate-fade-in-up-delayed">
          Signalez un problème, suggérez une amélioration ou contactez votre mairie.
        </p>
        <Link
          to="/formulaire"
          className="inline-block bg-blue-600 text-white text-lg px-6 py-3 rounded-lg hover:bg-blue-700 transition opacity-0 animate-fade-in-up-late"
        >
          Soumettre une demande
        </Link>
      </div>

      {/* Carrousel 1 */}
      <div className="overflow-hidden mb-8 w-full opacity-0 animate-fade-in-up-late">
        <div className="flex gap-4 animate-scroll-ltr w-max">
          {[...images, ...images].map((src, i) => (
            <img
              key={`ltr-${i}`}
              src={src}
              alt={`carousel-1-img-${i}`}
              className="w-[279px] h-[196px] object-cover rounded-xl shadow"
            />
          ))}
        </div>
      </div>

      {/* Carrousel 2 */}
      <div className="overflow-hidden mb-24 w-full opacity-0 animate-fade-in-up-late">
        <div className="flex gap-4 animate-scroll-rtl w-max">
          {[...images, ...images].map((src, i) => (
            <img
              key={`rtl-${i}`}
              src={src}
              alt={`carousel-2-img-${i}`}
              className="w-[279px] h-[196px] object-cover rounded-xl shadow"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
