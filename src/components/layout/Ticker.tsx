import { useTranslation } from "react-i18next";

export default function Ticker() {
  const { t } = useTranslation();

  const items = [
    t("freeShipping"),
    t("newArrivals"),
    t("qualityGuaranteed"),
    t("returnsPolicy"),
  ];

  const content = items.map((item) => (
    <span key={item} className="flex items-center gap-4">
      <span className="text-rust">●</span>
      <span>{item}</span>
    </span>
  ));

  return (
    <div className="bg-ink text-chalk overflow-hidden py-2.5">
      <div className="flex ticker-scroll whitespace-nowrap">
        <div className="flex gap-8 label-mono text-[0.65rem] shrink-0 px-4">
          {content}
        </div>
        <div className="flex gap-8 label-mono text-[0.65rem] shrink-0 px-4">
          {content}
        </div>
      </div>
    </div>
  );
}
