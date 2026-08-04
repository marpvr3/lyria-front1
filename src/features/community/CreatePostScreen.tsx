import { useState, type ChangeEvent, type FormEvent } from "react";
import { Camera, ChevronLeft, ImagePlus } from "lucide-react";

import { AppShell } from "@/layouts/AppShell";
import type { CreateCommunityPostRequest } from "./domain/community.types";
import "./community.css";

interface CreatePostScreenProps {
  authorName: string;
  error?: string | null;
  onBack: () => void;
  onPublish: (payload: CreateCommunityPostRequest) => Promise<void>;
  onNavigate: (screen: string) => void;
}

interface FormState {
  foodName: string;
  restriction: string;
  targetGroup: string;
  description: string;
  preparation: string;
  ingredients: string;
}

const initialForm: FormState = {
  foodName: "",
  restriction: "Sin tacc",
  targetGroup: "",
  description: "",
  preparation: "",
  ingredients: "",
};

export function CreatePostScreen({
  authorName,
  error: externalError = null,
  onBack,
  onPublish,
  onNavigate,
}: CreatePostScreenProps) {
  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setValidationError("La imagen no puede superar los 4 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(String(reader.result ?? ""));
      setPhotoName(file.name);
      setValidationError(null);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (publishing) return;

    const missing = [
      ["nombre de la comida", form.foodName],
      ["descripción", form.description],
      ["preparación", form.preparation],
      ["ingredientes", form.ingredients],
    ].find(([, value]) => !value.trim());

    if (missing || !photo) {
      setValidationError(
        missing ? `Completá el campo ${missing[0]}.` : "Sumá una foto para publicar.",
      );
      return;
    }

    setPublishing(true);
    setValidationError(null);
    try {
      await onPublish({
        ...form,
        photo,
        photoName,
        authorName,
      });
    } catch {
      setValidationError("No pudimos publicar todavía. Revisá la conexión e intentá de nuevo.");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <AppShell activeTab="community" onNavigate={onNavigate}>
      <main className="community-panel min-h-full">
        <div className="community-create-header">
          <button type="button" onClick={onBack} className="community-icon-button" aria-label="Volver">
            <ChevronLeft size={22} />
          </button>
          <div>
            <p className="community-eyebrow">Comunidad Lyria</p>
            <h1>Crear publicación</h1>
          </div>
          <Camera size={24} className="text-[#59634f]" />
        </div>

        <form className="community-create-card" onSubmit={handleSubmit}>
          <label className="community-photo-picker">
            {photo ? (
              <img src={photo} alt="Vista previa de la publicación" className="create-photo-preview" />
            ) : (
              <>
                <ImagePlus size={28} />
                <strong>Agregá una foto</strong>
                <span>Mostrá tu plato o receta</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handlePhoto} />
          </label>

          <div className="create-field-grid">
            <label className="create-field create-field-wide">
              <span>¿Qué preparaste?</span>
              <input
                value={form.foodName}
                onChange={(event) => updateField("foodName", event.target.value)}
                placeholder="Ej. Bowl de quinoa"
              />
            </label>

            <label className="create-field">
              <span>Restricción</span>
              <select
                value={form.restriction}
                onChange={(event) => updateField("restriction", event.target.value)}
              >
                <option>Sin tacc</option>
                <option>Saludable</option>
                <option>Veggie</option>
                <option>Vegano</option>
                <option>Sin lactosa</option>
              </select>
            </label>

            <label className="create-field">
              <span>Grupo o tema</span>
              <input
                value={form.targetGroup}
                onChange={(event) => updateField("targetGroup", event.target.value)}
                placeholder="Ej. Recetas fáciles"
              />
            </label>

            <label className="create-field create-field-wide">
              <span>Contanos un poco más</span>
              <textarea
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="¿Por qué te gustó o qué consejo compartirías?"
                rows={3}
              />
            </label>

            <label className="create-field create-field-wide">
              <span>Preparación</span>
              <textarea
                value={form.preparation}
                onChange={(event) => updateField("preparation", event.target.value)}
                placeholder="Contá los pasos principales..."
                rows={4}
              />
            </label>

            <label className="create-field create-field-wide">
              <span>Ingredientes</span>
              <textarea
                value={form.ingredients}
                onChange={(event) => updateField("ingredients", event.target.value)}
                placeholder="Separalos por comas o por líneas..."
                rows={3}
              />
            </label>
          </div>

          {(validationError || externalError) && (
            <p className="community-form-error">{validationError || externalError}</p>
          )}

          <button type="submit" className="community-publish-button" disabled={publishing}>
            {publishing ? "Publicando..." : "Publicar en comunidad"}
          </button>
        </form>
      </main>
    </AppShell>
  );
}
