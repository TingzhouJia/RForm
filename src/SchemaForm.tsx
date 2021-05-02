
import React, { Component, useRef } from "react";
import Form from './Form'
import Field from './Field'
import ListForm from './ListForm'
import { IFormInstance } from "./Form";
import { FormStore } from "./formType";
import { IFieldStore, Meta, RuleObject, SchemaField, SchemaType } from "./interface";

export interface ISchemaFormProps {
    schema: SchemaType
    actions?: { [name: string]: ((controls: any, meta: Meta, dependencies: { [name: string]: IFieldStore }, component: Component) => React.ReactNode) }
    widget: { [name: string]: ((props: SchemaField) => Component) }
}


const GenRules = (rules?: RuleObject, required?: boolean, type?: any, compType?: any) => {
    if (['string', 'number', 'boolean', 'array'].includes(type)) {
        rules.type = type

    }
    if (['email', 'url', 'date'].includes(compType)) {
        rules.type = compType
    }

    rules.required = required || false
    return rules
}


const renderSelect = (selectNames?: string[], selectValues?: string[], defaultValue?: string[], multiple?: boolean) => {
    return <select multiple={!!multiple} defaultValue={defaultValue} >
        {
            selectValues.map((options, index) => {
                return <option value={options}>
                    {selectNames[index] || ""}
                </option>
            })
        }
    </select>
}

const renderInput = (type: string, defaultValue?: any, accept?: string, min?: number, max?: number, step?: number) => {
    return <input type={type} defaultValue={defaultValue} accept={accept}
        checked={defaultValue} min={min} max={max} step={step} />
}




const SchemaForm = React.forwardRef<IFormInstance, ISchemaFormProps>(({ schema, widget, actions }, ref) => {

    
    const formRef = useRef<HTMLFormElement>()


    const GetCustomized = (config: SchemaField) => {
        const customizedName = config.widget
        if (widget) {
            const rendered = widget[customizedName]
            return rendered(config)
        }

        return

    }

    const getbasicComponent = (config: SchemaField) => {
        const type = config.componentprops.name
        const componentTyep = config.componentprops.type
        const { optionNames, optionValues, defaultValue, multiple } = config.componentprops.select
        const basis = type === 'input' ? renderInput(componentTyep, config?.defaultValues,
            config?.componentprops?.file?.accept,
            config?.componentprops?.range?.min, config?.componentprops?.range?.max, config?.componentprops?.range?.step) :
            renderSelect(optionNames, optionValues, defaultValue, multiple)
        return basis
    }

    // get the component that should be rendered
    const renderComponent = (config: SchemaField) => {
        let renderedComponent
        renderedComponent = GetCustomized(config)
        if (!renderedComponent) {
            renderedComponent = getbasicComponent(config)
        }
        return renderedComponent
    }

    const getListChildren = (name:string,children: { [name: string]: SchemaField }) => {
        return Object.keys(children).map(item => {
            let config = children[item]
            const child=renderComponent(config)
            
            return (
                <Field isListField name={[name,config.name]}>
                    {
                        (control,meta,)=>{
                            let newEle=React.cloneElement(child,control)
                            return newEle
                        }
                    }
                </Field>
            )
        })
    }

    

    const GenForm = () => {

        const children = schema.properties

        return Object.keys(children).map(name => {
            const config = children[name]


            //register an list form
            if (config.type === 'list') {

                return <ListForm name={config.name}>
                    {
                        (fields, {add,remove }) => {
                            return (fields.map((field, index) => {
                                return <React.Fragment key={field.key}>
                                    {getListChildren(field.name,config.listChildren).map(item=>item)}
                                </React.Fragment>
                            }))
                        }
                    }
                </ListForm>
            } else {
                const renderedComponent=renderComponent(config)
                const action = actions[config.actions]
                if (action) {
                    return <Field name={config.name} dependencies={config.dependencies}>
                        {
                            (control, meta, dependencies) => {
                                return action(control, meta, dependencies, renderedComponent)
                            }
                        }
                    </Field>
                }

                return <Field name={config.name} >
                    {
                        (control, meta, dependencies) => {
                            const newElement = React.cloneElement(renderedComponent, control)
                            return (<div>
                                <label>{config.title}</label>
                                <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
                                    {newElement}
                                    {meta.errors.map(item => {
                                        return <span color="red">{item}</span>
                                    })}
                                </div>
                            </div>)
                        }
                    }
                </Field>
            }

        })

    }

    return <Form name={schema.name}>
        {GenForm().map(item=>item)}
    </Form>
})