import * as React from "react";
import "./TagTracker.scss";
import { Tag, TaggableType } from "../../../services/Models";
import { axiosInstance } from "../../../index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
    targetId?: number | number[];
    type: TaggableType;
    onToggleTag(): void;
}

interface State {
    isLoading: boolean;
    newTagText: string;
    tags: Tag[];
}

const COMPONENT_NAME = "TagTracker";

export class TagTracker extends React.Component<Props, State> {
    constructor(props: Props, context: any) {
        super(props, context);

        this.state = {
            isLoading: false,
            newTagText: "",
            tags: []
        };
    }

    /**
     * Loads the initial data
     */
    public componentDidMount(): void {
        this.refreshData();
    }

    /**
     * Necessary for update of panel data
     * @param prevProps - Interface for the props
     */
    public componentDidUpdate(prevProps: Readonly<Props>): void {
        if (this.props.targetId !== prevProps.targetId) {
            this.refreshData();
        }
    }

    public render(): JSX.Element {
        return (
            <div className={COMPONENT_NAME}>
                <div className={`${COMPONENT_NAME}__add-wrapper`}>
                    <div className={"FormGroup"}>
                        <div className={"FormGroup--input-indicator"}>
                            <input
                                type="text"
                                name="tag"
                                id={"tag"}
                                value={this.state.newTagText}
                                placeholder={"Enter tag..."}
                                onChange={(e: any) => {
                                    this.setState({
                                        newTagText: e.target.value
                                    });
                                }}
                                onKeyDown={(e: any) => {
                                    if(e.key === "Enter") {
                                        this.handleAddTag();
                                    }
                                }}
                            />
                            <span className={"FormGroup--input-indicator"}>
                                <button
                                    type={"button"}
                                    className={"btn btn-primary"}
                                    onClick={() => {
                                        this.handleAddTag();
                                    }}
                                >
                                    Add
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
                <div className={`${COMPONENT_NAME}__tag-wrapper`}>
                    {this.state.tags &&
                        this.state.tags.map((tag, index) => {
                            return (
                                <span
                                    key={index}
                                    className={`tag ${
                                        tag.selected ? "tag--is-set" : ""
                                    }`}
                                >
                                    <span
                                        onClick={() => {
                                            this.handleToggleSelected(tag);
                                        }}>
                                        {tag.title}
                                    </span>
                                    <span
                                        className={`${COMPONENT_NAME}__tag-close-btn`}
                                        onClick={() => {
                                            this.handleTagRemoval(tag)
                                        }}
                                    >
                                        <FontAwesomeIcon icon={"times"} />
                                    </span>
                                </span>
                            );
                        })}
                </div>
                {this.state.isLoading ? (
                    <div className={`${COMPONENT_NAME}__loading`}>
                        <span className={`${COMPONENT_NAME}__loading--text`}>
                            Loading...
                        </span>
                    </div>
                ) : (
                    undefined
                )}
            </div>
        );
    }

    /**
     * Handles toggle of the transaction tag
     * @param tag - The tags data
     */
    private handleToggleSelected(tag: Tag): void {
        const togglePromise = axiosInstance
            .post(tag.selected ? `/tag/relation/remove` : `/tag/relation/add`, {
                tag_id: tag.id,
                taggable_id: this.props.targetId,
                taggable_type: this.props.type
            })
            .then((response: any) => {
                this.refreshData();
                this.props.onToggleTag();
            })
            .catch((error: any) => {
                console.log("Error: ", error);
            });
    }

    private handleTagRemoval(tag: Tag): void {

        const handleTagRemovalConfirm = confirm(`Are you sure you want to delete the tag: ${tag.title}`);

        if(handleTagRemovalConfirm) {
            axiosInstance
                .get(`tags/remove/${tag.id}`)
                .then(response => {
                    this.refreshData();
                })
                .catch((error: any) => {
                    console.log("Error: ", error);
                });
        }
    }

    /**
     * Handles adding a tag and creating a transaction tag
     */
    private handleAddTag(): void {
        const requestData: any = {
            title: this.state.newTagText
        };

        // If there is a transaction id, add the parameters to create the TagRelations
        if (this.props.targetId) {
            requestData.taggable_id = this.props.targetId;
            requestData.taggable_type = this.props.type;
        }

        axiosInstance
            .post(`/tags`, requestData)
            .then((response) => {
                console.log("response", response);
            })
            .catch((error) => {
                console.log("Error: ", error);
            })
            .then(() => {
                this.setState({
                    newTagText: ""
                });

                this.refreshData();
            });
    }

    /**
     * Refreshes the views data based on the transaction id
     */
    private async refreshData(): Promise<any> {
        this.setState({ tags: [] });
        let postData = {};

        if(this.props.targetId && this.props.type) {
            postData = {
                taggable_id: this.props.targetId,
                taggable_type: this.props.type,
            }
        }

        this.setState({
            isLoading: true
        });

        axiosInstance
            .post(`/tag/relation`, postData)
            .then((response) => {
                console.log("refreshData()", response);

                this.setState({
                    tags: response.data.data.tags
                });
            })
            .catch(e => console.log("Error: ", e))
            .then(() => this.setState({ isLoading: false }));
    }
}
