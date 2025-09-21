"use client";
import { useRegisterUser } from "@/lib/query/hooks";
import { registerSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import z from "zod";

export default function RegisterForm() {
  const createUserMutation = useRegisterUser();
  type RegisterUserFormFields = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUserFormFields>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegisterFormSubmit: SubmitHandler<
    RegisterUserFormFields
  > = async (data) => {
    try {
      createUserMutation.mutate(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleRegisterFormSubmit)}>
      <div>
        <label htmlFor="firstname">Firstname: </label>
        <input
          type="text"
          {...register("firstname")}
          name="firstname"
          placeholder="Enter first name"
        />
        {errors.firstname && (
          <span className="text-red-500">{errors.firstname.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="lastname">Lastname: </label>
        <input
          type="text"
          {...register("lastname")}
          name="lastname"
          placeholder="Enter last name"
        />
        {errors.lastname && (
          <span className="text-red-500">{errors.lastname.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="email">Email: </label>
        <input
          type="email"
          {...register("email")}
          name="email"
          placeholder="Enter your email"
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          {...register("password")}
          name="password"
          placeholder="Enter your password"
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </div>

      <button type="submit" disabled={createUserMutation.isPending}>
        {createUserMutation.isPending ? "Creating..." : "Create Account"}
      </button>
    </form>
  );
}
