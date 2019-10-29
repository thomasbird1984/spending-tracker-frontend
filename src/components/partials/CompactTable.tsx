import * as React from "react";
import "./CompactTable.scss";

interface CompactTableProps {
    items: any[];
    headings: string[];
}

interface State {
    items: any[];
}

const COMPONENT_NAME = "CompactTable";

export class CompactTable extends React.Component<CompactTableProps, State> {
    public static readonly displayName = COMPONENT_NAME;

    constructor(props: CompactTableProps, context: any) {
        super(props, context);

        this.state = {
            items: []
        };
    }

    public componentDidMount(): void {
        const items: any = [];

        this.props.items.map(item => {
            const itemToAdd: any = [];
            this.props.headings.map(title => {
                if(title === "amount") {
                    itemToAdd.push(`$${item[title]}`);
                } else {
                    itemToAdd.push(item[title]);
                }
            });

            items.push(itemToAdd);
        });

        this.setState({ items: items });
    }

    public render(): JSX.Element {
        return (
            <div className={COMPONENT_NAME}>
                <div className={`${COMPONENT_NAME}__row`}>
                    {this.props.headings && this.props.headings.map((title, index) => (
                        <div className={`${COMPONENT_NAME}__column ${COMPONENT_NAME}__heading`} key={index}>
                            {title}
                        </div>
                    ))}
                </div>

                <div className={`${COMPONENT_NAME}__body`}>
                    {this.state.items.map((item, rowIndex) => (
                        <div className={`${COMPONENT_NAME}__row`} key={rowIndex}>
                            {item.map((column: string, columnIndex: number) => (
                                <div className={`${COMPONENT_NAME}__column`} key={columnIndex}>
                                    {column}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
