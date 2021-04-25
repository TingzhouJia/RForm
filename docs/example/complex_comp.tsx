import { Field, Form } from "rong-form"
import { useState } from "react"

interface IValue {
    checked?:boolean
    input?:string
}

interface IComponent {
    value?:IValue,
    onChange?:(value:IValue)=>void
}

const MultipleComponent:React.FC<IComponent>=({value,onChange})=>{
    const [checked, setchecked] = useState(false)
    const [input, setinput] = useState('')
    const changeCheckbox=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const val=e.target.checked
        setchecked(val)
        triggr({checked:val})
    }
    const triggr=(changed:IValue)=>{
        onChange&&onChange({checked,input,...value,...changed})
    }
    const changeInput=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const val=e.target.value
        setinput(val)
        triggr({input:val})
    }
    return <span>
       <div>
       <input type="checkbox" checked={checked||value?.checked} onChange={changeCheckbox} />
       </div>
        <input value={value?.input||input} onChange={changeInput} />
    </span>
}

export default ()=>{
    return <Form onValuesChange={e=>console.log(e)}>
        <Field name="multi">
            <MultipleComponent/>
        </Field>
    </Form>
}