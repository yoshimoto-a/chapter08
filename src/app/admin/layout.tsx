import  Link  from "next/link";
//import "../globals.css";

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <div className="w-1/4 bg-gray-200 h-screen">
        <ul>
          <li className="p-2">
            <Link href={"/admin/posts"}>記事一覧</Link>
          </li>
          <li className="p-2">
            <Link href={"/admin/category"}>カテゴリー一覧</Link>
          </li>
        </ul>
      </div>
      <div className="w-3/4 p-4">{children}</div>
    </div>
  );
};

export default SidebarLayout;