import { useEffect, useState } from "react";
import api from "../services/api";
import authAPI from "../api/authAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Commentaire({ productId }) {
  const [comments, setComments] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const isLoggedIn = authAPI.isAuthenticated();
  const nbrCaracter = 300;
  const [text, setText] = useState("");
  const [lastCommentTime, setLastCommentTime] = useState(null);

  const navigate = useNavigate();

  const canComment = () => {
    if (!lastCommentTime) return true;

    const diff = Date.now() - lastCommentTime;
    return diff > 3 * 60 * 1000;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) return toast.error("Commentaire vide");
    if (rating === 0) return toast.error("Ajoute une note");

    try {
      setSubmitting(true);

      await api.post("/comments", {
        content: text,
        rating,
        product: `/api/products/${productId}`
      }, {
        headers: {
          "Content-Type": "application/ld+json"
        }
      });

      setText("");
      setRating(0);

      toast.success("Commentaire envoyé en attente de validation");

      const now = Date.now();
      localStorage.setItem("lastCommentTime", now);
      setLastCommentTime(now);

    } catch (err) {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setSubmitting(false);
    }
  };

  const date = (dateString) => {
    const maintenant = new Date();
    const date = new Date(dateString);

    const diffMs = maintenant - date;

    const jours = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (jours < 1) return "Aujourd'hui";
    if (jours === 1) return "Il y a 1 jour";
    if (jours < 7) return `Il y a ${jours} jours`;

    const semaines = Math.floor(jours / 7);

    if (semaines === 1) return "Il y a 1 semaine";

    return `Il y a ${semaines} semaines`;
  };

  useEffect(() => {
    const saved = localStorage.getItem("lastCommentTime");
    if (saved) setLastCommentTime(Number(saved));
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/comments/product/${productId}`);

        const commentsData = res.data.data ?? res.data ?? [];

        const filteredComments = commentsData
          .filter((comment) => comment.status === "approuvé")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setComments(filteredComments);
      } catch (error) {
        console.error("ERROR COMMENTS =", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [productId]);

  return (
    <div className="flex justify-center w-full bg-white"
      style={{
        backgroundImage: "url('/motif.svg')",
        backgroundRepeat: "repeat",
        backgroundSize: "400px 400px",
      }}
    >
      <div className="w-full max-w-7xl sm:p-3 p-5 flex flex-col items-center justify-center gap-5">
        <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl">Ils ont goûté, ils ont adoré</h2>
        <p>Parce que le meilleur avis reste celui de ceux qui ont goûté</p>
        <div className="flex flex-col lg:flex-row w-full gap-10">

          <div className="flex flex-col gap-5 w-full lg:w-1/2">
            <h3 className="font-semibold text-xl sm:text-2xl">Commentaires récents</h3>
            {/* zone des commentaires */}
            {loading ? (
              <p>Chargement des commentaires...</p>
            ) : comments.length === 0 ? (
              <p>Aucun commentaire pour le moment.</p>
            ) : (
              comments
                .slice(0, visibleCount)
                .map((comment) => (
                  <div key={comment.id} className="flex flex-col sm:flex-row gap-5 p-3 border-2 items-center bg-white border-green-600 rounded-2xl" >

                    <img className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                      src={
                        comment.user?.profileImage?.trim()
                          ? comment.user.profileImage
                          : "/icons/user-regular-full.svg"
                      }
                      alt={`${comment.user?.firstname} ${comment.user?.lastname}`}
                    />
                    <div className="flex w-full h-full justify-between flex-col">
                      <div className="w-full flex flex-col gap-3">
                        <div className="w-full flex flex-col items-center sm:flex-row sm:justify-between gap-2">
                          <span className="font-bold">
                            {comment.user?.firstname} {comment.user?.lastname}
                          </span>

                          <div className="flex gap-1">
                            {Array.from({
                              length: comment.rating || 0,
                            }).map((_, index) => (
                              <img key={index} src="/icons/star-solid-full.svg" alt="star" className="h-5" />
                            ))}
                          </div>
                        </div>
                        <p className="font-light text-center sm:text-start text-sm wrap-break-word">
                          {comment.content}
                        </p>
                      </div>

                      <p className="flex justify-end text-sm text-gray-500">
                        {date(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
            )}
            {visibleCount < comments.length && (
              <button
                onClick={() => setVisibleCount((prev) => prev + 3)}
                className="text-green-600 font-semibold"
              >
                Voir plus...
              </button>
            )}
          </div>
          {/* ----------------------------------------------------------------------------------- */}
          <div className="flex flex-col gap-5 w-full lg:w-1/2">
            <h3 className="font-semibold text-xl sm:text-2xl">
              Ajouter un commentaire
            </h3>

            <div className="flex p-3 border-2 bg-white border-green-600 rounded-2xl">

              {/* si l'utilisateur n'est pas connecté */}
              {!isLoggedIn ? (
                <div className="flex flex-col gap-4 w-full items-center text-center p-6">
                  <p className="text-gray-700 font-medium">
                    Vous devez être connecté pour laisser un commentaire.
                  </p>

                  <button
                    onClick={() => navigate("/login")}
                    className="btn-primary"
                  >
                    Se connecter / créer un compte
                  </button>
                </div>

              ) : (

                /* si l'utilisateur est connecté */
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 w-full">
                  {/*zone étoiles */}
                  <div className="grid">
                    <h2 className="text-lg font-bold pb-2">
                      Votre score d'étoile :
                    </h2>

                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <img
                          key={i}
                          src={i <= rating
                            ? "/icons/star-solid-full.svg"
                            : "/icons/star-regular-full.svg"
                          }
                          alt="star"
                          className="h-5 cursor-pointer"
                          onClick={() => setRating(i)}
                        />
                      ))}
                    </div>
                  </div>

                  {/*zone commentaire */}
                  <div className="flex-col w-full">
                    <h2 className="text-xl font-bold pb-2">
                      Votre commentaire :
                    </h2>

                    <textarea
                      value={text}
                      onChange={(e) =>
                        setText(e.target.value.slice(0, nbrCaracter))
                      }
                      maxLength={nbrCaracter}
                      rows={5}
                      className="w-full bg-gray-50 rounded-2xl p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
                    />

                    <p className="text-xs text-gray-400 text-right">
                      {text.length}/{nbrCaracter}
                    </p>
                  </div>

                  <button type="submit" className="btn-primary">
                    Envoyer
                  </button>

                </form>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}