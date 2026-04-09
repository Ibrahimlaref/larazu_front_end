import { Link } from "react-router-dom";

import Wrapper from "@/components/hoc/Wrapper";
import Ticker from "@/components/layout/Ticker";

export default function Lookbook() {
  return (
    <Wrapper>
      {/* Hero */}
      <section className="relative bg-ink text-chalk min-h-[80vh] flex items-center justify-center text-center">
        <div className="absolute inset-0">
          <img
            src="/products/Gemini_Generated_Image_ta4kahta4kahta4k.png"
            alt="Lookbook"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-ink/50" />
        </div>
        <div className="relative px-4 max-w-2xl">
          <p className="label-mono text-sand mb-4">SEASON 2025</p>
          <h1 className="heading-display text-5xl md:text-7xl leading-tight mb-2">
            The <span className="heading-display-italic text-sand">LAZULI</span>
          </h1>
          <h1 className="heading-display text-5xl md:text-7xl">Lookbook</h1>
          <p className="text-chalk/70 mt-6 text-sm max-w-md mx-auto">
            Curated style stories for every occasion — modern, modest, and made for Algeria.
          </p>
          <Link to="/shop" className="mt-8 inline-flex items-center justify-center bg-rust text-white hover:bg-rust/90 label-mono px-8 py-3">
            Shop the Looks
          </Link>
        </div>
      </section>

      <Ticker />

      {/* Chapter One */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="label-mono text-mist mb-3">CHAPTER ONE</p>
            <h2 className="heading-display text-4xl md:text-5xl">
              Effortless <span className="heading-display-italic">Elegance</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="/products/Gemini_Generated_Image_3q6hc63q6hc63q6h.png"
                alt="Effortless Elegance 1"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="/products/Gemini_Generated_Image_9ameg29ameg29ame.png"
                alt="Effortless Elegance 2"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Chapter Two */}
      <section className="bg-warm py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <p className="label-mono text-mist mb-3">CHAPTER TWO</p>
            <h2 className="heading-display text-4xl md:text-5xl">
              Urban <span className="heading-display-italic">Energy</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="aspect-[3/4] overflow-hidden md:col-span-2">
              <img
                src="/products/Gemini_Generated_Image_omcyhvomcyhvomcy.png"
                alt="Urban Energy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="/products/Gemini_Generated_Image_8yapny8yapny8yap.png"
                alt="Urban Energy 2"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <p className="label-mono text-mist mb-3">EXPLORE THE FULL COLLECTION</p>
        <h2 className="heading-display text-4xl md:text-5xl mb-8">
          500+ Pieces <span className="heading-display-italic font-bold">Waiting</span> for You
        </h2>
        <Link to="/shop" className="inline-flex items-center justify-center bg-rust text-white hover:bg-rust/90 label-mono px-10 py-3">
          Shop All Collections
        </Link>
      </section>
    </Wrapper>
  );
}
