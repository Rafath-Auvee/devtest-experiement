"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { images } from "@/lib/assets/images";
import GoogleButton from "./GoogleButton";
import FormInput from "./FormInput";

interface RegisterFields {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agreeTerms: boolean;
}

const inputClasses = {
  label: "_social_registration_label _mar_b8",
  input: "form-control _social_registration_input",
  wrapper: "_social_registration_form_input _mar_b14",
};

export default function RegisterForm() {
  const [fields, setFields] = useState<RegisterFields>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agreeTerms: false,
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

    if (!fields.firstName || !fields.lastName || !fields.email || !fields.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (fields.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (!fields.agreeTerms) {
      toast("You must agree to the terms & conditions", { icon: "⚠️" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: fields.firstName,
          lastName: fields.lastName,
          email: fields.email,
          password: fields.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "Registration failed");
        return;
      }

      toast.success("Account created! Welcome aboard 🎉");
      window.location.href = "/feed";
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
      <div className="_social_registration_content">
        <div className="_social_registration_right_logo _mar_b28">
          <Image src={images.logo} alt="Buddy Script" width={150} height={48} className="_right_logo" priority />
        </div>

        <p className="_social_registration_content_para _mar_b8">Get Started Now</p>
        <h4 className="_social_registration_content_title _titl4 _mar_b50">
          Registration
        </h4>

        <GoogleButton
          label="Register with google"
          wrapperClass="_social_registration_content_btn _mar_b40"
        />

        <div className="_social_registration_content_bottom_txt _mar_b40">
          <span>Or</span>
        </div>

        <form className="_social_registration_form" onSubmit={handleSubmit}>
          <div className="row">
            <FormInput
              label="First Name"
              id="reg-firstName"
              type="text"
              name="firstName"
              value={fields.firstName}
              onChange={handleChange}
              autoComplete="given-name"
              required
              labelClass={inputClasses.label}
              inputClass={inputClasses.input}
              wrapperClass={inputClasses.wrapper}
            />
            <FormInput
              label="Last Name"
              id="reg-lastName"
              type="text"
              name="lastName"
              value={fields.lastName}
              onChange={handleChange}
              autoComplete="family-name"
              required
              labelClass={inputClasses.label}
              inputClass={inputClasses.input}
              wrapperClass={inputClasses.wrapper}
            />
            <FormInput
              label="Email"
              id="reg-email"
              type="email"
              name="email"
              value={fields.email}
              onChange={handleChange}
              autoComplete="email"
              required
              labelClass={inputClasses.label}
              inputClass={inputClasses.input}
              wrapperClass={inputClasses.wrapper}
            />
            <FormInput
              label="Password"
              id="reg-password"
              type="password"
              name="password"
              value={fields.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
              labelClass={inputClasses.label}
              inputClass={inputClasses.input}
              wrapperClass={inputClasses.wrapper}
            />
          </div>

          <div className="row">
            <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
              <div className="form-check _social_registration_form_check">
                <input
                  className="form-check-input _social_registration_form_check_input"
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={fields.agreeTerms}
                  onChange={handleChange}
                />
                <label
                  className="form-check-label _social_registration_form_check_label"
                  htmlFor="agreeTerms"
                >
                  I agree to terms &amp; conditions
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
              <div className="_social_registration_form_btn _mar_t40 _mar_b60">
                <button
                  type="submit"
                  className="_social_registration_form_btn_link _btn1"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Register now"}
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="row">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_registration_bottom_txt">
              <p className="_social_registration_bottom_txt_para">
                Already have an account?{" "}
                <Link href="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
