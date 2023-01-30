// import { Replace } from '../../helpers/Replace';

export interface NewMessageProps {
  id?: number;
  codMsg: string;
  xmlMessage: string;
  process: string;
  status: string;
  error?: object | [];
  createdAt?: Date;
  updatedAt?: Date;
}

export class NewMessage {
  // props: Replace< //   NewMessageProps, //   { id?: number; createdAt?: Date; updatedAt?: Date } // >,
  constructor(private props: NewMessageProps) {
    this.props = {
      ...props,
    };
  }

  public get id() {
    return this.props.id;
  }

  public get codMsg() {
    return this.props.codMsg;
  }

  public set codMsg(codMsg: string) {
    this.props.codMsg = codMsg;
  }

  public get xmlMessage(): string {
    return this.props.xmlMessage;
  }

  public set xmlMessage(xml: string) {
    this.props.xmlMessage = xml;
  }

  public get process(): string {
    return this.props.process;
  }

  public set process(process: string) {
    this.props.process = process;
  }

  public get status(): string {
    return this.props.status;
  }

  public set status(status: string) {
    this.props.status = status;
  }

  public get error(): object | [] {
    return this.props.error;
  }

  public set error(error: object) {
    this.props.error = error;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
