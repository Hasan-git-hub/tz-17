import { useState } from "react";

const overlayClassName =
  "fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-[4px]";
const cardClassName =
  "relative w-full max-w-xl overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-[0_24px_60px_rgba(24,24,27,0.12)]";
const labelClassName = "flex flex-col gap-2";
const baseFieldClassName =
  "w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-800 shadow-sm outline-none transition placeholder:text-zinc-400 focus:-translate-y-0.5 focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-200";
const cancelButtonClassName =
  "h-11 flex-1 rounded-2xl border border-zinc-300 bg-white font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60";
const closeButtonClassName =
  "absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60";
const submitButtonClassName =
  "h-11 flex-1 rounded-2xl border border-zinc-900 bg-zinc-900 font-semibold text-white shadow-md transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70";

const UserFormModal = ({
  title,
  description,
  submitLabel,
  initialValues,
  onSubmit,
  onClose,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [formError, setFormError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formError) {
      setFormError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedData = {
      name: formData.name.trim(),
      username: formData.username.trim(),
      email: formData.email.trim(),
    };

    const hasEmptyField = Object.values(normalizedData).some((value) => !value);

    if (hasEmptyField) {
      setFormError("Iltimos, barcha maydonlarni to'ldiring.");
      return;
    }

    await onSubmit(normalizedData);
  };

  return (
    <div
      className={overlayClassName}
      onClick={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <form
        onSubmit={handleSubmit}
        className={cardClassName}
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-form-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          className={closeButtonClassName}
          disabled={isSubmitting}
          aria-label="Close modal"
        >
          x
        </button>

        <div className="flex flex-col gap-5 px-6 py-6 sm:px-7">
          <div className="pr-12">
            <h2
              id="user-form-modal-title"
              className="text-2xl font-black text-zinc-950"
            >
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              {description}
            </p>
          </div>

          <label className={labelClassName}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              autoComplete="name"
              required
              className={baseFieldClassName}
            />
          </label>

          <label className={labelClassName}>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="username"
              autoComplete="username"
              required
              className={baseFieldClassName}
            />
          </label>

          <label className={labelClassName}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email"
              autoComplete="email"
              required
              className={baseFieldClassName}
            />
          </label>

          {formError && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {formError}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 bg-zinc-50 px-6 py-5 sm:flex-row sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className={cancelButtonClassName}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={submitButtonClassName}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserFormModal;
