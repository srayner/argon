import React from "react";

interface ClickableIconProps {
  icon: React.ReactNode;
  onClick: () => void;
  e2e: string;
}

const ClickableIcon: React.FC<ClickableIconProps> = ({
  icon,
  onClick,
  e2e,
}) => {
  return (
    <span
      onClick={onClick}
      className="cursor-pointer text-xl hover:text-blue-500 transition-colors"
      data-e2e={e2e}
    >
      {icon}
    </span>
  );
};

interface CardHeaderProps {
  title: string;
  actions: {
    icon: React.ReactNode;
    onClick: () => void;
    e2e: string;
  }[];
}

const CardHeader: React.FC<CardHeaderProps> = ({ title, actions }) => {
  return (
    <div className="bg-zinc-300 w-full min-h-[46px] py-2 px-4 flex justify-between items-center rounded-t-lg">
      <h3 className="text-black text-sm font-semibold">{title}</h3>
      <div className="flex space-x-4">
        {actions.map((action, index) => (
          <ClickableIcon
            key={index}
            icon={action.icon}
            onClick={action.onClick}
            e2e={action.e2e}
          />
        ))}
      </div>
    </div>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
}

const CardBody: React.FC<CardBodyProps> = ({ children }) => {
  return <div className="p-4">{children}</div>;
};

export { CardHeader, CardBody };
