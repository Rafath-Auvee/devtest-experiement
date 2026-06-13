import Image from "next/image";

interface AuthHeroProps {
  src: string;
  alt: string;
  darkSrc?: string;
}

export default function AuthHero({ src, alt, darkSrc }: AuthHeroProps) {
  return (
    <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
      <div className="_social_login_left">
        <div className="_social_login_left_image">
          <img src={src} alt={alt} className="_left_img" />
        </div>
        {darkSrc && (
          <div className="_social_registration_right_image_dark">
            <img src={darkSrc} alt={alt} />
          </div>
        )}
      </div>
    </div>
  );
}
