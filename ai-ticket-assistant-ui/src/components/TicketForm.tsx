import { useState, type ChangeEvent, type ChangeEventHandler, type FormEvent, type FormEventHandler } from "react";
import { useNavigate } from "react-router-dom";

function TicketForm() {
  const [form, setForm] = useState({ title: '', description: '' })
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit: FormEventHandler = async (e: FormEvent) => {
    e.preventDefault();

    const { title, description } = form;

    if (!title || !description) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ticket`, {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description
        })
      });

      if (response.ok) {
        setForm({ title: '', description: '' });
        navigate("/");
      } else {
        setError("Something error occurred. Please try again.");
      }
    } catch (error) {
      console.error("❌ Ticket creation failed", error);
      setError("Ticket creation failed");
    }
  };

  const handleChange: ChangeEventHandler = (event: ChangeEvent<HTMLFormElement>) => {
    setForm(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }))
  };

  const closeForm = () => {
    setForm({ title: '', description: '' });
    navigate("/");
  };

  return (
    <div className="max-w-11/12 px-3 mx-auto mt-3 flex flex-col">
      <button
        className="btn btn-circle btn-neutral bg-white border-0 shadow-none"
        onClick={closeForm}
      >
        <img src="/public/back-arrow.png" />
      </button>
      <form
        className="flex flex-col gap-3 mx-auto mt-5 w-full"
        onSubmit={handleSubmit}
      >
        <p className="text-2xl">Ticket Details</p>
        <label className="input w-full">
          <input
            type="title"
            className="grow"
            placeholder="Ticket title"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
        </label>
        <textarea
          className="textarea w-full"
          placeholder="Ticket description..."
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        <button className="btn btn-primary">Submit</button>
        {error && <span className="text-error">{error}</span>}
      </form>
    </div>
  );
}

export default TicketForm;