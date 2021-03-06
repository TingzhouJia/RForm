import { Instance } from "mobx-state-tree";
import { createContext, useContext } from "react";
import { FormStore } from "./formType";
import { ValidateMessages, ValidateTriggerType } from "./interface";
import { warning } from "./utils";

export type RootInstance = Instance<typeof FormStore>;

export type FormType = {
    store:RootInstance,
    validateTrigger?:ValidateTriggerType[]
    validateMessage?:ValidateMessages
    listInitial?:{[name:string]:any[]}
}
const RootStoreContext = createContext<null | FormType>(null);
export function useMst() {
    const store= useContext(RootStoreContext);
    if (store === null) {
        warning(false, "No `Form` component found")
        throw new Error("Store cannot be null, please add a context provider");
    }
    return store;
}
export const Provider = RootStoreContext.Provider;


export type ListFormType={
    name:string
    id:number,
    register:(index:number)=>void
}

export const ListStoreContext=createContext<ListFormType>(null)
