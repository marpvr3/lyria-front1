import {
  Bell,
  Bookmark,
  Carrot,
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
  useRef,
  useState,
  type MouseEvent,
} from "react";

import { AppShell } from "@/layouts/AppShell";

interface CommunityScreenProps {
  onOpenGroup?: (
    groupId: string,
  ) => void;

  onCreatePost?: () => void;

  onOpenPost?: (
    postId: string,
  ) => void;

  onNavigate?: (
    screen: string,
  ) => void;
}

interface CommunityGroup {
  id: string;
  name: string;
  icon: typeof Wheat;
}

interface CommunityPost {
  id: string;
  author: string;
  initials: string;
  group: string;
  time: string;
  text: string;
  likes: number;
  comments: number;
  saved: boolean;
  image?: string;
  location?: string;
}

const GROUPS: CommunityGroup[] = [
  {
    id: "sin-tacc",
    name: "Sin TACC",
    icon: Wheat,
  },
  {
    id: "vegano",
    name: "Vegano",
    icon: Leaf,
  },
  {
    id: "vegetariano",
    name: "Vegetariano",
    icon: Carrot,
  },
  {
    id: "sin-lactosa",
    name: "Sin lactosa",
    icon: MilkOff,
  },
];

const POSTS: CommunityPost[] = [
  {
    id: "post-1",
    author: "Sofi M.",
    initials: "SM",
    group: "Sin TACC",
    time: "18 min",
    location: "Palermo",
    text:
      "Encontré esta cafetería con varias opciones sin TACC. El personal sabía explicar muy bien cómo evitaban la contaminación cruzada 💚",
    likes: 42,
    comments: 9,
    saved: true,
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=75",
  },
  {
    id: "post-2",
    author: "Mica R.",
    initials: "MR",
    group: "Vegano",
    time: "1 h",
    text:
      "¿Alguien conoce lugares lindos para merendar con opciones veganas? Busco algo tranquilo para este finde.",
    likes: 28,
    comments: 14,
    saved: false,
  },
  {
    id: "post-3",
    author: "Vale T.",
    initials: "VT",
    group: "Sin lactosa",
    time: "3 h",
    location: "Recoleta",
    text:
      "Dato útil: varios cafés ya están ofreciendo leche vegetal sin costo extra. Dejé algunos guardados para probar esta semana.",
    likes: 31,
    comments: 6,
    saved: false,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=75",
  },
];

export function CommunityScreen({
  onOpenGroup,
  onCreatePost,
  onOpenPost,
  onNavigate,
}: CommunityScreenProps) {
  const sliderRef =
    useRef<HTMLDivElement>(
      null,
    );

  const dragDistanceRef =
    useRef(0);

  const [
    selectedGroup,
    setSelectedGroup,
  ] = useState(
    "sin-tacc",
  );

  const [
    savedPosts,
    setSavedPosts,
  ] = useState<string[]>(
    POSTS.filter(
      (post) => post.saved,
    ).map(
      (post) => post.id,
    ),
  );

  const [
    likedPosts,
    setLikedPosts,
  ] = useState<string[]>(
    [],
  );

  const [
    isDragging,
    setIsDragging,
  ] = useState(false);

  const [
    dragStartX,
    setDragStartX,
  ] = useState(0);

  const [
    dragStartScroll,
    setDragStartScroll,
  ] = useState(0);

  function toggleSaved(
    postId: string,
  ) {
    setSavedPosts(
      (current) =>
        current.includes(postId)
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

  function toggleLiked(
    postId: string,
  ) {
    setLikedPosts(
      (current) =>
        current.includes(postId)
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

  function handleMouseDown(
    event: MouseEvent<HTMLDivElement>,
  ) {
    const slider =
      sliderRef.current;

    if (!slider) {
      return;
    }

    dragDistanceRef.current =
      0;

    setIsDragging(
      true,
    );

    setDragStartX(
      event.pageX,
    );

    setDragStartScroll(
      slider.scrollLeft,
    );
  }

  function handleMouseMove(
    event: MouseEvent<HTMLDivElement>,
  ) {
    if (!isDragging) {
      return;
    }

    const slider =
      sliderRef.current;

    if (!slider) {
      return;
    }

    const distance =
      event.pageX -
      dragStartX;

    dragDistanceRef.current =
      Math.max(
        dragDistanceRef.current,
        Math.abs(
          distance,
        ),
      );

    if (
      Math.abs(
        distance,
      ) > 3
    ) {
      event.preventDefault();
    }

    slider.scrollLeft =
      dragStartScroll -
      distance;
  }

  function stopDragging() {
    setIsDragging(
      false,
    );
  }

  function handleGroupClick(
    groupId: string,
  ) {
    if (
      dragDistanceRef.current >
      6
    ) {
      dragDistanceRef.current =
        0;

      return;
    }

    setSelectedGroup(
      groupId,
    );

    onOpenGroup?.(
      groupId,
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
        <header className="bg-[#EBB5B2] px-6 pb-[62px] pt-9 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-[29px] font-extrabold tracking-[-0.04em]">
              Comunidad
            </h1>

            <button
              type="button"
              aria-label="Notificaciones"
              className="grid h-[50px] w-[50px] shrink-0 place-items-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
            >
              <Bell
                size={21}
                strokeWidth={1.9}
              />
            </button>
          </div>
        </header>

        <section className="-mt-[31px] min-h-[680px] rounded-t-[38px] bg-white pb-24 pt-6">
          <div className="px-5">
            <h2 className="text-[18px] font-extrabold tracking-[-0.02em]">
              Grupos
            </h2>
          </div>

          <div
            ref={sliderRef}
            onMouseDown={
              handleMouseDown
            }
            onMouseMove={
              handleMouseMove
            }
            onMouseUp={
              stopDragging
            }
            onMouseLeave={
              stopDragging
            }
            className={`mt-3 flex gap-2.5 overflow-x-auto px-5 pb-3 select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
              isDragging
                ? "cursor-grabbing"
                : "cursor-grab"
            }`}
          >
            {GROUPS.map(
              (group) => {
                const Icon =
                  group.icon;

                const isSelected =
                  selectedGroup ===
                  group.id;

                return (
                  <button
                    key={
                      group.id
                    }
                    type="button"
                    onClick={() =>
                      handleGroupClick(
                        group.id,
                      )
                    }
                    className={`flex h-[39px] shrink-0 items-center gap-2 rounded-full border px-3.5 transition-all duration-200 ${
                      isSelected
                        ? "border-[#A3B153] bg-[#A3B153] text-white shadow-[0_6px_14px_rgba(163,177,83,0.20)]"
                        : "border-[#EAE6DD] bg-white text-[#6C765D] hover:border-[#A3B153]/40"
                    }`}
                  >
                    <Icon
                      size={14}
                      strokeWidth={1.9}
                      className={
                        isSelected
                          ? "text-white"
                          : "text-[#A3B153]"
                      }
                    />

                    <span className="whitespace-nowrap text-[10px] font-bold">
                      {
                        group.name
                      }
                    </span>
                  </button>
                );
              },
            )}
          </div>

          <div className="mt-4 flex items-end justify-between px-5">
            <div>
              <h2 className="text-[19px] font-extrabold tracking-[-0.02em]">
                Publicaciones
              </h2>

              <p className="mt-0.5 text-[9.5px] text-[#394032]/38">
                Lo último de tu comunidad
              </p>
            </div>

            <button
              type="button"
              className="text-[9.5px] font-bold text-[#A3B153]"
            >
              Recientes
            </button>
          </div>

          <div className="mt-4 space-y-4 px-4">
            {POSTS.map(
              (post) => {
                const isSaved =
                  savedPosts.includes(
                    post.id,
                  );

                const isLiked =
                  likedPosts.includes(
                    post.id,
                  );

                return (
                  <article
                    key={
                      post.id
                    }
                    className="overflow-hidden rounded-[25px] bg-white ring-1 ring-[#EEEAE1] shadow-[0_7px_20px_rgba(57,64,50,0.06)]"
                  >
                    <div className="flex items-center gap-3 px-4 py-3.5">
                      <div className="rounded-full bg-[#EBB5B2] p-[2px]">
                        <div className="grid h-[40px] w-[40px] place-items-center rounded-full border-2 border-white bg-[#EEF1DF] text-[10.5px] font-extrabold text-[#6C765D]">
                          {
                            post.initials
                          }
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-[12px] font-extrabold text-[#394032]">
                            {
                              post.author
                            }
                          </p>

                          <span className="text-[8px] text-[#394032]/22">
                            •
                          </span>

                          <span className="text-[9px] text-[#394032]/38">
                            {
                              post.time
                            }
                          </span>
                        </div>

                        <div className="mt-0.5 flex items-center gap-1.5">
                          <span className="text-[9.5px] font-bold text-[#A3B153]">
                            {
                              post.group
                            }
                          </span>

                          {post.location && (
                            <>
                              <span className="text-[8px] text-[#394032]/20">
                                •
                              </span>

                              <span className="truncate text-[8.5px] text-[#394032]/38">
                                {
                                  post.location
                                }
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        aria-label="Más opciones"
                        className="grid h-8 w-8 shrink-0 place-items-center text-[#394032]/35 transition hover:text-[#394032]"
                      >
                        <MoreHorizontal
                          size={19}
                          strokeWidth={1.8}
                        />
                      </button>
                    </div>

                    {post.image && (
                      <button
                        type="button"
                        onClick={() =>
                          onOpenPost?.(
                            post.id,
                          )
                        }
                        className="relative block aspect-[1.32/1] w-full overflow-hidden bg-[#F3F2ED]"
                      >
                        <img
                          src={
                            post.image
                          }
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                        />

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[24%] bg-gradient-to-t from-black/20 to-transparent" />

                        <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-sm">
                          <span className="text-[9px] font-bold text-[#6C765D]">
                            {
                              post.group
                            }
                          </span>
                        </div>
                      </button>
                    )}

                    <div className="px-4 pb-4 pt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() =>
                              toggleLiked(
                                post.id,
                              )
                            }
                            aria-label="Me gusta"
                            className={`transition ${
                              isLiked
                                ? "text-[#EB8F92]"
                                : "text-[#394032]/68 hover:text-[#EB8F92]"
                            }`}
                          >
                            <Heart
                              size={20}
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
                            className="text-[#394032]/68 transition hover:text-[#394032]"
                          >
                            <MessageCircle
                              size={20}
                              strokeWidth={1.8}
                            />
                          </button>

                          <button
                            type="button"
                            aria-label="Compartir"
                            className="text-[#394032]/68 transition hover:text-[#394032]"
                          >
                            <Send
                              size={19}
                              strokeWidth={1.8}
                            />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            toggleSaved(
                              post.id,
                            )
                          }
                          aria-label={
                            isSaved
                              ? "Quitar de guardados"
                              : "Guardar publicación"
                          }
                          className={
                            isSaved
                              ? "text-[#A3B153]"
                              : "text-[#394032]/55"
                          }
                        >
                          <Bookmark
                            size={20}
                            strokeWidth={1.8}
                            fill={
                              isSaved
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>
                      </div>

                      <p className="mt-3 text-[10.5px] font-extrabold text-[#394032]">
                        {post.likes +
                          (isLiked
                            ? 1
                            : 0)}{" "}
                        Me gusta
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          onOpenPost?.(
                            post.id,
                          )
                        }
                        className="mt-2 block w-full text-left"
                      >
                        <p className="text-[11.5px] leading-[1.55] text-[#394032]/72">
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

                      <button
                        type="button"
                        onClick={() =>
                          onOpenPost?.(
                            post.id,
                          )
                        }
                        className="mt-2 text-[9.5px] font-medium text-[#394032]/38 transition hover:text-[#6C765D]"
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

        <div className="pointer-events-none sticky bottom-[10px] z-40 -mt-[64px] flex justify-end px-5">
          <button
            type="button"
            onClick={
              onCreatePost
            }
            aria-label="Crear publicación"
            className="pointer-events-auto grid h-[58px] w-[58px] place-items-center rounded-full bg-[#EBB5B2] text-white shadow-[0_10px_24px_rgba(235,181,178,0.30)] transition duration-200 hover:scale-105"
          >
            <Plus
              size={26}
              strokeWidth={2.2}
            />
          </button>
        </div>
      </main>
    </AppShell>
  );
}