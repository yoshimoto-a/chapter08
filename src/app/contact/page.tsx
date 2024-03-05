"use client";

import { useContactForm } from "./_hooks/useContactForm";

const Contact: React.FC = () => {
  const {
    handleSubmit,
    onSubmit,
    resetForm,
    register,
    formState: { errors, isSubmitting },
  } = useContactForm();

  return (
    <div className="max-w-[800px] mx-auto py-10">
      <h1 className="text-xl font-bold mb-10">問合わせフォーム</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex justify-between items-center mb-6">
          <label htmlFor="name" className="w-[240px]">
            お名前
          </label>
          <div className="w-full">
            <input
              type="text"
              id="name"
              className="border border-gray-300 rounded-lg p-4 w-full"
              disabled={isSubmitting}
              {...register("name", {
                required: "お名前は必須です。",
                maxLength: {
                  value: 30,
                  message: "お名前は30文字以内で入力してください。",
                },
              })}
            ></input>
            <div>{errors.name?.message}</div>
          </div>
        </div>
        <div className="flex justify-between items-center mb-6">
          <label htmlFor="email" className="w-[240px]">
            メールアドレス
          </label>
          <div className="w-full">
            <input
              type="email"
              id="email"
              className="border border-gray-300 rounded-lg p-4 w-full"
              disabled={isSubmitting}
              {...register("email", {
                required: "メールアドレスは必須です。",
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: "メールアドレスの形式が不正です。",
                },
              })}
            ></input>
            <div>{errors.email?.message}</div>
          </div>
        </div>
        <div className="flex justify-between items-center mb-6">
          <label htmlFor="message" className="w-[240px]">
            本文
          </label>
          <div className="w-full">
            <textarea
              id="message"
              rows={8}
              className="w-full border border-gray-300 rounded-lg p-4"
              disabled={isSubmitting}
              {...register("message", {
                required: "本文は必須です。",
                maxLength: {
                  value: 500,
                  message: "本文は500文字以内で入力してください。",
                },
              })}
            ></textarea>
            <div>{errors.message?.message}</div>
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <button
            type="submit"
            className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg mr-4"
            disabled={isSubmitting}
          >
            送信
          </button>
          <button
            type="button"
            className="bg-gray-200 font-bold py-2 px-4 rounded-lg"
            disabled={isSubmitting}
            onClick={resetForm}
          >
            クリア
          </button>
        </div>
      </form>
    </div>
  );
};

export default Contact;