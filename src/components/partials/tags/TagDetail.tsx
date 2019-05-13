import * as React from "react";
import { Tag } from "../../../services/Models";

interface TagDetailViewProps {
    tag: Tag;
}

interface State {
}

const COMPONENT_NAME = "DetailView";

export class TagDetailView extends React.Component<
    TagDetailViewProps,
    State
    > {
    constructor(props: TagDetailViewProps, context: any) {
        super(props, context);

        this.state = {};
    }

    public render(): JSX.Element {
        return (
            <div className={COMPONENT_NAME}>
                <div className={`${COMPONENT_NAME}__detail`}>
                    <span className={`${COMPONENT_NAME}__detail--label`}>
                        Title:
                    </span>
                    <span className={`${COMPONENT_NAME}__detail--value`}>
                        <h2>{this.props.tag && this.props.tag.title}</h2>
                    </span>
                </div>

                <div className={`${COMPONENT_NAME}__detail`}>
                    <span className={`${COMPONENT_NAME}__detail--label`}>
                        Description:
                    </span>
                    <span className={`${COMPONENT_NAME}__detail--value`}>
                        {this.props.tag && this.props.tag.description}
                    </span>
                </div>
            </div>
        );
    }
}
