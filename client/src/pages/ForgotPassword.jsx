
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import validator from "../utils/Validator";
import { useState } from "react";

const ForgotPassword = () => {
  const [sendOTPLoading, setSendOTPLoading] = useState();
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [commonMessage, setCommonMessage] = useState("");
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: ""
  });

  const [messages, setMessages] = useState({
    emailMessage: "",
    otpMessage: "",
    newPasswordMessage: ""
  });

  const onChangeHandler = (e) => {
    setFormData((preFormData) => {
      return { ...preFormData, [e.target.id]: e.target.value};
    });
    validateInput(e);
  }

  const validateInput = (e) => {

    if (e.target.id === "email") {
      const { isValid, message } = validator.isValidEmail(e.target.value);
      if (!isValid) {
        e.target.parentElement.classList.replace("border-primary", "border-danger");
        setMessages((preMessages) => {
          return { ...preMessages, emailMessage:`* ${message} ....`}
        }); 
      } else {
        e.target.parentElement.classList.replace("border-danger", "border-primary");
        setMessages((preMessages) => {
          return { ...preMessages, emailMessage: ""};
        });
      }
    }

    if (e.target.id === "newPassword") {
      const { isValid, message } = validator.isValidPassword(e.target.value);
      if (!isValid) {
        e.target.parentElement.classList.replace("border-primary", "border-danger");
        setMessages((preMessages) => {
          return { ...preMessages, newPasswordMessage:`* ${message} ....`}
        }); 
      } else {
        e.target.parentElement.classList.replace("border-danger", "border-primary");
        setMessages((preMessages) => {
          return { ...preMessages, newPasswordMessage: ""};
        });
      }
    }


    if (e.target.id === "otp") {
      if (e.target.value.length < 6) {
        e.target.parentElement.classList.replace("border-primary", "border-danger");
        setMessages((preMessages) => {
          return { ...preMessages, otpMessage: "OTP must be 6 characters ...."};
        });
      } else {
        e.target.parentElement.classList.replace("border-danger", "border-primary");
        setMessages((preMessages) => {
          return { ...preMessages, otpMessage: ""};
        });
      }
    }

  }

  const sendOTP = async (e) => {
    e.preventDefault();
    if (validator.isValidEmail(formData.email).isValid) {
      try {
        setSendOTPLoading(true);
        const res = await fetch("http://localhost:3000/api/v1/auth/forgot-password", {
          headers: {"Content-Type": "application/json"},
          method: "POST",
          body: JSON.stringify({
            email: formData.email.trim()
          })
        });
        const data = await res.json();
        setSendOTPLoading(false);

        if (data.success === true) {
          setCommonMessage("Check your email. The OTP has been sent ....");
          setTimeout(() => setCommonMessage(""), 2500);
          setCount((count) => count + 1);
        }

        if (data.statusCode === 404) {
          document.getElementById("email").parentElement.classList.add("border-danger");
          setMessages((preMessages) => {
            return { ...preMessages, emailMessage: "* Email address does not exist. Please try another email ...."};
          });
        }

      } catch(err) {
        setSendOTPLoading(false);
        console.error(err.message);
      }
    }
  }

  
  const resetPassword = async () => {
    if (
      validator.isValidEmail(formData.email).isValid && 
      validator.isValidPassword(formData.newPassword).isValid &&
      formData.otp !== ""
    ) {
      try {
        setResetPasswordLoading(true);
        const res = await fetch("http://localhost:3000/api/v1/auth/reset-password", {
          headers: {"Content-Type": "application/json"},
          method: "POST",
          body: JSON.stringify({
            email: formData.email.trim(),
            newPassword: formData.newPassword.trim(),
            otp: formData.otp.trim()
          })
        });
        const data = await res.json();
        setResetPasswordLoading(false);
        
        if (data.success === false) {
          document.getElementById("otp").parentElement.classList.add("border-danger");
          setMessages((preMessages) => {
            return { ...preMessages, otpMessage: "Please enter a valid OTP ...."};
          });
        } else {
          document.getElementById("otp").parentElement.classList.remove("border-danger");
          setMessages((preMessages) => {
            return { ...preMessages, otpMessage: ""};
          });
        }

        if (data.success === true) {
          setCommonMessage("Password reset successfully ....");
          setTimeout(() => setCommonMessage(""), 2500);
        }
      } catch(err) {  
        setResetPasswordLoading(false);
        setMessages((preMessages) => {
          return { ...preMessages, otpMessage: err.message };
        });
      }
    }
  }

  return (
    <div className="w-100 d-flex justify-content-center mt-5" >
      <form className="d-flex flex-column align-items-center gap-2" style={{width: "400px"}}>
        <h5 className="fw-bold fg-gray">Reset Account Password</h5>
        <Input 
          id={"email"}
          value={formData.email}
          type={"text"}
          placeholder={"Email ...."}
          iconSrc={["/images/icons/email-icon.png"]}
          onChangeHandler={onChangeHandler}
          message={messages.emailMessage}
        />

        <Input 
          id={"newPassword"}
          value={formData.newPassword}
          type={"password"}
          placeholder={"New password ...."}
          iconSrc={["/images/icons/lock-icon.png", "/images/icons/eye-close-icon.png"]}
          onChangeHandler={onChangeHandler}
          message={messages.newPasswordMessage}
        /> 

        <div className="h-60 w-100 d-flex gap-2 justify-content-between align-items-start">
          <Input 
            id={"otp"}
            value={formData.otp}
            type={"text"}
            placeholder={"OTP ...."}
            iconSrc={["/images/icons/otp-icon.png"]}
            onChangeHandler={onChangeHandler}
            message={messages.otpMessage}
          /> 
          <button 
            className="w-100 border-none outline-none fw-bold text-white btn btn-success p-2" 
            type={"button"}
            onClick={sendOTP}
            disabled={sendOTPLoading || resetPasswordLoading}
          >
            {sendOTPLoading ? "Sending OTP ...." : (count > 0 ? "Resend OTP" : "Send OTP")}
          </button>
        </div>
        <Button 
          type={"button"} 
          bgColor={"btn-primary"} 
          handler={resetPassword}
          disabled={sendOTPLoading || resetPasswordLoading}
        >
          {resetPasswordLoading ? "Loading ...." : "Reset Password"}
        </Button>

        <Button 
          type={"button"} 
          bgColor={"btn-danger"} 
          disabled={sendOTPLoading || resetPasswordLoading}
          handler={() => navigate(-1)}
        >
          Go Back
        </Button>
        <p className="text-success fw-bold m-0">{commonMessage}</p>
      </form>
    </div>
  );
}

export default ForgotPassword;