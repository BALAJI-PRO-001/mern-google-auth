
const Button = (props) => {
  return (
    <button
      type={props.type}
      className={`btn ${props.bgColor} w-100 text-white fw-bold p-2 rounded`}
      onClick={props.handler}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}

export default Button;