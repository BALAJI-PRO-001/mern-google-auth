
export function toggleIcon(imgElement, oldPath, newPath) {
  if (imgElement === undefined || imgElement === null) {
    throw new Error("Given imgElement is null or undefined");
  }

  if (imgElement.src.match(oldPath)) 
    imgElement.src = newPath;
  else 
    imgElement.src = oldPath;
}


export function toggleType(element, oldType, newType) {
  if (element === undefined || element === null) {
    throw new Error("Give element is null or undefined");
  }

  if (element.type.match(oldType)) 
    element.type = newType;
  else
    element.type = oldType;
}


export function toggleBorder(e) {
  const inputContainer = e.target.parentElement;
  inputContainer.classList.toggle("border");
  inputContainer.classList.toggle("border-2");
  inputContainer.classList.toggle("border-primary");
}

