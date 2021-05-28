import { cssHeader } from '../../constants';

export const css = `${cssHeader}

.container {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 40px;
  font-weight: bolder;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-shadow: 0 0 5px black;
}

.hpRatio {
  display: flex;
  -webkit-text-stroke: 2px #008422;
}

.hpValue {}

.hpTemp {
  color: #b4e3ff;
  -webkit-text-stroke: 2px #000c96;
}
`;
