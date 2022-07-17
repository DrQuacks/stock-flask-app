import React from "react";
import useInput from '../hooks/useInput';
import sendToPython from "../sendToPython";

function NameForm(props) {
  const { value, bind, reset } = useInput('');
  
  const handleSubmit = (evt) => {
      evt.preventDefault();
      sendToPython(value)
      console.log('value is: ',value)
      alert(`Submitting Name ${value}`);
      reset();
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" {...bind} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}

export default NameForm