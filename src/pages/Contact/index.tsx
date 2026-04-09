import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Wrapper from "@/components/hoc/Wrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  return (
    <Wrapper>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <p className="label-mono text-mist mb-3">GET IN TOUCH</p>
          <h1 className="heading-display text-4xl md:text-5xl">
            Contact <span className="heading-display-italic text-sand">Us</span>
          </h1>
          <p className="text-mist mt-4 max-w-md mx-auto">
            Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <div className="space-y-6">
            <div>
              <Label className="label-mono text-[0.6rem] mb-2 block">YOUR NAME</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Mohammed Amrani"
                className="bg-white border-stone"
              />
            </div>
            <div>
              <Label className="label-mono text-[0.6rem] mb-2 block">EMAIL</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="mohammed@email.com"
                className="bg-white border-stone"
              />
            </div>
            <div>
              <Label className="label-mono text-[0.6rem] mb-2 block">SUBJECT</Label>
              <Input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Order inquiry, partnership..."
                className="bg-white border-stone"
              />
            </div>
            <div>
              <Label className="label-mono text-[0.6rem] mb-2 block">MESSAGE</Label>
              <Textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us more..."
                rows={5}
                className="bg-white border-stone"
              />
            </div>
            <Button className="bg-ink text-chalk hover:bg-ink/90 label-mono px-8 py-5 w-full">
              Send Message
            </Button>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-warm p-8">
              <h3 className="heading-display text-2xl mb-6">Store Information</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-rust mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Address</p>
                    <p className="text-mist text-sm">123 Didouche Mourad Street, Algiers 16000, Algeria</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-rust mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Phone</p>
                    <p className="text-mist text-sm">+213 555 123 456</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-rust mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Email</p>
                    <p className="text-mist text-sm">hello@lazuli.dz</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-rust mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Working Hours</p>
                    <p className="text-mist text-sm">Sun — Thu: 9:00 AM – 6:00 PM</p>
                    <p className="text-mist text-sm">Fri — Sat: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Wrapper>
  );
}
