import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbNavProps {
  items: { label: string; href?: string }[];
}

export default function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, i) => (
          <span key={item.label} className="inline-flex items-center gap-1.5">
            {i > 0 && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
            <BreadcrumbItem>
            {i === items.length - 1 ? (
              <BreadcrumbPage className="label-mono text-ink">{item.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink
                render={<Link to={item.href || "/"} />}
                className="label-mono text-mist hover:text-ink"
              >
                {item.label}
              </BreadcrumbLink>
            )}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
