"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { images } from "@/lib/assets/images";
import GoogleButton from "./GoogleButton";
import FormInput from "./FormInput";

interface LoginFields {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginForm() {
  const router = useRouter();
  const [fields, setFields] = useState<LoginFields>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!fields.email || !fields.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fields.email, password: fields.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "Login failed");
        return;
      }

      toast.success(`Welcome back, ${data.user.firstName}!`);
      router.push("/feed");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
      <div className="_social_login_content">
        <div className="_social_login_left_logo _mar_b28">
          <Image src={images.logo} alt="Buddy Script" width={150} height={48} className="_left_logo" priority />
        </div>

        <p className="_social_login_content_para _mar_b8">Welcome back</p>
        <h4 className="_social_login_content_title _titl4 _mar_b50">
          Login to your account
        </h4>

        <GoogleButton label="Or sign-in with google" />

        <div className="_social_login_content_bottom_txt _mar_b40">
          <span>Or</span>
        </div>

        <form className="_social_login_form" onSubmit={handleSubmit}>
          <div className="row">
            <FormInput
              label="Email"
              id="login-email"
              type="email"
              name="email"
              value={fields.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
            <FormInput
              label="Password"
              id="login-password"
              type="password"
              name="password"
              value={fields.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="row">
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
              <div className="form-check _social_login_form_check">
                <input
                  className="form-check-input _social_login_form_check_input"
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={fields.rememberMe}
                  onChange={handleChange}
                />
                <label
                  className="form-check-label _social_login_form_check_label"
                  htmlFor="rememberMe"
                >
                  Remember me
                </label>
              </div>
            </div>
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
              <div className="_social_login_form_left">
                <p className="_social_login_form_left_para">Forgot password?</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
              <div className="_social_login_form_btn _mar_t40 _mar_b60">
                <button
                  type="submit"
                  className="_social_login_form_btn_link _btn1"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login now"}
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="row">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_login_bottom_txt">
              <p className="_social_login_bottom_txt_para">
                Don&apos;t have an account?{" "}
                <Link href="/register">Create New Account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
