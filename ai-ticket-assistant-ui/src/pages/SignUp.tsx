import { useState, type ChangeEvent, type ChangeEventHandler, type FormEventHandler } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleChange: ChangeEventHandler = (event: ChangeEvent<HTMLFormElement>) => {
    setForm(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }))
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    const { email, password, confirmPassword } = form;

    e.preventDefault();

    if (email === '' || password === '' || confirmPassword === '') return;

    if (password !== confirmPassword) {
      setError("Password mismatch.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (response.ok) {
        setForm({ email: "", password: "", confirmPassword: "" });
        setError("");
        navigate("/");
      } else {
        setError("Sign up failed. Please try again in sometime");
      }
    } catch (error) {
      console.error("❌ Sign up failed", error);
      setError("Sign up failed");
    }
  };

  return (
    <div className="flex flex-col gap-3 max-w-sm mx-auto mt-10">
      <form
        className="flex flex-col gap-3 w-full mx-auto"
        onSubmit={handleSubmit}
      >
        <p className="text-2xl">Sign Up</p>
        <label className="input w-full">
          <input
            type="email"
            className="grow"
            placeholder="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </label>
        <label className="input w-full">
          <input
            type="password"
            className="grow"
            placeholder="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </label>
        <label className="input w-full">
          <input
            type="password"
            className="grow"
            placeholder="confirmPassword"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </label>
        <button className="btn btn-primary">Sign Up</button>
        {error && <span className="text-error">{error}</span>}
      </form>
      <span className="text-primary">Existing user? <Link to="/login" className="link-hover font-bold text-sm ">Log In</Link></span>
    </div>
  );
}

export default Signup;