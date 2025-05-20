
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import useInView from '../hooks/useInView'

export default function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/formulaire', { replace: true })
    }
  }, [navigate])

  const images = [...Array(10)].map((_, i) => `/images/img${i + 1}.jpg`)
  const [introRef, introVisible] = useInView()
  const [carrouselRef, carrouselVisible] = useInView()
  const [statsRef, statsVisible] = useInView()
  const [contactRef, contactVisible] = useInView()
  const [temoignagesRef, temoignagesVisible] = useInView()
  const [suiviRef, suiviVisible] = useInView()

  return (
    <div className="relative w-full overflow-hidden font-sans bg-black">
      {/* Vidéo de fond dans une hauteur fixe */}
      <div className="relative w-full h-[100vh] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/media/bg-video.mp4" type="video/mp4" />
        </video>
        {/* Voile foncé par-dessus la vidéo */}
        <div className="absolute inset-0 bg-black/60 z-10" />
        {/* Titre flottant au-dessus */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-white  ">
          <div
            id="faire-une-demande"
            ref={introRef}
            className={`scroll-mt-32 max-w-2xl text-center px-4 transition-all duration-700 ${
              introVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Bienvenue sur la plateforme citoyenne</h1>
            <p className="text-lg mb-10">
              Signalez un problème, suggérez une amélioration ou contactez votre mairie.
            </p>
            <Link to="/formulaire" className="inline-block bg-blue-600 text-white text-lg px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              Soumettre une demande
            </Link>
          </div>
        </div>
      </div>

       {/* Contenu de la page après la vidéo */}
      <div className="relative z-20 flex flex-col items-center justify-start text-white">

        {/* Carrousels */}
        <div
          ref={carrouselRef}
          className={`scroll-mt-32 w-full transition-opacity duration-700 ${
            carrouselVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="overflow-hidden mb-8 w-full">
            <div className="flex gap-4 animate-scroll-ltr w-max">
              {[...images, ...images].map((src, i) => (
                <img key={`ltr-${i}`} src={src} alt={`carousel-1-img-${i}`} className="w-[279px] h-[196px] object-cover rounded-xl shadow" />
              ))}
            </div>
          </div>

          <div className="overflow-hidden mb-24 w-full">
            <div className="flex gap-4 animate-scroll-rtl w-max">
              {[...images, ...images].map((src, i) => (
                <img key={`rtl-${i}`} src={src} alt={`carousel-2-img-${i}`} className="w-[279px] h-[196px] object-cover rounded-xl shadow" />
              ))}
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div
          id="stats"
          ref={statsRef}
          className={`scroll-mt-32 relative z-20 w-full max-w-6xl px-4 mb-32 transition-all duration-700 ${
            statsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-6">Pourquoi cette plateforme est essentielle ?</h2>
          <p className="text-white text-center mb-10 text-sm md:text-base max-w-2xl mx-auto">
            Ces chiffres soulignent l’intérêt de moderniser les échanges entre les citoyens et leur collectivité.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 place-items-center">
            {[
              {
                value: '72%',
                label: 'des citoyens ne savent pas où signaler un problème public',
                icon: '❓',
              },
              {
                value: '4 agents',
                label: 'mobilisés en moyenne pour gérer les demandes manuellement',
                icon: '🧑‍💼',
              },
              {
                value: '38h',
                label: 'de délai moyen sans plateforme centralisée',
                icon: '⏳',
              },
              {
                value: '91%',
                label: 'des usagers trouvent ce type de service rassurant',
                icon: '👍',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="transition-transform duration-300 hover:scale-105"
              >
                <div className="bg-white rounded-3xl shadow-2xl p-2 w-[435px] h-[426px] flex items-center justify-center relative overflow-hidden">
                  <div className="bg-blue-50 w-full h-full rounded-2xl p-6 flex flex-col items-center justify-center text-center relative">
                    <div className="text-6xl mb-4">{item.icon}</div>
                    <div className="text-4xl font-bold text-blue-700 mb-2">{item.value}</div>
                    <p className="text-base text-gray-700 font-medium mb-1">{item.label}</p>
                    <p className="text-xs text-gray-500">
                      Cette donnée montre l’importance de digitaliser la relation citoyen-mairie pour plus d'efficacité et de transparence.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
  {/* Contact */}
        <div
          id="contact"
          ref={contactRef}
          className={`scroll-mt-32 relative z-20 w-full max-w-5xl px-4 mb-32 transition-all duration-700 ${
            contactVisible ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
          }`}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-4">Besoin d’aide ?</h2>
          <p className="text-white text-center mb-10 text-sm md:text-base max-w-2xl mx-auto">
            Notre équipe est là pour vous accompagner. Retrouvez les réponses aux questions fréquentes ou contactez-nous directement.
          </p>

  <div className="transition-transform duration-500 hover:scale-105">
    <div className="bg-white/90 rounded-2xl shadow-2xl relative h-[400px] flex items-center justify-center px-8">
      {/* Cadre intérieur */}
      <div className="absolute inset-3 border-2 border-white/60 rounded-xl pointer-events-none z-0"></div>

      {/* Contenu */}
      <div className="relative z-10 text-center flex flex-col gap-4 items-center">
        <p className="text-gray-800 text-base max-w-md">
          Consultez notre foire aux questions pour obtenir rapidement une réponse aux problèmes les plus courants.
        </p>
        <a
          href="/faq"
          className="text-blue-600 font-semibold underline hover:text-blue-800 transition"
        >
          Accéder à la FAQ
        </a>
        <p className="text-gray-800">Ou contactez-nous par e-mail :</p>
        <a
          href="mailto:contact@citoyenplus.fr"
          className="text-blue-600 hover:text-blue-800 transition font-medium"
        >
          contact@citoyenplus.fr
        </a>
 
      </div>
    </div>
  </div>
</div>
  {/* Témoignages */}
        <div
          id="temoignages"
          ref={temoignagesRef}
          className={`scroll-mt-32 relative z-20 w-full max-w-7xl px-4 mb-32 transition-all duration-700 ${
            temoignagesVisible ? 'blur-0 opacity-100' : 'blur-sm opacity-0'
          }`}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-4">Ils nous font confiance</h2>
          <p className="text-white text-center mb-10 text-sm md:text-base max-w-2xl mx-auto">
            Découvrez les retours de citoyens et agents ayant utilisé notre plateforme.
          </p>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
    {[
      {
        name: 'Sophie Bernard',
        role: 'Habitante à Lyon',
        comment: 'J’ai signalé un problème d’éclairage public, et tout a été réglé en deux jours.',
      },
      {
        name: 'Marc Dubois',
        role: 'Agent technique',
        comment: 'Cette plateforme m’a permis de traiter les demandes plus rapidement et efficacement.',
      },
      {
        name: 'Lina Morel',
        role: 'Citoyenne engagée',
        comment: 'Enfin un outil moderne et simple pour faire entendre notre voix auprès de la mairie.',
      },
      {
        name: 'Thomas Leroy',
        role: 'Responsable voirie',
        comment: 'Centraliser toutes les demandes a amélioré notre réactivité sur le terrain.',
      },
      {
        name: 'Julie Charpentier',
        role: 'Mère de famille',
        comment: 'Je peux maintenant suivre l’état de mes signalements en temps réel, c’est génial.',
      },
      {
        name: 'David Martin',
        role: 'Employé municipal',
        comment: 'Les signalements sont clairs et priorisés, un vrai gain de temps.',
      },
      {
        name: 'Emma Giraud',
        role: 'Étudiante',
        comment: 'J’ai pu faire une suggestion pour mon quartier en moins de 2 minutes.',
      },
      {
        name: 'Nicolas Caron',
        role: 'Habitant à Bordeaux',
        comment: 'La plateforme est fluide, rapide et très rassurante.',
      },
      {
        name: 'Claire Petit',
        role: 'Assistante administrative',
        comment: 'Nous avons réduit notre charge de mails entrants grâce à ce système.',
      },
    ].map((item, i) => (
      <div
        key={i}
        className="bg-white rounded-3xl shadow-xl p-6 h-[260px] flex flex-col justify-between transition-transform duration-300 hover:scale-105"
      >
        <p className="text-gray-800 italic">“{item.comment}”</p>
        <div className="mt-4 text-right">
          <p className="text-sm font-semibold text-blue-700">{item.name}</p>
          <p className="text-xs text-gray-500">{item.role}</p>
        </div>
      </div>
    ))}
  </div>
</div>
{/* Suivi / Section à venir */}
        <div
          id="suivi"
          ref={suiviRef}
          className={`scroll-mt-32 relative z-20 w-full max-w-6xl px-4 mb-32 transition-all duration-700 ${
            suiviVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-6">Une version mobile bientôt disponible 📱</h2>
          <p className="text-white text-center mb-10 text-sm md:text-base max-w-2xl mx-auto">
            Nous préparons une application mobile pour vous permettre de faire vos signalements encore plus facilement, où que vous soyez.
          </p>

          <div className="transition-transform duration-500 hover:scale-105">
            <div className="bg-white/90 rounded-2xl shadow-2xl relative h-[500px] flex flex-col md:flex-row items-center justify-between px-10 py-6">
              <div className="absolute inset-3 border-2 border-white/60 rounded-xl pointer-events-none z-0"></div>

              <div className="relative z-10 w-full md:w-1/2 text-center md:text-left">
                <h3 className="text-2xl font-semibold mb-4 text-blue-700">Bientôt sur iOS & Android</h3>
                <p className="text-sm text-gray-800 mb-4">
                  Recevez des notifications, suivez vos signalements en direct, et envoyez des demandes en un clic depuis votre téléphone.
                </p>
                <p className="text-sm text-gray-600">
                  Restez connecté : nous vous informerons dès que l’application sera disponible sur les stores.
                </p>
              </div>

              <div className="relative z-10 w-full md:w-1/2 flex justify-center mt-6 md:mt-0">
                <img
                  src="/images/mobile-preview.jpg"
                  alt="Aperçu mobile"
                  className="h-[360px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}




