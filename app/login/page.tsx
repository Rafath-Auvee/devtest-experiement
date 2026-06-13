import AuthLayout from "@/components/auth/AuthLayout";
import AuthHero from "@/components/auth/AuthHero";
import LoginForm from "@/components/auth/LoginForm";
import { images } from "@/src/assets/images";

export default function LoginPage() {
  return (
    <AuthLayout wrapperClass="_social_login_wrapper">
      <AuthHero src={images.loginHero} alt="Login illustration" />
      <LoginForm />
    </AuthLayout>
  );
}
