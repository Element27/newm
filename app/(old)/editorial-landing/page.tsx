import Link from "next/link";
import { FiArrowRight, FiPlus } from "react-icons/fi";

const pillars = [
  {
    index: "01",
    title: "Catalog every piece",
    body: "Turn the closet into a searchable system instead of a pile of forgotten buys.",
  },
  {
    index: "02",
    title: "Plan real outfits",
    body: "Build dressing rituals for office days, slow mornings, dinners, and travel weeks.",
  },
  {
    index: "03",
    title: "Style from memory",
    body: "Mura learns the shape of your wardrobe and responds with looks that feel like you.",
  },
];

const modules = [
  "Closet indexing",
  "Outfit memory",
  "Weekly planning",
  "Category logic",
  "Personal styling",
  "Repeat tracking",
];

const manifestoCards = [
  {
    eyebrow: "Wardrobe memory",
    title: "Your archive should feel alive.",
    body: "Every item becomes part of a usable styling system, not just another image in a folder.",
    tone: "dark",
  },
  {
    eyebrow: "Signal over noise",
    title: "A dashboard that speaks clearly.",
    body: "Direct hierarchy, sharp blocks, and one place to see what works together right now.",
    tone: "light",
  },
  {
    eyebrow: "System confidence",
    title: "94%",
    body: "of suggested looks can come from what is already in the closet when the wardrobe is properly mapped.",
    tone: "accent",
  },
];

const useCases = [
  {
    tag: "MONDAY",
    title: "Office, but still personal",
    copy: "Pull a structured outfit from your saved tailoring without rebuilding the wheel every week.",
  },
  {
    tag: "SATURDAY",
    title: "Soft weekend uniform",
    copy: "Use the planner to repeat what works and still keep the look feeling considered.",
  },
  {
    tag: "DINNER",
    title: "Last-minute, fully styled",
    copy: "Mura surfaces combinations from your closet before you fall back to the same default outfit.",
  },
];

const quotes = [
  "The closet finally feels edited.",
  "I plan in minutes instead of spiraling.",
  "I wear more of what I already own.",
  "The styling feels personal, not generic.",
];

export default function EditorialLandingPage() {
  return (
    <div className="min-h-screen bg-[#f3ede2] text-[#21160d]">
      <style>{`
        @keyframes landingTicker {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }

        @keyframes landingFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @keyframes landingPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.72; }
        }

        @keyframes landingGrid {
          from { background-position: 0 0, 0 0; }
          to { background-position: 64px 64px, 0 0; }
        }

        .landing-ticker {
          animation: landingTicker 18s linear infinite;
        }

        .landing-float {
          animation: landingFloat 5s ease-in-out infinite;
        }

        .landing-pulse {
          animation: landingPulse 3s ease-in-out infinite;
        }

        .landing-grid {
          animation: landingGrid 14s linear infinite;
          background-image:
            linear-gradient(rgba(33, 22, 13, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(33, 22, 13, 0.1) 1px, transparent 1px);
          background-size: 32px 32px;
        }
      `}</style>

      <div className="border-b-4 border-[#21160d] bg-[#f3ede2]">
        <div className="mx-auto flex max-w-[92rem] items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Link href="/editorial-landing" className="font-['Arial_Black',_Impact,_sans-serif] text-3xl uppercase tracking-[-0.08em]">
            Mura
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold uppercase tracking-[0.18em] md:flex">
            <a href="#system" className="transition hover:text-[#9d6c20]">
              System
            </a>
            <a href="#proof" className="transition hover:text-[#9d6c20]">
              Proof
            </a>
            <a href="#rhythm" className="transition hover:text-[#9d6c20]">
              Rhythm
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden border-2 border-[#21160d] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] md:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 border-2 border-[#21160d] bg-[#21160d] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f3ede2] transition hover:bg-[#9d6c20]"
            >
              Start now
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <section className="overflow-hidden border-b-4 border-[#21160d] bg-[#cf9f54] py-3">
        <div className="landing-ticker flex w-[200%] gap-4 whitespace-nowrap text-xs font-black uppercase tracking-[0.3em] text-[#21160d]">
          {Array.from({ length: 12 }).map((_, index) => (
            <span key={index} className="shrink-0">
              Digital wardrobe system / brutal clarity / outfit memory / styling intelligence /
            </span>
          ))}
        </div>
      </section>

      <main>
        <section className="border-b-4 border-[#21160d]">
          <div className="mx-auto grid max-w-[92rem] gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="border-b-4 border-[#21160d] px-4 py-10 md:px-8 md:py-16 lg:border-b-0 lg:border-r-4">
              <div className="mb-6 inline-flex border-2 border-[#21160d] bg-[#f8f3eb] px-3 py-2 text-[10px] font-black uppercase tracking-[0.28em]">
                Brutalist wardrobe OS
              </div>

              <h1 className="max-w-4xl font-['Arial_Black',_Impact,_sans-serif] text-[3.4rem] uppercase leading-[0.88] tracking-[-0.08em] md:text-[5.3rem] xl:text-[7rem]">
                Organize your wardrobe like it actually matters.
              </h1>

              <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
                <p className="max-w-2xl text-base leading-7 md:text-lg">
                  Mura turns your closet into a living system for cataloging pieces, planning looks,
                  and getting dressed with more speed, taste, and memory.
                </p>

                <div className="flex gap-3">
                  <Link
                    href="/onboarding"
                    className="inline-flex items-center gap-2 border-2 border-[#21160d] bg-[#21160d] px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#f3ede2] transition hover:translate-x-1 hover:-translate-y-1"
                  >
                    Enter Mura
                    <FiArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="#system"
                    className="inline-flex items-center border-2 border-[#21160d] bg-[#f8f3eb] px-5 py-3 text-sm font-black uppercase tracking-[0.18em] transition hover:bg-[#cf9f54]"
                  >
                    See system
                  </a>
                </div>
              </div>
            </div>

            <div className="relative min-h-[30rem] overflow-hidden bg-[#21160d]">
              <div className="landing-grid absolute inset-0 opacity-70" />
              <div className="absolute left-6 top-6 border-2 border-[#21160d] bg-[#f3ede2] px-3 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-[#21160d]">
                Placeholder visual
              </div>
              <div className="landing-float absolute right-6 top-8 w-[8rem] border-2 border-[#21160d] bg-[#cf9f54] px-4 py-3 text-right text-xs font-black uppercase tracking-[0.16em] text-[#21160d] md:w-[10rem]">
                No image yet.
                <br />
                Graphic block only.
              </div>
              <div className="absolute inset-x-8 bottom-8 top-20 border-4 border-[#f3ede2] bg-[linear-gradient(135deg,#2f2013_0%,#47311e_100%)]" />
              <div className="landing-pulse absolute left-[10%] top-[22%] h-6 w-6 rounded-full bg-[#cf9f54]" />
              <div className="landing-float absolute left-[16%] top-[32%] border-4 border-[#f3ede2] bg-[#cf9f54] px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-[#21160d]">
                Closet
              </div>
              <div className="landing-float absolute right-[12%] top-[42%] border-4 border-[#f3ede2] bg-[#f3ede2] px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-[#21160d] [animation-delay:1.1s]">
                Planner
              </div>
              <div className="absolute bottom-[18%] left-[12%] max-w-[14rem] border-4 border-[#f3ede2] bg-transparent px-4 py-4 text-sm font-semibold leading-6 text-[#f3ede2]">
                Replace this panel with final campaign art later. For now, the page keeps the energy
                with motion, blocks, and type.
              </div>
              <div className="absolute bottom-0 right-0 border-l-4 border-t-4 border-[#21160d] bg-[#cf9f54] px-5 py-4 text-xs font-black uppercase tracking-[0.18em] text-[#21160d]">
                Live styling engine
              </div>
            </div>
          </div>
        </section>

        <section id="system" className="border-b-4 border-[#21160d] bg-[#f8f3eb]">
          <div className="mx-auto max-w-[92rem] px-4 py-12 md:px-8 md:py-16">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#9d6c20]">
                  Three pillars
                </p>
                <h2 className="max-w-3xl font-['Arial_Black',_Impact,_sans-serif] text-[2.5rem] uppercase leading-[0.9] tracking-[-0.07em] md:text-[4rem]">
                  A fashion tool built like a command center.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 md:text-base">
                The page is intentionally direct: thick rules, rigid grids, hard contrast, and motion
                used as structure rather than decoration.
              </p>
            </div>

            <div className="grid gap-0 border-4 border-[#21160d] md:grid-cols-3">
              {pillars.map((pillar, index) => (
                <article
                  key={pillar.index}
                  className={[
                    "min-h-[20rem] px-5 py-6 md:px-7 md:py-8",
                    index < pillars.length - 1 ? "border-b-4 border-[#21160d] md:border-b-0 md:border-r-4" : "",
                    index === 1 ? "bg-[#21160d] text-[#f3ede2]" : index === 2 ? "bg-[#cf9f54]" : "bg-[#f8f3eb]",
                  ].join(" ")}
                >
                  <div className="text-[4rem] font-['Arial_Black',_Impact,_sans-serif] leading-none tracking-[-0.08em]">
                    {pillar.index}
                  </div>
                  <h3 className="mt-8 max-w-xs font-['Arial_Black',_Impact,_sans-serif] text-[2rem] uppercase leading-[0.92] tracking-[-0.05em]">
                    {pillar.title}
                  </h3>
                  <p
                    className={[
                      "mt-6 max-w-sm text-sm leading-7",
                      index === 1 ? "text-[#e8d9c4]" : "text-[#3b2c1d]",
                    ].join(" ")}
                  >
                    {pillar.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b-4 border-[#21160d]">
          <div className="mx-auto grid max-w-[92rem] gap-0 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="border-b-4 border-[#21160d] bg-[#21160d] px-4 py-10 text-[#f3ede2] md:px-8 md:py-14 lg:border-b-0 lg:border-r-4">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#cf9f54]">Modules</p>
              <h2 className="mt-5 font-['Arial_Black',_Impact,_sans-serif] text-[2.8rem] uppercase leading-[0.9] tracking-[-0.06em] md:text-[4.2rem]">
                Hard-working tools for a smarter closet.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-[#e6d7c2]">
                The interaction model is simple on purpose. Save pieces. Build logic. Surface looks.
                Repeat.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                {modules.map((module) => (
                  <span
                    key={module}
                    className="border-2 border-[#f3ede2] px-3 py-2 text-xs font-black uppercase tracking-[0.16em]"
                  >
                    {module}
                  </span>
                ))}
              </div>
            </div>

            <div id="proof" className="grid gap-0 md:grid-cols-[1.05fr_0.95fr]">
              <div className="border-b-4 border-[#21160d] bg-[#f8f3eb] md:border-b-0 md:border-r-4">
                {manifestoCards.slice(0, 2).map((card, index) => (
                  <article
                    key={card.title}
                    className={[
                      "px-4 py-8 md:px-8 md:py-10",
                      index === 0 ? "border-b-4 border-[#21160d]" : "",
                      card.tone === "dark" ? "bg-[#cf9f54] text-[#21160d]" : "bg-[#f8f3eb]",
                    ].join(" ")}
                  >
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-[#6c4a18]">
                      {card.eyebrow}
                    </p>
                    <h3 className="mt-4 max-w-lg font-['Arial_Black',_Impact,_sans-serif] text-[2.2rem] uppercase leading-[0.92] tracking-[-0.05em] md:text-[3rem]">
                      {card.title}
                    </h3>
                    <p className="mt-5 max-w-lg text-sm leading-7">{card.body}</p>
                  </article>
                ))}
              </div>

              <article className="flex min-h-[24rem] flex-col justify-between bg-[#f3ede2] px-4 py-8 md:px-8 md:py-10">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[#9d6c20]">
                    {manifestoCards[2].eyebrow}
                  </p>
                  <div className="mt-4 font-['Arial_Black',_Impact,_sans-serif] text-[5rem] uppercase leading-none tracking-[-0.08em] md:text-[8rem]">
                    {manifestoCards[2].title}
                  </div>
                  <p className="mt-5 max-w-sm text-sm leading-7">{manifestoCards[2].body}</p>
                </div>
                <div className="mt-8 border-4 border-[#21160d] bg-[#21160d] px-4 py-4 text-xs font-black uppercase tracking-[0.18em] text-[#f3ede2]">
                  Measured from closet-based outfit generation patterns
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="rhythm" className="border-b-4 border-[#21160d] bg-[#cf9f54]">
          <div className="mx-auto max-w-[92rem] px-4 py-12 md:px-8 md:py-16">
            <div className="mb-8 flex items-start justify-between gap-6">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#5a3b12]">
                  Use cases
                </p>
                <h2 className="max-w-4xl font-['Arial_Black',_Impact,_sans-serif] text-[2.6rem] uppercase leading-[0.9] tracking-[-0.06em] md:text-[4.2rem]">
                  Dressing rhythms, not random suggestions.
                </h2>
              </div>
              <div className="hidden border-4 border-[#21160d] bg-[#f3ede2] px-5 py-4 text-sm font-black uppercase tracking-[0.18em] lg:block">
                Animated blocks.
                <br />
                Hard edges.
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {useCases.map((item, index) => (
                <article
                  key={item.tag}
                  className={[
                    "group min-h-[22rem] border-4 border-[#21160d] px-5 py-5 transition duration-300 hover:-translate-y-2 hover:translate-x-2",
                    index === 1 ? "bg-[#21160d] text-[#f3ede2]" : "bg-[#f8f3eb]",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={[
                        "text-xs font-black uppercase tracking-[0.28em]",
                        index === 1 ? "text-[#cf9f54]" : "text-[#9d6c20]",
                      ].join(" ")}
                    >
                      {item.tag}
                    </span>
                    <span className="text-2xl">+</span>
                  </div>
                  <h3 className="mt-16 max-w-xs font-['Arial_Black',_Impact,_sans-serif] text-[2rem] uppercase leading-[0.92] tracking-[-0.05em]">
                    {item.title}
                  </h3>
                  <p
                    className={[
                      "mt-5 max-w-sm text-sm leading-7",
                      index === 1 ? "text-[#e9dac5]" : "text-[#33251a]",
                    ].join(" ")}
                  >
                    {item.copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden border-b-4 border-[#21160d] bg-[#21160d] py-6 text-[#f3ede2]">
          <div className="landing-ticker flex w-[220%] gap-8 whitespace-nowrap text-2xl font-['Arial_Black',_Impact,_sans-serif] uppercase tracking-[-0.04em] md:text-4xl">
            {Array.from({ length: 10 }).map((_, index) => (
              <span key={index} className="shrink-0">
                {quotes[index % quotes.length]} {" "} / {" "}
              </span>
            ))}
          </div>
        </section>

        <section className="border-b-4 border-[#21160d] bg-[#f8f3eb]">
          <div className="mx-auto grid max-w-[92rem] gap-0 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="flex min-h-[22rem] items-end border-b-4 border-[#21160d] bg-[#f3ede2] px-4 py-8 md:px-8 lg:border-b-0 lg:border-r-4">
              <div className="landing-float max-w-sm border-4 border-[#21160d] bg-[#cf9f54] px-6 py-6 text-[#21160d]">
                <p className="text-xs font-black uppercase tracking-[0.28em]">Launch block</p>
                <p className="mt-4 font-['Arial_Black',_Impact,_sans-serif] text-3xl uppercase leading-[0.92] tracking-[-0.05em]">
                  Placeholder for campaign asset
                </p>
              </div>
            </div>

            <div className="px-4 py-10 md:px-8 md:py-14">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#9d6c20]">Call to action</p>
              <h2 className="mt-4 max-w-4xl font-['Arial_Black',_Impact,_sans-serif] text-[2.8rem] uppercase leading-[0.9] tracking-[-0.06em] md:text-[4.6rem]">
                Build the wardrobe system you wish you already had.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8">
                Start with the pieces you already own. Let Mura organize the closet, map the
                categories, and surface better outfits faster.
              </p>

              <div className="mt-8 flex flex-col gap-4 md:flex-row">
                <Link
                  href="/onboarding"
                  className="inline-flex items-center justify-center gap-2 border-4 border-[#21160d] bg-[#21160d] px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#f3ede2] transition hover:bg-[#9d6c20]"
                >
                  Start onboarding
                  <FiArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center border-4 border-[#21160d] bg-transparent px-6 py-4 text-sm font-black uppercase tracking-[0.18em] transition hover:bg-[#cf9f54]"
                >
                  Existing user
                </Link>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {["Closet", "Planner", "Stylist"].map((item) => (
                  <div key={item} className="border-4 border-[#21160d] bg-[#f3ede2] px-4 py-5">
                    <div className="mb-10 inline-flex h-10 w-10 items-center justify-center border-2 border-[#21160d] text-[#21160d]">
                      <FiPlus className="h-4 w-4" />
                    </div>
                    <div className="font-['Arial_Black',_Impact,_sans-serif] text-2xl uppercase tracking-[-0.05em]">
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
