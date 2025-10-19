export function AboutHeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 ethnic-pattern">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="w-16 h-1 bg-primary mx-auto mb-4"></div>
            <h1 className="text-3xl font-bold tracking-tighter font-serif sm:text-5xl">
              About Our Firm
            </h1>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We are a trusted tax and financial services firm committed to delivering excellence in
              financial, taxation, and compliance services. With a client-centric approach and
              deep industry expertise, we empower businesses and individuals to navigate complex
              financial landscapes with confidence. Our mission is to provide transparent,
              timely, and tailored solutions that foster sustainable growth and ensure
              regulatory peace of mind.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}