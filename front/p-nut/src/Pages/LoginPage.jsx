import LoginSignupForm from "../Components/LoginSignupForm";
import LoginForm from "../Components/LoginForm";

const LoginPage = () => {
  const phrase = "아직 회원이 아니신가요?";
  const direction = "지금 가입하세요!";
  const currentPage = "login";

  return (
    <div className="w-full h-screen bg-stone-100 flex justify-center place-items-center">
      <LoginSignupForm
        phrase={phrase}
        direction={direction}
        currentPage={currentPage}
      >
        <LoginForm />
      </LoginSignupForm>
    </div>
  );
};

export default LoginPage;
