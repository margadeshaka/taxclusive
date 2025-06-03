import Image from "next/image";
import Link from "next/link";

export default function InsightsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="ethnic-divider">
              <span className="text-primary font-serif px-4">Insights</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter font-serif md:text-4xl/tight">
              Latest Financial Insights
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Stay ahead with our latest financial insights, designed to help you navigate the
              ever-evolving economic landscape. From market trends and investment strategies to
              regulatory changes and tax planning tips, our expert analysis empowers you to make
              informed decisions and achieve long-term financial success.
            </p>
          </div>
        </div>
        <div className="grid gap-8 pt-12 md:grid-cols-2 lg:grid-cols-3">
          <article className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
            <div className="aspect-video overflow-hidden">
              <Image
                src="/extra.png"
                width={600}
                height={400}
                alt="Tax planning strategies for small businesses"
                className="object-cover transition-all group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <time dateTime="2023-04-01">April 1, 2025</time>
                <span>•</span>
                <span>Taxation</span>
              </div>
              <h3 className="mt-3 text-xl font-bold">
                Tax Planning Strategies for Small Businesses
              </h3>
              <p className="mt-2 line-clamp-3 text-muted-foreground">
                With tax reforms underway, small businesses must adapt to new deductions and
                exemptions. Our expert tips help you optimize your tax strategy, ensuring you
                maximize savings while remaining compliant with the latest regulations.
              </p>
              {/* <Link
                href="/insights/tax-planning-strategies"
                className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                aria-label="Read more about Tax Planning Strategies for Small Businesses in 2023"
              >
                Read more 
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link> */}
            </div>
          </article>
          <article className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
            <div className="aspect-video overflow-hidden">
              <Image
                src="/insights2.png"
                width={600}
                height={400}
                alt="Financial forecasting guide for business growth"
                className="object-cover transition-all group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <time dateTime="2023-03-15">March 15, 2025</time>
                <span>•</span>
                <span>Financial Advisory</span>
              </div>
              <h3 className="mt-3 text-xl font-bold">The Importance of Financial Forecasting</h3>
              <p className="mt-2 line-clamp-3 text-muted-foreground">
                With a volatile global economy, accurate financial forecasting has never been more
                critical. This article explores techniques to help businesses predict financial
                outcomes, adapt to market changes, and make informed investment decisions.
              </p>
              {/* <Link
                href="/insights/financial-forecasting"
                className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                aria-label="Read more about Financial Forecasting: A Guide for Business Growth"
              >
                Read more 
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link> */}
            </div>
          </article>
          <article className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
            <div className="aspect-video overflow-hidden">
              <Image
                src="/insights3.png"
                width={600}
                height={400}
                alt="The importance of regular financial audits"
                className="object-cover transition-all group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <time dateTime="2023-02-28">February 28, 2025</time>
                <span>•</span>
                <span>Audit</span>
              </div>
              <h3 className="mt-3 text-xl font-bold">The Importance of Regular Financial Audits</h3>
              <p className="mt-2 line-clamp-3 text-muted-foreground">
                As businesses face increasing scrutiny, regular financial audits ensure transparency
                and build trust with stakeholders. Learn why audits are more important than ever and
                how they can help safeguard your company&apos;s future.
              </p>
              {/* <Link
                href="/insights/importance-of-audits"
                className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                aria-label="Read more about The Importance of Regular Financial Audits"
              >
                Read more
                 <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link> */}
            </div>
          </article>
        </div>
        <div className="flex justify-center pt-8">
          <Link
            href="/insights"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            View All Insights
          </Link>
        </div>
      </div>
    </section>
  );
}
