import React, { useState } from 'react'
import { Input, Button } from './index'
import { login as userLogin } from '../store/userSlice'
import { userService } from '../api/services/userService'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import bg from '../assets/bg.jpg'

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm()
  const [error, setError] = useState("")
const login = async (data) => {
  setError("");

  try {
    const res = await userService.login(data);

    if (!res.success) {
      setError(res.error || "Login failed");
      return;
    }

    const user = res.data?.user;

    if (!user) {
      setError("Invalid response from server");
      return;
    }

    dispatch(userLogin({ user }));
    navigate("/");

  } catch (error) {
    setError(error.message || "Login failed");
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

          <h2 className="text-center text-2xl font-bold">Sign in</h2>

          <p className="mt-2 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>

          {error && (
            <p className="text-red-600 mt-6 text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit(login)} className="mt-8">
            <div className="space-y-5">

              <Input
                label="Email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                })}
              />

              <Input
                label="Password"
                type="password"
                {...register("password", {
                  required: "Password is required"
                })}
              />

              <Button type="submit" className="w-full">
                Login
              </Button>

            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default Login