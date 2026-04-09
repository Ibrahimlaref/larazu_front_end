import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WILAYAS } from "@/api/mockData";

interface WilayaSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function WilayaSelect({ value, onChange }: WilayaSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v ?? "")}>
      <SelectTrigger className="bg-white border-stone">
        <SelectValue placeholder="Select your wilaya" />
      </SelectTrigger>
      <SelectContent className="max-h-60 bg-white">
        {WILAYAS.map((w) => (
          <SelectItem key={w} value={w}>{w}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
