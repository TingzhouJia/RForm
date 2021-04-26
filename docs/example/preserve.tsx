import { Field, Form } from "rong-form"

export default ()=>{
    return <Form>
        <Field name="a" defaultValue="rong" preserve={true}>
            <input/>
        </Field>
        <button type="reset">Reset</button>
    </Form>
}