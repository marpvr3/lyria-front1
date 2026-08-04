import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Bell,
  ChevronLeft,
  Plus,
  Search,
  Send,
} from "lucide-react";

import { AppShell } from "@/layouts/AppShell";
import { CategoryFilters } from "@/features/home/components/CategoryFilters";
import { NotificationsDrawer } from "@/features/home/components/NotificationsDrawer";
import { notificationPool } from "@/features/home/data/home.mock";
import { RecipeDetailScreen } from "./RecipeDetailScreen";
import type {
  CommunityChat,
  CommunityMessage,
  CommunityPost,
} from "./domain/community.types";
import "./community.css";

const filters = [
  "Todos",
  "Sin TACC",
  "Vegano",
  "Vegetariano",
  "Veggie",
  "Sin lactosa",
  "Sin azúcar",
  "Saludable",
  "Keto",
  "Sin frutos secos",
];

const activeUsers = [
  { name: "Ana", color: "bg-[#ebb5b2]" },
  { name: "Lina", color: "bg-[#a3b153]" },
  { name: "María", color: "bg-[#d4bf8b]" },
  { name: "Sofi", color: "bg-[#c79d9b]" },
  { name: "Vale", color: "bg-[#788667]" },
];

interface CommunityScreenProps {
  posts: CommunityPost[];
  chats: CommunityChat[];
  loading?: boolean;
  error?: string | null;
  onSendMessage: (chatId: string, text: string) => Promise<CommunityMessage>;
  onNavigate: (screen: string) => void;
}

export function CommunityScreen({
  posts,
  chats,
  loading = false,
  error = null,
  onSendMessage,
  onNavigate,
}: CommunityScreenProps) {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [readChatIds, setReadChatIds] = useState<Set<string>>(() => new Set());
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = useMemo(
    () =>
      notificationPool.map((notification, index) => ({
        id: String(index),
        title: notification.title,
        message: "",
        type:
          notification.icon === "heart"
            ? ("favorite" as const)
            : ("restaurant" as const),
      })),
    [],
  );

  const normalizedSearch = search.trim().toLowerCase();
  const visiblePosts = useMemo(
    () =>
      posts.filter((post) => {
        const matchesFilter =
          activeFilter === "Todos" ||
          post.restriction.toLowerCase() === activeFilter.toLowerCase();
        const searchable = [
          post.foodName,
          post.restriction,
          post.targetGroup,
          post.description,
          post.authorName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return matchesFilter && (!normalizedSearch || searchable.includes(normalizedSearch));
      }),
    [activeFilter, normalizedSearch, posts],
  );

  const visibleChats = useMemo(
    () =>
      chats.filter((chat) => {
        const searchable = [chat.title, chat.subtitle, ...chat.tags]
          .join(" ")
          .toLowerCase();
        const matchesFilter =
          activeFilter === "Todos" || searchable.includes(activeFilter.toLowerCase());
        return matchesFilter && (!normalizedSearch || searchable.includes(normalizedSearch));
      }),
    [activeFilter, chats, normalizedSearch],
  );

  const groupChats = visibleChats.filter((chat) => !chat.isPrivate);
  const privateChats = visibleChats.filter((chat) => chat.isPrivate);

  const renderChatItem = (chat: CommunityChat) => (
    <button
      type="button"
      key={chat.id}
      className="community-chat-item"
      onClick={() => setSelectedChatId(chat.id)}
    >
      <span className={`community-chat-avatar accent-${chat.accent}`}>{chat.title.slice(0, 1)}</span>
      <span className="community-chat-item-body min-w-0 flex-1 text-left">
        <span className="community-chat-item-title">{chat.title}</span>
        <span className="community-chat-item-subtitle">{chat.subtitle}</span>
        <span className="community-chat-item-tags">
          {chat.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </span>
      </span>
      <span className="community-chat-meta">
        <small>{chat.time}</small>
        {chat.unread > 0 && !readChatIds.has(chat.id) && <b>{chat.unread}</b>}
      </span>
    </button>
  );

  const selectedChat = chats.find((chat) => chat.id === selectedChatId) ?? null;
  const selectedPost = posts.find((post) => post.id === selectedPostId) ?? null;

  useEffect(() => {
    document.querySelector<HTMLElement>("[data-app-scroll]")?.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [selectedChatId, selectedPostId]);

  function handleBackToCommunity() {
    if (selectedChatId) {
      setReadChatIds((current) => {
        const next = new Set(current);
        next.add(selectedChatId);
        return next;
      });
    }
    setSelectedChatId(null);
  }

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !selectedChat || sending) return;

    setSending(true);
    setSendError(null);
    try {
      await onSendMessage(selectedChat.id, text);
      setDraft("");
    } catch {
      setSendError("No pudimos enviar el mensaje. Probá de nuevo.");
    } finally {
      setSending(false);
    }
  }

  if (selectedChat) {
    return (
      <AppShell activeTab="community" onNavigate={onNavigate}>
        <main className="community-panel min-h-full">
          <div className="community-chat-header">
            <button
              type="button"
              onClick={handleBackToCommunity}
              className="community-icon-button"
              aria-label="Volver a comunidad"
            >
              <ChevronLeft size={22} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="community-eyebrow">Comunidad Lyria</p>
              <h1 className="truncate text-xl font-bold text-[#263126]">{selectedChat.title}</h1>
              <p className="truncate text-xs text-[#59634f]">{selectedChat.subtitle}</p>
            </div>
            <span className="community-chat-avatar">{selectedChat.title.slice(0, 1)}</span>
          </div>

          <div className="community-chat-panel">
            <div className="community-chat-tags">
              {selectedChat.tags.map((tag) => (
                <span key={tag} className="community-tag">
                  {tag}
                </span>
              ))}
            </div>

            <div className="community-message-list">
              {selectedChat.messages.map((message) => (
                <div
                  key={message.id}
                  className={`community-message ${message.author === "Tú" ? "is-own" : ""}`}
                >
                  <span className="community-message-author">{message.author}</span>
                  <p>{message.text}</p>
                  <small>{message.time}</small>
                </div>
              ))}
            </div>

            {sendError && <p className="community-form-error">{sendError}</p>}
            <form className="community-message-form" onSubmit={handleSend}>
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Escribí un mensaje..."
                aria-label="Mensaje"
              />
              <button type="submit" disabled={sending || !draft.trim()} aria-label="Enviar mensaje">
                <Send size={18} />
              </button>
            </form>
          </div>
        </main>
      </AppShell>
    );
  }

  if (selectedPost) {
    return (
      <RecipeDetailScreen
        post={selectedPost}
        onBack={() => setSelectedPostId(null)}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <AppShell activeTab="community" onNavigate={onNavigate}>
      <main className="community-panel min-h-full">
        <header className="community-header">
          <div>
            <h1>Comunidad</h1>
            <p className="community-header-copy">
              Encontrá ideas, lugares y personas que comen como vos.
            </p>
          </div>
          <button
            type="button"
            className="community-header-icon"
            onClick={() => setNotificationsOpen(true)}
            aria-label="Abrir notificaciones"
          >
            <Bell size={20} />
          </button>
        </header>

        <div className="community-card">
          <label className="community-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar en la comunidad"
              aria-label="Buscar en la comunidad"
            />
          </label>

          <CategoryFilters
            categories={filters}
            activeCategory={activeFilter}
            onCategory={setActiveFilter}
          />

          <section className="community-section">
            <div className="community-section-heading">
              <div>
                <p className="community-section-kicker">Conectados ahora</p>
                <h2>Activos ahora</h2>
              </div>
              <span className="community-online-dot">{activeUsers.length} online</span>
            </div>
            <div className="community-active-users">
              {activeUsers.map((user) => (
                <div key={user.name} className="community-active-user">
                  <span className={`community-user-avatar ${user.color}`}>{user.name.slice(0, 1)}</span>
                  <span>{user.name}</span>
                </div>
              ))}
            </div>
          </section>

          {loading && <p className="community-empty">Cargando comunidad...</p>}
          {error && <p className="community-form-error">{error}</p>}

          <section className="community-section">
            <div className="community-section-heading">
              <div>
                <p className="community-section-kicker">Conversaciones</p>
                <h2>Chats y grupos</h2>
              </div>
              <span className="community-count">{groupChats.length}</span>
            </div>
            <div className="community-chat-list">
              {groupChats.map(renderChatItem)}
              {!loading && groupChats.length === 0 && (
                <p className="community-empty">No encontramos chats con ese filtro.</p>
              )}
            </div>
          </section>

        {privateChats.length > 0 && (
            <section className="community-section community-private-section">
              <div className="community-section-heading">
                <div>
                  <p className="community-section-kicker">Conversaciones uno a uno</p>
                  <h2>Chats privados</h2>
                </div>
                <span className="community-count">{privateChats.length}</span>
              </div>
              <div className="community-chat-list">{privateChats.map(renderChatItem)}</div>
            </section>
          )}

          <section className="community-section community-posts-section">
            <div className="community-section-heading">
              <div>
                <p className="community-section-kicker">Compartí lo que cocinaste</p>
                <h2>Publicaciones recientes</h2>
              </div>
              <span className="community-count">{visiblePosts.length}</span>
            </div>
            <div className="community-post-list">
              {visiblePosts.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  className="community-post-card"
                  onClick={() => setSelectedPostId(post.id)}
                  aria-label={`Abrir receta ${post.foodName}`}
                >
                  {post.photo && <img src={post.photo} alt={post.foodName} className="community-post-photo" />}
                  <div className="community-post-content">
                    <div className="community-post-topline">
                      <span className="community-tag">{post.restriction}</span>
                      <span>{post.authorName}</span>
                    </div>
                    <h3>{post.foodName}</h3>
                    <p>{post.description}</p>
                    <small>{post.targetGroup || "Comunidad Lyria"}</small>
                  </div>
                </button>
              ))}
              {!loading && visiblePosts.length === 0 && (
                <p className="community-empty">Todavía no hay publicaciones para mostrar.</p>
              )}
            </div>
          </section>
        </div>

        <button
          type="button"
          className="community-create-button"
          onClick={() => onNavigate("community-create")}
          aria-label="Crear publicación"
        >
          <Plus size={24} />
        </button>
      </main>

      <NotificationsDrawer
        open={notificationsOpen}
        notifications={notifications}
        onClose={() => setNotificationsOpen(false)}
      />
    </AppShell>
  );
}
