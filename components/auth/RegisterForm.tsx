"use client";

import Link from "next/link";
import { images } from "@/src/assets/images";
import GoogleButton from "./GoogleButton";
import FormInput from "./FormInput";

const inputClasses = {
  label: "_social_registration_label _mar_b8",
  input: "form-control _social_registration_input",
  wrapper: "_social_registration_form_input _mar_b14",
};

export default function RegisterForm() {
  return (
    <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
      <div className="_social_registration_content">
        <div className="_social_registration_right_logo _mar_b28">
          <img src={images.logo} alt="Buddy Script" className="_right_logo" />
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

        <form className="_social_registration_form">
          <div className="row">
            <FormInput
              label="First Name"
              id="reg-firstName"
              type="text"
              name="firstName"
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
                  required
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
                >
                  Register now
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
