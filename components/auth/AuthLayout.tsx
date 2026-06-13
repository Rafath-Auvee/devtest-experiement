import Image from "next/image";
import { images } from "@/lib/assets/images";

interface AuthLayoutProps {
  wrapperClass: string;
  children: React.ReactNode;
}

export default function AuthLayout({ wrapperClass, children }: AuthLayoutProps) {
  return (
    <section className={`${wrapperClass} _layout_main_wrapper`}>
      <div className="_shape_one">
        <Image src={images.shape1Svg} alt="" width={400} height={400} className="_shape_img" />
        <Image src={images.darkShape} alt="" width={400} height={400} className="_dark_shape" />
      </div>
      <div className="_shape_two">
        <Image src={images.shape2} alt="" width={400} height={400} className="_shape_img" />
        <Image src={images.darkShape1} alt="" width={400} height={400} className="_dark_shape _dark_shape_opacity" />
      </div>
      <div className="_shape_three">
        <Image src={images.shape3} alt="" width={300} height={300} className="_shape_img" />
        <Image src={images.darkShape2} alt="" width={300} height={300} className="_dark_shape _dark_shape_opacity" />
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
