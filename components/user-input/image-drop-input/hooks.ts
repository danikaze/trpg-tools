import {
  ChangeEvent,
  createRef,
  DragEventHandler,
  useEffect,
  useState,
} from 'react';
import { Props } from '.';

interface State {
  valid: 'na' | 'ok' | 'ng';
  image: File | string | null;
  reset: number | string;
}

export function useImageDropInput(props: Props) {
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

  function changeImage(
    files: FileList | File | string | null,
    forcePreview?: boolean
  ) {
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
    // we don't want to call onChange when just setting the default image
    onChange && typeof image !== 'string' && onChange(image, false);
    if (inputRef.current && files instanceof FileList) {
      inputRef.current.files = files as FileList;
    }
  }

  function validateImage(image: File | string) {
    if (typeof image === 'string') return true;
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

const previewImage = (target: HTMLElement | null, image?: File | string) => {
  if (!target) return;
  if (!image) {
    target.style.backgroundImage = '';
    return;
  }
  if (typeof image === 'string') {
    target.style.backgroundImage = `url(${image})`;
    return;
  }

  const reader = new FileReader();
  reader.onload = (ev) => {
    target.style.backgroundImage = `url(${ev.target!.result as string})`;
  };
  reader.readAsDataURL(image);
};
