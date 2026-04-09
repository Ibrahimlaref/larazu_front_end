import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  const shopLinks = [
    { to: "/shop?category=men", label: "Men's Wear" },
    { to: "/shop?category=women", label: "Women's Wear" },
    { to: "/shop?category=kids", label: "Kids" },
    { to: "/shop?category=streetwear", label: "Streetwear" },
    { to: "/shop?category=accessories", label: "Accessories" },
    { to: "/shop?badge=sale", label: "Sale" },
  ];

  const supportLinks = [
    { to: "#", label: t("footer.trackOrder") },
    { to: "#", label: t("footer.returns") },
    { to: "#", label: t("footer.shipping") },
    { to: "#", label: t("footer.sizeGuide") },
    { to: "#", label: t("footer.faq") },
    { to: "/contact", label: "Contact" },
  ];

  const companyLinks = [
    { to: "/about", label: "About" },
    { to: "#", label: t("footer.careers") },
    { to: "#", label: t("footer.privacyPolicy") },
    { to: "#", label: t("footer.terms") },
  ];

  const socials = ["f", "ig", "tw", "tk"];

  return (
    <footer className="bg-ink text-chalk/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-2xl tracking-[0.3em] font-serif font-bold text-chalk mb-4">
              LAZULI
            </h3>
            <p className="text-sm leading-relaxed text-chalk/60 mb-6">
              {t("footer.description")}
            </p>
            <div className="flex gap-2">
              {socials.map((s) => (
                <span
                  key={s}
                  className="w-10 h-10 border border-chalk/20 flex items-center justify-center text-xs font-mono text-chalk/60 hover:text-chalk hover:border-chalk/50 transition-colors cursor-pointer"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="label-mono text-sand mb-4">{t("footer.shop")}</h4>
            <ul className="space-y-2">
              {shopLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-chalk/60 hover:text-chalk transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="label-mono text-sand mb-4">{t("footer.support")}</h4>
            <ul className="space-y-2">
              {supportLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-chalk/60 hover:text-chalk transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="label-mono text-sand mb-4">{t("footer.company")}</h4>
            <ul className="space-y-2">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-chalk/60 hover:text-chalk transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-chalk/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono text-chalk/40">{t("footer.copyright")}</p>
          <div className="flex gap-3">
            {["CCP", "BARIDIMOB", "CASH"].map((m) => (
              <span
                key={m}
                className="px-3 py-1 border border-chalk/20 text-xs font-mono text-chalk/60"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
