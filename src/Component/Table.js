import React, {useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TabView, TabPanel } from 'primereact/tabview';
import { Row, Col } from 'reactstrap';
import Modal from './Modal';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import '../style/main.css'

const Table = (props) => {

    let datatableRef = useRef(null);

    const groupByList = [
        { label: 'None', value: 'none' },
        { label: 'Created On', value: 'createdOn' },
        { label: 'Pending On', value: 'dueDate' },
        { label: 'Priority', value: 'priority' },
        ];
    const [groupBy, setGroupBy] = useState("none");
    const [search, setSearch] = useState("");
    const [dialog, setDialog] = useState("");  //dailogfor
    const [deleteData, setDeleteData] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(false); //showDelete
    const [showModal, setShowModal] = useState(false); // show popup
    const [selectedData, setSelectedData] = useState(''); //select data
    const [index, setIndex] = useState(0); //activeindex

    const onGroupSelect = (e) => {
        setGroupBy(e.target.value);
    }


    const footerTemplate = (data) => {
        return (
            <React.Fragment></React.Fragment>
        );
    }

    const commonDataTable = (data) => {
        return (
            groupBy !== "none" ?
                <DataTable value={data} className="p-datatable-gridlines"
                    rowClassName={markAsDone}
                    onRowClick={e => onRowClick(e.data)}
                    rowGroupMode="subheader" groupField={groupBy}
                    sortMode="single" sortField={groupBy} sortOrder={1}
                    rowGroupHeaderTemplate={headerTemplate} rowGroupFooterTemplate={footerTemplate}
                    ref={(el)=> datatableRef = el}
                >
                    <Column field="summary" header="Summary" />
                    <Column field="priority" header="Priority" />
                    <Column field="createdOn" header="Created On" />
                    <Column field="dueDate" header="Due By" />
                    <Column header="Action" body={action} />
                </DataTable> :
                <DataTable value={data} className="p-datatable-gridlines"
                    rowClassName={markAsDone}
                    onRowClick={e => onRowClick(e.data)}
                    ref={(el)=> datatableRef = el}
                >
                    <Column field="summary" header="Summary" sortable />
                    <Column field="priority" header="Priority" sortable />
                    <Column field="createdOn" header="Created On" sortable />
                    <Column field="dueDate" header="Due By" sortable />
                    <Column header="Action" body={action} />
                </DataTable>)
    }

    const emptyTable = () => {
        return(
            <Row>
                <Card title={`No Tasks available`} subTitle={`Please add tasks.`}>
                </Card>
            </Row>
        )
    }

    const headerTemplate = (data) => {
        return <span className="subHeaderClass text-uppercase font-weight-bold">{data[groupBy]}</span>
    }


    const onRowClick = (e) => {
        setSelectedData(e);
        setDialog("View");
        togglePopup();
    }

    const markAsDone = (e) => {
        if (index === 0) {
            return { 'taskDone': e.currentState === "Done" }
        }
    }

    const action = (rowData) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', textDecoration: 'none !important' }}>
                <Button icon="pi pi-pencil" title="Edit Task" onClick={e => { e.stopPropagation(); onClickEdit(rowData) }} className=" p-button-info" />
                {rowData.currentState === "Done" ?
                    <Button label="ReOpen" onClick={e => { e.stopPropagation(); props.reOpen(rowData.id) }} className=" p-button-primary " />
                    : <Button label="Done" onClick={e => { e.stopPropagation(); props.markAsDone(rowData.id) }} className=" p-button-success " />
                }
                <Button icon="pi pi-ban" title="Delete Task" onClick={e => { e.stopPropagation(); onClickDelete(rowData) }} className="p-button-danger" />
            </div>
        )
    }

    const onClickDelete = (rowData) => {
        setDeleteData(rowData);
        toggleDelete();
    }

    const toggleDelete = () => {
        setConfirmDelete(!confirmDelete);
    }

    const onClickEdit = (rowData) => {
        setSelectedData(rowData);
        setDialog("Edit");
        togglePopup();
    }

    const togglePopup = () => {
        setShowModal(!showModal);
    }

    const onSave = (taskDetail, type) => {
        props.onSave(taskDetail, type);
    }

    const onSearchChange = (e) => {
        setSearch(e.target.value);
        datatableRef.filter(e.target.value, 'summary', 'startsWith');
    }

    const footer = (
                <span>
                    <Button label="No" onClick={toggleDelete} className="p-button-secondary" />
                    <Button label="Yes" onClick={e=>{props.deleteTask(deleteData.id,deleteData.currentState);toggleDelete()}} className="p-button-danger" />

                </span>
            )
        
    return (
        <div>
            <Row>
                <label className="control-label col-md-2" style={{ paddingLeft: "1.5%" }}>Group By</label>
                <label className="control-label col-md-10" style={{ paddingLeft: "2%" }}>Search</label>
            </Row>
            <Row>
                <Col md="2" sm="2">
                    <Dropdown value={groupBy}
                        options={groupByList}
                        onChange={e => onGroupSelect(e)}
                        style={{ width: "100%" }}
                    />
                </Col>
                <Col md="8" sm="8">
                    <InputText value={search}
                        onChange={e => onSearchChange(e)}
                        style={{ width: "100%" }}
                        placeholder="Search Tasks" />
                </Col>
            </Row>
            <br />
            <Row>
                <TabView header="ToDo List" activeIndex={index} onTabChange={e => setIndex(e.index)} >
                    <TabPanel header="All">
                        { (props.pendingTaskDetails.length>0 || props.completedTaskDetails.length>0) ?
                            commonDataTable(props.pendingTaskDetails.concat(props.completedTaskDetails)) :
                            emptyTable()
                        }
                    </TabPanel>
                    <TabPanel header="Pending">
                        {props.pendingTaskDetails.length>0 ? 
                            commonDataTable(props.pendingTaskDetails) :
                            emptyTable()
                        }
                    </TabPanel>
                    <TabPanel header="Completed">
                        {props.completedTaskDetails.length>0 ?
                            commonDataTable(props.completedTaskDetails) :
                            emptyTable()
                        }
                    </TabPanel>
                </TabView>
            </Row>
            {confirmDelete &&
                <Dialog header="Confirm" style={{ width: '40%' }} visible={confirmDelete}
                    onHide={toggleDelete} footer={footer}>
                        <div style={{marginBottom:'1rem'}}><b>Summary:</b> {deleteData.summary}</div>
                            
                        <div>Do you want to delete this task?</div>

                </Dialog>
            }
            {showModal &&
                <Modal visible={showModal}
                    toggle={togglePopup}
                    modalFor={dialog}
                    selectedData={selectedData}
                    onSave={onSave}
                />
            }
        </div>
    )
}
export default Table;