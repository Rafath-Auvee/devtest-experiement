import FeedNavbar from "@/components/feed/FeedNavbar";
import LeftSidebar from "@/components/feed/LeftSidebar";
import RightSidebar from "@/components/feed/RightSidebar";

export default function FeedPage() {
  return (
    <div className="_layout">
      <FeedNavbar />
      <div className="_main_layout">
        <div className="container _custom_container">
          <div className="_layout_inner_wrap">
            <div className="row">
              <LeftSidebar />
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_layout_middle_wrap">
                  <div className="_layout_middle_inner">
                    <p style={{ padding: "2rem", color: "var(--color6)" }}>
                      Feed posts coming soon…
                    </p>
                  </div>
                </div>
              </div>
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
