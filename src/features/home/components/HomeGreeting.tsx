import type { User } from "../domain/home.types";

interface HomeGreetingProps {
  user: User | null;
}

function getGreeting(user: User | null): string {
  if (!user?.nombre) return "Buen Día";
  return `Buen Día, ${user.nombre.split(" ")[0]}`;
}

export function HomeGreeting({ user }: HomeGreetingProps) {
  return (
    <section className="mb-7" aria-labelledby="home-title">
      <h1
        id="home-title"
        className="text-[26px] leading-none font-black tracking-tight text-white"
      >
        {getGreeting(user)}
      </h1>
      <p className="mt-1.5 text-[11px] font-bold text-white">
        Descubre lugares que se adaptan a ti.
      </p>
    </section>
  );
}
