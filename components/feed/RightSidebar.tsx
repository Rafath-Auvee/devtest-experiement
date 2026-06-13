import Image from "next/image";
import Link from "next/link";
import { images } from "@/lib/assets/images";

const youMightLike = [
  { name: "Radovan SkillArena", title: "Founder & CEO at Trophy", img: images.avatar },
  { name: "Steve Jobs", title: "CEO of Apple", img: images.people1 },
];

const friends = [
  { name: "Steve Jobs", title: "CEO of Apple", img: images.people1, time: "5 minutes ago", inactive: true },
  { name: "Ryan Roslansky", title: "CEO of Linkedin", img: images.people2, time: "10 minutes ago", inactive: false },
  { name: "Dylan Field", title: "CEO of Figma", img: images.people3, time: "1 hour ago", inactive: false },
  { name: "Steve Jobs", title: "CEO of Apple", img: images.people1, time: "2 hours ago", inactive: true },
];

export default function RightSidebar() {
  return (
    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
      <div className="_layout_right_sidebar_wrap">

        <div className="_layout_right_sidebar_inner">
          <div className="_right_inner_area_info _padd_t24 _padd_b24 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
            <div className="_right_inner_area_info_content _mar_b24">
              <h4 className="_right_inner_area_info_content_title _title5">You Might Like</h4>
              <span className="_right_inner_area_info_content_txt">
                <Link className="_right_inner_area_info_content_txt_link" href="#0">See All</Link>
              </span>
            </div>
            <hr className="_underline" />
            {youMightLike.map(({ name, title, img }) => (
              <div key={name} className="_right_inner_area_info_ppl">
                <div className="_right_inner_area_info_box">
                  <div className="_right_inner_area_info_box_image">
                    <Link href="#0">
                      <Image src={img} alt={name} width={40} height={40} className="_ppl_img" />
                    </Link>
                  </div>
                  <div className="_right_inner_area_info_box_txt">
                    <Link href="#0">
                      <h4 className="_right_inner_area_info_box_title">{name}</h4>
                    </Link>
                    <p className="_right_inner_area_info_box_para">{title}</p>
                  </div>
                </div>
                <div className="_right_info_btn_grp">
                  <button type="button" className="_right_info_btn_link">Ignore</button>
                  <button type="button" className="_right_info_btn_link _right_info_btn_link_active">Follow</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="_layout_right_sidebar_inner">
          <div className="_feed_right_inner_area_card _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
            <div className="_feed_top_fixed">
              <div className="_feed_right_inner_area_card_content _mar_b24">
                <h4 className="_feed_right_inner_area_card_content_title _title5">Your Friends</h4>
                <span className="_feed_right_inner_area_card_content_txt">
                  <Link className="_feed_right_inner_area_card_content_txt_link" href="#0">See All</Link>
                </span>
              </div>
              <form className="_feed_right_inner_area_card_form">
                <svg className="_feed_right_inner_area_card_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                  <circle cx="7" cy="7" r="6" stroke="#666" />
                  <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
                </svg>
                <input className="form-control me-2 _feed_right_inner_area_card_form_inpt" type="search" placeholder="Search..." aria-label="Search" />
              </form>
            </div>
            <div className="_feed_bottom_fixed">
              {friends.map(({ name, title, img, time, inactive }, i) => (
                <div key={i} className={`_feed_right_inner_area_card_ppl${inactive ? " _feed_right_inner_area_card_ppl_inactive" : ""}`}>
                  <div className="_feed_right_inner_area_card_ppl_box">
                    <div className="_feed_right_inner_area_card_ppl_image">
                      <Link href="#0">
                        <Image src={img} alt={name} width={36} height={36} className="_box_ppl_img" />
                      </Link>
                    </div>
                    <div className="_feed_right_inner_area_card_ppl_txt">
                      <Link href="#0">
                        <h4 className="_feed_right_inner_area_card_ppl_title">{name}</h4>
                      </Link>
                      <p className="_feed_right_inner_area_card_ppl_para">{title}</p>
                    </div>
                  </div>
                  <div className="_feed_right_inner_area_card_ppl_side">
                    <span>{time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
