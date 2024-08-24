import { useRef } from "react";

const Avatar = (props) => {
  const inputRef = useRef();

  return (
    <div className="d-flex flex-column align-items-center">
      <input 
        type="file" 
        className="d-none" 
        ref={inputRef} onChange={(e) => props.getAvatarImageFile(e.target.files[0])}
        accept="image/*"
      />
      <div 
        className="avatar-img border border-1 rounded-circle" 
        style={{
          backgroundImage: `url(${props.imgURL})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat"
        }}
        onClick={() => inputRef.current.click()}
      >
      </div>
      <p 
        className={`m-0 mt-1 fw-bold ${props.message && props.message.includes("Error: ") ? "text-danger" : "text-success"}`} 
        style={{transition: "500ms"}}
      >
        {props.message && props.message.substring(props.message.indexOf(":") + 1)}
      </p>
    </div>
  );  
}

export default Avatar;