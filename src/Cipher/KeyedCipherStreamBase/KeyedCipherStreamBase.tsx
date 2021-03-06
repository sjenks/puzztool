import * as React from 'react';
import { Button, ButtonGroup, ButtonToolbar, FormControl, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import LocalStorageComponent from '../../Data/LocalStorageComponent';
import { KeyedCipherStringBase  } from 'puzzle-lib';
import './KeyedCipherStreamBase.css';

export interface KeyedCipherStreamProps {}

interface KeyedCipherStreamState {
  conversion: number;
  key: string;
  output: string;
  text: string;
}

interface KeyedCipherStreamSavedState {
  conversion: number;
  key: string;
  text: string;
}

abstract class KeyedCipherStreamBase
    extends LocalStorageComponent<KeyedCipherStreamProps, KeyedCipherStreamState, KeyedCipherStreamSavedState> {
  private readonly _cipher: KeyedCipherStringBase;
  private _conversion: number = 2;
  private _input: HTMLInputElement;

  constructor(props: KeyedCipherStreamProps, cipher: KeyedCipherStringBase) {
    super(props);

    this._cipher = cipher;
    this.state = {
      conversion: 0,
      key: '',
      output: '',
      text: '',
    };
  }

  public componentDidMount() {
    super.componentDidMount();
    this._input.focus();
  }

  public render() {
    return (
      <div className="KeyedCipherStreamBase">
        <FormControl
          className="KeyedCipherStreamBase-input"
          inputRef={(input: HTMLInputElement) => { this._input = input; }}
          onChange={(event: React.FormEvent<FormControl>) => this.onTextChanged(event)}
          placeholder="Text"
          value={this.state.text}
        />
        <FormControl
          className="KeyedCipherStreamBase-input"
          onChange={(event: React.FormEvent<FormControl>) => this.onKeyChanged(event)}
          placeholder="Key"
          value={this.state.key}
        />
        <ButtonToolbar className="KeyedCipherStreamBase-commands">
          <ToggleButtonGroup
            name="KeyedCipherStreamBase-conversion"
            // tslint:disable-next-line: no-any
            onChange={(value: any) => this.onConversionChanged(value as number)}
            type="radio"
            value={this.state.conversion}
          >
            <ToggleButton value={1}>Encrypt</ToggleButton>
            <ToggleButton value={2}>Decrypt</ToggleButton>
          </ToggleButtonGroup>
          <ButtonGroup>
            <Button onClick={(event: React.MouseEvent<Button>) => this.onClearClick(event)}>Clear</Button>
          </ButtonGroup>
        </ButtonToolbar>
        <pre className="KeyedCipherStreamBase-output">
          {this.state.output}
        </pre>
      </div>
    );
  }

  protected onSaveState() {
    return {
      conversion: this._conversion,
      key: this._cipher.key,
      text: this._cipher.text,
    };
  }

  protected onRestoreState(savedState: KeyedCipherStreamSavedState | null) {
    if (savedState !== null) {
      this._cipher.text = savedState.text;
      this._cipher.key = savedState.key;
      this._conversion = savedState.conversion;
    }
  }

  protected onUpdateState() {
    this.setState({
      conversion: this._conversion,
      key: this._cipher.key,
      output: this._conversion === 1 ? this._cipher.encrypt() : this._cipher.decrypt(),
      text: this._cipher.text,
    });
  }

  private onTextChanged(event: React.SyntheticEvent<FormControl>) {
    const element = (event.target as HTMLInputElement);
    this._cipher.text = element.value;
    this.updateState();
  }

  private onKeyChanged(event: React.SyntheticEvent<FormControl>) {
    const element = (event.target as HTMLInputElement);
    this._cipher.key = element.value;
    this.updateState();
  }

  private onConversionChanged(event: number) {
    this._conversion = event;
    this.updateState();
  }

  private onClearClick(event: React.MouseEvent<Button>) {
    this._cipher.key = '';
    this._cipher.text = '';
    this._conversion = 2;

    this.updateState();
  }
}

export default KeyedCipherStreamBase;
