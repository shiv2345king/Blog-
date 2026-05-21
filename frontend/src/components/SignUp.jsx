import React, { useState } from "react";
import { Input, Button } from "./index";
import { login as userLogin } from "../store/userSlice";
import { userService } from "../api/services/userService";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

const signUp = async (data) => {
  setError("");

  try {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("username", data.username);
    formData.append("password", data.password);

    if (data.avatar?.[0]) {
      formData.append("avatar", data.avatar[0]);
    }

    // 🔹 Step 1: Register
    await userService.register(formData);

    // 🔹 Step 2: Login immediately
    const loginRes = await userService.login({
      email: data.email,
      password: data.password,
    });

    // 🔹 Step 3: Store token
    localStorage.setItem("accessToken", loginRes.accessToken);

    // 🔹 Step 4: Set Redux user
    dispatch(userLogin({
      user: loginRes.user
    }));

    navigate("/");

  } catch (error) {
    setError(error.message || "Something went wrong");
  }
};

  return (
    <div className="flex items-center justify-center w-full">
      <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">

        <h2 className="text-center text-2xl font-bold">
          Sign up to create account
        </h2>

        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>

        {error && (
          <p className="text-red-600 mt-6 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit(signUp)} className="mt-8">
          <div className="space-y-5">

            <Input
              label="Full Name:"
              {...register("fullName", { required: "Full name required" })}
            />

            {/* ✅ ADD USERNAME FIELD */}
            <Input
              label="Username:"
              {...register("username", { required: "Username required" })}
            />

            <Input
              label="Email:"
              type="email"
              {...register("email", {
                required: "Email required",
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Invalid email",
                },
              })}
            />

            <Input
              label="Password:"
              type="password"
              {...register("password", { required: "Password required" })}
            />

            <Input
              label="Avatar (optional):"
              type="file"
              accept="image/png, image/jpeg"
              {...register("avatar")}
            />

            <Button type="submit" className="w-full">
              Create Account
            </Button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;