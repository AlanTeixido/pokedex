export function Footer() {
  return (
    <footer
      className="w-full mt-auto py-6 px-4"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,11,20,0.8)",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p
          className="text-sm tracking-wide"
          style={{ color: "#4a5568" }}
        >
          Data from{" "}
          <a
            href="https://pokeapi.co"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[#8b9ab8]"
            style={{ color: "#6366f1" }}
          >
            PokéAPI
          </a>
          {" "}· Pokémon © Nintendo / Game Freak
        </p>

        <p
          className="text-sm tracking-wide"
          style={{ color: "#4a5568" }}
        >
          Built by{" "}
          <a
            href="https://alanteixido.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium transition-colors hover:text-[#a78bfa]"
            style={{ color: "#8b9ab8" }}
          >
            Alan Teixidó
          </a>
          {" "}· 2025
        </p>
      </div>
    </footer>
  );
}
