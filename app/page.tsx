import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calculator,
  FileText,
  TrendingUp,
  DollarSign,
  Package,
  CircleIcon,
} from "lucide-react";
import Link from "next/link";

function Header() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <CircleIcon className="text-accent h-6 w-6" />
          <span className="ml-2 text-xl font-semibold">Layerwyse</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            href="/calculator"
            className="hover:text-accent text-sm font-medium"
          >
            Calculator
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Smart Pricing for
                  <span className="block">3D Printing</span>
                </h1>
                <p className="text-muted-foreground mt-3 text-base sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  Calculate accurate costs, track projects, and understand
                  profitability. Turn your 3D-printing hobby into a sustainable
                  business.
                </p>
                <div className="mt-8 sm:mx-auto sm:max-w-lg sm:text-center lg:mx-0 lg:text-left">
                  <Link href="/calculator">
                    <Button
                      size="lg"
                      className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-lg"
                    >
                      Try Calculator
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative mt-12 sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0 lg:flex lg:max-w-none lg:items-center">
                <div className="border-border bg-card w-full rounded-lg border p-8 shadow-lg">
                  <div className="bg-muted flex aspect-video items-center justify-center rounded-md">
                    <span className="text-muted-foreground text-sm">
                      Calculator Preview Image
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              <div>
                <div className="bg-accent flex h-12 w-12 items-center justify-center rounded-md">
                  <Calculator className="text-accent-foreground h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h2 className="text-lg font-medium">
                    Accurate Cost Calculator
                  </h2>
                  <p className="text-muted-foreground mt-2 text-base">
                    Calculate precise pricing including materials, machine
                    usage, labor, electricity, and failure rates for every print
                    job.
                  </p>
                </div>
              </div>

              <div className="mt-10 lg:mt-0">
                <div className="bg-accent flex h-12 w-12 items-center justify-center rounded-md">
                  <FileText className="text-accent-foreground h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h2 className="text-lg font-medium">Project Tracking</h2>
                  <p className="text-muted-foreground mt-2 text-base">
                    Track jobs, monitor status, estimate profit, and maintain
                    detailed notes and failure logs for every project.
                  </p>
                </div>
              </div>

              <div className="mt-10 lg:mt-0">
                <div className="bg-accent flex h-12 w-12 items-center justify-center rounded-md">
                  <TrendingUp className="text-accent-foreground h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h2 className="text-lg font-medium">Business Insights</h2>
                  <p className="text-muted-foreground mt-2 text-base">
                    Understand profitability, manage partner payouts, and
                    optimize pricing with bulk order models and calculation
                    history.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
              <div>
                <h2 className="text-3xl font-bold sm:text-4xl">
                  Everything You Need to Price Right
                </h2>
                <p className="text-muted-foreground mt-3 max-w-3xl text-lg">
                  Layerwyse handles all the complexity of 3D printing cost
                  calculation. From material costs and machine depreciation to
                  labor and overhead, get accurate pricing that ensures your
                  business stays profitable.
                </p>
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <DollarSign className="text-accent mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <h3 className="font-medium">Material & Labor Costs</h3>
                      <p className="text-muted-foreground text-sm">
                        Track resin, filament, sanding, painting, and
                        post-processing costs
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="text-accent mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <h3 className="font-medium">Machine & Overhead</h3>
                      <p className="text-muted-foreground text-sm">
                        Calculate electricity, machine depreciation, rent, and
                        maintenance
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 lg:mt-0">
                <div className="border-border bg-card w-full rounded-lg border p-8 shadow-lg">
                  <div className="bg-muted flex aspect-video items-center justify-center rounded-md">
                    <span className="text-muted-foreground text-sm">
                      Dashboard Preview Image
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
              <div className="order-2 lg:order-1">
                <div className="border-border bg-card w-full rounded-lg border p-8 shadow-lg">
                  <div className="bg-muted flex aspect-video items-center justify-center rounded-md">
                    <span className="text-muted-foreground text-sm">
                      Project Tracking Preview Image
                    </span>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold sm:text-4xl">
                  From Hobby to Business
                </h2>
                <p className="text-muted-foreground mt-3 max-w-3xl text-lg">
                  Layerwyse helps you transition from printing as a hobby to
                  running a sustainable 3D printing business. Track every
                  project, understand your margins, and make data-driven pricing
                  decisions.
                </p>
                <div className="mt-8">
                  <Link href="/calculator">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full text-lg"
                    >
                      Try Calculator
                      <ArrowRight className="ml-3 h-6 w-6" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="border-border bg-card rounded-lg border p-12 text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Ready to Price Your Prints Accurately?
              </h2>
              <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-lg">
                Join makers who are turning their 3D printing passion into
                profitable businesses with accurate pricing and professional
                project management.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/calculator">
                  <Button
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-lg"
                  >
                    Try Calculator
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
