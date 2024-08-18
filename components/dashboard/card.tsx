import Link from "next/link";

export const Card = ({ href, icon: Icon, title, text, count }: any) => {
  return (
    <Link href={href}>
      <div className="p-6 w-full h-[160px] mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4 hover:bg-gray-100 hover:shadow-xl">
        <div className="shrink-0">
          <Icon className="text-6xl" />
        </div>
        <div>
          <div className="text-xl font-medium text-black">{title}</div>
          <p className="text-slate-500">{text}</p>
        </div>
        <p className="text-black text-5xl">{count}</p>
      </div>
    </Link>
  );
};
