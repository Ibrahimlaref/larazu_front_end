import Wrapper from "@/components/hoc/Wrapper";

export default function About() {
  return (
    <Wrapper>
      {/* Hero */}
      <section className="relative bg-ink text-chalk py-24">
        <div className="absolute inset-0">
          <img
            src="/products/Gemini_Generated_Image_ebfh0webfh0webfh.png"
            alt="About LAZULI"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative max-w-3xl mx-auto text-center px-4">
          <p className="label-mono text-sand mb-4">OUR STORY</p>
          <h1 className="heading-display text-5xl md:text-6xl mb-6">
            About <span className="heading-display-italic text-sand">LAZULI</span>
          </h1>
          <p className="text-chalk/70 leading-relaxed">
            Born in Algeria, made for Algeria. LAZULI is a premium clothing brand that celebrates Algerian identity through modern fashion.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="heading-display text-3xl mb-4">Our Mission</h2>
            <p className="text-mist leading-relaxed">
              We believe every Algerian deserves access to premium, beautifully crafted clothing.
              From streetwear to modest fashion, from kids to formal wear — we curate collections
              that blend international quality with local identity.
            </p>
          </div>
          <div>
            <h2 className="heading-display text-3xl mb-4">Our Values</h2>
            <ul className="space-y-3 text-mist">
              <li className="flex items-start gap-3">
                <span className="text-rust mt-1">●</span>
                <span><strong className="text-ink">Quality First</strong> — Every item is quality-checked before shipping.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rust mt-1">●</span>
                <span><strong className="text-ink">Made in Algeria</strong> — Supporting local manufacturing and talent.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rust mt-1">●</span>
                <span><strong className="text-ink">Inclusive Fashion</strong> — Styles for every body, every taste, every occasion.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rust mt-1">●</span>
                <span><strong className="text-ink">Accessible Luxury</strong> — Premium quality at fair prices.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Image band */}
      <section className="grid grid-cols-3 gap-1">
        <img src="/products/Gemini_Generated_Image_440k5l440k5l440k.png" alt="" className="w-full aspect-square object-cover" />
        <img src="/products/Gemini_Generated_Image_agy78sagy78sagy7.png" alt="" className="w-full aspect-square object-cover" />
        <img src="/products/Gemini_Generated_Image_x66q0vx66q0vx66q.png" alt="" className="w-full aspect-square object-cover" />
      </section>

      {/* Stats */}
      <section className="bg-warm py-20">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "500+", label: "Products" },
            { value: "58", label: "Wilayas Served" },
            { value: "48h", label: "Delivery" },
            { value: "10K+", label: "Happy Customers" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="heading-display text-4xl text-rust">{stat.value}</p>
              <p className="label-mono text-mist mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </Wrapper>
  );
}
