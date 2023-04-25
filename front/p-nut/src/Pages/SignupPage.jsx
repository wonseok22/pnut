import LoginSignupForm from "../Components/LoginSignupForm";
import SignupForm from "../Components/SignupForm";

const SignupPage = () => {
  const phrase = "계정이 있으신가요?";
  const direction = "로그인하러 가기!";
  const currentPage = "signup";

  return (
    <div className="w-full h-screen bg-stone-100 flex justify-center place-items-center">
      <div className="place-content-center">
        <LoginSignupForm
          phrase={phrase}
          direction={direction}
          currentPage={currentPage}
        >
          <SignupForm />
        </LoginSignupForm>
      </div>
    </div>
  );
};

export default SignupPage;
