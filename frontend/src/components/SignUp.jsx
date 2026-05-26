import React, { useState } from "react";
import { Input, Button } from "./index";
import { login as userLogin } from "../store/userSlice";
import { userService } from "../api/services/userService";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import bg from "../assets/bg.jpg";

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

      const registerRes = await userService.register(formData);

      if (!registerRes.success) {
        setError(registerRes.error || "Registration failed");
        return;
      }

      const user = registerRes.data?.user;

      if (!user) {
        setError("Invalid registration response");
        return;
      }

      dispatch(userLogin({ user }));
      navigate("/");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err?.message || "Registration failed");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen w-full bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative w-full flex justify-center px-4">
        <div className="w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
          <h2 className="text-center text-2xl font-bold">
            Sign up to create account
          </h2>

          <p className="mt-2 text-center text-base text-black/60">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>

          {error && <p className="text-red-600 mt-6 text-center">{error}</p>}

          <form onSubmit={handleSubmit(signUp)} className="mt-8">
            <div className="space-y-5">
              <Input label="Full Name" {...register("fullName", { required: true })} />
              <Input label="Username" {...register("username", { required: true })} />
              <Input label="Email" type="email" {...register("email", { required: true })} />
              <Input label="Password" type="password" {...register("password", { required: true })} />
              <Input label="Avatar (optional)" type="file" {...register("avatar")} />

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;