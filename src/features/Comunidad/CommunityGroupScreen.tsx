import {
  Bookmark,
  Carrot,
  ChevronLeft,
  Heart,
  Leaf,
  MessageCircle,
  MilkOff,
  MoreHorizontal,
  Plus,
  Send,
  Wheat,
} from "lucide-react";

import {
  useState,
  type ComponentType,
} from "react";

import { AppShell } from "@/layouts/AppShell";

interface CommunityGroupScreenProps {
  groupId?: string;

  onBack?: () => void;

  onCreatePost?: () => void;

  onOpenPost?: (
    postId: string,
  ) => void;

  onNavigate?: (
    screen: string,
  ) => void;
}

interface GroupInfo {
  name: string;

  icon: ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
}

interface GroupPost {
  id: string;
  author: string;
  initials: string;
  time: string;
  location?: string;
  text: string;
  likes: number;
  comments: number;
  saved?: boolean;
  image?: string;
}

const GROUP_INFO: Record<
  string,
  GroupInfo
> = {
  "sin-tacc": {
    name: "Sin TACC",
    icon: Wheat,
  },

  vegano: {
    name: "Vegano",
    icon: Leaf,
  },

  vegetariano: {
    name: "Vegetariano",
    icon: Carrot,
  },

  "sin-lactosa": {
    name: "Sin lactosa",
    icon: MilkOff,
  },
};

const GROUP_POSTS: GroupPost[] = [
  {
    id: "group-post-1",
    author: "Sofi M.",
    initials: "SM",
    time: "18 min",
    location: "Palermo",
    text:
      "Encontré esta cafetería con varias opciones y me encantó la atención. El personal sabía explicar muy bien cómo preparaban cada opción 💚",
    likes: 42,
    comments: 9,
    saved: true,
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80",
  },

  {
    id: "group-post-2",
    author: "Mica R.",
    initials: "MR",
    time: "1 h",
    text:
      "¿Alguien conoce un lugar lindo para merendar este finde? Busco algo tranquilo y con buenas opciones.",
    likes: 28,
    comments: 14,
    saved: false,
  },

  {
    id: "group-post-3",
    author: "Vale T.",
    initials: "VT",
    time: "3 h",
    location: "Recoleta",
    text:
      "Probé este lugar hace unos días y me gustó muchísimo. La comida estaba increíble y volvería sin dudas ✨",
    likes: 31,
    comments: 6,
    saved: false,
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80",
  },
];

export function CommunityGroupScreen({
  groupId = "vegano",
  onBack,
  onCreatePost,
  onOpenPost,
  onNavigate,
}: CommunityGroupScreenProps) {
  const [
    joined,
    setJoined,
  ] = useState(false);

  const [
    likedPosts,
    setLikedPosts,
  ] = useState<string[]>(
    [],
  );

  const [
    savedPosts,
    setSavedPosts,
  ] = useState<string[]>(
    GROUP_POSTS.filter(
      (post) => post.saved,
    ).map(
      (post) => post.id,
    ),
  );

  const group =
    GROUP_INFO[groupId] ??
    GROUP_INFO["vegano"];

  const GroupIcon =
    group.icon;

  function toggleLike(
    postId: string,
  ) {
    setLikedPosts(
      (current) =>
        current.includes(
          postId,
        )
          ? current.filter(
              (id) =>
                id !== postId,
            )
          : [
              ...current,
              postId,
            ],
    );
  }

  function toggleSave(
    postId: string,
  ) {
    setSavedPosts(
      (current) =>
        current.includes(
          postId,
        )
          ? current.filter(
              (id) =>
                id !== postId,
            )
          : [
              ...current,
              postId,
            ],
    );
  }

  return (
    <AppShell
      activeTab="community"
      onNavigate={
        onNavigate
      }
    >
      <main className="relative min-h-full bg-white text-[#394032]">

        {/* HEADER */}
        <header className="bg-[#EBB5B2] px-5 pb-[70px] pt-7 text-white">

          <div className="flex items-center gap-4">

            {/* VOLVER */}
            <button
              type="button"
              onClick={
                onBack
              }
              aria-label="Volver"
              className="flex h-[52px] w-[28px] shrink-0 items-center justify-start text-white transition-transform duration-200 hover:-translate-x-0.5"
            >
              <ChevronLeft
                size={23}
                strokeWidth={2.3}
              />
            </button>

            {/* ICONO GRUPO */}
            <div className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-[17px] bg-white text-[#A3B153] shadow-[0_7px_18px_rgba(100,70,70,0.08)]">
              <GroupIcon
                size={24}
                strokeWidth={1.9}
              />
            </div>

            {/* NOMBRE */}
            <h1 className="text-[28px] font-extrabold tracking-[-0.04em]">
              {
                group.name
              }
            </h1>

          </div>

        </header>

        {/* CUERPO */}
        <section className="-mt-[32px] min-h-[710px] rounded-t-[38px] bg-white pb-24 pt-5">

          {/* BOTONES */}
          <div className="flex items-center gap-3 px-5">

            <button
              type="button"
              onClick={() =>
                setJoined(
                  (current) =>
                    !current,
                )
              }
              className={`flex h-[44px] flex-1 items-center justify-center rounded-full text-[11px] font-extrabold transition-all duration-200 ${
                joined
                  ? "bg-[#EEF1DF] text-[#6C765D]"
                  : "bg-[#A3B153] text-white shadow-[0_7px_16px_rgba(163,177,83,0.18)]"
              }`}
            >
              {joined
                ? "✓ Miembro"
                : "Unirme al grupo"}
            </button>

            <button
              type="button"
              onClick={
                onCreatePost
              }
              className="flex h-[44px] flex-1 items-center justify-center gap-2 rounded-full bg-[#EBB5B2] text-[11px] font-extrabold text-white shadow-[0_7px_16px_rgba(235,181,178,0.24)] transition duration-200 hover:bg-[#E7AAA7]"
            >
              <Plus
                size={16}
                strokeWidth={2.3}
              />

              Publicar
            </button>

          </div>

          {/* TÍTULO */}
          <div className="mt-7 px-5">
            <h2 className="text-[20px] font-extrabold tracking-[-0.025em]">
              Publicaciones
            </h2>
          </div>

          {/* FEED */}
          <div className="mt-5 space-y-5 px-3">

            {GROUP_POSTS.map(
              (post) => {
                const isLiked =
                  likedPosts.includes(
                    post.id,
                  );

                const isSaved =
                  savedPosts.includes(
                    post.id,
                  );

                return (
                  <article
                    key={
                      post.id
                    }
                    className="overflow-hidden rounded-[28px] border border-[#EEE8DE] bg-white shadow-[0_6px_20px_rgba(57,64,50,0.045)]"
                  >

                    {/* CABECERA */}
                    <div className="flex items-center gap-3 px-4 py-3.5">

                      {/* AVATAR */}
                      <div className="rounded-full bg-[#EBB5B2] p-[1.5px]">
                        <div className="grid h-[40px] w-[40px] place-items-center rounded-full border-2 border-white bg-[#EEF1DF] text-[10px] font-extrabold text-[#6C765D]">
                          {
                            post.initials
                          }
                        </div>
                      </div>

                      {/* INFO */}
                      <div className="min-w-0 flex-1">

                        <div className="flex items-center gap-1.5">

                          <p className="text-[12px] font-extrabold text-[#394032]">
                            {
                              post.author
                            }
                          </p>

                          <span className="text-[8px] text-[#394032]/20">
                            •
                          </span>

                          <span className="text-[9px] text-[#394032]/35">
                            {
                              post.time
                            }
                          </span>

                        </div>

                        <div className="mt-0.5 flex items-center gap-1.5">

                          <span className="text-[9.5px] font-bold text-[#A3B153]">
                            {
                              group.name
                            }
                          </span>

                          {post.location && (
                            <>
                              <span className="text-[8px] text-[#394032]/18">
                                •
                              </span>

                              <span className="text-[8.5px] text-[#394032]/35">
                                {
                                  post.location
                                }
                              </span>
                            </>
                          )}

                        </div>

                      </div>

                      {/* TRES PUNTOS */}
                      <button
                        type="button"
                        aria-label="Más opciones"
                        className="grid h-8 w-8 shrink-0 place-items-center text-[#394032]/28 transition hover:text-[#394032]/60"
                      >
                        <MoreHorizontal
                          size={18}
                          strokeWidth={1.8}
                        />
                      </button>

                    </div>

                    {/* FOTO */}
                    {post.image && (
                      <button
                        type="button"
                        onClick={() =>
                          onOpenPost?.(
                            post.id,
                          )
                        }
                        className="relative block w-full overflow-hidden bg-[#F5F3ED]"
                      >
                        <img
                          src={
                            post.image
                          }
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="aspect-[1.18/1] w-full object-cover"
                        />

                        {/* ETIQUETA */}
                        <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] backdrop-blur-sm">
                          <span className="text-[8.5px] font-bold text-[#6C765D]">
                            {
                              group.name
                            }
                          </span>
                        </div>
                      </button>
                    )}

                    {/* CONTENIDO */}
                    <div className="px-4 pb-4 pt-3">

                      {/* ACCIONES */}
                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-4">

                          <button
                            type="button"
                            onClick={() =>
                              toggleLike(
                                post.id,
                              )
                            }
                            aria-label="Me gusta"
                            className={`transition ${
                              isLiked
                                ? "text-[#EB8F92]"
                                : "text-[#394032]/58 hover:text-[#EB8F92]"
                            }`}
                          >
                            <Heart
                              size={19}
                              strokeWidth={1.8}
                              fill={
                                isLiked
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              onOpenPost?.(
                                post.id,
                              )
                            }
                            aria-label="Comentarios"
                            className="text-[#394032]/58 transition hover:text-[#394032]"
                          >
                            <MessageCircle
                              size={19}
                              strokeWidth={1.8}
                            />
                          </button>

                          <button
                            type="button"
                            aria-label="Compartir"
                            className="text-[#394032]/58 transition hover:text-[#394032]"
                          >
                            <Send
                              size={18}
                              strokeWidth={1.8}
                            />
                          </button>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            toggleSave(
                              post.id,
                            )
                          }
                          aria-label="Guardar publicación"
                          className={`transition ${
                            isSaved
                              ? "text-[#A3B153]"
                              : "text-[#394032]/45 hover:text-[#A3B153]"
                          }`}
                        >
                          <Bookmark
                            size={19}
                            strokeWidth={1.8}
                            fill={
                              isSaved
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>

                      </div>

                      {/* LIKES */}
                      <p className="mt-3 text-[10.5px] font-extrabold text-[#394032]">
                        {post.likes +
                          (isLiked
                            ? 1
                            : 0)}{" "}
                        Me gusta
                      </p>

                      {/* DESCRIPCIÓN */}
                      <button
                        type="button"
                        onClick={() =>
                          onOpenPost?.(
                            post.id,
                          )
                        }
                        className="mt-2 block w-full text-left"
                      >
                        <p className="text-[11px] leading-[1.55] text-[#394032]/68">
                          <span className="mr-1.5 font-extrabold text-[#394032]">
                            {
                              post.author
                            }
                          </span>

                          {
                            post.text
                          }
                        </p>
                      </button>

                      {/* COMENTARIOS */}
                      <button
                        type="button"
                        onClick={() =>
                          onOpenPost?.(
                            post.id,
                          )
                        }
                        className="mt-2 text-[9.5px] font-medium text-[#394032]/33 transition hover:text-[#6C765D]"
                      >
                        Ver los{" "}
                        {
                          post.comments
                        }{" "}
                        comentarios
                      </button>

                    </div>

                  </article>
                );
              },
            )}

          </div>

        </section>

      </main>
    </AppShell>
  );
}