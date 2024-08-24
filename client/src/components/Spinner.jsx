
const Spinner = (props) => {
  return (
    <div className="d-flex gap-2 justify-content-center align-content-center">
      <p className={`fw-bold ${props.labelCss}`}>{props.children}</p>
      <div className={`spinner-border ${props.spinnerCss}`} role="status" style={{height: props.spinnerHeight, width: props.spinnerWidth}}></div>
    </div>
  );
}

export default Spinner; 