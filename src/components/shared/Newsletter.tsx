import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subscribeNewsletter } from "@/api/newsletter";
import { toast } from "sonner";

export default function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await subscribeNewsletter(email.trim());
      toast.success(t("newsletter.success", { defaultValue: "Subscribed successfully!" }));
      setEmail("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Subscription failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-warm py-20">
      <div className="max-w-xl mx-auto text-center px-4">
        <h2 className="heading-display text-3xl md:text-4xl mb-3">
          {t("newsletter.title")}
        </h2>
        <p className="text-mist mb-8">{t("newsletter.subtitle")}</p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("newsletter.placeholder")}
            className="bg-white border-stone flex-1"
            required
            disabled={loading}
          />
          <Button type="submit" className="bg-ink text-chalk hover:bg-ink/90 label-mono px-6" disabled={loading}>
            {t("newsletter.subscribe")}
          </Button>
        </form>
      </div>
    </section>
  );
}
