import { Analytics } from '@vercel/analytics/react'
import {
  ArrowRight,
  Bot,
  ChartLine,
  ChefHat,
  Hotel,
  Phone,
  ShieldCheck,
  Soup,
  Truck,
  Utensils,
  Wallet,
} from 'lucide-react'
import Hero from '@/components/ui/animated-shader-hero'

const features = [
  {
    icon: Bot,
    title: 'Autonomous ordering',
    body: 'The agent learns your menu, par levels, and prep cycles — then places daily orders without you lifting a finger.',
  },
  {
    icon: Phone,
    title: 'WhatsApp & call native',
    body: 'Negotiates with mandi vendors and distributors over WhatsApp and voice — in Hindi, English, Tamil, and more.',
  },
  {
    icon: Wallet,
    title: 'Live price intelligence',
    body: 'Real-time mandi rates across 80+ Indian cities so you always know the fair price before you buy.',
  },
  {
    icon: Truck,
    title: 'Vendor orchestration',
    body: 'Splits orders across vetted suppliers for the best mix of price, quality, and delivery window.',
  },
  {
    icon: ChartLine,
    title: 'Cost analytics',
    body: 'See food cost % per dish, per outlet, per shift — with AI suggestions on where to recover margin.',
  },
  {
    icon: ShieldCheck,
    title: 'FSSAI-compliant trail',
    body: 'Every invoice, batch, and weight digitised and audit-ready for compliance and quality teams.',
  },
]

const kitchens = [
  {
    icon: Utensils,
    title: 'Restaurants',
    body: 'Single outlets and chains looking to protect margins on volatile ingredients.',
  },
  {
    icon: ChefHat,
    title: 'Cloud kitchens',
    body: 'Multi-brand operators managing dozens of SKUs across shifts.',
  },
  {
    icon: Hotel,
    title: 'Hotels & QSRs',
    body: 'Procurement teams orchestrating multi-vendor supply at scale.',
  },
  {
    icon: Soup,
    title: 'Caterers & messes',
    body: 'Bulk buyers who live and die by mandi prices and reliability.',
  },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Analytics />
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <a href="#" className="flex min-w-0 items-center gap-2">
            <img
              src="/logo.png"
              alt="Repeat AI"
              width={36}
              height={36}
              className="h-8 w-8 shrink-0 rounded-md object-cover sm:h-9 sm:w-9"
            />
            <span className="font-display truncate text-lg font-semibold text-white sm:text-xl">
              Repeat<span className="text-emerald-300"> AI</span>
            </span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {[
              ['how', 'How it works'],
              ['features', 'Features'],
              ['why', 'Why us'],
              ['contact', 'Contact'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className="text-sm cursor-pointer text-emerald-100/70 transition-colors hover:text-white"
              >
                {label}
              </button>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => scrollTo('contact')}
            className="inline-flex h-9 cursor-pointer items-center justify-center rounded-[8px] bg-emerald-500 px-3 text-sm font-medium text-black shadow transition hover:bg-emerald-400 sm:px-4"
          >
            Book a demo
          </button>
        </div>
      </header>

      <Hero
        trustBadge={{
          text: 'AI procurement, built for Indian kitchens',
          icons: ['✨'],
        }}
        headline={{
          line1: 'Source smarter.',
          line2: 'Cook freer.',
        }}
        subtitle="Repeat AI is an AI procurement agent that negotiates, orders, and tracks ingredients for restaurants, cloud kitchens, hotels, and caterers across India."
        buttons={{
          primary: {
            text: 'Book a demo',
            onClick: () => scrollTo('contact'),
          },
          secondary: {
            text: 'See how it works',
            onClick: () => scrollTo('how'),
          },
        }}
        stats={[
          { value: '22%', label: 'avg. cost saved' },
          { value: '1,200+', label: 'outlets and vendors' },
          { value: '9 hrs', label: 'saved weekly' },
        ]}
        image={{
          src: '/hero-ingredients-CqWvy-kU.jpg',
          alt: 'Fresh Indian ingredients sourced through Repeat AI',
          caption: {
            title: "This morning's order",
            line: 'Tomatoes · 40 kg',
            note: 'Saved ₹1,240 vs last week',
          },
        }}
      />

      <section id="features" className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-widest text-leaf">Features</p>
            <h2 className="font-display mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              A procurement team that never sleeps
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Built for the messy reality of Indian food supply chains — fragmented vendors, daily
              price swings, WhatsApp orders, and razor-thin margins.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-leaf transition-colors group-hover:bg-primary/15">
                  <Icon className="h-5 w-5 text-leaf" />
                </div>
                <h3 className="font-display mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="bg-gradient-warm py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-widest text-leaf">How it works</p>
            <h2 className="font-display mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Live in your kitchen by next week
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              No new hardware. No replacing your team. Repeat AI plugs into the way Indian kitchens
              already work.
            </p>
          </div>
          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              [
                '01',
                'Connect your kitchen',
                'Share your details, items required. Repeat AI models your demand in under a day.',
              ],
              [
                '02',
                'AI negotiates & orders',
                'The agent benchmarks mandi rates, chats with suppliers on WhatsApp, and locks in the best basket.',
              ],
              [
                '03',
                'You approve & track',
                'Review the daily plan in one tap. Track deliveries, weights, and savings live from any phone.',
              ],
            ].map(([n, title, body]) => (
              <li key={n} className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <span className="font-display text-5xl font-semibold text-spice/70">{n}</span>
                <h3 className="font-display mt-4 text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="why" className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-widest text-leaf">Built for</p>
            <h2 className="font-display mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Every kind of Indian kitchen
            </h2>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kitchens.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl bg-secondary/60 p-6 transition-colors hover:bg-secondary"
              >
                <Icon className="h-7 w-7 text-leaf" />
                <h3 className="font-display mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center text-primary-foreground">
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
            Ready to slash your food costs and save hours?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
            Book a 20-minute demo. We&apos;ll plug Repeat AI into one of your outlets and show you
            the savings within the first week.
          </p>
          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <input
              type="email"
              required
              placeholder="you@kitchen.com"
              className="h-12 min-w-0 w-full rounded-[8px] border border-white/30 bg-white/10 px-3 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-1 focus:ring-white"
            />
            <button
              type="submit"
              className="inline-flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[8px] bg-secondary px-8 text-sm font-medium text-foreground shadow-sm transition hover:bg-secondary/80"
            >
              Request demo <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-4 text-xs text-primary-foreground/70">
            Trusted by 50+ customers.
          </p>
        </div>
      </section>

      <footer className="border-t border-border bg-background py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-2 text-center text-sm text-muted-foreground sm:justify-start sm:text-left">
            <img
              src="/logo.png"
              alt="Repeat AI"
              width={28}
              height={28}
              className="h-7 w-7 rounded-md object-cover"
            />
            <span className="font-display font-semibold text-foreground">Repeat AI</span>
            <span className="w-full sm:w-auto">· AI procurement for Indian food services</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Repeat AI Technologies Pvt. Ltd.
          </p>
        </div>
      </footer>
    </div>
  )
}
