import { useRef } from "react";
import { toggleIcon, toggleType, toggleBorder } from "../utils/userInteraction";

const Input = (props) => {
  const inputRef = useRef();

  return (
    <div className="position-relative w-100 h-60">
      <div className="d-flex align-items-center gap-1 custom-border bg-l-g rounded">
        <img src={props.iconSrc[0]} alt="icon" className="icon ms-2" />
        <input
          id={props.id}
          value={props.value}
          type={props.type}
          ref={inputRef}
          placeholder={props.placeholder}
          className="w-100 p-2 rounded outline-none fw-bold border-none bg-transparent"
          onFocus={toggleBorder}
          onBlur={toggleBorder}
          onChange={props.onChangeHandler}
        />
        {
          props.iconSrc[1] && <img 
            src={props.iconSrc[1]} 
            alt="icon" 
            className="icon me-4"
            onClick={(e) => {
              toggleIcon(
                e.target, 
                "/images/icons/eye-close-icon.png",
                "/images/icons/eye-open-icon.png"
              );
              toggleType(inputRef.current, "password", "text");
            }}
          />
        }
      </div>
      <p className="m-0 text-danger fw-bold position-absolute" style={{bottom: "-3px", fontSize: "14px"}}>{props.message}</p>
    </div>
  );
}

export default Input;
