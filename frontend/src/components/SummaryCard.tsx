import type { LucideIcon } from "lucide-react";
type SummaryCardProps = {
    title: string;
    value: string | number;
    description: string;
    icon: LucideIcon;
    descriptionIcon?: LucideIcon | string;
};

export default function SummaryCard({
    title,
    value,
    description,
    icon: Icon,
    descriptionIcon: DescriptionIcon,
}: SummaryCardProps) {
    return (
        <div className="relative flex min-h-45 w-full flex-col rounded-lg bg-gradient-to-r from-blue-500 to-blue-800 pb-13 pl-6 pr-18 pt-6 text-white">
            <h3 className="mb-3 text-[17px]">{title}</h3>
            <h1 className="text-[40px] font-bold">{value}</h1>
            <p className="absolute bottom-4 left-4 flex items-center gap-1 text-[15px] text-white">
                {typeof DescriptionIcon === "string" ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-bold text-blue-500">
                        {DescriptionIcon}
                    </span>
                ) : (
                    DescriptionIcon && (
                        <DescriptionIcon
                            className="h-6 w-6 rounded-full bg-white p-1 text-blue-500"
                            strokeWidth={4}
                        />
                    )
                )}
                {description}
            </p>
            <Icon className="absolute bottom-2 right-3 h-18 w-18 opacity-50" />
        </div>
    );
}
