import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function SizeGuide() {
  const [open, setOpen] = useState(false);
  const sizes = [
    { size: "XS", bust: "80", waist: "62", hips: "86" },
    { size: "S", bust: "84", waist: "66", hips: "90" },
    { size: "M", bust: "88", waist: "70", hips: "94" },
    { size: "L", bust: "92", waist: "74", hips: "98" },
    { size: "XL", bust: "96", waist: "78", hips: "102" },
    { size: "XXL", bust: "100", waist: "82", hips: "106" },
  ];

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-rust text-sm font-mono uppercase tracking-wider hover:underline">
        Size Guide
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-chalk sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="heading-display text-2xl">Size Guide</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone">
                <th className="py-2 text-left label-mono">Size</th>
                <th className="py-2 text-center label-mono">Bust (cm)</th>
                <th className="py-2 text-center label-mono">Waist (cm)</th>
                <th className="py-2 text-center label-mono">Hips (cm)</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((s) => (
                <tr key={s.size} className="border-b border-stone/50">
                  <td className="py-2 font-semibold">{s.size}</td>
                  <td className="py-2 text-center text-mist">{s.bust}</td>
                  <td className="py-2 text-center text-mist">{s.waist}</td>
                  <td className="py-2 text-center text-mist">{s.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-mist mt-4">
          Measurements are in centimeters. For the best fit, measure yourself and compare with the chart above.
        </p>
      </DialogContent>
      </Dialog>
    </>
  );
}
