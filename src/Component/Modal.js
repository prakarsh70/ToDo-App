import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Row, Col } from "react-bootstrap";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";

function Modal(props) {
  let priorityList = [
    { label: "None", value: "None" },
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
  ];

  const convertToYYYYMMDD = (inpdt) =>
    inpdt.getFullYear() + "-" + (inpdt.getMonth() + 1) + "-" + inpdt.getDate();

  let taskDet = {
    id: props.id,
    summary: "",
    desciption: "",
    dueDate: null,
    priority: "None",
    currentState: "open",
    createdOn: convertToYYYYMMDD(new Date()),
  };
  const [taskDetails, setTaskDetails] = useState(taskDet);
  const [summaryError, setSummaryError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [dueDateError, setDueDateError] = useState("");
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    console.log("props.selectedData", props.selectedData);
    if (props.modalFor === "Edit" || props.modalFor === "View") {
      const task = { ...taskDetails };
      task["id"] = props.selectedData.id;
      task["summary"] = props.selectedData.summary;
      task["priority"] = props.selectedData.priority;
      task["dueDate"] = new Date(props.selectedData.dueDate);
      task["desciption"] = props.selectedData.desciption;
      task["currentState"] = props.selectedData.currentState;
      task["createdOn"] = props.selectedData.createdOn;
      console.log("task", props.selectedData);
      setTaskDetails(task);
    }
    if (props.modalFor === "View") {
      setDisable(true);
    }
  }, []);

  const onHide = () => {
    props.toggle();
  };

  const onSave = () => {
    if (onValidate()) {
      const taskD = { ...taskDetails };
      taskD["dueDate"] = convertToYYYYMMDD(taskD["dueDate"]);
      console.log("inside add task modal", props.modalFor);
      props.onSave(taskD, props.modalFor);
      onHide();
    }
  };

  const onValidate = () => {
    let flag = true;
    if (!taskDetails.summary) {
      setSummaryError("Please enter Summary");
      flag = false;
    } else if (
      taskDetails.summary.length > 140 ||
      taskDetails.summary.length < 10
    ) {
      setSummaryError(
        "Summary should be minmum 10 character and maximum 140 character"
      );
      flag = false;
    }
    if (!taskDetails.summary) {
      setDescriptionError("Please enter Description");
      flag = false;
    } else if (
      taskDetails.summary.length > 500 ||
      taskDetails.summary.length < 10
    ) {
      setDescriptionError(
        "Decription should be minmum 10 character and maximum 500 character"
      );
      flag = false;
    }
    if (!taskDetails.dueDate) {
      setDueDateError("Please Select Due Date");
      flag = false;
    }
    return flag;
  };

  const onHandleChange = (e, event) => {
    const taskD = { ...taskDetails };
    taskD[event] = e.target.value;
    setTaskDetails(taskD);

    if (event === "summary") {
      setSummaryError("");
    } else if (event === "desciption") {
      setDescriptionError("");
    } else if (event === "dueDate") {
      setDueDateError("");
    }
  };

  const renderFooter = (
    <span>
      <Button
        label="Cancel"
        onClick={onHide}
        className="p-button-raised p-button-secondary"
      />
      {!disable && (
        <Button label="Save" onClick={onSave} className="p-button-primary" />
      )}
    </span>
  );

  return (
    <Dialog
      header={props.modalFor + " Task"}
      style={{ width: "50%" }}
      visible={props.visible}
      onHide={onHide}
      footer={renderFooter}
    >
      <Row>
        <label className="control-label col-md-2">
          Summary<b className="text-danger">*</b>
        </label>
      </Row>
      <Row>
        <Col md="12" sm="12">
          <InputText
            value={taskDetails.summary}
            minLength={10}
            maxLength={140}
            onChange={(e) => onHandleChange(e, "summary")}
            style={{ width: "100%" }}
            placeholder="Summary"
            disabled={disable}
          />
          <p className="text-danger">{summaryError}</p>
        </Col>
      </Row>
      <Row>
        <label className="control-label col-md-2">
          Description<b className="text-danger">*</b>
        </label>
      </Row>
      <Row>
        <Col md="12" sm="12">
          <InputTextarea
            minLength={10}
            maxLength={500}
            rows={4}
            style={{ width: "100%" }}
            value={taskDetails.desciption}
            onChange={(e) => onHandleChange(e, "desciption")}
            placeholder="Desciption"
            disabled={disable}
          />
          <p className="text-danger">{descriptionError}</p>
        </Col>
      </Row>
      <Row>
        <label className="control-label col-md-6">
          Due Date<b className="text-danger">*</b>
        </label>
        <label className="control-label col-md-6">
          Priority<b className="text-danger">*</b>
        </label>
      </Row>
      <Row>
        <Col md="6" sm="6">
          <Calendar
            value={taskDetails.dueDate}
            onChange={(e) => onHandleChange(e, "dueDate")}
            showIcon
            minDate={new Date()}
            disabled={disable}
          />
        </Col>
        <Col md="6" sm="6">
          <Dropdown
            value={taskDetails.priority}
            options={priorityList}
            onChange={(e) => onHandleChange(e, "priority")}
            style={{ width: "100%" }}
            disabled={disable}
          />
        </Col>
      </Row>
      <Row>
        <Col md="6" sm="6">
          <p className="text-danger">{dueDateError}</p>
        </Col>
      </Row>
    </Dialog>
  );
}

export default Modal;