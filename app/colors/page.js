// pages/colors.js (Next.js) or a simple HTML page

export default function ColorsPage() {
  const colors = [
    { name: "Primary", var: "--color-primary" },
    { name: "Secondary", var: "--color-secondary" },
    { name: "Accent", var: "--color-accent" },
    { name: "Accent1", var: "--color-accent1" },
    { name: "Accent2", var: "--color-accent2" },
    { name: "Accent3", var: "--color-accent3" },
    { name: "Accent4", var: "--color-accent4" },
    { name: "Background", var: "--color-bg" },
    { name: "Foreground", var: "--color-fg" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Tailwind Theme Colors</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {colors.map((color) => (
          <div
            key={color.var}
            className="rounded-lg shadow-lg p-6 flex flex-col items-center justify-center"
            style={{ backgroundColor: `var(${color.var})` }}
          >
            <span
              className="text-white font-bold mb-2"
              style={{
                color:
                  color.name === "Background" || color.name === "Foreground"
                    ? "black"
                    : "white",
              }}
            >
              {color.name}
            </span>
            <span className="text-sm text-white/80">{`var(${color.var})`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
