import Input from "../components/Input";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import validator from "../utils/Validator";
import {useEffect, useState } from "react";
import OAuthGoogle from "../components/OAuthGoogle";
import Avatar from "../components/Avatar";
import Spinner from "../components/Spinner";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarImageURL, setAvatarImageURL] = useState("/images/default-avatar-img.png");
  const [avatarImageFile, setAvatarImageFile] = useState();


  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: "/images/default-avatar-img.png"
  });

  const [messages, setMessages] = useState({
    userNameMessage: "",
    emailMessage: "",
    passwordMessage: "",
    confirmPasswordMessage: "",
    avatarMessage: ""
  });

  const onChangeHandler = (e) => {
    setFormData((preFormData) => {
      return { ...preFormData, [e.target.id]: e.target.value };
    });
    validateInput(e);
  }


  const validateInput = (e) => {

    if (e.target.id === "username") {
      const { isValid, message } = validator.isValidName(e.target.value);
      if (!isValid) {
        e.target.parentElement.classList.replace("border-primary", "border-danger");
        setMessages((preMessages) => {
          return { ...preMessages, userNameMessage:`* ${message} ....`}
        }); 
      } else {
        e.target.parentElement.classList.replace("border-danger", "border-primary");
        setMessages((preMessages) => {
          return { ...preMessages, userNameMessage: ""};
        });
      }
    }

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

    if (e.target.id === "confirmPassword") {
      const { isValid, message } = validator.isValidConfirmPassword(formData.password, e.target.value);
      if (!isValid) {
        e.target.parentElement.classList.replace("border-primary", "border-danger");
        setMessages((preMessages) => {
          return { ...preMessages, confirmPasswordMessage:`* ${message} ....`}
        }); 
      } else {
        e.target.parentElement.classList.replace("border-danger", "border-primary");
        setMessages((preMessages) => {
          return { ...preMessages, confirmPasswordMessage: ""};
        });
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = () => {
      const booleans = [];
      booleans.push(validator.isValidName(formData.username).isValid);
      booleans.push(validator.isValidEmail(formData.email).isValid);
      booleans.push(validator.isValidPassword(formData.password).isValid);
      booleans.push(validator.isValidConfirmPassword(formData.password, formData.confirmPassword).isValid);
      return booleans.every((boolean) => boolean);
    }

    if (isValid()) {
      try {
        setLoading(true);
        const res = await fetch("/api/v1/auth/sign-up", {
          headers: {"Content-Type": "application/json"},
          method: "POST",
          body: JSON.stringify({
            username: formData.username.trim(),
            email: formData.email.trim(),
            password: formData.password.trim(),
            avatar: formData.avatar
          })
        });
        const data = await res.json();   

        if (data.statusCode === 409) {
          setLoading(false);
          document.getElementById("email").parentElement.classList.add("border-danger");
          setMessages((preMessages) => {
            return {...preMessages, emailMessage: "* Email is already in use. Please try another email ...."};
          });
          return;
        }
        
        if (data.success === true) {
          setLoading(false);
          navigate("/sign-in");
        }

        setLoading(false);
      } catch(err) {
        setLoading(false);
        console.error(err.message);
      }
    }
  }

  const getAvatarImageFile = async (avatarImageFile) => {
    setAvatarImageFile(avatarImageFile);
  }

  useEffect(() => {
    if (avatarImageFile) {
      setAvatarImageURL(URL.createObjectURL(avatarImageFile));
      if ((avatarImageFile.size / 1024) > 2048) {
        setMessages((preMessages) => {
          return { ...preMessages, avatarMessage: "Error: The image must be less than 2MB!"};
        });
      } else {
        setMessages((preMessages) => {
          return { ...preMessages, avatarMessage: ""};
        });
      }
    }
  }, [avatarImageFile]);


  const uploadAvatar = async () => {
    try {
      const formData = new FormData();
      formData.append("avatar", avatarImageFile);
      setIsUploading(true);
      const res = await fetch("/api/v1/user/upload/avatar", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setIsUploading(false);
      if (data.file.downloadURL) {
        setMessages((preMessages) => {
          return { ...preMessages, avatarMessage: "Image upload successfully!" };
        });
        setFormData((preFormData) => {
          return { ...preFormData, avatar: data.file.downloadURL };
        });
      }
    } catch(err) {
      setIsUploading(false);
      setMessages((preMessages) => {
        return { ...preMessages, avatarMessage: `Error: ${err.message}`};
      });
    }
  }

  return (
    <div className="w-100 d-flex justify-content-center mt-5" >
      <form className="d-flex flex-column align-items-center gap-2" style={{width: "400px"}}>
        <h4 className="fw-bold fg-gray">Sign Up</h4>
        <Avatar 
          message={messages.avatarMessage} 
          getAvatarImageFile={getAvatarImageFile} 
          imgURL={avatarImageURL}
        />
        { avatarImageFile && messages.avatarMessage === "" && !isUploading && (
            <div className="border border-3 mb-1 d-flex align-items-center px-1 py-1 rounded">
              <img src="/images/icons/up-arrow-icon.png" alt="icon" className="icon" />
              <button type="button" className="bg-transparent border-0 h-100 text-black fw-bold" onClick={uploadAvatar}>Upload Image</button>
            </div>
          )
        }
        { 
          avatarImageFile && isUploading && (
            <Spinner
              labelCss={"text-success"} 
              spinnerCss={"text-success"} 
              spinnerHeight={"25px"}
              spinnerWidth={"25px"}
            >
              Uploading
            </Spinner>
          )
        }
        <Input 
          id={"username"}
          value={formData.username}
          type={"text"}
          placeholder={"Username ...."}
          iconSrc={["/images/icons/user-icon.png"]}
          onChangeHandler={onChangeHandler}
          message={messages.userNameMessage}
        />
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
        <Input 
          id={"confirmPassword"}
          value={formData.confirmPassword}
          type={"password"}
          placeholder={"Confirm password ...."}
          iconSrc={["/images/icons/lock-icon.png", "/images/icons/eye-close-icon.png"]}
          onChangeHandler={onChangeHandler}
          message={messages.confirmPasswordMessage}
        />

        <Button 
          type={"button"} 
          bgColor={"btn-primary"} 
          handler={handleSubmit}
          disabled={loading}
        >
          {loading ? "Loading ...." : "Sign up"}
        </Button>

        <OAuthGoogle />

        <p className="fw-bold">
          Have an account?
          <Link to="/sign-in" className="text-decoration-none ms-1">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;