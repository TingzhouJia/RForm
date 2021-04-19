import { toJS } from "mobx";
import { addMiddleware, getSnapshot, Instance, TypeOfValue, types } from "mobx-state-tree";
import React, { useEffect, useImperativeHandle, useRef } from "react";
import { Provider } from "./context";

import { FieldStore } from "./Field";
import { FormStore } from "./formType";
import { Callbacks, FieldError, Rule, ValidateMessages, ValidateTriggerType } from "./interface";



export interface FormInstance {
    getFieldValue: (name: string) => string
    getFieldsValue: () => { [name: string]: any }
    getFieldError: (name: string) => string[]
    getFieldsError: () => FieldError[]
    isFieldValidating: (name: string) => boolean
    submit: () => void
}

export interface IFormProps {
    initialValues?: { [name: string]: any },
    children?: React.ReactNode | ((form: FormInstance) => React.ReactNode),
    component?: false | string | React.FC<any>,
    name?: string
    onValuesChange?: Callbacks<any>['onValuesChange']
    onFieldsChange?: Callbacks<any>['onFieldsChange']
    onFinish?: Callbacks<any>['onFinish']
    validateMessages?: ValidateMessages
    validateTrigger?: ValidateTriggerType[]
}
const formState = FormStore.create({ fields: {} },)
const Form = React.forwardRef<FormInstance, IFormProps>(({
    children,
    component: Component = "form" as any,
    onFinish,
    onValuesChange,
    validateMessages,
    validateTrigger = [],
    initialValues
}, ref) => {

    const formRef = useRef<HTMLFormElement>()

    useImperativeHandle(
        ref,
        () => ({
            getFieldValue(name: string) {
                return formState.getFieldValue(name)
            },
            getFieldsValue() {
                return getSnapshot(formState, true)
            },
            getFieldError(name: string) {
                return formState.getFieldError(name)
            },
            getFieldsError() {
                return formState.getFieldsError()
            },
            isFieldValidating(name: string) {
                return formState.isFieldValidating(name)
            },
            submit() {
                formRef.current.submit()
            }
        }),
        [],
    )

    const getValues = (args) => {
        return formState.getFieldKeys(args[0], args[1])
    }
    // const getValueFromlist(args)=>{
    //     return formState.getListValues(args[0],)
    // }
    const disposer = (baseStore) => {
        if (onValuesChange) {
            addMiddleware(baseStore, (call, next, abort) => {
                if (call.name === "setField") {
                    const args = call.args
                    onValuesChange({ [args[0]]: args[1] }, getValues(args))
                } else if (call.name === "changeListValue") {
                    const args = call.args
                    const name = args[0]
                    const value = args[1]["value"]
                    if (name.length === 1) {
                        //  onValuesChange(value,getValueFromlist())
                    }
                }
                return next(call)
            })
        }
        return baseStore
    }

    const init=()=>{
        if(initialValues){
            formState.initForm(initialValues)
        }
    }

    useEffect(() => {
        init()
        return () => {
            
        }
    }, [])

    const wrapperNode = (
        <Provider value={{ store: disposer(formState), validateTrigger, validateMessage: validateMessages }}>{children}</Provider>
    );

    if (Component === false) {
        return wrapperNode;
    }

    return <Component
        ref={formRef}
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            e.stopPropagation();
            onFinish && onFinish(getSnapshot(formState, true))

        }}
        onReset={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            formState.reset()

        }}
    >
        {wrapperNode}
    </Component >
})

export default Form