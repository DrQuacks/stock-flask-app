import React from "react";
import useInput from '../hooks/useInput';
import sendToPython from "../helpers/sendToPython";

function NameForm({setInput}) {
  const { value:name, bind:bindName, reset:resetName } = useInput('');
  const { value:days, bind:bindDays, reset:resetDays } = useInput('');
  let data = []
  
  async function handleSubmit(evt){
      evt.preventDefault();
      data = sendToPython(name)
      console.log("data is: ",data)
      const resolvedData = await data
      console.log("resolvedData is: ",resolvedData)
      setInput(resolvedData)
      console.log('value is: ',name)
      alert(`Submitting Name ${name}`);
      resetName();
      resetDays()
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Stock Symbol:
        <input type="text" {...bindName} />
      </label>
      <label>
        Trailing Days:
        <input type="text" {...bindDays} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}

export default NameForm