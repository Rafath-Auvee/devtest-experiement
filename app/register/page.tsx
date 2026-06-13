import AuthLayout from "@/components/auth/AuthLayout";
import AuthHero from "@/components/auth/AuthHero";
import RegisterForm from "@/components/auth/RegisterForm";
import { images } from "@/src/assets/images";

export default function RegisterPage() {
  return (
    <AuthLayout wrapperClass="_social_registration_wrapper">
      <AuthHero
        src={images.registrationHero}
        alt="Registration illustration"
        darkSrc={images.registrationHeroDark}
      />
      <RegisterForm />
    </AuthLayout>
  );
}
