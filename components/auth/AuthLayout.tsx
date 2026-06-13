import { images } from "@/src/assets/images";

interface AuthLayoutProps {
  wrapperClass: string;
  children: React.ReactNode;
}

export default function AuthLayout({ wrapperClass, children }: AuthLayoutProps) {
  return (
    <section className={`${wrapperClass} _layout_main_wrapper`}>
      <div className="_shape_one">
        <img src={images.shape1Svg} alt="" className="_shape_img" />
        <img src={images.darkShape} alt="" className="_dark_shape" />
      </div>
      <div className="_shape_two">
        <img src={images.shape2} alt="" className="_shape_img" />
        <img src={images.darkShape1} alt="" className="_dark_shape _dark_shape_opacity" />
      </div>
      <div className="_shape_three">
        <img src={images.shape3} alt="" className="_shape_img" />
        <img src={images.darkShape2} alt="" className="_dark_shape _dark_shape_opacity" />
      </div>
      <div className="_social_login_wrap">
        <div className="container">
          <div className="row align-items-center">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
