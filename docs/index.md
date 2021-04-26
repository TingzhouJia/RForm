<br/>
<p align="center"><img src="../rform.png"/></p>

<h1 align="center">Rong Form</h1>

> Rong Form is a modern form management library for React

<br/>
<br/>

# Quick Start

1.  Install:

```bash
yarn add rong-form -S
```

```bash
npm i rong-form -S
```

2.  Import :

```js
import ReactDOM from 'react-dom';
import { Form, Field } from 'rong-form';
ReactDOM.render(
  <Form>
    <Field name="username">
      <input />
    </Field>
  </Form>,
  document.getElementById('root'),
);
```

## 🔥 API

We use typescript to create the Type definition. You can view directly in IDE. But you can still check the type definition [here](https://github.com/TingzhouJia/RForm/blob/main/src/interface.ts).

### Form

| Prop             | Description                             | Type                                  | Default |
| ---------------- | --------------------------------------- | ------------------------------------- | ------- |
| component        | Customize Form render component         | string \| Component \| false          | form    |
| initialValues    | Initial value of Form                   | Object                                | -       |
| validateMessages | Set validate message template           | [ValidateMessages](#validatemessages) | -       |
| onFieldsChange   | Trigger when any value of Field changed | (changedFields, allFields) => void    | -       |
| onFinish         | Trigger when form submit and success    | (values) => void                      | -       |
| onValuesChange   | Trigger when any value of Field changed | (changedValues, values) => void       | -       |

### Field

| Prop               | Description                                              | Type                                                               | Default      |
| ------------------ | -------------------------------------------------------- | ------------------------------------------------------------------ | ------------ |
| name               | Name of the field                                        | string \| string[] \|                                              | -            |
| initialValue       | Initial value of Form                                    | Object                                                             | -            |
| defaultValue       | Default value of Form                                    | Object                                                             | -            |
| trigger            | The trigger of this field                                | string                                                             | onChange     |
| validateTrigger    | Validate when the field is triggered                     | string[ ]                                                          | ['onChange'] |
| dependencies       | Dependencies of field                                    | string[]                                                           | -            |
| valuePropName      | Config the value for field                               | string                                                             | value        |
| getValueFromEvents | Config customized get value function                     | (...args)=>void                                                    | -            |
| rules              | The rule applied for field                               | [RuleObject](#RuleObject)                                          | -            |
| children           | Children of Field, could be signle component or function | ( controls: any,meta:Meta,dependencies:Object,) => React.ReactNode | -            |

### List

| Prop          | Description                    | Type                                                                                                            | Default |
| ------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------- | ------- |
| name          | Name of List Form              | string                                                                                                          | -       |
| initialValues | InitialValue for List Form     | any[]                                                                                                           | -       |
| children      | The children to render in List | ( fields: { name: string, key: string, isListField: boolean }[],operations: [ListOperations](#ListOperations),) => React.ReactNode | -       |

##### ListOperations:




### Ref

```ts
interface IFormInstance {
    getFieldValue: (name: string) => string
    getFieldsValue: () => { [name: string]: any }
    getFieldError: (name: string) => string[]
    getFieldsError: () => FieldError[]
    isFieldValidating: (name: string) => boolean
    fillValue:(name:string,value:any)=>void
    fillValues:(data:any)=>void
    submit: () => void
    reset:()=>void
}

```


<br/>

