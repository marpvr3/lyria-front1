import type { User } from "../domain/home.types";

interface HomeGreetingProps {
  user: User | null;
}

function getGreeting(user: User | null): string {
  if (!user?.nombre) return "Buen Día";
  return `Buen día, ${user.nombre.split(" ")[0]}`;
}

export function HomeGreeting({ user }: HomeGreetingProps) {
  return (
    <section className="mt-4" aria-labelledby="home-title">
      <h1
        id="home-title"
        className="text-[24px] leading-none font-black tracking-tight text-white"
      >
        {getGreeting(user)}
      </h1>

      <p className="mt-1 text-[12px] font-bold text-white">
        Descubre lugares que se adaptan a ti.
      </p>
    </section>
  );
}