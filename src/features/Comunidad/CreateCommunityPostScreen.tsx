import {
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ImagePlus,
  Send,
  X,
} from "lucide-react";

import {
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import { AppShell } from "@/layouts/AppShell";

interface CreateCommunityPostScreenProps {
  onBack?: () => void;

  onPublish?: (post: {
    group: string;
    content: string;
    image?: File;
  }) => void;

  onNavigate?: (
    screen: string,
  ) => void;
}

interface RestrictionOption {
  id: string;
  label: string;
}

const RESTRICTIONS: RestrictionOption[] = [
  {
    id: "sin-tacc",
    label: "Sin TACC",
  },
  {
    id: "vegano",
    label: "Vegano",
  },
  {
    id: "vegetariano",
    label: "Vegetariano",
  },
  {
    id: "sin-lactosa",
    label: "Sin lactosa",
  },
];

export function CreateCommunityPostScreen({
  onBack,
  onPublish,
  onNavigate,
}: CreateCommunityPostScreenProps) {
  const [
    restriction,
    setRestriction,
  ] = useState(
    "sin-tacc",
  );

  const [
    selectOpen,
    setSelectOpen,
  ] = useState(false);

  const [
    content,
    setContent,
  ] = useState("");

  const [
    image,
    setImage,
  ] = useState<
    File | undefined
  >();

  const [
    preview,
    setPreview,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  const fileRef =
    useRef<HTMLInputElement>(
      null,
    );

  const selectedRestriction =
    RESTRICTIONS.find(
      (item) =>
        item.id ===
        restriction,
    );

  function handleImage(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      setError(
        "Selecciona una imagen válida.",
      );

      return;
    }

    if (preview) {
      URL.revokeObjectURL(
        preview,
      );
    }

    setImage(file);

    setPreview(
      URL.createObjectURL(
        file,
      ),
    );

    setError(null);
  }

  function removeImage() {
    if (preview) {
      URL.revokeObjectURL(
        preview,
      );
    }

    setImage(undefined);
    setPreview("");

    if (fileRef.current) {
      fileRef.current.value =
        "";
    }
  }

  function publish() {
    if (!content.trim()) {
      setError(
        "Escribe algo antes de publicar.",
      );

      return;
    }

    setError(null);

    onPublish?.({
      group:
        restriction,
      content:
        content.trim(),
      image,
    });
  }

  return (
    <AppShell
      activeTab="community"
      onNavigate={
        onNavigate
      }
    >
      <main className="relative min-h-full bg-white text-[#394032]">
        <header className="bg-[#EBB5B2] px-5 pb-[56px] pt-7 text-white">
          <div className="grid grid-cols-[44px_1fr_44px] items-center">
            <button
              type="button"
              onClick={
                onBack
              }
              aria-label="Volver"
              className="flex h-11 w-11 items-center justify-start text-white transition-transform duration-200 hover:-translate-x-0.5"
            >
              <ChevronLeft
                size={23}
                strokeWidth={2.3}
              />
            </button>

            <h1 className="text-center text-[25px] font-extrabold tracking-[-0.035em]">
              Crear publicación
            </h1>

            <div
              className="h-11 w-11"
              aria-hidden="true"
            />
          </div>
        </header>

        <section className="-mt-[30px] min-h-[700px] rounded-t-[38px] bg-white px-5 pb-28 pt-6">

          {/* FOTO */}
          <div>
            <div className="mb-2 flex items-center justify-between px-2">
              <span className="text-[11px] font-bold text-[#6C765D]">
                Foto
              </span>

              <span className="text-[9.5px] text-[#394032]/35">
                opcional
              </span>
            </div>

            <input
              ref={
                fileRef
              }
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={
                handleImage
              }
              className="hidden"
            />

            {preview ? (
              <div className="relative overflow-hidden rounded-[26px] bg-[#F8F4E8]">
                <img
                  src={
                    preview
                  }
                  alt="Vista previa"
                  className="aspect-[1.45/1] w-full object-cover"
                />

                <div className="absolute right-3 top-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      fileRef.current?.click()
                    }
                    aria-label="Cambiar foto"
                    className="grid h-9 w-9 place-items-center rounded-full bg-white/95 text-[#6C765D] shadow-[0_5px_14px_rgba(57,64,50,0.12)] transition hover:scale-105"
                  >
                    <Camera
                      size={16}
                      strokeWidth={1.9}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={
                      removeImage
                    }
                    aria-label="Eliminar foto"
                    className="grid h-9 w-9 place-items-center rounded-full bg-white/95 text-[#6C765D] shadow-[0_5px_14px_rgba(57,64,50,0.12)] transition hover:scale-105"
                  >
                    <X
                      size={16}
                      strokeWidth={2}
                    />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  fileRef.current?.click()
                }
                className="flex h-[150px] w-full flex-col items-center justify-center rounded-[26px] bg-[#F8F4E8] transition hover:bg-[#F3F0E5]"
              >
                <div className="grid h-[48px] w-[48px] place-items-center rounded-full bg-white text-[#A3B153] shadow-[0_5px_14px_rgba(57,64,50,0.07)]">
                  <ImagePlus
                    size={21}
                    strokeWidth={1.9}
                  />
                </div>

                <span className="mt-3 text-[11px] font-bold text-[#6C765D]">
                  Agregar foto
                </span>
              </button>
            )}
          </div>

          {/* RESTRICCIÓN */}
          <div className="relative mt-6">
            <label className="ml-2 block text-[11px] font-bold text-[#6C765D]">
              Restricción alimenticia
            </label>

            <button
              type="button"
              onClick={() =>
                setSelectOpen(
                  (current) =>
                    !current,
                )
              }
              className={`mt-2.5 flex h-[52px] w-full items-center justify-between rounded-full bg-[#F8F4E8] px-5 text-left transition ${
                selectOpen
                  ? "shadow-[0_0_0_3px_rgba(163,177,83,0.12)]"
                  : ""
              }`}
            >
              <span className="text-[12px] font-semibold text-[#394032]">
                {
                  selectedRestriction?.label
                }
              </span>

              <ChevronDown
                size={18}
                strokeWidth={1.9}
                className={`text-[#6C765D] transition-transform duration-200 ${
                  selectOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {selectOpen && (
              <div className="absolute left-0 right-0 top-[82px] z-30 overflow-hidden rounded-[22px] border border-[#EEEAE1] bg-white p-2 shadow-[0_14px_35px_rgba(57,64,50,0.13)]">
                {RESTRICTIONS.map(
                  (option) => {
                    const isSelected =
                      option.id ===
                      restriction;

                    return (
                      <button
                        key={
                          option.id
                        }
                        type="button"
                        onClick={() => {
                          setRestriction(
                            option.id,
                          );

                          setSelectOpen(
                            false,
                          );
                        }}
                        className={`flex h-[44px] w-full items-center justify-between rounded-[16px] px-3.5 text-left transition ${
                          isSelected
                            ? "bg-[#EEF1DF] text-[#6C765D]"
                            : "text-[#394032] hover:bg-[#F8F4E8]"
                        }`}
                      >
                        <span className="text-[11.5px] font-semibold">
                          {
                            option.label
                          }
                        </span>

                        {isSelected && (
                          <Check
                            size={16}
                            strokeWidth={2.2}
                            className="text-[#A3B153]"
                          />
                        )}
                      </button>
                    );
                  },
                )}
              </div>
            )}
          </div>

          {/* DESCRIPCIÓN */}
          <label className="mt-6 block">
            <span className="ml-2 block text-[11px] font-bold text-[#6C765D]">
              Descripción
            </span>

            <textarea
              value={
                content
              }
              onChange={(
                event,
              ) => {
                setContent(
                  event.target
                    .value,
                );

                setError(
                  null,
                );
              }}
              maxLength={500}
              placeholder="¿Qué quieres compartir?"
              className="mt-2.5 min-h-[130px] w-full resize-none rounded-[24px] bg-[#F8F4E8] px-4 py-4 text-[12px] leading-[1.6] text-[#394032] outline-none transition placeholder:text-[#394032]/30 focus:shadow-[0_0_0_3px_rgba(163,177,83,0.12)]"
            />

            <div className="mt-1.5 flex justify-end px-2">
              <span className="text-[9px] text-[#394032]/30">
                {
                  content.length
                }
                /500
              </span>
            </div>
          </label>

          {error && (
            <p className="mt-2 px-2 text-[10px] font-medium text-[#D98F8C]">
              {
                error
              }
            </p>
          )}

          <button
            type="button"
            onClick={
              publish
            }
            className="mt-5 flex h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[#6C765D] text-[12px] font-extrabold text-white shadow-[0_9px_22px_rgba(57,64,50,0.15)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#A3B153]"
          >
            <Send
              size={16}
              strokeWidth={2}
            />

            Publicar
          </button>
        </section>
      </main>
    </AppShell>
  );
}