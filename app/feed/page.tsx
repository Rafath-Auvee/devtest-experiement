import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import FeedNavbar from "@/components/feed/FeedNavbar";
import LeftSidebar from "@/components/feed/LeftSidebar";
import RightSidebar from "@/components/feed/RightSidebar";
import FeedMiddle from "@/components/feed/FeedMiddle";

export default async function FeedPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="_layout">
      <FeedNavbar firstName={user.firstName} lastName={user.lastName} />
      <div className="_main_layout">
        <div className="container _custom_container">
          <div className="_layout_inner_wrap">
            <div className="row">
              <LeftSidebar />
              <FeedMiddle />
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
