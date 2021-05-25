import { cssHeader } from '../../constants';

export const css = `${cssHeader}

.container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.flash {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-undex: 12;
  opacity: 0;
  transition: opacity 3000ms;
  background: transparent;
}

.vignetee {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  opacity: 0;
  background: radial-gradient(circle, rgba(0,0,0,0) 30%, rgba(0,0,0,1) 100%);
  background-size: 100%;
  background-position: center;
}

.down {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  opacity: 0.7;
  background-image: url(#Broken Glass#);
  background-size: 100% 100%;
}

.damage {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 11;
  opacity: 0;
  background: radial-gradient(circle, rgba(0,0,0,0) 30%, rgba(120,0,0,1) 100%);
  background-size: 100%;
  background-position: center;
  animation: heartbeat 2000ms infinite;
}

@keyframes heartbeat {
  0% { background-size: 100%; }
  10% { background-size: 150%; }
  20% { background-size: 100%; }
  30% { background-size: 150%; }
  40% { background-size: 100%; }
  50% { background-size: 105%; }
  100% { background-size: 100%; }
}
`;
