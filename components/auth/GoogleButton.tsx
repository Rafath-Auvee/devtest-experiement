import { images } from "@/src/assets/images";

interface GoogleButtonProps {
  label: string;
  wrapperClass?: string;
}

export default function GoogleButton({
  label,
  wrapperClass = "_social_login_content_btn _mar_b40",
}: GoogleButtonProps) {
  return (
    <button type="button" className={wrapperClass}>
      <img src={images.google} alt="Google" className="_google_img" />
      <span>{label}</span>
    </button>
  );
}
