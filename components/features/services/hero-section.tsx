export function ServicesHeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 ethnic-pattern">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="w-16 h-1 bg-primary mx-auto mb-4"></div>
            <h1 className="text-3xl font-bold tracking-tighter font-serif sm:text-5xl">
              Our Services
            </h1>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Comprehensive accounting, taxation, and financial advisory services tailored to
              meet your unique needs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}