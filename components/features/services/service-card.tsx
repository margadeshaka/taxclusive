import { LucideIcon, ChevronRight } from "lucide-react";

interface ServiceFeature {
  text: string;
}

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: ServiceFeature[];
}

export function ServiceCard({ icon: Icon, title, description, features }: ServiceCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
      <div className="flex flex-col space-y-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        <ul className="mt-4 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <ChevronRight className="mr-2 h-4 w-4 text-primary" />
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}