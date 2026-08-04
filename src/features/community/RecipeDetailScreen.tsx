import { ChevronLeft, Clock3, Leaf } from "lucide-react";

import { AppShell } from "@/layouts/AppShell";
import type { CommunityPost } from "./domain/community.types";
import "./community.css";

interface RecipeDetailScreenProps {
  post: CommunityPost;
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export function RecipeDetailScreen({ post, onBack, onNavigate }: RecipeDetailScreenProps) {
  return (
    <AppShell activeTab="community" onNavigate={onNavigate}>
      <main className="community-panel community-recipe-panel min-h-full">
        <header className="community-recipe-header">
          <button
            type="button"
            onClick={onBack}
            className="community-icon-button"
            aria-label="Volver a publicaciones"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="community-eyebrow">Receta de la comunidad</p>
            <h1>{post.foodName}</h1>
          </div>
          <Leaf size={23} className="community-recipe-leaf" />
        </header>

        <article className="community-recipe-surface">
          {post.photo && <img src={post.photo} alt={post.foodName} className="community-recipe-hero" />}
          <div className="community-recipe-content">
            <div className="community-recipe-meta">
              <span className="community-tag">{post.restriction}</span>
              <span>Por {post.authorName}</span>
            </div>

            <p className="community-recipe-description">{post.description}</p>

            {post.targetGroup && (
              <span className="community-recipe-topic">{post.targetGroup}</span>
            )}

            <section className="community-recipe-section">
              <div className="community-recipe-section-title">
                <Leaf size={18} />
                <h2>Ingredientes</h2>
              </div>
              <p>{post.ingredients}</p>
            </section>

            <section className="community-recipe-section">
              <div className="community-recipe-section-title">
                <Clock3 size={18} />
                <h2>Preparación</h2>
              </div>
              <p>{post.preparation}</p>
            </section>
          </div>
        </article>
      </main>
    </AppShell>
  );
}
