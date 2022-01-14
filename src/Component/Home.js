import React, { useState } from 'react';
import { Button } from 'primereact/button';
import Modal from './Modal';
import Table from './Table';

const Home = () => {

    const defaultPendingData = [{
        id: 1,
        summary: "Buy groceries",
        desciption: "Buy groceries from market, do not forget Coriander ",
        dueDate: "2021-04-26",
        priority: "High",
        currentState: "open",
        createdOn: "2021-04-24"
    },
    {
        id: 2,
        summary: "Complete the designs",
        desciption: "Finish all the pending designs",
        dueDate: "2021-04-30",
        priority: "Medium",
        currentState: "open",
        createdOn: "2021-04-24"
    },
    {
        id: 4,
        summary: "Do research on the assignment",
        desciption: "prepare research data for the assignment",
        dueDate: "2021-04-27",
        priority: "High",
        currentState: "open",
        createdOn: "2021-04-24"
    }];
    const defaultCompletedData = [{
        id: 3,
        summary: "Sleep well",
        desciption: "Sleep well for atleast 7 hours",
        dueDate: "2021-04-26",
        priority: "None",
        currentState: "Done",
        createdOn: "2021-04-24"
    }];
    const [showPopup, setShowPopup] = useState(false);
    const [dialogFor, setDialogFor] = useState("");
    const [pendingTaskDetails, setPendingTaskDetails] = useState(defaultPendingData);
    const [completedTaskDetails, setCompletedTaskDetails] = useState(defaultCompletedData);
    const [id, setId] = useState(5);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    }

    const onClickAdd = () => {
        setDialogFor("Add");
        togglePopup();
    }

    const onSave = (taskDetail, type) => {
        let tempPendingTaskDetails = [...pendingTaskDetails];
        let tempCompletedTaskDetails = [...completedTaskDetails];
        if (type === "Add") {
            setId(taskDetail.id + 1);
            tempPendingTaskDetails.unshift(taskDetail);
            setPendingTaskDetails(tempPendingTaskDetails);
        } else if (type === "Edit") {
            if (taskDetail.currentState === "Done") {
                let completedTask = []
                tempCompletedTaskDetails.forEach(task => {
                    if (task.id === taskDetail.id) {
                        completedTask.push(taskDetail)
                    } else {
                        completedTask.push(task)
                    }
                })
                setCompletedTaskDetails(completedTask);
            } else {
                let pendingTask = []
                tempPendingTaskDetails.forEach(task => {
                    if (task.id === taskDetail.id) {
                        pendingTask.push(taskDetail)
                    } else {
                        pendingTask.push(task)
                    }
                })
                setPendingTaskDetails(pendingTask);
            }
        }
    }


    const markAsDone = (id) => {
        const tempPendingTaskDetails = [...pendingTaskDetails]
        const tempCompletedTaskDetails = [...completedTaskDetails]
        tempPendingTaskDetails.forEach(task => {
            if (task.id === id) {
                task['currentState'] = "Done";
                tempCompletedTaskDetails.push(task);
                setCompletedTaskDetails(tempCompletedTaskDetails);
            }
        })
        setPendingTaskDetails(tempPendingTaskDetails.filter((task) => task.id !== id));
    }

    const reOpen = (id) => {
        const tempPendingTaskDetails = [...pendingTaskDetails]
        const tempCompletedTaskDetails = [...completedTaskDetails]
        tempCompletedTaskDetails.forEach(task => {
            if (task.id === id) {
                task['currentState'] = "Open";
                tempPendingTaskDetails.push(task);
                setPendingTaskDetails(tempPendingTaskDetails);
            }
        })
        setCompletedTaskDetails(tempCompletedTaskDetails.filter((task) => task.id !== id));
    }

    const deleteTask = (id, status) => {
        if (status === "Done") {
            const tempCompletedTaskDetails = [...completedTaskDetails];
            setCompletedTaskDetails(tempCompletedTaskDetails.filter((task) => task.id !== id));
        } else {
            const tempPendingTaskDetails = [...pendingTaskDetails];
            setPendingTaskDetails(tempPendingTaskDetails.filter((task) => task.id !== id));
        }
    }
    return (
        <React.Fragment>
            <Button icon="pi pi-plus" title="Add Task" onClick={onClickAdd} className="p-button-rounded addButton " style={{ position: 'absolute', marginTop: '0.5%', marginLeft: '82%' }} />
            <h3>ToDo App</h3>

            <br />

            <Table pendingTaskDetails={pendingTaskDetails}
                completedTaskDetails={completedTaskDetails}
                markAsDone={markAsDone}
                reOpen={reOpen}
                deleteTask={deleteTask}
                onSave={onSave} />

            {showPopup &&
                <Modal visible={showPopup}
                    toggle={togglePopup}
                    modalFor={dialogFor}
                    id={id}
                    onSave={onSave} />
            }

        </React.Fragment>
    )

}
export default Home;