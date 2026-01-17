import React from 'react';
import Card from './Card';

interface StatCardProps {
    icon: React.ReactElement;
    title: string;
    value: string;
    details?: React.ReactNode;
    actionText?: string;
    onActionClick?: () => void;
    colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, details, actionText, onActionClick, colorClass }) => (
    <Card className="flex flex-col">
        <div className="flex items-start">
            <div className={`p-3 rounded-lg mr-4 ${colorClass.replace('text-', 'bg-')}/10`}>
                {React.cloneElement(icon as React.ReactElement<any>, { className: `h-6 w-6 ${colorClass}` })}
            </div>
            <div>
                <h3 className="font-semibold text-[var(--muted-foreground)]">{title}</h3>
                <p className="text-3xl font-bold">{value}</p>
            </div>
        </div>
        {details && <div className="mt-2 text-sm">{details}</div>}
        <div className="flex-grow"></div>
        {actionText && onActionClick && (
            <button onClick={onActionClick} className="text-sm font-semibold mt-4 text-[var(--accent-color)] hover:underline self-start">
                {actionText} &rarr;
            </button>
        )}
    </Card>
);

export default StatCard;