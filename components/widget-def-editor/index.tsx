import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';
import { CreateWidgetDefData } from '@model/widget-def';
import { Button } from '@components/user-input/button';
import { Select } from '@components/user-input/select';
import { Tabs, TabData } from '@components/tabs';
import { TextInput } from '@components/user-input/text-input';
import { TextArea } from '@components/user-input/text-area';
import { TabType, useWidgetDefEditor } from './hooks';

export interface Props {
  mode: 'create' | 'edit';
  readonly?: boolean;
  data?: {
    name: string;
    html: string;
    css: string;
    js: string;
  };
  onSave: (widgetDef: CreateWidgetDefData) => void;
  onCancel?: () => void;
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {},
  tabs: {},
  typeEditor: {},
  nameEditor: {},
  codeEditor: {},
  actions: {},
}));

type Styles = ReturnType<typeof useStyles>;

export const WidgetDefEditor: FunctionComponent<Props> = ({
  className,
  ...props // tslint:disable-line: trailing-comma
}) => {
  const styles = useStyles();
  const {
    save,
    selectTab,
    updateName,
    updateType,
    updateCode,
    name,
    selectedType,
    selectedCode,
    saveButtonDisabled,
    nameMaxLength,
    codeMaxLength,
  } = useWidgetDefEditor(props);

  const createButton = (
    <Button onClick={save} disabled={saveButtonDisabled}>
      {props.mode === 'create' ? 'Create' : 'Save'}
    </Button>
  );

  const tabs: TabData<TabType>[] = [
    { label: 'HTML', value: 'html' },
    { label: 'CSS', value: 'css' },
    { label: 'JS', value: 'js' },
  ];

  const title =
    props.mode === 'create'
      ? 'Create new Widget Definition'
      : 'Edit Widget Definition';

  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.title}>{title}</div>
      <TextInput
        label="Name"
        required={true}
        className={styles.nameEditor}
        onChange={updateName}
        value={name}
        maxLength={nameMaxLength}
      />
      <Select
        label="Type"
        required={true}
        className={styles.typeEditor}
        options={[{ label: 'Character Sheet', value: 'charNote' }]}
        onChange={updateType}
        value={selectedType}
      />
      <Tabs
        className={styles.tabs}
        defaultValue="html"
        tabs={tabs}
        onChange={selectTab}
      />
      <TextArea
        className={styles.codeEditor}
        onChange={updateCode}
        value={selectedCode}
        maxLength={codeMaxLength}
      />
      <div className={styles.actions}>{createButton}</div>
    </div>
  );
};
