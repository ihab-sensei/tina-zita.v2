import React from 'react'
import { Form, Input, Select } from 'antd';


const EditNoteForm = ({ editNoteFormState, setEditNoteFormState}) => {

    const handleChange = (e, key) => {
        setEditNoteFormState({
            ...editNoteFormState,
            [key]: (e.target ? e.target.value: e)
        })
    };
    const handleChangeInput = (e) => {
        setEditNoteFormState({
            ...editNoteFormState,
            [e.target.id] : e.target.value < 0 ? 0 : e.target.value
        })
    }

    return(
    <div>
     <Form
      layout="vertical"
      name="NoteForm"
      initialValues={{
        remember: true,
      }}
      
    >
      <Form.Item
        label="Title"
        name="title"
        
      >
        <Input
        placeholder="Title..."
        type="text"
        id="title"
        name="title"
        value={editNoteFormState.title}
        onChange={(e) => handleChangeInput(e)}/>

      </Form.Item>
       
      <Form.Item
        
        label="Content"
        name="content" > 

         <Input
         placeholder="Content..."
         type="text"
         id="content"
         name="content"
         value={editNoteFormState.content}
         onChange={(e) => handleChangeInput(e)}/>
        
        </Form.Item>
    </Form>
    </div>
    )
}

export default EditNoteForm;