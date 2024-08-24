import Input from "../components/Input";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import validator from "../utils/Validator";
import {useEffect, useState } from "react";
import Avatar from "../components/Avatar";
import Spinner from "../components/Spinner";
import { getState, updateState } from "../utils/state";
import AuthenticationModal from "../components/AuthenticationModal";

const Account = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarImageFile, setAvatarImageFile] = useState();
  const currentUser = JSON.parse(getState("currentUser"));
  const [isValid, setIsValid] = useState(true);

  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    avatar: currentUser.avatar
  });


  const [messages, setMessages] = useState({
    userNameMessage: "",
    emailMessage: "",
    passwordMessage: "",
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
        setIsValid(false);
        setMessages((preMessages) => {
          return { ...preMessages, userNameMessage:`* ${message} ....`}
        }); 
      } else {
        e.target.parentElement.classList.replace("border-danger", "border-primary");
        setIsValid(true);
        setMessages((preMessages) => {
          return { ...preMessages, userNameMessage: ""};
        });
      }
    }

    if (e.target.id === "email") {
      const { isValid, message } = validator.isValidEmail(e.target.value);
      if (!isValid) {
        e.target.parentElement.classList.replace("border-primary", "border-danger");
        setIsValid(false);
        setMessages((preMessages) => {
          return { ...preMessages, emailMessage:`* ${message} ....`}
        }); 
      } else {
        e.target.parentElement.classList.replace("border-danger", "border-primary");
        setIsValid(true);
        setMessages((preMessages) => {
          return { ...preMessages, emailMessage: ""};
        });
      }
    }


    if (e.target.id === "password") {
      const { isValid, message } = validator.isValidPassword(e.target.value);
      if (!isValid) {
        e.target.parentElement.classList.replace("border-primary", "border-danger");
        setIsValid(false);
        setMessages((preMessages) => {
          return { ...preMessages, passwordMessage:`* ${message} ....`}
        }); 
      } else {
        e.target.parentElement.classList.replace("border-danger", "border-primary");
        setIsValid(true);
        setMessages((preMessages) => {
          return { ...preMessages, passwordMessage: ""};
        });
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/user/${currentUser._id}`, {
        headers: {"Content-Type": "application/json"},
        method: "PATCH",
        body: JSON.stringify(formData)
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

      if (data.statusCode === 401) {
        setLoading(false);
        setMessages((preMessages) => {
          return { ...preMessages, avatarMessage: "Error: Please sign out and sign in again ...."};
        });
        return
      }

      if (data.statusCode === 404) {
        setLoading(false);
        setMessages((preMessages) => {
          return { ...preMessages, avatarMessage: "Error: Your account has already been deleted ...."};
        });
        return
      }
      
      if (data.success === true) {
        updateState("currentUser", data.data.user);
        setMessages((preMessages) => {
          return { ...preMessages, avatarMessage: "Your account has been successfully updated ...."}
        });
        setTimeout(() => {
          setMessages((preMessages) => {
            return { ...preMessages, avatarMessage: " "};
          });
          navigate("/account");
        }, 2500);
      }

      setLoading(false);
    } catch(err) {
      setLoading(false);
      console.error(err.message);
    }
  }

  const getAvatarImageFile = async (avatarImageFile) => {
    setAvatarImageFile(avatarImageFile);
  }

  useEffect(() => {
    if (avatarImageFile) {
      setFormData((preFormData) => {
        return { ...preFormData, avatar: URL.createObjectURL(avatarImageFile)};
      });
      if ((avatarImageFile.size / 1024) >2048) {
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

  const signOutHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/v1/auth/sign-out");
      if (res.status === 200) {
        updateState("currentUser", null);
        navigate("/sign-in");
      }
    } catch(err) {
      console.error(err.message);
    }
  }

  return (
    <div className="w-100 d-flex justify-content-center mt-5" >
      <form className="d-flex flex-column align-items-center gap-2" style={{width: "400px"}}>
        <h4 className="fw-bold fg-gray m-0">Account</h4>
        <Avatar 
          message={messages.avatarMessage} 
          getAvatarImageFile={getAvatarImageFile} 
          imgURL={formData.avatar || currentUser.avatar}
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
          value={formData.password || ""}
          type={"password"}
          placeholder={"Password ...."}
          iconSrc={["/images/icons/lock-icon.png", "/images/icons/eye-close-icon.png"]}
          onChangeHandler={onChangeHandler}
          message={messages.passwordMessage}
        />       

        <Button 
          type={"button"} 
          bgColor={"btn-success"} 
          handler={handleSubmit}
          disabled={loading || !isValid}
        >
          {loading ? "Loading ...." : "Update"}
        </Button>
        <button 
          type="button" 
          className="btn btn-danger fw-bold w-100 p-2" 
          data-bs-toggle="modal" 
          data-bs-target="#authentication-modal"
          disabled={loading}
        >
          Delete
        </button>  
        <AuthenticationModal/>      
        <Button 
          type={"button"} 
          bgColor={"btn-secondary"} 
          handler={signOutHandler}
          disabled={loading}
        >
          Sign Out
        </Button>
        <p className="fw-bold text-center">
          Go back to the
          <Link to="/home" className="text-decoration-none ms-1">Home Page</Link> <br />
        </p> 
      </form>
    </div>
  );
}

export default Account;