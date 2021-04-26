import { mount } from "enzyme"
import React from "react"
import { Field, Form, ListForm } from "rong-form"

describe("RForm.List", () => {
    it("basic", () => {
        const wrapper = mount(<Form>
            <ListForm name="list">
                {
                    (fields, { add, remove }) => {
                        return (
                        fields.map((field, index) => (
                            <Field {...field}>
                                <input />
                            </Field>
                        ))
                    )
                    }
                }
            </ListForm>
        </Form>)
        expect(wrapper.find('input').length).toEqual(1)
    })

    it("with initialValues", () => {
        const wrapper = mount(<Form >
        <ListForm name="a" initialValue={['1','2','3']}>
            {
                (fields, { add, remove }) => {
                    return <>{
                        fields.map((field, index) => {
                         
                            return <React.Fragment key={field.key}>
                                <Field {...field} >
                                    <input />
                                </Field>
                                <span onClick={() => remove(index)}>remove</span>
                                <br />
                                <br />
                            </React.Fragment>
                        })

                    }
                        <button onClick={() => add()}> add</button>
                    </>
                }
            }
        </ListForm>
    </Form>)
        wrapper.update()
        expect(wrapper.find('input').length).toEqual(2)
    })

    it("add operation", () => {
        const wrapper = mount(<Form>
            <ListForm name="list">
                {
                    (fields, { add, remove }) => (
                        <>
                            {
                                fields.map((field, index) => (
                                    <Field {...field}>
                                        <input />
                                    </Field>
                                ))
                            }
                            <button className="add-btn" onClick={() => add()}></button>
                        </>
                    )
                }
            </ListForm>
        </Form>)
        wrapper.find(".add-btn").simulate('click')
        expect(wrapper.find('input').length).toEqual(2)
    })

    it("remove operation", () => {
        const wrapper = mount(<Form>
            <ListForm name="a">
                {
                    (fields, { add, remove }) => (
                        <>
                            {
                                fields.map((field, index) => (
                                    <>
                                        <Field {...field}>
                                            <input />
                                        </Field>
                                        <button className="remove-btn" onClick={() => remove(index)}></button>
                                    </>
                                ))
                            }

                        </>
                    )
                }
            </ListForm>
        </Form>)
       
        wrapper.find('button').simulate('click')
        expect(wrapper.find('input').length).toEqual(0)
    })
})