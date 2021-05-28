import clsx from 'clsx';
import { DragEventHandler, FunctionComponent, RefObject } from 'react';
import { makeStyles } from '@utils/styles';
import { useImageDropInput } from './hooks';

export interface Props {
  /** class name to use instead of the default ones */
  className?: string;
  /** List of allowed image types as `['image/jpeg', 'image/png]` */
  allowedTypes?: string[];
  /** Maximum image size in bytes to allow (should validate in server too) */
  maxBytes?: number;
  /** Optional ref to the <input> element */
  inputRef?: RefObject<HTMLInputElement>;
  /** Image to show by default */
  defaultImage?: File | string | null | undefined;
  /** Update it to force a input reset (re-render) */
  reset?: number | string;
  /**
   * If set to `true`, it won't render on value changes,
   * only when the provided `defaultImage` changes
   */
  disableAutoPreview?: boolean;
  /**
   * Callback to call when the value changes
   * (not called if `reset` changes)
   */
  onChange?: (image: File | null, invalid: boolean) => void;
}

const useStyles = makeStyles(() => ({
  root: {
    '& input': {
      display: 'none',
    },
  },
  default: {
    display: 'block',
    cursor: 'pointer',
    width: 150,
    height: 150,
    borderRadius: 7,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  defaultEmpty: {
    backgroundColor: '#f3f3f3',
    border: `3px dashed #b5b5b5`,
  },
  defaultNg: {
    border: '3px dashed #ff0000',
  },
}));

const preventDefault: DragEventHandler<HTMLDivElement> = (ev) => {
  ev.preventDefault();
  ev.stopPropagation();
};

export const ImageDropInput: FunctionComponent<Props> = (props) => {
  const styles = useStyles();
  const {
    handleDrop,
    dropRegionClick,
    changeHandler,
    state,
    inputRef,
    dropAreaRef,
  } = useImageDropInput(props);

  const classes = clsx(
    styles.root,
    props.className || [
      styles.default,
      state.valid === 'na' && styles.defaultEmpty,
      state.valid === 'ng' && styles.defaultNg,
    ]
  );

  return (
    <div
      className={classes}
      ref={dropAreaRef}
      onClick={dropRegionClick}
      onDragEnter={preventDefault}
      onDragLeave={preventDefault}
      onDragOver={preventDefault}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={changeHandler}
      />
    </div>
  );
};
