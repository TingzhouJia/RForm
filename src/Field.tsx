import { types, } from 'mobx-state-tree'
import { inject, observer, } from 'mobx-react'
import React, { Component, useContext, useEffect, useMemo } from 'react'
import { defaultGetValueFromEvent,  toArray as toChildrenArray, warning } from './utils'
import { IFieldStore, Meta,  RuleObject, ValidateTriggerType } from './interface'
import { ListStoreContext, useMst } from './context'

export const FieldStore = types.model("field", {
    name: types.identifier,

    value: types.maybeNull(types.frozen()),
    error: types.maybeNull(types.array(types.string)),
    defaultValue: types.maybeNull(types.string),
    validating: types.optional(types.boolean, false),
    preserve:types.optional(types.boolean,false),
    dependencies:types.optional(types.array(types.string),[]),
    dependsOn:types.optional(types.map(types.string),{})
}).actions((self) => ({
    setValue(value: any) {
        self.value = value 
    },
    reset() {
        self.value = ""
    },

    
}))

export interface IField {
    name: string | string[]
    defaultValue?: any
    trigger?: string,
    validateTrigger?: ValidateTriggerType[]
    dependencies?: string[],
    valuePropName?: string
    getValueFromEvents?: (...args: any) => any
    // renderer:React.ReactNode
    rules?: RuleObject,
    preserve?:boolean
    isListField?: boolean,
    initialValue?: any,
    children: React.ReactNode | (( controls: any,meta:Meta,dependencies: {[name:string]:IFieldStore},) => React.ReactNode)
}

const Field: React.FC<IField> = observer(({
    children,
    name,
    trigger = "onChange",
    valuePropName = "value",
    defaultValue = "",
    preserve=false,
    getValueFromEvents,
    validateTrigger = ["onChange"],
    rules,
    isListField = false,
    initialValue,
    dependencies
}) => {

    const { store, validateTrigger: RootTrigger, validateMessage = {} } = useMst()

    const list = useContext(ListStoreContext)
    let listName = list?.name || null

    useEffect(() => {


        // register field into form
        if (!isListField) {
            // when 
            if (name && typeof name === 'string' && !store.hasField(name)) {
                store.registerField({ name, value: initialValue || defaultValue, defaultValue,dependencies:[],preserve })
             //   store.registerDependencies(name,dependencies)
            } else {
                warning(false, "Duplicated Name in form")
            }
            // register type into list form
        } else if (Array.isArray(name)) {
            const type = store.getDataType(name[0])
            list?.register(Number(name[0]))
            if (name.length === 2) {
                if (type?.indexOf(name[1]) === -1) {
                    store.registerFromField([listName, name[1]])

                }
            } else if (name.length === 1) {
                if (!type) {
                    store.registerFromField([listName,])
                }
            }

        }

        return () => {
            if (typeof name === 'string' && name && store.hasField(name)) {
                store.dropField(name)
            }
        }
    }, [])

    const getMeta = () => {
        const data = store.getFieldByName(name as string)
        return {
            errors: data?.error?.toJSON(),
            validating: data?.validating,
            name
        } as Meta
    }

    const handleDependencies = () => {
        if (dependencies) {
            let res={}
            dependencies.map(item => {
                const c=store.getFieldByName(String(item))
               if(c){
                res[item]={name:c.name,value:c.value,errors:c.error} 
               }
               return null
            })
            return res
        }
    }

    const getOnlyChild = (children: React.ReactNode) => {
        if (typeof children === 'function') {
            const meta = getMeta()
            return {
                ...getOnlyChild(children(getControlled({}),meta,handleDependencies() )),
                isFunction: true
            }
        }
        const childList = toChildrenArray(children);

        if (childList.length !== 1 || !React.isValidElement(childList[0])) {
            return { child: childList, isFunction: false };
        }

        return { child: childList[0], isFunction: false };

    }
    const getControlled: any = (childProps: { [name: string]: any }) => {
       
    
    
        
        const originTriggerFunc: any = childProps[trigger];

        const mergedGetValueProps = ((val) => ({ [valuePropName]: val }));

        let control
        // not list item
        if (!isListField) {
            control = {
                ...childProps,
                ...mergedGetValueProps(store.hasField(name as string) ? store.getFieldValue(name as string) : defaultValue),

            };
        } else {

            let value = ""

            if (name.length === 2) {
                let valueSet = store.getOneSet(listName, Number(name[0]))

                value = valueSet[name[1]]?.value
            } else {
                const valueSet = store.getOneSet(listName, Number(name))

                if (valueSet) {
                    value = Object.values(valueSet)[0]?.value

                }

            }
            control = {
                ...childProps,
                ...mergedGetValueProps(value || "")
            }
        }
       
        control[trigger] = (...args: any) => {
            
            let newValue
            if (getValueFromEvents) {
                newValue = getValueFromEvents(...args)
            } else {
                newValue = defaultGetValueFromEvent(valuePropName, ...args)
            }
            if (isListField) {
                if (name.length === 2) {
                    store.changeListValue([listName, name[1]], { value: newValue }, Number(name[0]))
                } else {
                    store.changeListValue([listName], { value: newValue }, Number(name))
                }
            } else {
                store.setField(name as string, newValue)
               
                store.changeDependencies(name as string,newValue)
            }

            if (originTriggerFunc) {
                originTriggerFunc(...args)
            }
        }
        let mergedValidate = validateTrigger ? validateTrigger : RootTrigger

        mergedValidate.forEach(item => {
            const originTrigger = control[item];
            control[item] = (...args: any) => {
                
                if (originTrigger) {
                    originTrigger(...args);
                }

                // Always use latest rules

                if (!isListField) {
                    if (rules) {
                    
                        store.validateFields(name as string, rules, validateMessage)
                    }
                } else {

                }
            };
        })


        return control
    }


    const returnChild = () => {

        let returnChildNode = null
        const { child, isFunction } = getOnlyChild(children);
        
        if (isFunction) {
            returnChildNode = child
        } else if (React.isValidElement(child)) {
            returnChildNode = React.cloneElement(
                child as React.ReactElement,
                getControlled((child as React.ReactElement).props),
            );
        } else {
            returnChildNode = child
            warning(false, "`children is not valid`")
        }

        return returnChildNode as React.ReactNode
    }


    return (<React.Fragment>{returnChild()}</React.Fragment>)
})



export default Field