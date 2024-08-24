import Input from "../components/Input";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import validator from "../utils/Validator";
import { useState } from "react";
import { stateNewState } from "../utils/state";

const AdminLogin = () => {
  const [loading, setLoading] = useState();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [messages, setMessages] = useState({
    emailMessage: "",
    passwordMessage: "",
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


    if (e.target.id === "password") {
      const { isValid, message } = validator.isValidPassword(e.target.value);
      if (!isValid) {
        e.target.parentElement.classList.replace("border-primary", "border-danger");
        setMessages((preMessages) => {
          return { ...preMessages, passwordMessage:`* ${message} ....`}
        }); 
      } else {
        e.target.parentElement.classList.replace("border-danger", "border-primary");
        setMessages((preMessages) => {
          return { ...preMessages, passwordMessage: ""};
        });
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
        
    const isValid = () => {
      const booleans = [];
      booleans.push(validator.isValidEmail(formData.email).isValid);
      booleans.push(validator.isValidPassword(formData.password).isValid);

      for (let boolean of booleans) {
        if (!boolean) return false;
      }
      return true;
    }

    if (isValid()) {
      try {
        setLoading(true);
        const res = await fetch("/api/v1/admin/login", {
          headers: {"Content-Type": "application/json"},
          method: "POST",
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          }),
          credentials: "include"
        });

        const data = await res.json();
        setLoading(false);
        
        if (data.statusCode === 404) {
          document.getElementById("email").parentElement.classList.add("border-danger");
          setMessages((preMessages) => {
            return { ...preMessages, emailMessage: "* Email address does not exist. Please try another email ...."}
          });
        }

        if (data.statusCode === 401) {
          document.getElementById("password").parentElement.classList.add("border-danger");
          setMessages((preMessages) => {
            return { ...preMessages, passwordMessage: "* Please enter a valid password for this account ...."};
          });
        }

        if (data.success === true) {
          stateNewState("admin", true);
          navigate("/admin/dashboard");
        }
      } catch(err) {
        console.error(err.message);
      }
    }
  }

  return (
    <div className="w-100 d-flex justify-content-center mt-5" >
      <form className="d-flex flex-column align-items-center gap-2" style={{width: "400px"}}>
        <h3 className="fw-bold text-secondary">Admin Login</h3>
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
          id={"password"}
          value={formData.password}
          type={"password"}
          placeholder={"Password ...."}
          iconSrc={["/images/icons/lock-icon.png", "/images/icons/eye-close-icon.png"]}
          onChangeHandler={onChangeHandler}
          message={messages.passwordMessage}
        />       

        <Button 
          type={"button"} 
          bgColor={"btn-primary"} 
          handler={handleSubmit}
          disabled={loading}
        >
          {loading ? "Loading ...." : "Login"}
        </Button>

        <p className="fw-bold text-center">
          Go back to the 
          <Link to="/home" className="text-decoration-none ms-1">Home Page</Link> <br />
        </p>   
      </form>
    </div>
  );
}

export default AdminLogin;