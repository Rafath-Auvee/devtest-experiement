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
          <Image src={src} alt={alt} width={700} height={520} className="_left_img" priority />
        </div>
        {darkSrc && (
          <div className="_social_registration_right_image_dark">
            <Image src={darkSrc} alt={alt} width={700} height={520} priority />
          </div>
        )}
      </div>
    </div>
  );
}
