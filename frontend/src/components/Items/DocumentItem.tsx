import React from 'react'
import styled from "styled-components";
import {Badge} from "react-bootstrap";
import {Document} from "../../Objects";
import {useNavigate} from "react-router-dom";

interface Props {
    document: Document
}

export function DocumentItem({document}: Props) {
    const navigate = useNavigate()

    return (
        <Container className="mx-3" onClick={() => navigate(`/document/${document.id}`, {state: {document: document}})}>
            <div className="left">
                <i className="bi bi-image-fill picture-icon ms-3"></i>
                <div className="my-2 ms-3">
                    <div className="name">{document.name}</div>
                    <div className="file">{document.documentData.substring(document.documentData.lastIndexOf("/") + 1)}</div>
                </div>
            </div>
            <div className="right">
                <i className="bi bi-three-dots-vertical me-2 ms-3"></i>
            </div>
        </Container>
    )
}

const Container = styled.div`
  background: white;
  box-shadow: 0px 3px 20px #F2F2F2;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .left {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .right {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .picture-icon {
    font-size: 1.5rem;
    color: #9BC328;
  }

  .name {
    font-size: 1rem;
  }

  .file {
    font-size: 0.8rem;
  }
`;