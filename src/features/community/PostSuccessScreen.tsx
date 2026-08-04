import { Check, MessageCircle, Plus } from "lucide-react";

import { AppShell } from "@/layouts/AppShell";
import "./community.css";

interface PostSuccessScreenProps {
  onCommunity: () => void;
  onNavigate: (screen: string) => void;
}

export function PostSuccessScreen({ onCommunity, onNavigate }: PostSuccessScreenProps) {
  return (
    <AppShell activeTab="community" onNavigate={onNavigate}>
      <main className="community-panel community-success-panel min-h-full">
        <div className="community-success-icon">
          <Check size={34} />
        </div>
        <p className="community-eyebrow">Comunidad Lyria</p>
        <h1>¡Publicado con éxito!</h1>
        <p className="community-success-copy">
          Tu receta ya forma parte de un espacio donde todos pueden encontrar ideas para comer mejor.
        </p>
        <div className="community-success-actions">
          <button type="button" className="community-publish-button" onClick={onCommunity}>
            <MessageCircle size={18} />
            Ver comunidad
          </button>
          <button type="button" className="community-secondary-button" onClick={() => onNavigate("community-create")}>
            <Plus size={18} />
            Publicar otra receta
          </button>
        </div>
      </main>
    </AppShell>
  );
}
