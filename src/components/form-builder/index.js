import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Row, Col, Tabs, Button, Form, Modal, Layout } from 'antd';
import Toolbar from './toolbar';
import FormBuilderContext from '../form-builder-context';
import FormRenderer from '../form-renderer';
import FormViewer from '../form-viewer';
import DropZone from './drop-zone';

const { Sider, Content } = Layout;
const { TabPane } = Tabs;
const FormBuilder = ({ fields = [], onUpdate, fieldProps, formProps, ...props }) => {
    const [elements, setElements] = useState([]);
    const [showPreview, setShowPreview] = useState(false)
    const [formValue, setFormValue] = useState({});

    useEffect(() => {
        if (fields && fields.length)
            setElements(fields);
    }, [fields])
    const updateFormElement = (elem) => {
        setElements([...elem]);
        onUpdate?.(elem);
    }
    const onFormSubmit = (values) => {
        setFormValue(values);
        setShowPreview(true);
    }
    return (
        <DndProvider backend={HTML5Backend}>
            <FormBuilderContext.Provider value={{ elements, setElements }}>
                <Tabs defaultActiveKey="1" centered >
                    <TabPane tab="Editor" key="1">
                        <Layout style={{ height: "100%", display: 'flex', alignItems: "stretch", gap: "10px" }}>
                            <Sider theme='light' width={250} breakpoint='md' collapsedWidth={0} >
                                <Toolbar fieldProps={fieldProps} />
                            </Sider>
                            <Content style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                                backgroundColor: '#fff',
                            }}>
                                <DropZone elements={elements} onUpdate={updateFormElement} formProps={formProps} />
                            </Content>
                        </Layout>
                    </TabPane>
                    <TabPane tab="Preview" key="2">
                        <Row>
                            <Col span={2}></Col>
                            <Col span={20}>
                                <Form
                                    {...formProps}
                                    onFinish={onFormSubmit}
                                    onSubmit
                                >
                                    <FormRenderer elements={elements}></FormRenderer>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form>
                            </Col>
                            <Col span={2}></Col>
                        </Row>
                    </TabPane>
                </Tabs>
                <Modal title="View"
                    footer={null}
                    width={"90%"}
                    visible={showPreview} onCancel={(e) => setShowPreview(false)}
                    style={{ width: "100%", resize: "auto" }}>
                    <FormViewer elements={elements} values={formValue}></FormViewer>
                </Modal>
            </FormBuilderContext.Provider>
        </DndProvider >)
}

export default FormBuilder;