import clsx from 'clsx';
import {
  ChangeEvent,
  createRef,
  DragEventHandler,
  FunctionComponent,
  RefObject,
  useEffect,
  useState,
} from 'react';
import { makeStyles } from '@utils/styles';

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
  defaultImage?: File | null | undefined;
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

interface State {
  valid: 'na' | 'ok' | 'ng';
  image: File | null;
  reset: number | string;
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

const previewImage = (target: HTMLElement | null, image?: File) => {
  if (!target) return;
  if (!image) {
    target.style.backgroundImage = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (ev) => {
    target.style.backgroundImage = `url(${ev.target!.result as string})`;
  };
  reader.readAsDataURL(image);
};

function useImageDropInput(props: Props) {
  const { onChange, allowedTypes, maxBytes } = props;
  const [state, setState] = useState<State>({
    valid: 'na',
    image: null,
    reset: 0,
  });
  const dropAreaRef = createRef<HTMLDivElement>();
  const inputRef = props.inputRef || createRef<HTMLInputElement>();

  if (
    !IS_PRODUCTION &&
    allowedTypes &&
    allowedTypes.some((type) => type.indexOf('image/') !== 0)
  ) {
    throw new Error('ImageDropInput.allowedTypes should be like image/png');
  }

  useEffect(() => {
    changeImage(props.defaultImage || null, true);
  }, [props.defaultImage, props.reset]);

  function changeImage(files: FileList | File | null, forcePreview?: boolean) {
    const image = files instanceof FileList ? files![0] : files;
    if (image === state.image) return;

    const target =
      !props.disableAutoPreview || forcePreview ? dropAreaRef.current : null;

    if (!image || !validateImage(image)) {
      setState({
        image,
        valid: image ? 'ng' : 'na',
        reset: props.reset || state.reset,
      });
      previewImage(target);
      // we don't want to call onChange when we just resetting the image
      state.reset === props.reset && onChange && onChange(null, !!image);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      return;
    }

    setState({
      image,
      valid: 'ok',
      reset: props.reset || state.reset,
    });
    previewImage(target, image);
    onChange && onChange(image, false);
    if (inputRef.current && files instanceof FileList) {
      inputRef.current.files = files as FileList;
    }
  }

  function validateImage(image: File) {
    if (!image) return false;
    if (allowedTypes && allowedTypes.indexOf(image.type) === -1) return false;
    if (maxBytes && image.size > maxBytes) return false;
    return true;
  }

  const handleDrop: DragEventHandler<HTMLDivElement> = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    changeImage(ev.dataTransfer.files);
  };

  const dropRegionClick = () => {
    inputRef.current!.click();
  };

  const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
    changeImage(ev.target.files);
  };

  return {
    handleDrop,
    dropRegionClick,
    changeHandler,
    state,
    inputRef,
    dropAreaRef,
  };
}

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
