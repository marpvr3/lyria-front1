import {
  Bookmark,
  ChevronLeft,
  Heart,
  MessageCircle,
  Send,
} from "lucide-react";

import { useState } from "react";

import { AppShell } from "@/layouts/AppShell";

interface CommunityPostDetailScreenProps {
  onBack?: () => void;

  onNavigate?: (
    screen: string,
  ) => void;
}

interface CommentItem {
  id: string;
  author: string;
  initials: string;
  text: string;
  time: string;
}

const COMMENTS: CommentItem[] = [
  {
    id: "1",
    author: "Mica R.",
    initials: "MR",
    text:
      "¡Buenísimo el dato! Me sirve un montón 💚",
    time: "12 min",
  },
  {
    id: "2",
    author: "Vale T.",
    initials: "VT",
    text:
      "¿Sabes si también tenían opciones sin lactosa?",
    time: "5 min",
  },
];

export function CommunityPostDetailScreen({
  onBack,
  onNavigate,
}: CommunityPostDetailScreenProps) {
  const [
    comment,
    setComment,
  ] = useState("");

  const [
    liked,
    setLiked,
  ] = useState(false);

  const [
    saved,
    setSaved,
  ] = useState(false);

  const [
    comments,
    setComments,
  ] = useState<CommentItem[]>(
    COMMENTS,
  );

  function handleSendComment() {
    const cleanComment =
      comment.trim();

    if (!cleanComment) {
      return;
    }

    setComments(
      (current) => [
        ...current,
        {
          id: `comment-${Date.now()}`,
          author: "Tú",
          initials: "TÚ",
          text: cleanComment,
          time: "Ahora",
        },
      ],
    );

    setComment("");
  }

  return (
    <AppShell
      activeTab="community"
      onNavigate={onNavigate}
    >
      <main className="relative min-h-full bg-white text-[#394032]">

        {/* HEADER */}
        <header className="bg-[#EBB5B2] px-5 pb-[55px] pt-7 text-white">
          <div className="grid grid-cols-[44px_1fr_44px] items-center">

            <button
              type="button"
              onClick={onBack}
              aria-label="Volver"
              className="flex h-11 w-11 items-center justify-start text-white transition-transform duration-200 hover:-translate-x-0.5"
            >
              <ChevronLeft
                size={23}
                strokeWidth={2.3}
              />
            </button>

            <h1 className="text-center text-[25px] font-extrabold tracking-[-0.035em]">
              Publicación
            </h1>

            <div
              className="h-11 w-11"
              aria-hidden="true"
            />

          </div>
        </header>

        {/* CONTENIDO */}
        <section className="-mt-[30px] min-h-[700px] rounded-t-[38px] bg-white pb-24 pt-5">

          {/* USUARIO */}
          <div className="flex items-center gap-3 px-5">

            <div className="rounded-full bg-[#EBB5B2] p-[2px]">
              <div className="grid h-[43px] w-[43px] place-items-center rounded-full border-2 border-white bg-[#EEF1DF] text-[11px] font-extrabold text-[#6C765D]">
                SM
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-extrabold">
                Sofi M.
              </p>

              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-[#A3B153]">
                  Sin TACC
                </span>

                <span className="text-[9px] text-[#394032]/25">
                  •
                </span>

                <span className="text-[9.5px] text-[#394032]/38">
                  18 min
                </span>
              </div>
            </div>

          </div>

          {/* FOTO */}
          <div className="mt-4 overflow-hidden bg-[#F5F3ED]">
            <img
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=75"
              alt="Publicación de la comunidad"
              loading="lazy"
              decoding="async"
              className="aspect-[1.2/1] w-full object-cover"
            />
          </div>

          {/* ACCIONES */}
          <div className="px-5 pt-4">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-5">

                <button
                  type="button"
                  onClick={() =>
                    setLiked(
                      (current) =>
                        !current,
                    )
                  }
                  aria-label="Me gusta"
                  className={`transition ${
                    liked
                      ? "text-[#EB8F92]"
                      : "text-[#394032]/70 hover:text-[#EB8F92]"
                  }`}
                >
                  <Heart
                    size={22}
                    strokeWidth={1.8}
                    fill={
                      liked
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>

                <button
                  type="button"
                  aria-label="Comentarios"
                  className="text-[#394032]/70 transition hover:text-[#394032]"
                >
                  <MessageCircle
                    size={22}
                    strokeWidth={1.8}
                  />
                </button>

                <button
                  type="button"
                  aria-label="Compartir"
                  className="text-[#394032]/70 transition hover:text-[#394032]"
                >
                  <Send
                    size={21}
                    strokeWidth={1.8}
                  />
                </button>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSaved(
                    (current) =>
                      !current,
                  )
                }
                aria-label="Guardar publicación"
                className={`transition ${
                  saved
                    ? "text-[#A3B153]"
                    : "text-[#394032]/55 hover:text-[#A3B153]"
                }`}
              >
                <Bookmark
                  size={21}
                  strokeWidth={1.8}
                  fill={
                    saved
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>

            </div>

            <p className="mt-3 text-[11px] font-extrabold">
              {liked
                ? 43
                : 42}{" "}
              Me gusta
            </p>

            <p className="mt-2 text-[11.5px] leading-[1.6] text-[#394032]/72">
              <span className="mr-1.5 font-extrabold text-[#394032]">
                Sofi M.
              </span>

              Encontré esta cafetería con varias opciones sin TACC y me encantó la atención. Súper recomendable 💚
            </p>

          </div>

          {/* COMENTARIOS */}
          <section className="mt-7 px-5">

            <div className="flex items-center justify-between">
              <h2 className="text-[17px] font-extrabold tracking-[-0.02em]">
                Comentarios
              </h2>

              <span className="text-[10px] font-medium text-[#394032]/30">
                {comments.length}
              </span>
            </div>

            <div className="mt-5 space-y-5">

              {comments.map(
                (item) => (
                  <article
                    key={item.id}
                    className="flex items-start gap-3"
                  >

                    <div className="grid h-[36px] w-[36px] shrink-0 place-items-center rounded-full bg-[#F8E6E3] text-[9.5px] font-extrabold text-[#6C765D]">
                      {item.initials}
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center gap-1.5">
                        <p className="text-[11px] font-extrabold">
                          {item.author}
                        </p>

                        <span className="text-[8px] text-[#394032]/20">
                          •
                        </span>

                        <span className="text-[9px] text-[#394032]/35">
                          {item.time}
                        </span>
                      </div>

                      <p className="mt-1.5 text-[11px] leading-[1.55] text-[#394032]/65">
                        {item.text}
                      </p>

                    </div>

                  </article>
                ),
              )}

            </div>

            {/* NUEVO COMENTARIO */}
            <div className="mt-8 pb-5">

              <div className="flex items-center gap-3 rounded-full border border-[#EBB5B2]/45 bg-white p-[6px] pl-5 shadow-[0_8px_22px_rgba(57,64,50,0.07)]">

                <input
                  value={comment}
                  onChange={(
                    event,
                  ) =>
                    setComment(
                      event.target.value,
                    )
                  }
                  onKeyDown={(
                    event,
                  ) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      handleSendComment();
                    }
                  }}
                  placeholder="Escribe un comentario..."
                  className="h-[38px] min-w-0 flex-1 bg-transparent text-[11px] text-[#394032] outline-none placeholder:text-[#394032]/28"
                />

                <button
                  type="button"
                  onClick={
                    handleSendComment
                  }
                  disabled={
                    !comment.trim()
                  }
                  aria-label="Enviar comentario"
                  className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-[#EBB5B2] text-white shadow-[0_5px_12px_rgba(235,181,178,0.30)] transition duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Send
                    size={16}
                    strokeWidth={2}
                  />
                </button>

              </div>

            </div>

          </section>

        </section>

      </main>
    </AppShell>
  );
}