import FeedNavbar from "@/components/feed/FeedNavbar";
import LeftSidebar from "@/components/feed/LeftSidebar";
import RightSidebar from "@/components/feed/RightSidebar";
import FeedMiddle from "@/components/feed/FeedMiddle";

export default function FeedPage() {
  return (
    <div className="_layout">
      <FeedNavbar />
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
