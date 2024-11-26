import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const SignUp = () => {
  const { createUser } = useContext(AuthContext);
  const navigate = useNavigate()
  // handleSignUp
  const handleSignUp = async (e) =>{
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value;
   try {
   let res = await createUser(email, password)
   console.log(res.user)
   if(res.user){
    navigate('/')
   }
   } catch (error) {
    console.log(error)
   }
  }
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-900 text-gray-100">
        <div className="mb-8 text-center">
          <h1 className="my-3 text-4xl font-bold">Sign Up</h1>
          <p className="text-sm text-gray-400">
            Sign Up to access More Features
          </p>
        </div>
        <form onSubmit={handleSignUp} className="space-y-12">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="leroy@jenkins.com"
                className="w-full px-3 py-2 border rounded-md border-gray-700 bg-gray-900 text-gray-100 focus:outline-none focus:border-green-900"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className="text-sm">
                  Password
                </label>
              </div>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="*****"
                className="w-full px-3 py-2 border rounded-md border-gray-700 bg-gray-900 text-gray-100 focus:outline-none focus:border-green-900"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <button
                type="submit"
                className="w-full px-8 py-3 font-semibold rounded-md bg-green-900 text-white"
              >
                Sign Up
              </button>
            </div>
            <p className="px-6 text-sm text-center text-gray-400">
              Already have an account? &nbsp;
              <Link
                rel="noopener noreferrer"
                to="/login"
                className="hover:underline text-green-900"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp
