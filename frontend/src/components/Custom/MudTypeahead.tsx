import React from "react"
import { Form } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { TypeaheadComponentProps } from "react-bootstrap-typeahead/types/components/Typeahead";
import styled from 'styled-components';
// import './index.css
export interface MudTypeaheadProps extends TypeaheadComponentProps {
    colmd: number;
    title: string;
}

const StyledTypeahead = styled(Typeahead)`
`

const MudTypeahead: React.FC<MudTypeaheadProps> = (props) => {
    return (
        <div className={"col-md-" + props.colmd}>
            <Form.Label><b>{props.title}</b></Form.Label>
            <StyledTypeahead
                newSelectionPrefix="Hinzufügen: "
                flip={true}
                {...props}
            />
        </div>
    )
}

export default MudTypeahead;