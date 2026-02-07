import { signup } from "../services/authService";

const Signup = () => {

  const handleSignup = async () => {
    await signup(
      "janarthanan2626@gmail.com",
      "password123",
      "Janarthanan"
    );
    alert("User registered successfully");
  };

  return (
    <button onClick={handleSignup}>
      Sign Up
    </button>
  );
};

export default Signup;
